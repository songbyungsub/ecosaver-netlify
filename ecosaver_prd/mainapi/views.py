from django.shortcuts import render
from django.http import JsonResponse
import requests
import json
from datetime import date, timedelta, datetime
import lunardate
import calendar
import numpy as np
import pandas as pd
from kepco.models import *
from kepco.views import *
import re
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F,Sum, Count
from django.db.models.functions import TruncHour,TruncMonth, TruncDay, TruncYear, Trunc, Cast
from django.db import models
import time
import os

# 본부 목록 api
@csrf_exempt
def headquarterapi(request):
    if (request.method == 'POST') :
        try:
            # 국사 테이블에서 본부만 group by 후 정렬
            affairs_all = affairs.objects.values('headquarter').order_by('headquarter').distinct()

            answer_list = []

            for row in affairs_all :
                if '강북' in str(row['headquarter']) :
                    answer_list.append(str(row['headquarter']))
            for row in affairs_all :
                if '강북' not in str(row['headquarter']) :
                    answer_list.append(str(row['headquarter']))

            # return example
            # {
            #     "list" : [
            #         '강북/강원','강남/서부', ...
            #     ]
            # }
            return JsonResponse({'returnCode' : "ok", "list" : list(answer_list)},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})

# 센터 목록 api
@csrf_exempt
def centerapi(request):
    if request.method == 'POST':
        try:
            receiveData = json.loads(request.body.decode("utf-8"))

            q = Q()
            q.add(Q(center__contains=receiveData['data']['center']),q.AND)
            # q.add(Q(center__contains="서울강북"),q.AND)

            affairs_all = affairs.objects.filter(q).exclude(
                Q(headquarter='비통신') | Q(headquarter='제주단')| Q(headquarter='직할센터'
                                                               )).values('affairs').order_by('affairs').distinct()

            answer_list = []

            for row in affairs_all :
                answer_list.append(str(row['affairs']))

            return JsonResponse({'returnCode' : "ok", "list" : list(answer_list)},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})

# 팀 목록 api
# @csrf_exempt
# def teamapi(request):
#     if request.method == 'POST':
#         try:
#             receiveData = json.loads(request.body.decode("utf-8"))

#             q = Q()
#             q.add(Q(center=receiveData['data']['center']),q.AND)

#             affairs_all = affairs.objects.filter(q).values('team').order_by('team').distinct()

#             answer_list = []

#             for row in affairs_all :
#                 answer_list.append(str(row['team']))

#             return JsonResponse({'returnCode' : "ok", "list" : list(answer_list)},json_dumps_params={'ensure_ascii': False})
#         except Exception as e :
#             print(str(e))
#             return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})

# 국사 목록 api
@csrf_exempt
def affairapi(request):
    if request.method == 'POST':
        try:
            receiveData = json.loads(request.body.decode("utf-8"))

            # 받은 데이터에서 본부 읽어서 국사 리스트 orm으로 부르기
            q = Q()
            q.add(Q(headquarter__contains=receiveData['data']['headquarter'][:2]),q.AND)
            affairs_all = affairs.objects.filter(q).values('affairs').order_by('affairs').distinct()

            # 데이터 return
            answer_list = []
            for row in affairs_all :
                answer_list.append(str(row['affairs']))

            # return example
            # {
            #     "list" : [
            #         '혜화','전농', ...
            #     ]
            # }
            return JsonResponse({'returnCode' : "ok", "list" : list(answer_list)},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})

