from django.urls import path, include
from mainapi import views

urlpatterns = [
    # 국사 소속 데이터
    path('depthheadquarter/',views.headquarterapi, name='headquarterapi'),
    path('depthcenter/',views.centerapi, name='centerapi'), 
    # path('depthteam/',views.teamapi, name='teamapi'),
    path('depthaffair/',views.affairapi, name='affairapi'),

    # 전력 데이터
    path('quarterpower/',views.affairquarterpowerapi, name='affairquarterpowerapi'),
    path('export_affair_power/',views.export_affair_power, name='export_affair_power'),
    path('export_daily_report_data/',views.export_daily_report_data, name='export_daily_report_data'),

    # 본부별 전주차 전력량
    path('all_graph/',views.all_graph, name='all_graph'),
    path('headquarter_graph/',views.headquarter_graph, name='headquarter_graph'),
    path('center_graph/',views.center_graph, name='center_graph'),
    path('center_topfive/',views.center_topfive, name='center_topfive'),
    path('center_affair_graph/',views.center_affair_graph, name='center_affair_graph'),
    path('gb_center_affair_num/',views.gb_center_affair_num, name='gb_center_affair_num'),
    path('center_affairs_rate/',views.center_affairs_rate, name='center_affairs_rate'),
    
    # 레포트페이지
    path('power_goal_dashboard/',views.power_goal_dashboard, name='power_goal_dashboard'),
]