from rest_framework import permissions


class ProcessPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        elif request.method == 'POST':
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True


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
        return request.user.has_perm('can_vote', obj)


class DelegatePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        elif request.method == 'POST':
                if request.data.get('credit_balance', 0) != 0:
                    return request.user.is_staff
            return True
        elif request.method in ['PUT', 'PATCH']:
            if request.data.get('credit_balance', 0) != 0:
                return request.user.is_authenticated and request.user.is_staff
            return request.user.is_authenticated
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True


class ConversationPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        elif request.method == 'POST':
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True

    def has_object_permission(self, request, view, obj):
        if obj.groups.filter(name='RxC Conversations').exists():
            return True
        else:
            return request.user.has_perm('can_view', obj)