#---------------------------------------------------------------------------------------------------------------------------------------------------------
# 실시간 국사 전력데이터 api
@csrf_exempt
def affairquarterpowerapi(request):
    if request.method == 'POST'  :
        try:
            receiveData = json.loads(request.body.decode("utf-8"))
            # receiveData = {
            #     'data' : {
            #         'affair' : '혜화',
            #         'startDate' : '24-01-10',
            #         'endDate' : '24-01-10',
            #         'selectedRadio' : 'day',
            #     }
            # }
            # 조회하는 국사 pk 가져오기
            q = Q()
            q.add(Q(affairs=receiveData['data']['affair']), q.AND)
            selected_affair = affairs.objects.filter(q)

            # 조회 날짜 전처리
            startDate = "20" + str(receiveData['data']['startDate']).replace("-","")
            endDate = "20" + str(receiveData['data']['endDate']).replace("-","")

            # 조회 날짜 및 국사 지정 장고 orm 불러오기
            m = Q()
            # m.add(Q(isreliability=1), m.AND)
            m.add(Q(affairs_uuid=selected_affair[0]), m.AND)
            m.add(Q(time__range=(datetime.strptime(startDate, "%Y%m%d"),datetime.strptime(endDate, "%Y%m%d")+timedelta(days=1)-timedelta(minutes=1))),m.AND)
            power_object = affairspower.objects.filter(m)
            # 시간 단위에 따라 가져온 object 처리
            if receiveData['data']['selectedRadio'] == 'half' :
                time_list = []
                # 짝수때마다 전에꺼랑 더해서 리턴 데이터에 추가
                for nu in range(len(power_object)) :
                    if (nu+1) % 2 != 1:
                        time_list.append(
                            {
                                'date' : power_object[nu-1].time,
                                'power' : int(float(power_object[nu-1].power)) + int(float(power_object[nu].power)),
                                'cost' : int(power_object[nu-1].cost) + int(power_object[nu].cost),
                            }
                        )
                last_object = time_list
            # 나머지의 경우 Trunc를 활용 시간단위에 맞게 출력
            elif receiveData['data']['selectedRadio'] == 'hour' :
                last_object = power_object.annotate(date=TruncHour('time')).values('date').annotate(power=Sum('power')).annotate(cost=Sum('cost')).values('date','power','cost').annotate(time=Cast('date',models.TextField())).values('date','power','cost')
            elif receiveData['data']['selectedRadio'] == 'day' :
                last_object = power_object.annotate(date=TruncDay('time')).values('date').annotate(power=Sum('power')).annotate(cost=Sum('cost')).values('date','power','cost').annotate(time=Cast('date',models.TextField())).values('date','power','cost')
            elif receiveData['data']['selectedRadio'] == 'month' :
                last_object = power_object.annotate(date=TruncMonth('time')).values('date').annotate(power=Sum('power')).annotate(cost=Sum('cost')).values('date','power','cost').annotate(time=Cast('date',models.TextField())).values('date','power','cost')
            elif receiveData['data']['selectedRadio'] == 'year' :
                last_object = power_object.annotate(date=TruncYear('time')).values('date').annotate(power=Sum('power')).annotate(cost=Sum('cost')).values('date','power','cost').annotate(time=Cast('date',models.TextField())).values('date','power','cost')
            else :
                last_object = power_object.values('time','power','cost').annotate(date=Cast('time',models.TextField())).values('date','power','cost')
            
            # 최종으로 출력한 장고 object를 프론트에서 정한 규격에 따라 가공
            # answer_list = []
            # for row in last_object :
            #     try:
            #         answer_list.append(
            #             {
            #                 'time' : str(row['date']),
            #                 'power' : str(row['power']),
            #                 'cost' : str(row['cost']),
            #             }
            #         )
            #     except:
            #         answer_list.append(
            #             {
            #                 'time' : str(row.time),
            #                 'power' : str(row.power), #kwh
            #                 'cost' : str(row.cost)
            #             }
            #         )

            # return example
            # {
            #     "list" : [
            #         {
            #             'time' : "202401030800",
            #             'power' : "1923.34",
            #             'cost' : '236503.9',
            #         },
            #         {
            #             'time' : "202401030815",
            #             'power' : "1253.34",
            #             'cost' : "12353.34",
            #         },
            #         ...
            #     ]
            # }
            return JsonResponse({'returnCode' : "ok","list" : { "affair":receiveData['data']['affair'], 'data' : list(last_object), 'length' : len(last_object) }},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})

