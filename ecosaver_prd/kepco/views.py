from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from io import StringIO
from urllib.parse import quote
import requests
import json
from datetime import date, timedelta, datetime
import pandas as pd
import lunardate
import calendar
import numpy as np
from kepco.models import *
from django.db.models import Q
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import asyncio
from django.db.models import F,Sum, Count

# Create your views here.

# 0 6 * * * curl -X POST http://localhost:8001/kepco/crawling_kepco_power/

power_to_cost = 150

last_day_of_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
leap_year_last_day_of_month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

# 몇년 몇주차 이름 찾는 함수
def get_today_week_name(targetdate):

    today_week_name = ""

    today = targetdate
    year = today.year  # 2023
    month = today.month #3
    day = today.day  #27

    x = np.array(calendar.monthcalendar(year, month))
    week_of_month = np.where(x == day)[0][0] + 1
    first_day_of_month = date(year, month, 1).weekday()
    flag = 0
    if first_day_of_month > 3:
        flag = 1
    week_of_month -= flag
    if week_of_month == 0:
        day_of_week = date(year, month, day).weekday()
        if day_of_week > 3:  # 목요일
            if month == 1:
                year -= 1
                month = 12
            else:
                month -= 1
            if year % 4 == 0:
                day = leap_year_last_day_of_month[month - 1]
            else:
                day = last_day_of_month[month - 1]

            x = np.array(calendar.monthcalendar(year, month))
            week_of_month = np.where(x == day)[0][0] + 1
            if date(year, month, 1).weekday() > 3:
                week_of_month -= 1
        else:
            week_of_month = 1
    elif week_of_month == 5:
        # print(month)

        if month == 12:
            year += 1
            month = 1
        else:
            # print(date(year, month+1, 1))
            nextday_of_week = date(year, month+1, 1).weekday()
            # print(nextday_of_week)
            if nextday_of_week > 3:  # 목요일
                pass
            else:
                month += 1
                week_of_month = 1
        # day = 1
        # day_of_week = date(year, month+1, day).weekday()

        # if day_of_week > 3:  # 목요일
        #     week_of_month = 1
    return [month, week_of_month]

# 강북강원 하루 전력 데이터 스케쥴링 API
@csrf_exempt
def crawling_kepco_power(request):
    q = Q()
    q.add(Q(headquarter='강북/강원'),q.OR)
    q.add(Q(affairs='구로'),q.OR)
    affairs_all = affairs.objects.filter(q) 

    for affa in affairs_all:
        print(affa.affairs)

        enddate = datetime.now() - timedelta(days=1)
        str_date = enddate.strftime("%Y%m%d")
        print(str_date)
        
        kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
        try:
            resp = requests.get(url=kepco_url)
            json_data = json.loads(resp.text)
            dict_data = json_data['dayLpDataInfoList'][0]
            
            kepco_power_list =list((dict_data).keys())
            
            for powlist in kepco_power_list :
                if 'pwr_qty' in str(powlist) :
                    
                    str_date_datetime = (enddate+timedelta(days=1)).strftime("%Y%m%d")+"00:00:00" if '2400' in str(powlist) else str_date+str(powlist[7:9])+":"+str(powlist[9:11])+":00"
                    st_week = (datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).isocalendar()
                    now_power = float(dict_data[powlist]) if dict_data[powlist] != '' else 0
                    now_time = datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")
                    
                    q = Q()
                    q.add(Q(affairs=affa.affairs),q.AND)
                    q.add(Q(isocanledar_year=(st_week[0]-1)),q.AND)
                    q.add(Q(weekday=(datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).weekday()),q.AND)
                    q.add(Q(isocanledar_week=st_week[1]),q.AND)
                    q.add(Q(time_hour=now_time.hour),q.AND)
                    q.add(Q(time_minute=now_time.minute),q.AND)
                    
                    temp_obj = affairspower.objects.filter(q)
                    last_year_power = 0 if len(temp_obj) == 0 else temp_obj[0].power
                    
                    temp_power = affairspower(
                        affairs_uuid = affa,
                        affairs = affa.affairs,
                        power = now_power,
                        affairpowerid = str(affa.affairs)+str_date+str(powlist[7:]),
                        time = now_time,
                        cost = now_power*(power_to_cost),
                        isocanledar_week=st_week[1],
                        isocanledar_year=st_week[0],
                        weekday = now_time.weekday(),
                        time_hour = now_time.hour,
                        time_minute = now_time.minute,
                        
                        lastyearpower = last_year_power,
                        isreliability = True if (last_year_power != 0) and (now_power != 0) else False ,
                        # lastyearpower = 0,
                        # isreliability = False ,
                        
                    )
                    temp_power.save()
        except Exception as e :
            print(str(e))
            
        enddate = enddate - timedelta(days=1)
        str_date = enddate.strftime("%Y%m%d")
        print(str_date)
        
        kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
        try:
            resp = requests.get(url=kepco_url)
            json_data = json.loads(resp.text)
            dict_data = json_data['dayLpDataInfoList'][0]
            
            kepco_power_list =list((dict_data).keys())
            
            for powlist in kepco_power_list :
                if 'pwr_qty' in str(powlist) :
                    
                    str_date_datetime = (enddate+timedelta(days=1)).strftime("%Y%m%d")+"00:00:00" if '2400' in str(powlist) else str_date+str(powlist[7:9])+":"+str(powlist[9:11])+":00"
                    st_week = (datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).isocalendar()
                    now_power = float(dict_data[powlist]) if dict_data[powlist] != '' else 0
                    now_time = datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")
                    
                    q = Q()
                    q.add(Q(affairs=affa.affairs),q.AND)
                    q.add(Q(isocanledar_year=(st_week[0]-1)),q.AND)
                    q.add(Q(weekday=(datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).weekday()),q.AND)
                    q.add(Q(isocanledar_week=st_week[1]),q.AND)
                    q.add(Q(time_hour=now_time.hour),q.AND)
                    q.add(Q(time_minute=now_time.minute),q.AND)
                    
                    temp_obj = affairspower.objects.filter(q)
                    last_year_power = 0 if len(temp_obj) == 0 else temp_obj[0].power
                    
                    temp_power = affairspower(
                        affairs_uuid = affa,
                        affairs = affa.affairs,
                        power = now_power,
                        affairpowerid = str(affa.affairs)+str_date+str(powlist[7:]),
                        time = now_time,
                        cost = now_power*(power_to_cost),
                        isocanledar_week=st_week[1],
                        isocanledar_year=st_week[0],
                        weekday = now_time.weekday(),
                        time_hour = now_time.hour,
                        time_minute = now_time.minute,
                        
                        lastyearpower = last_year_power,
                        isreliability = True if (last_year_power != 0) and (now_power != 0) else False ,
                        # lastyearpower = 0,
                        # isreliability = False ,
                        
                    )
                    temp_power.save()
        except Exception as e :
            print(str(e))
    return JsonResponse({'returnCode' : "ok"})

