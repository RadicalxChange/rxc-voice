from rest_framework import permissions


class DelegatePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated
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

    # def has_object_permission(self, request, view, obj):
    #     return obj.email == request.user.email


class GroupPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated
        elif request.method == 'POST':
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True


class ProcessPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated
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
        return request.user.has_perm('can_vote', obj) or request.user.is_staff


class ProposalPermission(permissions.BasePermission):

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


class VotePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated and request.user.is_staff
        elif request.method == 'POST':
            return request.user.is_authenticated
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True


class TransferPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated and request.user.is_staff
        elif request.method == 'POST':
            return True
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.sender == request.user


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