# 대쉬보드 API ---------------------------------------------------------------------------------------------------------------
@csrf_exempt
def all_graph(request):
    if request.method == 'POST' :
        try:
            todaydate = date.today()
            targetdate = todaydate - timedelta(days=7)
            
            target_year = targetdate.isocalendar()[0]
            target_week_num = targetdate.isocalendar()[1]
            
            return_dict = {}
            temp_week_num = get_today_week_name(targetdate)
            return_dict['month'] = str(temp_week_num[0])
            return_dict['week'] = str(temp_week_num[1])    
            
            w = Q()
            w.add(Q(isocanledar_year=(target_year)), w.AND)
            w.add(Q(isocanledar_week=target_week_num), w.AND)
            now_total_kwh = affairsweekpower.objects.exclude(Q(headquarter='비통신') | Q(headquarter='제주단')| Q(headquarter='직할센터')).filter(w).aggregate(Sum('powersum'))['powersum__sum']
            past_total_kwh = affairsweekpower.objects.exclude(Q(headquarter='비통신') | Q(headquarter='제주단')| Q(headquarter='직할센터')).filter(w).aggregate(Sum('lastyearpowersum'))['lastyearpowersum__sum']
            
      
            return_dict['past'] = round(past_total_kwh,1)
            return_dict['now'] = round(now_total_kwh,1)
            return_dict['rate'] = (round((((now_total_kwh-past_total_kwh)/past_total_kwh))*100,1) if now_total_kwh != 0 and past_total_kwh!= 0  else 0)
            return JsonResponse({'returnCode' : "ok","list" :return_dict},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})

# 전국본부 주차별 전력 데이터 API
@csrf_exempt
def headquarter_graph(request):
    if request.method == 'POST' :
        try:
            todaydate = date.today()
            targetdate = todaydate - timedelta(days=7)
            
            target_year = targetdate.isocalendar()[0]
            target_week_num = targetdate.isocalendar()[1]
      
            headquarter_object = affairs.objects.exclude(Q(headquarter='비통신') | Q(headquarter='제주단')| Q(headquarter='직할센터')).distinct().values('headquarter')
            
            return_dict = {}
            temp_week_num = get_today_week_name(targetdate)
            return_dict['month'] = str(temp_week_num[0])
            return_dict['week'] = str(temp_week_num[1])    
            return_dict['data'] = []
            
            for rows in headquarter_object:
                headquarter_dict = {}
                past_kwh_num = 0
                now_kwh_num = 0
                
                w = Q()
                w.add(Q(headquarter=(rows['headquarter'])), w.AND)
                w.add(Q(isocanledar_year=(target_year)), w.AND)
                w.add(Q(isocanledar_week=target_week_num), w.AND)
                now_total_kwh = affairsweekpower.objects.filter(w).aggregate(Sum('powersum'))['powersum__sum']
                past_total_kwh = affairsweekpower.objects.filter(w).aggregate(Sum('lastyearpowersum'))['lastyearpowersum__sum']
                
                
                headquarter_dict['headquarter'] = (rows['headquarter'])
                headquarter_dict['past'] = round(past_total_kwh,1)
                headquarter_dict['now'] = round(now_total_kwh,1)
                headquarter_dict['rate'] = (round((((now_total_kwh-past_total_kwh)/past_total_kwh))*100,1) if now_total_kwh != 0 and past_total_kwh!= 0  else 0)
                return_dict['data'].append(headquarter_dict)
            sorted_return_list = sorted(return_dict['data'], key=lambda item: item['rate'])
            return_dict['data'] = sorted_return_list
            return JsonResponse({'returnCode' : "ok","list" :return_dict},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})
        