# 국사 데이터 DB에 저장
@csrf_exempt
def writeaffairs(request):
    try:
        affaris_data = pd.read_csv('kepcolist.csv',dtype='str')
        print(affaris_data)
        print(len(affaris_data))
        for i in range(len(affaris_data)):
            print(affaris_data['국사'][i])
            affaris_object = affairs(
                headquarter = affaris_data['본부명'][i],
                center = affaris_data['센터'][i],
                team = affaris_data['팀'][i],
                affairs = affaris_data['국사'][i],
                cust_no = affaris_data['고객번호'][i],
                contract = affaris_data['구분1'][i],
                powertocost = affaris_data['구분'][i],
            )
            affaris_object.save()
    except Exception as e:
        print(str(e))
    return JsonResponse({'returnCode' : "ok"})

# 받을 전력데이터 날짜 
end_date_in = date.today()
# end_date_in = date(2024,12,20)
# start_date_in = date(2023,12,20)

# end_date_in = date(2023,12,31)
start_date_in = date(2024,1,1)

# end_date_in = date.today()
# start_date_in = date(2024,2,15)

# 국사별 전력데이터 저장
@csrf_exempt
def crawl_yearpowergb(request):
    m = Q()
    m.add(Q(center='서울강북액세스운용센터'),m.OR)
    m.add(Q(center='강북/강원코어운용센터'),m.OR)
    m.add(Q(center='강북/강원ICT기술담당'),m.OR)
    q=Q()
    q.add(m,q.AND)
    q.add(Q(headquarter='강북/강원'),q.AND)
    
    affairs_all = affairs.objects.filter(q)
    
    for affa in affairs_all:
        try:
            print(affa.affairs)
            # 작년
            enddate = end_date_in
            daterange = timedelta(days=1)
            startdate = start_date_in
            bulk_list = []
            while(enddate>=startdate) :
                str_date = startdate.strftime("%Y%m%d")
                
                print(str_date)
                
                kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
            
                try:
                    resp = requests.get(url=kepco_url)
                    dict_data = json.loads(resp.text)['dayLpDataInfoList'][0]

                    kepco_power_list =list((dict_data).keys())

                    for powlist in kepco_power_list :
                        if 'pwr_qty' in str(powlist) :
                            str_date_datetime = (startdate+timedelta(days=1)).strftime("%Y%m%d")+"00:00:00" if '2400' in str(powlist) else str_date+str(powlist[7:9])+":"+str(powlist[9:11])+":00"
                            st_week = (datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).isocalendar()
                            now_power = float(dict_data[powlist]) if dict_data[powlist] != '' else 0
                            now_time = datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")
                            q = Q()
                            q.add(Q(affairs=affa.affairs),q.AND)
                            q.add(Q(isocanledar_year=(st_week[0]-1)),q.AND)
                            q.add(Q(weekday=(datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).weekday()),q.AND)
                            q.add(Q(isocanledar_week=st_week[1]),q.AND)
                            q.add(Q(time_hour=now_time.hour),q.AND)
                            q.add(Q(time_minute=now_time.minute),q.AND)
                            
                            temp_obj = affairspower.objects.filter(q)
                            last_year_power = 0 if len(temp_obj) == 0 else temp_obj[0].power
                            
                            temp_power = affairspower(
                                affairs_uuid = affa,
                                affairs = affa.affairs,
                                power = now_power,
                                affairpowerid = str(affa.affairs)+str_date+str(powlist[7:]),
                                time = now_time,
                                cost = now_power*(power_to_cost),
                                isocanledar_week=st_week[1],
                                isocanledar_year=st_week[0],
                                weekday = now_time.weekday(),
                                time_hour = now_time.hour,
                                time_minute = now_time.minute,
                                
                                lastyearpower = last_year_power,
                                isreliability = True if (last_year_power != 0) and (now_power != 0) else False ,
                                # lastyearpower = 0,
                                # isreliability = False ,
                                
                            )
                            bulk_list.append(temp_power)
                            if len(bulk_list) > 10000 :
                                affairspower.objects.bulk_create(
                                    bulk_list,
                                    update_conflicts=True,
                                    # unique_fields=['affairpowerid'],
                                    update_fields=[
                                        'affairs',
                                        'power',
                                        'cost',
                                        'time',
                                        'isocanledar_year',
                                        'isocanledar_week',
                                        'weekday',
                                        'lastyearpower',
                                        'isreliability',
                                        'time_hour',
                                        'time_minute'
                                        ]
                                    )
                                bulk_list = []
                                print('bulk create')
                            # temp_power.save()
                    startdate += daterange
                except Exception as e :
                    print(str(e))
                    print(json.loads(resp.text))
            affairspower.objects.bulk_create(
                                    bulk_list,
                                    update_conflicts=True,
                                    # unique_fields=['affairpowerid'],
                                    update_fields=[
                                        'affairs',
                                        'power',
                                        'cost',
                                        'time',
                                        'isocanledar_year',
                                        'isocanledar_week',
                                        'weekday',
                                        'lastyearpower',
                                        'isreliability',
                                        'time_hour',
                                        'time_minute'
                                        ]
                                    )
            bulk_list = []
            print('bulk create')
        except Exception as e :
            print(str(e))
    return JsonResponse({'returnCode' : "ok"})

