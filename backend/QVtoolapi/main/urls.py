from django.urls import path, re_path

from .rootview import RootView
from .authviews import (DelegateList, DelegateDetail,
                        CustomAuthToken, PermissionList, GroupList)
from .electionviews import (ElectionList, ElectionDetail, ProposalList,
                            VoteList, VoteListAll, ProposalListAll,
                            TransferList, TransferListAll)
from .conversationviews import (ConversationList, ConversationDetail)
from .processviews import (ProcessList, ProcessDetail)

urlpatterns = [
    path('', RootView.as_view(), name='root-view'),

    # Authentication APIs
    path('delegates/', DelegateList.as_view(), name='delegate-list'),
    path('delegates/<int:pk>/', DelegateDetail.as_view(),
         name='delegate-detail'),
    path('groups/', GroupList.as_view(), name='group-list'),
    path('permissions/', PermissionList.as_view(), name='permission-list'),
    re_path(r'^api-token-auth/', CustomAuthToken.as_view()),

    # Process APIs
    path('processes/', ProcessList.as_view(), name='process-list'),
    path('processes/<int:pk>/', ProcessDetail.as_view(), name='process-detail'),

    # Election APIs
    path('proposals/', ProposalListAll.as_view(), name='all-proposals-list'),
    path('votes/', VoteListAll.as_view(), name='all-votes-list'),
    path('transfers/', TransferListAll.as_view(), name='transfer-list-all'),
    path('delegates/<int:pk>/transfers/', TransferList.as_view(),
         name='transfer-list'),
    path('elections/', ElectionList.as_view(), name='election-list'),
    path('elections/<int:pk>/', ElectionDetail.as_view(),
         name='election-detail'),
    path('elections/<int:pk>/proposals/',
         ProposalList.as_view(), name='proposal-list'),
    path('elections/<int:pk>/votes/',
         VoteList.as_view(), name='vote-list'),


    # Conversation APIs
    path('conversations/', ConversationList.as_view(),
         name='conversation-list'),
    path('conversations/<int:pk>/', ConversationDetail.as_view(),
         name='conversation-detail'),



    # See note in views.py.
    # path('proposals/<int:pk>', ProposalDetail.as_view(),
    #      name='proposal-detail'),
]
