from django.urls import path, include
from kepco import views

urlpatterns = [
    path('crawling_kepco_power/',views.crawling_kepco_power, name='crawling_kepco_power'),

    # path('crawlingpower/',views.crawl_yearpower, name='crawlingpower'),
    path('crawl_yearpowergb/',views.crawl_yearpowergb, name='crawl_yearpowergb'),
    path('crawl_yearpowergn/',views.crawl_yearpowergn, name='crawl_yearpowergn'),
    path('crawl_yearpowerbs/',views.crawl_yearpowerbs, name='crawl_yearpowerbs'),
    # path('crawl_yearpowerdg/',views.crawl_yearpowerdg, name='crawl_yearpowerdg'),
    # path('crawl_yearpowerjn/',views.crawl_yearpowerjn, name='crawl_yearpowerjn'),
    # path('crawl_yearpowercn/',views.crawl_yearpowercn, name='crawl_yearpowercn'),
    
    path('uploadaffair/',views.writeaffairs, name='writeaffairs'),

    path('powerbill/',views.powerbill, name='powerbill'),
    path('importexcel/',views.importexcel, name='importexcel'),
    path('crawl_year_gb/',views.crawl_year_gb, name='crawl_year_gb'),
    path('test_api/',views.test_api, name='test_api'),
    path('power_statistics/',views.power_statistics, name='power_statistics'),
    path('daily_report_data/',views.daily_report_data, name='daily_report_data'),
]
