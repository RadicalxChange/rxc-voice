from django.urls import path, re_path

from .rootview import RootView
from .authviews import (DelegateList, DelegateDetail, ProfileList, ProfileDetail, UserDetail,
                        CustomAuthToken, PermissionList, EmailApplication,
                        GroupList, GetGithubUser, ValidateAuthToken,
                        GetTwitterToken, ForgotPassword, ResetPassword)
from .electionviews import (ElectionList, ElectionDetail, ProposalList,
                            VoteList)
from .conversationviews import (ConversationList, ConversationDetail)
from .processviews import (ProcessList, ProcessDetail, TransferList,
                           EstimateMatch)

urlpatterns = [
    path('', RootView.as_view(), name='root-view'),

    # Authentication APIs
    path('profile/', ProfileList.as_view(), name='profile-list'),
    path('profiles/<int:pk>/', ProfileDetail.as_view(),
         name='profile-detail'),
    path('delegates/', DelegateList.as_view(), name='delegate-list'),
    path('delegates/<int:pk>/', DelegateDetail.as_view(),
         name='delegate-detail'),
     path('users/<int:pk>/', UserDetail.as_view(),
          name='user-detail'),
    path('groups/', GroupList.as_view(), name='group-list'),
    path('permissions/', PermissionList.as_view(), name='permission-list'),
    path('github/verify/', GetGithubUser.as_view()),
    path('twitter/token/', GetTwitterToken.as_view()),
    path('email-application/', EmailApplication.as_view()),
    path('forgot-password/', ForgotPassword.as_view()),
    path('reset-password/', ResetPassword.as_view()),
    re_path(r'^api-token-auth/', CustomAuthToken.as_view()),
    re_path(r'^activate/',
            ValidateAuthToken.as_view(), name='activate'),

    # Process APIs
    path('processes/', ProcessList.as_view(), name='process-list'),
    path('processes/<int:pk>/', ProcessDetail.as_view(), name='process-detail'),
    path('processes/<int:pk>/transfers/', TransferList.as_view(), name='transfer-list'),
    path('estimate-match/', EstimateMatch.as_view(), name='estimate-match'),

    # Election APIs
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
    # path('proposals/', ProposalListAll.as_view(), name='all-proposals-list'),
    # path('votes/', VoteListAll.as_view(), name='all-votes-list'),
]