# 강북강원 국사별 절감률 TOP5 API
@csrf_exempt
def center_topfive(request):
    if request.method == 'POST' :
        try:
            todaydate = date.today()
            targetdate = todaydate - timedelta(days=7)
            
            target_year = targetdate.isocalendar()[0]
            target_week_num = targetdate.isocalendar()[1]
            
            affair_object = affairs.objects.filter(headquarter="강북/강원").exclude(Q(headquarter='비통신') | Q(headquarter='제주단')| Q(headquarter='직할센터'))
            
            return_dict = {}
            temp_week_num = get_today_week_name(targetdate)
            return_dict['month'] = str(temp_week_num[0])
            return_dict['week'] = str(temp_week_num[1]) 
            return_dict['data'] = []
          
            for rows in affair_object:
                affair_dict = {}
                past_kwh_num = 0
                now_kwh_num = 0
                
                w = Q()
                w.add(Q(affairs=(rows.affairs)), w.AND)
                w.add(Q(isocanledar_year=(target_year)), w.AND)
                w.add(Q(isocanledar_week=target_week_num), w.AND)
                powersum_object = affairsweekpower.objects.filter(w)[0]
                now_total_kwh = powersum_object.powersum
                past_total_kwh = powersum_object.lastyearpowersum
           
                affair_dict['center'] = (rows.affairs)
                affair_dict['past'] = round(past_total_kwh,1)
                affair_dict['now'] = round(now_total_kwh,1)
                affair_dict['rate'] = (round((((now_total_kwh-past_total_kwh)/past_total_kwh))*100,1) if now_total_kwh != 0 and past_total_kwh!= 0  else 0)
                return_dict['data'].append(affair_dict)
                
            sorted_return_list = sorted(return_dict['data'], key=lambda item: item['rate'])[:5]
            return_dict['data'] = sorted_return_list
            return JsonResponse({'returnCode' : "ok","list" :return_dict},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})
        
# 강북센터 주차별 전력 데이터 API
@csrf_exempt
def center_graph(request):
    if request.method == 'POST' :
        try:
            start = time.time()
            
            todaydate = date.today()
            targetdate = todaydate - timedelta(days=7)
            
            target_year = targetdate.isocalendar()[0]
            target_week_num = targetdate.isocalendar()[1]
            
            # 강북/강원만, 기타 제외
            center_object = affairs.objects.filter(headquarter='강북/강원').exclude(center='기타').distinct().values('center')
            return_dict = {}
            temp_week_num = get_today_week_name(targetdate)
            return_dict['month'] = str(get_today_week_name(todaydate)[0])
            return_dict['week'] = str(get_today_week_name(todaydate)[1])    
            return_dict['data'] = []
            
            for rows in center_object:
                center_dict = {}
                past_kwh_num = 0
                now_kwh_num = 0
                q = Q()
                q.add(Q(center=rows['center']), q.AND)
                target_object = affairs.objects.filter(q)
                    
                for affai in target_object:
                    w = Q()
                    w.add(Q(affairs=(affai.affairs)), w.AND)
                    w.add(Q(isocanledar_year=(target_year)), w.AND)
                    w.add(Q(isocanledar_week=target_week_num), w.AND)
                    powersum_object = affairsweekpower.objects.filter(w)[0]
                    now_total_kwh = powersum_object.powersum
                    past_total_kwh = powersum_object.lastyearpowersum

                    now_kwh_num += now_total_kwh
                    past_kwh_num += past_total_kwh
                
                center_dict['center'] = (rows['center'])
                center_dict['past'] = round(past_kwh_num,1)
                center_dict['now'] = round(now_kwh_num,1)
                center_dict['rate'] = (round((((now_kwh_num-past_kwh_num)/past_kwh_num))*100,1) if now_kwh_num != 0 and past_kwh_num!= 0  else 0)
                return_dict['data'].append(center_dict)
            sorted_return_list = sorted(return_dict['data'], key=lambda item: item['rate'])
            return_dict['data'] = sorted_return_list
            print("center_graph api time: "+f"{time.time()-start:.4f} sec")
            return JsonResponse({'returnCode' : "ok","list" :return_dict},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})
         
