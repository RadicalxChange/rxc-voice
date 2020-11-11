from django.urls import path, re_path

from .views import (RootView, ElectionList, ElectionDetail, ProposalList,
                    VoteList, VoteListAll, ProposalListAll, AnonList,
                    AnonDetail, AnonVoterListAll, UserList, UserDetail,
                    CustomAuthToken)

urlpatterns = [
    path('', RootView.as_view(), name='root-view'),

    path('elections/', ElectionList.as_view(), name='election-list'),
    path('elections/<int:pk>/', ElectionDetail.as_view(),
         name='election-detail'),
    path('proposals/', ProposalListAll.as_view(), name='all-proposals-list'),
    path('votes/', VoteListAll.as_view(), name='all-votes-list'),
    path('anon-voters/', AnonVoterListAll.as_view(),
         name='all-anon-voters-list'),
    # See note in views.py.
    # path('proposals/<int:pk>', ProposalDetail.as_view(),
    #      name='proposal-detail'),
    path('elections/<int:pk>/proposals/',
         ProposalList.as_view(), name='proposal-list'),
    path('elections/<int:pk>/votes/',
         VoteList.as_view(), name='vote-list'),
    path('elections/<int:pk>/anon-voters/',
         AnonList.as_view(), name='anon-voters-list'),
    path('anon-voters/<str:pk>/',
         AnonDetail.as_view(), name='anon-voter-detail'),


    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),

    re_path(r'^api-token-auth/', CustomAuthToken.as_view()),
]