@csrf_exempt
def crawl_yearpowergn(request):
    m = Q()
    m.add(Q(affairs='구로'),m.OR)
    q=Q()
    q.add(m,q.AND)
    q.add(Q(headquarter='강남'),q.AND)
    
    affairs_all = affairs.objects.filter(q)
    
    for affa in affairs_all:
        try:
            print(affa.affairs)
            # 작년
            enddate = end_date_in
            daterange = timedelta(days=1)
            startdate = start_date_in
            bulk_list = []
            while(enddate>=startdate) :
                str_date = startdate.strftime("%Y%m%d")
                
                print(str_date)
                
                kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
            
                try:
                    resp = requests.get(url=kepco_url)
                    dict_data = json.loads(resp.text)['dayLpDataInfoList'][0]
                    # print(dict_data)

                    kepco_power_list =list((dict_data).keys())

                    for powlist in kepco_power_list :
                        if 'pwr_qty' in str(powlist) :
                            str_date_datetime = (startdate+timedelta(days=1)).strftime("%Y%m%d")+"00:00:00" if '2400' in str(powlist) else str_date+str(powlist[7:9])+":"+str(powlist[9:11])+":00"
                            st_week = (datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).isocalendar()
                            now_power = float(dict_data[powlist]) if dict_data[powlist] != '' else 0
                            now_time = datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")
                            q = Q()
                            q.add(Q(affairs=affa.affairs),q.AND)
                            q.add(Q(isocanledar_year=(st_week[0]-1)),q.AND)
                            q.add(Q(weekday=(datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).weekday()),q.AND)
                            q.add(Q(isocanledar_week=st_week[1]),q.AND)
                            q.add(Q(time_hour=now_time.hour),q.AND)
                            q.add(Q(time_minute=now_time.minute),q.AND)
                            
                            temp_obj = affairspower.objects.filter(q)
                            
                            last_year_power = 0 if len(temp_obj) == 0 else temp_obj[0].power
                            
                            temp_power = affairspower(
                                affairs_uuid = affa,
                                affairs = affa.affairs,
                                power = now_power,
                                affairpowerid = str(affa.affairs)+str_date+str(powlist[7:]),
                                time = now_time,
                                cost = now_power*(power_to_cost),
                                isocanledar_week=st_week[1],
                                isocanledar_year=st_week[0],
                                weekday = now_time.weekday(),
                                time_hour = now_time.hour,
                                time_minute = now_time.minute,
                                
                                lastyearpower = last_year_power,
                                isreliability = True if (last_year_power != 0) and (now_power != 0) else False ,
                                # lastyearpower = 0,
                                # isreliability = False ,
                                
                            )
                            bulk_list.append(temp_power)
                            if len(bulk_list) > 10000 :
                                affairspower.objects.bulk_create(
                                    bulk_list,
                                    update_conflicts=True,
                                    # unique_fields=['affairpowerid'],
                                    update_fields=[
                                        'affairs',
                                        'power',
                                        'cost',
                                        'time',
                                        'isocanledar_year',
                                        'isocanledar_week',
                                        'weekday',
                                        'lastyearpower',
                                        'isreliability',
                                        'time_hour',
                                        'time_minute'
                                        ]
                                    )
                                bulk_list = []
                                print('bulk create')
                            # temp_power.save()
                    startdate += daterange
                except Exception as e :
                    print(str(e))
                    print(json.loads(resp.text))
            affairspower.objects.bulk_create(
                                    bulk_list,
                                    update_conflicts=True,
                                    # unique_fields=['affairpowerid'],
                                    update_fields=[
                                        'affairs',
                                        'power',
                                        'cost',
                                        'time',
                                        'isocanledar_year',
                                        'isocanledar_week',
                                        'weekday',
                                        'lastyearpower',
                                        'isreliability',
                                        'time_hour',
                                        'time_minute'
                                        ]
                                    )
            bulk_list = []
            print('bulk create')
        except Exception as e :
            print(str(e))
    return JsonResponse({'returnCode' : "ok"})