# 강북센터내 국사 주차별 전력 데이터 API
@csrf_exempt
def center_affair_graph(request):
    if request.method == 'POST' :
        try:
            receiveData = json.loads(request.body.decode("utf-8"))
            
            todaydate = date.today()
            targetdate = todaydate - timedelta(days=7)
            
            target_year = targetdate.isocalendar()[0]
            target_week_num = targetdate.isocalendar()[1]
            
            q = Q()
            q.add(Q(center=receiveData['data']['center']), q.AND)
            # q.add(Q(center="강원액세스운용센터"), q.AND)
            affair_object = affairs.objects.exclude(Q(headquarter='비통신') | Q(headquarter='제주단')| Q(headquarter='직할센터')| Q(center='기타')).filter(q)
            
            return_dict = {}
            return_dict['month'] = str(get_today_week_name(todaydate)[0])
            return_dict['week'] = str(get_today_week_name(todaydate)[1])    
            return_dict['data'] = []
            
            for rows in affair_object:
                affair_dict = {}
                past_kwh_num = 0
                now_kwh_num = 0
                
                w = Q()
                w.add(Q(affairs=(rows.affairs)), w.AND)
                w.add(Q(isocanledar_year=(target_year)), w.AND)
                w.add(Q(isocanledar_week=target_week_num), w.AND)
                powersum_object = affairsweekpower.objects.filter(w)[0]
                now_total_kwh = powersum_object.powersum
                past_total_kwh = powersum_object.lastyearpowersum

                now_kwh_num += now_total_kwh
                past_kwh_num += past_total_kwh
            
                affair_dict['affairs'] = (rows.affairs)
                affair_dict['past'] = round(past_kwh_num,1)
                affair_dict['now'] = round(now_kwh_num,1)
                affair_dict['rate'] = (round((((now_kwh_num-past_kwh_num)/past_kwh_num))*100,1) if now_kwh_num != 0 and past_kwh_num!= 0  else 0)
                return_dict['data'].append(affair_dict)
            sorted_return_list = sorted(return_dict['data'], key=lambda item: item['rate'])
            return_dict['data'] = sorted_return_list
            return JsonResponse({'returnCode' : "ok","list" :return_dict},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})
        
# 강북 센터 갯수 API
@csrf_exempt
def gb_center_affair_num(request):
    if request.method == 'POST' :
        try:
            temp_object = affairs.objects.filter(headquarter="강북/강원").exclude(center="기타").values("center").annotate(
                count = Count('affairs')
            ).values('center','count')
            return JsonResponse({'returnCode' : "ok","list" : list(temp_object)},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})
        
