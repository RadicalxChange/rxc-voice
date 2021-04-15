from rest_framework.response import Response
from rest_framework import generics, mixins, status
from rest_framework.authentication import TokenAuthentication
from .serializers import ConversationSerializer
from .models import Conversation
from .permissions import ConversationPermission


class ConversationList(mixins.CreateModelMixin,
                       mixins.ListModelMixin,
                       generics.GenericAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    permission_classes = (ConversationPermission,)
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return Conversation.objects.filter(groups__name="RxC Conversations")

    def get(self, request, *args, **kwargs):
        conversations = self.get_queryset()
        page = self.paginate_queryset(conversations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(conversations, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ConversationDetail(mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin,
                         generics.GenericAPIView):

    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    permission_classes = (ConversationPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
