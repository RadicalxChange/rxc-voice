from django.urls import path, re_path

from .views import (RootView, ElectionList, ElectionDetail, ProposalList,
                    VoteList, VoteListAll, ProposalListAll, DelegateList,
                    DelegateDetail, CustomAuthToken, PermissionList, GroupList)

urlpatterns = [
    path('', RootView.as_view(), name='root-view'),

    path('delegates/', DelegateList.as_view(), name='delegate-list'),
    path('delegates/<int:pk>/', DelegateDetail.as_view(),
         name='delegate-detail'),
    path('groups/', GroupList.as_view(), name='group-list'),
    path('permissions/', PermissionList.as_view(), name='permission-list'),

    path('elections/', ElectionList.as_view(), name='election-list'),
    path('elections/<int:pk>/', ElectionDetail.as_view(),
         name='election-detail'),
    path('proposals/', ProposalListAll.as_view(), name='all-proposals-list'),
    path('votes/', VoteListAll.as_view(), name='all-votes-list'),

    path('elections/<int:pk>/proposals/',
         ProposalList.as_view(), name='proposal-list'),
    path('elections/<int:pk>/votes/',
         VoteList.as_view(), name='vote-list'),

    re_path(r'^api-token-auth/', CustomAuthToken.as_view()),
    # See note in views.py.
    # path('proposals/<int:pk>', ProposalDetail.as_view(),
    #      name='proposal-detail'),
]