# 국사 날짜선택 전력비교 API
@csrf_exempt
def center_affairs_rate(request):
    if request.method == 'POST' :
        try:
            receiveData = json.loads(request.body.decode("utf-8"))
            return_list = []
            
            enddate = datetime.strptime("20"+str(receiveData['data']['enddate']), "%Y-%m-%d")
            startdate = datetime.strptime("20"+str(receiveData['data']['startdate']), "%Y-%m-%d")
            
            while(startdate.weekday() != 0) :
                startdate -= timedelta(days=1)
            
            while startdate <= enddate:
                # print(startdate.weekday())
                if (startdate.weekday() == 0):
                    targetdate = startdate
                    now_total_kwh = 0
                    past_total_kwh = 0
                    
                    target_year = targetdate.isocalendar()[0]
                    target_week_num = targetdate.isocalendar()[1]
                    
                    past_kwh_num = 0
                    now_kwh_num = 0
                    
                    affair_dict = {}
                    if receiveData['data']['affairs'] == "전체" :
                        # 광역본부 전체 조건
                        w = Q()
                        w.add(Q(headquarter='강북/강원'), w.AND)
                        w.add(Q(isocanledar_year=(target_year)), w.AND)
                        w.add(Q(isocanledar_week=target_week_num), w.AND)
                        temp_week_power_object = affairsweekpower.objects.filter(w)
                        
                        now_total_kwh = temp_week_power_object.aggregate(Sum('powersum'))['powersum__sum'] or 0
                        past_total_kwh = temp_week_power_object.aggregate(Sum('lastyearpowersum'))['lastyearpowersum__sum'] or 0
                    elif len(affairs.objects.filter(affairs=receiveData['data']['affairs'])) == 0 :
                        # 센터 단위 조건
                        w = Q()
                        w.add(Q(headquarter='강북/강원'), w.AND)
                        w.add(Q(center=receiveData['data']['affairs']), w.AND)
                        temp_affair_object = affairs.objects.filter(w)
                        
                        for affa in temp_affair_object:
                            w = Q()
                            w.add(Q(affairs=affa.affairs), w.AND)
                            w.add(Q(isocanledar_year=(target_year)), w.AND)
                            w.add(Q(isocanledar_week=target_week_num), w.AND)
                            temp_week_power_object = affairsweekpower.objects.filter(w)
                            
                            if len(temp_week_power_object) > 0:
                                powersum_object = temp_week_power_object[0]
                                now_total_kwh += powersum_object.powersum
                                past_total_kwh += powersum_object.lastyearpowersum
                    else :
                        # 국사 단위 조건
                        w = Q()
                        w.add(Q(affairs=receiveData['data']['affairs']), w.AND)
                        w.add(Q(isocanledar_year=(target_year)), w.AND)
                        w.add(Q(isocanledar_week=target_week_num), w.AND)
                        temp_week_power_object = affairsweekpower.objects.filter(w)
                        
                        if len(temp_week_power_object) > 0:
                            powersum_object = temp_week_power_object[0]
                            now_total_kwh = powersum_object.powersum
                            past_total_kwh = powersum_object.lastyearpowersum
                        else:
                            now_total_kwh = 0
                            past_total_kwh = 0
                    
                    affair_dict['week'] = str(get_today_week_name(targetdate)[0]) + "-" + str(get_today_week_name(targetdate)[1]) + "주차"
                    affair_dict['past'] = str(round(past_total_kwh,1))
                    affair_dict['now'] = str(round(now_total_kwh,1))
                    affair_dict['rate'] = str((round((((now_total_kwh-past_total_kwh)/past_total_kwh))*100,1) if now_total_kwh != 0 and past_total_kwh!= 0  else 0))
                    
                    return_list.append(affair_dict)

                startdate += timedelta(days=1)
                
            return JsonResponse({'returnCode' : "ok","list":return_list},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})
        
     
# 일일 레포트 페이지 API ==========================================================================================================================
@csrf_exempt
def export_affair_power(request):
    if request.method == 'POST':
        try:
            df = pd.read_csv('data_power_gb.csv',dtype="str")
            io = StringIO()
            df.to_csv(io)
            io.seek(0)
            encoded_filename = quote('강북강원광역본부국사별전력데이터.csv')
            response = HttpResponse(io, content_type='text/csv',charset="utf-8-sig")
            response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(encoded_filename)
            return response
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})
        
@csrf_exempt
def export_daily_report_data(request):
    if request.method == 'POST':
        try:
            receiveData = json.loads(request.body.decode("utf-8"))
            targetdate_str = ("20"+receiveData['startDate']).replace("-","")
            # targetdate_str = "2024-02-20"
            # print(targetdate_str)
            removedate = date.today() - timedelta(days=8)
            file_data_dir = os.path.join(os.getcwd(),'dailyreport')
            check_num = 0
            for (root, directories, files) in os.walk(file_data_dir):
                for file in files :
                    file_date_str = str(file).split("_")[1].split(".")[0]
                    file_date = date(int(file_date_str[:4]),int(file_date_str[4:6]),int(file_date_str[6:8]))
                    file_path = os.path.join(root,file)
                    if (removedate>=file_date) :
                        os.remove(file_path)
                    else:
                        
                        if targetdate_str in file_path:
                            check_num += 1
                            tartget_file = file_path
            if check_num :
                df = pd.read_csv(tartget_file,dtype="str")
                io = StringIO()
                df.to_csv(io)
                io.seek(0)
                encoded_filename = quote('일일레포트.csv')
                response = HttpResponse(io, content_type='text/csv',charset="utf-8-sig")
                response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(encoded_filename)
                return response
            else:
                return JsonResponse({'returnCode' : "ok", "message" : "no file"},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})
        
