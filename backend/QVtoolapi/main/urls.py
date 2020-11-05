from django.urls import path

from .views import RootView, ElectionList, ElectionDetail, ProposalList, VoteList, ProposalListAll

urlpatterns = [
    path('', RootView.as_view(), name='root-view'),

    path('elections/', ElectionList.as_view(), name='election-list'),
    path('elections/<int:pk>/', ElectionDetail.as_view(),
         name='election-detail'),
    path('proposals/', ProposalListAll.as_view(), name='all-proposals-list'),
    # See note in views.py.
    # path('proposals/<int:pk>', ProposalDetail.as_view(),
    #      name='proposal-detail'),
    path('elections/<int:pk>/proposals/',
         ProposalList.as_view(), name='proposal-list'),
    path('elections/<int:pk>/votes/',
         VoteList.as_view(), name='vote-list'),
]
