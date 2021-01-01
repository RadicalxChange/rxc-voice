from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, mixins, status
from .serializers import ProcessSerializer
from .permissions import ProcessPermission
from .models import Process
from guardian.shortcuts import assign_perm


class ProcessList(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  generics.GenericAPIView):
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer

    permission_classes = (ProcessPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        processes = []
        for process in self.get_queryset():
            groups = process.groups.all()
            for group in groups:
                assign_perm('can_view', group, process)
            if request.user.has_perm('can_view', process):
                processes.append(process)
        page = self.paginate_queryset(processes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(processes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        process_id = serializer.data.get('id')
        process_object = Process.objects.get(pk=process_id)
        headers = self.get_success_headers(serializer.data)
        # assign can_view permission to any groups the process belongs to.
        groups = process_object.groups.all()
        for group in groups:
            assign_perm('can_view', group, process_object)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProcessDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
