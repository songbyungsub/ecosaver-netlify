from django.db import models
import uuid

# Create your models here.

class affairs (models.Model):
    affairs_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    headquarter = models.CharField(null=True,max_length=30) # 본부
    center = models.CharField(null=True,max_length=30) # 센터
    team = models.CharField(null=True,max_length=30) # 팀
    affairs = models.CharField(null=True,max_length=30)
    cust_no = models.CharField(null=True,max_length=30)
    contract = models.CharField(null=True,max_length=30)
    powertocost = models.CharField(null=True,max_length=30)

class affairspower (models.Model):
    # power_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    affairpowerid = models.CharField(primary_key=True,unique=True,max_length=30) # 전력데이터 pk
    affairs_uuid = models.ForeignKey(affairs, to_field='affairs_uuid',on_delete=models.CASCADE) # affar의 uuid
    affairs = models.CharField(null=True,max_length=30) # 국사
    power = models.FloatField(null=True,max_length=30) # 전력량
    cost = models.FloatField(null=True,max_length=30) # 전력비용
    time = models.DateTimeField(null=True) # 국사_일시
    isocanledar_year = models.IntegerField(null=True) # 년도
    # isocanledar_month = models.IntegerField(null=True)
    isocanledar_week = models.IntegerField(null=True) # n주차
    time_hour = models.IntegerField(null=True) # 시
    time_minute = models.IntegerField(null=True) # 분
    weekday = models.IntegerField(null=True) # 요일
    lastyearpower = models.FloatField(null=True,max_length=30) # 전년도 동주차 동요일 전력량
    isreliability = models.BooleanField(default = False) # 데이터 신뢰성
    

class affairsbill (models.Model):
    affairbillid = models.CharField(primary_key=True,unique=True,max_length=30)
    affairs_id = models.ForeignKey(affairs, to_field='affairs_uuid',on_delete=models.CASCADE) # affar의 uuid

    billdate = models.DateField(null=True) # 청구년월
    mrdate = models.DateField(null=True) # 검침일

    bill_aply_power = models.FloatField(null=True,max_length=30) # 요금적용전력

    base_bill = models.FloatField(null=True,max_length=30) # 기본요금
    kwh_bill = models.FloatField(null=True,max_length=30) # 전력량요금
    dc_bill = models.FloatField(null=True,max_length=30) # 할인공제요금
    req_bill = models.FloatField(null=True,max_length=30) # 전기요금
    fianl_bill = models.FloatField(null=True,max_length=30) # 청구요금

    lload_usekwh = models.FloatField(null=True,max_length=30) # 경부하사용량
    mload_usekwh = models.FloatField(null=True,max_length=30) # 중부하사용량
    maxload_usekwh = models.FloatField(null=True,max_length=30) # 최대부하사용량

    lload_needle = models.FloatField(null=True,max_length=30) # 경부하당월지침
    mload_needle = models.FloatField(null=True,max_length=30) # 중부하당월지침
    maxload_needle = models.FloatField(null=True,max_length=30) # 최대부하당월지침

    jn_pwrfact = models.FloatField(null=True,max_length=30) # 진상역률
    ji_pwrfact = models.FloatField(null=True,max_length=30) # 지상역률
    
class affairsweekpower (models.Model):
    weekpowerpk = models.CharField(primary_key=True,unique=True,max_length=30)
    
    headquarter = models.CharField(null=True,max_length=30) # 본부
    affairs = models.CharField(null=True,max_length=30) # 국사
    
    isocanledar_year = models.IntegerField(null=True) # 년도
    isocanledar_week = models.IntegerField(null=True) # n주차
    
    powersum = models.FloatField(null=True,max_length=30) # 전력량 합
    lastyearpowersum = models.FloatField(null=True,max_length=30) # 전년도 동주차 전력량 합