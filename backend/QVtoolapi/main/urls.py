from django.urls import path

from .views import RootView, ElectionList, ElectionDetail

urlpatterns = [
    path('', RootView.as_view(), name='root-view'),

    path('elections/', ElectionList.as_view(), name='election-list'),
    path('elections/<int:pk>/', ElectionDetail.as_view(),
         name='election-detail')
]
