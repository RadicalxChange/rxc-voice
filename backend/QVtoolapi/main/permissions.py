from rest_framework import permissions


class ElectionPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated
        elif request.method == 'POST':
            return True
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True

    def has_object_permission(self, request, view, obj):
        if obj.group:
            return request.user.groups.filter(pk=obj.group)
        else:
            return True