@csrf_exempt
def power_goal_dashboard(request):
    if request.method == 'POST' :
        try:
            todaydate = datetime.today().replace(hour=0).replace(minute=0).replace(second=0).replace(microsecond=0)
            # todaydate = date(todaydate.year,2,11)
            nowfirstdate = datetime(todaydate.year,1,1).replace(hour=0).replace(minute=0).replace(second=0).replace(microsecond=0)
            
            headquarter_goal = 0.95
            sector_goal = 1
            
            center_object = affairs.objects.filter(headquarter='강북/강원').exclude(center='기타').distinct().values('center')
            date_str = ''
            if todaydate.weekday() != 0:
                during_range = timedelta(days=1)
                date_str = str((todaydate-during_range).strftime("%m%d"))
            else :
                during_range = timedelta(days=3)
                date_str = str((todaydate-during_range).strftime("%m%d")) + "-" + str((todaydate-timedelta(days=1)).strftime("%m%d"))
            weekdate_str = str((todaydate-timedelta(days=7)).strftime("%m%d")) + "-" + str((todaydate-timedelta(days=1)).strftime("%m%d"))
            print(todaydate)
            return_list = []
            
            headquarter_last_sum = 0
            headquarter_now_sum = 0
            headquarter_last_week = 0
            headquarter_now_week = 0
            headquarter_last_day = 0
            headquarter_now_day = 0
            
            for rows in center_object :
                if '기술담당' in rows['center'] :
                    continue
                print(rows['center'])
                return_dict = {}
                return_dict['센터'] = rows['center']
                
                lastyearlastsum = 0
                lastyearnowsum = 0
                lastyearlastweek = 0
                lastyearnowweek = 0
                lastyearlastday = 0
                lastyearnowday = 0
                
                q = Q()
                q.add(Q(headquarter='강북/강원'),q.AND)
                q.add(Q(center=rows['center']),q.AND)
                affairs_all = affairs.objects.filter(q)
                for affa in affairs_all:
                    try:
                        # 누계 부분
                        q = Q()
                        q.add(Q(affairs=affa.affairs),q.AND)
                        q.add(Q(isreliability=1),q.AND)
                        q.add(Q(time__range=[nowfirstdate+timedelta(minutes=1),todaydate+timedelta(minutes=1)]),q.AND)
                        lastsumobject = affairspower.objects.filter(q).aggregate(Sum('lastyearpower'))['lastyearpower__sum'] 
                        nowsumobject = affairspower.objects.filter(q).aggregate(Sum('power'))['power__sum']
                        # print(affairspower.objects.filter(q).query)
                        lastyearlastsum += lastsumobject or 0
                        lastyearnowsum += nowsumobject or 0
                        
                        # 일별 부분
                        targetdate = todaydate-during_range
                        
                        q = Q()
                        q.add(Q(affairs=affa.affairs),q.AND)
                        q.add(Q(isreliability=1),q.AND)
                        q.add(Q(time__range=[targetdate+timedelta(minutes=1),todaydate+timedelta(minutes=1)]),q.AND)
                        lastdayobject = affairspower.objects.filter(q).aggregate(Sum('lastyearpower'))['lastyearpower__sum'] 
                        nowdayobject = affairspower.objects.filter(q).aggregate(Sum('power'))['power__sum']
                        # print(affairspower.objects.filter(q).query)
                        lastyearlastday += lastdayobject or 0
                        lastyearnowday += nowdayobject or 0
                            
                        
                        # 일주일 부분
                        targetdate = todaydate-timedelta(days=7)
                        
                        q = Q()
                        q.add(Q(affairs=affa.affairs),q.AND)
                        q.add(Q(isreliability=1),q.AND)
                        q.add(Q(time__range=[targetdate+timedelta(minutes=1),todaydate+timedelta(minutes=1)]),q.AND)
                        lastweekobject = affairspower.objects.filter(q).aggregate(Sum('lastyearpower'))['lastyearpower__sum'] 
                        nowweekobject = affairspower.objects.filter(q).aggregate(Sum('power'))['power__sum']
                        # print(affairspower.objects.filter(q).query)
                        lastyearlastweek += lastweekobject or 0
                        lastyearnowweek += nowweekobject or 0
                        
                    except Exception as e :
                        print(str(e))
                        
                headquarter_last_sum += lastyearlastsum
                headquarter_now_sum += lastyearnowsum
                headquarter_last_week += lastyearlastweek
                headquarter_now_week += lastyearnowweek
                headquarter_last_day += lastyearlastday
                headquarter_now_day += lastyearnowday
            
                return_dict['전년대비누계'] = round((lastyearnowsum - lastyearlastsum)/lastyearlastsum*100,1)
                return_dict['전년대비'+date_str] = round((lastyearnowday-lastyearlastday)/lastyearlastday*100,1)
                return_dict['전년대비'+weekdate_str] = round((lastyearnowweek-lastyearlastweek)/lastyearlastweek*100,1)
                
                return_dict['본부대비누계'] = round((lastyearlastsum*headquarter_goal)/lastyearnowsum*100,1)
                return_dict['본부대비'+date_str] = round((lastyearlastday*headquarter_goal)/lastyearnowday*100,1)
                return_dict['본부대비'+weekdate_str] = round((lastyearlastweek*headquarter_goal)/lastyearnowweek*100,1)
                
                return_dict['부문대비누계'] = round((lastyearlastsum*sector_goal)/lastyearnowsum*100,1)
                return_dict['부문대비'+date_str] = round((lastyearlastday*sector_goal)/lastyearnowday*100,1)
                return_dict['부문대비'+weekdate_str] = round((lastyearlastweek*sector_goal)/lastyearnowweek*100,1)
                return_list.append(return_dict)
                
                
            headquarter_dict = {
                "센터" : "계",
                '전년대비누계' : round((headquarter_now_sum-headquarter_last_sum)/headquarter_last_sum*100,1),
                '전년대비'+date_str : round((headquarter_now_day-headquarter_last_day)/headquarter_last_day*100,1),
                '전년대비'+weekdate_str : round((headquarter_now_week-headquarter_last_week)/headquarter_last_week*100,1),
                
                '본부대비누계' : round(headquarter_last_sum*headquarter_goal/headquarter_now_sum*100,1),
                '본부대비'+date_str : round(headquarter_last_day*headquarter_goal/headquarter_now_day*100,1),
                '본부대비'+weekdate_str : round(headquarter_last_week*headquarter_goal/headquarter_now_week*100,1),
                
                '부문대비누계' : round(headquarter_last_sum*sector_goal/headquarter_now_sum*100,1),
                '부문대비'+date_str : round(headquarter_last_day*sector_goal/headquarter_now_day*100,1),
                '부문대비'+weekdate_str : round(headquarter_last_week*sector_goal/headquarter_now_week*100,1),
            }
            
            return_list.append(headquarter_dict)
            return JsonResponse({'returnCode' : "ok", "data" : return_list},json_dumps_params={'ensure_ascii': False})
        except Exception as e :
            print(str(e))
            return JsonResponse({'returnCode' : "le", "error" : str(e)},json_dumps_params={'ensure_ascii': False})