@csrf_exempt
def crawl_yearpowerbs(request):
    m = Q()
    m.add(Q(center='강원액세스운용센터'),m.OR)
    q=Q()
    q.add(m,q.AND)
    q.add(Q(headquarter='강북/강원'),q.AND)
    
    affairs_all = affairs.objects.filter(q)
    
    for affa in affairs_all:
        try:
            print(affa.affairs)
            # 작년
            enddate = end_date_in
            daterange = timedelta(days=1)
            startdate = start_date_in
            bulk_list = []
            while(enddate>=startdate) :
                str_date = startdate.strftime("%Y%m%d")
                
                print(str_date)
                
                kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
            
                try:
                    resp = requests.get(url=kepco_url)
                    dict_data = json.loads(resp.text)['dayLpDataInfoList'][0]

                    kepco_power_list =list((dict_data).keys())

                    for powlist in kepco_power_list :
                        if 'pwr_qty' in str(powlist) :
                            str_date_datetime = (startdate+timedelta(days=1)).strftime("%Y%m%d")+"00:00:00" if '2400' in str(powlist) else str_date+str(powlist[7:9])+":"+str(powlist[9:11])+":00"
                            st_week = (datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).isocalendar()
                            now_power = float(dict_data[powlist]) if dict_data[powlist] != '' else 0
                            now_time = datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")
                            q = Q()
                            q.add(Q(affairs=affa.affairs),q.AND)
                            q.add(Q(isocanledar_year=(st_week[0]-1)),q.AND)
                            q.add(Q(weekday=(datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")).weekday()),q.AND)
                            q.add(Q(isocanledar_week=st_week[1]),q.AND)
                            q.add(Q(time_hour=now_time.hour),q.AND)
                            q.add(Q(time_minute=now_time.minute),q.AND)
                            
                            temp_obj = affairspower.objects.filter(q)
                            
                            last_year_power = 0 if len(temp_obj) == 0 else temp_obj[0].power
                            
                            temp_power = affairspower(
                                affairs_uuid = affa,
                                affairs = affa.affairs,
                                power = now_power,
                                affairpowerid = str(affa.affairs)+str_date+str(powlist[7:]),
                                time = now_time,
                                cost = now_power*(power_to_cost),
                                isocanledar_week=st_week[1],
                                isocanledar_year=st_week[0],
                                weekday = now_time.weekday(),
                                time_hour = now_time.hour,
                                time_minute = now_time.minute,
                                
                                lastyearpower = last_year_power,
                                isreliability = True if (last_year_power != 0) and (now_power != 0) else False ,
                                # lastyearpower = 0,
                                # isreliability = False ,
                                
                            )
                            bulk_list.append(temp_power)
                            if len(bulk_list) > 10000 :
                                affairspower.objects.bulk_create(
                                    bulk_list,
                                    update_conflicts=True,
                                    # unique_fields=['affairpowerid'],
                                    update_fields=[
                                        'affairs',
                                        'power',
                                        'cost',
                                        'time',
                                        'isocanledar_year',
                                        'isocanledar_week',
                                        'weekday',
                                        'lastyearpower',
                                        'isreliability',
                                        'time_hour',
                                        'time_minute'
                                        ]
                                    )
                                bulk_list = []
                                print('bulk create')
                            # temp_power.save()
                    startdate += daterange
                except Exception as e :
                    print(str(e))
                    print(json.loads(resp.text))
            affairspower.objects.bulk_create(
                                    bulk_list,
                                    update_conflicts=True,
                                    # unique_fields=['affairpowerid'],
                                    update_fields=[
                                        'affairs',
                                        'power',
                                        'cost',
                                        'time',
                                        'isocanledar_year',
                                        'isocanledar_week',
                                        'weekday',
                                        'lastyearpower',
                                        'isreliability',
                                        'time_hour',
                                        'time_minute'
                                        ]
                                    )
            bulk_list = []
            print('bulk create')
        except Exception as e :
            print(str(e))
    return JsonResponse({'returnCode' : "ok"})

# ----------------------------------------------------------------------------------------------------------------------------------------
# 청구데이터 API
@csrf_exempt
def powerbill(request):
    q = Q()
    q.add(Q(headquarter='강북/강원'),q.AND)
    affairs_all = affairs.objects.filter(q) # 모든 국사
    enddate = datetime.now() - timedelta(days=1)
    str_date = enddate.strftime("%Y%m%d")
    temp_list = []
    for affa in affairs_all:
        print(affa.affairs)
        # kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getCustBillData.do?custNo={affa.cust_no}&dataMonth=202212&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'

        try:
            # resp = requests.get(url=kepco_url)
            # json_data = json.loads(resp.text)
            # receive_data = json_data['custBillDataInfoList'][0]
            # # dict_data = json_data['dayLpDataInfoList'][0]
            temp_bill_object = affairsbill(
                affairbillid = affa.cust_no + str_date,
                affairs_id = affa,
                # billdate = datetime.strptime(receive_data['bill_ym'], "%Y%m"), # 청구년월datetime.strptime(str_date_datetime, "%Y%m%d%H:%M:%S")
                # mrdate = datetime.strptime(receive_data['bill_ym']+receive_data['mr_ymd'], "%Y%m%d"), # 검침일

                bill_aply_power = 99, # 요금적용전력

                base_bill = 99, # 기본요금
                # kwh_bill = receive_data['kwh_bill'], # 전력량요금
                # dc_bill = receive_data['dc_bill'], # 할인공제요금
                # req_bill = receive_data['req_bill'], # 전기요금
                # fianl_bill = receive_data['req_amt'], # 청구요금

                # lload_usekwh = receive_data['lload_usekwh'], # 경부하사용량
                # mload_usekwh = receive_data['mload_usekwh'], # 중부하사용량
                # maxload_usekwh = receive_data['maxload_usekwh'], # 최대부하사용량

                # lload_needle = receive_data['lload_needle'], # 경부하당월지침
                # mload_needle = receive_data['mload_needle'], # 중부하당월지침
                # maxload_needle = receive_data['maxload_needle'], # 최대부하당월지침

                # jn_pwrfact = receive_data['jn_pwrfact'], # 진상역률
                # ji_pwrfact = receive_data['ji_pwrfact']  # 지상역률
            )
            temp_list.append(temp_bill_object)
        except Exception as e :
            print(str(e))
            print(receive_data)
    affairsbill.objects.bulk_create(
            temp_list,
            update_conflicts=True,
            # unique_fields=['affairpowerid'],
            update_fields=[
                'bill_aply_power','base_bill']
            )
    return JsonResponse({'returnCode' : "ok"})

# 청구데이터 엑셀 아웃
@csrf_exempt
def importexcel(request):
    q = Q()
    q.add(Q(billdate=datetime.strptime("202312", "%Y%m")),q.AND)
    bills_all_twothree = affairsbill.objects.select_related().filter(q)

    excel_list = []

    for bills in bills_all_twothree:
        try:
            bills_dict= {
                "headquarter" : bills.affairs_id.headquarter,
                "center" : bills.affairs_id.center,
                "affairs" : bills.affairs_id.affairs,
                "cust_no" : bills.affairs_id.cust_no,
                "twothree_bill_aply_kwh" : bills.bill_aply_power,
                "twotwo_bill_aply_kwh" : "",
                "twothree_total_kwh" : bills.lload_usekwh + bills.mload_usekwh + bills.maxload_usekwh,
                "twotwo_total_kwh" : "",
                "twothree_bill" : bills.fianl_bill,
                "twotwo_bill" : "",
                "saving_rate":"",
            }
            excel_list.append(bills_dict)
        except Exception as e:
            print(str(e))
    
    q = Q()
    q.add(Q(billdate=datetime.strptime("202212", "%Y%m")),q.AND)
    bills_all_twotwo = affairsbill.objects.select_related().filter(q)

    for bills in bills_all_twotwo:
        for billdict in excel_list :
            if (billdict['headquarter'] == bills.affairs_id.headquarter) and ((billdict['center'] == bills.affairs_id.center)) and ((billdict['affairs'] == bills.affairs_id.affairs)) :
                billdict['twotwo_bill_aply_kwh'] = bills.bill_aply_power
                billdict['twotwo_total_kwh'] = bills.lload_usekwh + bills.mload_usekwh + bills.maxload_usekwh
                billdict['twotwo_bill'] = bills.fianl_bill
                billdict['saving_rate'] = round((1 - (billdict['twothree_bill'] / bills.fianl_bill)),2)
    
    df = pd.DataFrame.from_dict(excel_list)
    df.to_csv('./data.csv')
    print(df.info())
    
    return JsonResponse({'returnCode' : "ok"})

# ---------------------------
# 일일전력데이터 파일 만들기
@csrf_exempt
def crawl_year_gb(request):
    q = Q()
    q.add(Q(headquarter='강북/강원'),q.AND)
    # q.add(Q(center='강북/강원코어운용센터'),q.AND)
    affairs_all = affairs.objects.filter(q)
    
    excel_list = []
    check_num = 0
    daterange = timedelta(days=7)
    
    innow_enddate = date.today()
    innow_startdate = innow_enddate - daterange
    st_week = innow_enddate.isocalendar()
    last_date = datetime.strptime(str(st_week[0]-1)+(str(st_week[1]) if len(str(st_week[1])) == 2 else '0' + str(st_week[1]))+"1", "%Y%W%w")
    while(innow_enddate.weekday() != last_date.weekday()):
        last_date += timedelta(days=1)
    inlast_enddate = last_date
    inlast_startdate = inlast_enddate - daterange
    for affa in affairs_all:
        check_num = check_num + 1
        print(round(check_num/len(affairs_all)*100))
        
        now_enddate = innow_enddate
        now_startdate = innow_startdate
        last_enddate = inlast_enddate
        last_startdate = inlast_startdate
        
        try:
            print(affa.affairs)
            
            excel_dict = {}
            excel_dict['본부'] = affa.headquarter
            excel_dict['센터'] = affa.center
            excel_dict['국사'] = affa.affairs
            excel_dict['고객번호'] = affa.cust_no
            
            while(now_enddate>=now_startdate) :
                
                now_enddate = (now_enddate-timedelta(days=1))
                str_date = now_enddate.strftime("%Y%m%d")
                kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
                try:
                    resp = requests.get(url=kepco_url)
                    json_data = json.loads(resp.text)
                    dict_data = json_data['dayLpDataInfoList'][0]
                    kepco_power_list =list((dict_data).keys())
                    
                    day_num = 0
                    for powlist in kepco_power_list :
                        if 'pwr_qty' in str(powlist) :
                            day_num = day_num + (float(dict_data[powlist]) if dict_data[powlist] != '' else 0)
                    excel_dict[str_date] = round(day_num,1)
                except Exception as e :
                    print(str(e))
            
            # 작년꺼
            while(last_enddate>=last_startdate) :
                last_enddate = (last_enddate-timedelta(days=1))
                str_date = last_enddate.strftime("%Y%m%d")
                kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
                try:
                    resp = requests.get(url=kepco_url)
                    json_data = json.loads(resp.text)
                    dict_data = json_data['dayLpDataInfoList'][0]
                    kepco_power_list =list((dict_data).keys())
                    day_num = 0
                    for powlist in kepco_power_list :
                        if 'pwr_qty' in str(powlist) :
                            day_num = day_num + (float(dict_data[powlist]) if dict_data[powlist] != '' else 0)
                    # print(day_num)
                    excel_dict[str_date] = round(day_num,1)
                except Exception as e :
                    print(str(e))
            excel_list.append(excel_dict)
        except Exception as e :
            print(str(e))
    df = pd.DataFrame.from_dict(excel_list)
    df.to_csv('./data_power_gb.csv',index=False)
    return JsonResponse({'returnCode' : "ok"})

# 테스트용 API
@csrf_exempt
def test_api(request):
    nowdate = date(2024,2,26)
    startdate = date(2024,2,20)
    while(startdate<=nowdate):
        print(str(startdate))
        q = Q()
        q.add(Q(headquarter='강북/강원'),q.AND)
        q.add(Q(affairs='고양'),q.AND)
        affairs_all = affairs.objects.filter(q)
        
        for affa in affairs_all :
            targetdate = startdate
            str_date = targetdate.strftime("%Y%m%d")
            print("올해 날짜 : "+str_date)
            kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
            try:
                resp = requests.get(url=kepco_url)
                json_data = json.loads(resp.text)
                now_dict_data = json_data['dayLpDataInfoList'][0]
                # print(now_dict_data)
                now_kepco_power_list =list((now_dict_data).keys())
                daily_sum = 0
                for kep in now_kepco_power_list:
                    if 'pwr_qty' in kep:
                        print(str(kep) + " : " + str(now_dict_data[kep]))
                        daily_sum += now_dict_data[kep]
                print("하루 합 : "+str(daily_sum))
            except Exception as e :
                print(str(e))

        startdate += timedelta(days=1)
    return JsonResponse({'returnCode' : "ok"})

# 타 광역본부 저번주 주차별 전력 데이터 저장
@csrf_exempt
def power_statistics(request):
    
    nowdate = date.today()
    while (nowdate.weekday()!=0):
        nowdate -= timedelta(days=1)
    nowdate -= timedelta(days=1)
    
    q = Q()
    # q.add(Q(headquarter='강북/강원'),q.AND)
    # q.add(Q(affairs='월곡'),q.AND)
    affairs_all = affairs.objects.filter(q)
    
    for affa in affairs_all :
        targetdate = nowdate
        print(affa.affairs)
        now_power_sum = 0
        past_power_sum = 0
        for i in range(7):
            str_date = targetdate.strftime("%Y%m%d")
            print("올해 날짜 : "+str_date)
            kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
            try:
                resp = requests.get(url=kepco_url)
                json_data = json.loads(resp.text)
                now_dict_data = json_data['dayLpDataInfoList'][0]
                now_kepco_power_list =list((now_dict_data).keys())
                if ("errMsg" in now_kepco_power_list) :
                    print(now_dict_data)
                    continue
            except Exception as e :
                print(str(e))
            st_week = targetdate.isocalendar()
            last_date = datetime.strptime(str(st_week[0]-1)+(str(st_week[1]) if len(str(st_week[1])) == 2 else '0' + str(st_week[1]))+"1", "%Y%W%w")
            while(targetdate.weekday() != last_date.weekday()):
                last_date += timedelta(days=1)
            # print("전년도 동주차 동요일 : "+str(last_date))
            # 전년도 동주차 동요일
            str_date = last_date.strftime("%Y%m%d")
            # print(str_date)
            kepco_url = f'https://opm.kepco.co.kr:11080/OpenAPI/getDayLpData.do?custNo={affa.cust_no}&date={str_date}&serviceKey=bpb89eyd7bg430vckh8t&returnType=02'
            try:
                resp = requests.get(url=kepco_url)
                json_data = json.loads(resp.text)
                past_dict_data = json_data['dayLpDataInfoList'][0]
                past_kepco_power_list =list((past_dict_data).keys())
                if ("errMsg" in past_kepco_power_list) :
                    continue
            except Exception as e :
                print(str(e))
            
            try:
                for powlist in now_kepco_power_list :
                    if 'pwr_qty' in str(powlist) :
                        if (past_dict_data[powlist] != '') and (now_dict_data[powlist] != ''):
                            now_power_sum += float(now_dict_data[powlist])
                            past_power_sum += float(past_dict_data[powlist])
            except Exception as e :
                print(str(e))
            targetdate -= timedelta(days=1)
        try:
            st_week = nowdate.isocalendar()
            temp_statistics = affairsweekpower(
                weekpowerpk = str(affa.affairs) + str(st_week[0]) + str(st_week[1]),
                headquarter = affa.headquarter,
                affairs = affa.affairs,
                isocanledar_year = st_week[0],
                isocanledar_week = st_week[1],
                powersum = now_power_sum,
                lastyearpowersum = past_power_sum,
                )
            temp_statistics.save()
        except Exception as e:
            print(str(e))
    return JsonResponse({'returnCode' : "ok"})

# 일일레포트 데이터 파일 만들기
@csrf_exempt
def daily_report_data(request):
    todaydate = (datetime.today()).replace(hour=0).replace(minute=0).replace(second=0).replace(microsecond=0)
    # todaydate = date(todaydate.year,2,11)
    nowfirstdate = datetime(todaydate.year,1,1)
    center_object = affairs.objects.filter(headquarter='강북/강원').exclude(center='기타').distinct().values('center')
    during_range = timedelta(days=1) if todaydate.weekday() != 0 else timedelta(days=3)
    print(todaydate)
    print(nowfirstdate)
    return_list = []
    for rows in center_object :
        print(rows['center'])
        q = Q()
        q.add(Q(headquarter='강북/강원'),q.AND)
        q.add(Q(center=rows['center']),q.AND)
        affairs_all = affairs.objects.filter(q)
        for affa in affairs_all:
            try:
                return_dict = {}
                
                # 누계 부분
                q = Q()
                q.add(Q(affairs=affa.affairs),q.AND)
                q.add(Q(isreliability=1),q.AND)
                q.add(Q(time__range=[nowfirstdate.replace(minute=1),todaydate.replace(minute=1)]),q.AND)
                # print(affairspower.objects.filter(q).query)
                lastsumobject = affairspower.objects.filter(q).aggregate(Sum('lastyearpower'))['lastyearpower__sum'] 
                nowsumobject = affairspower.objects.filter(q).aggregate(Sum('power'))['power__sum']
                lastsum = lastsumobject or 0
                nowsum = nowsumobject or 0
                sumdiff = nowsum-lastsum
                sumrate = ((nowsum-lastsum)/lastsum*100) if nowsum !=0 and lastsum !=0 else 0
                
                return_dict['센터'] = rows['center']
                return_dict['국사'] = affa.affairs
                
                return_dict['작년누계'] = round(lastsum,2)
                return_dict['올해누계'] = round(nowsum,2)
                return_dict['누계대비'] = round(sumdiff,2)
                return_dict['누계증감율'] = round(sumrate,2)
                
                # 일별 부분
                targetdate = todaydate-during_range
                
                while(targetdate<todaydate) :
                    q = Q()
                    q.add(Q(affairs=affa.affairs),q.AND)
                    q.add(Q(isreliability=1),q.AND)
                    q.add(Q(time__range=[targetdate.replace(minute=1),(targetdate+timedelta(days=1)).replace(minute=1)]),q.AND)
                    lastdayobject = affairspower.objects.filter(q).aggregate(Sum('lastyearpower'))['lastyearpower__sum'] 
                    nowdayobject = affairspower.objects.filter(q).aggregate(Sum('power'))['power__sum']
                    # print(affairspower.objects.filter(q).query)
                    lastdaypower = lastdayobject or 0
                    nowdaypower = nowdayobject or 0
                    daypowerdiff = nowdaypower - lastdaypower
                    daypowerrate = ((nowdaypower-lastdaypower)/lastdaypower*100) if nowdaypower !=0 and lastdaypower !=0 else 0
                    
                    st_week = targetdate.isocalendar()
                    last_date = datetime.strptime(str(st_week[0]-1)+(str(st_week[1]) if len(str(st_week[1])) == 2 else '0' + str(st_week[1]))+"1", "%Y%W%w")
                    while(targetdate.weekday() != last_date.weekday()):
                        last_date += timedelta(days=1)
                    
                    return_dict[last_date.strftime("%Y%m%d")] = round(lastdaypower,2)
                    return_dict[(targetdate).strftime("%Y%m%d")] = round(nowdaypower,2)
                    return_dict[(targetdate).strftime("%Y%m%d")+'전력대비'] = round(daypowerdiff,2)
                    return_dict[(targetdate).strftime("%Y%m%d")+'전력증감율'] = round(daypowerrate,2)
                    targetdate += timedelta(days=1)
                return_list.append(return_dict)
            except Exception as e :
                print(str(e))
    df = pd.DataFrame(return_list)
    df.to_csv(f'./dailyreport/dailyreport_{todaydate.strftime("%Y%m%d")}.csv',index=False)
    return JsonResponse({'returnCode' : "ok"})