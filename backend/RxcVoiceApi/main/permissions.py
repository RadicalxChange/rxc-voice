from rest_framework import permissions
from .utils import is_verified, is_group_admin


class DelegatePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated
        elif request.method == 'POST':
            return True
        elif request.method in ['PUT', 'PATCH']:
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
            return request.user.is_authenticated and is_verified(request.user.id)
        elif request.method == 'POST':
            return request.user.is_authenticated
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True


class ProcessPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated and is_verified(request.user.id)
        elif request.method == 'POST':
            return request.user.is_authenticated
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return request.user.is_authenticated and is_verified(request.user.id)
        elif request.method == 'POST':
            return request.user.is_authenticated
        elif request.method in ['PUT', 'PATCH']:
            return is_group_admin(request.user.id, obj.groups) or request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True


class ElectionPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated and is_verified(request.user.id)
        elif request.method == 'POST':
            return request.user.is_authenticated
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return request.user.has_perm('can_vote', obj) or request.user.is_staff
        elif request.method == 'POST':
            return request.user.is_authenticated
        elif request.method in ['PUT', 'PATCH']:
            return is_group_admin(request.user.id, obj.groups) or request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True


class ProposalPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated and is_verified(request.user.id)
        elif request.method == 'POST':
            return request.user.is_authenticated
        elif request.method in ['PUT', 'PATCH', 'DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return request.user.has_perm('can_vote', obj.election) or request.user.is_staff
        elif request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return is_group_admin(request.user.id, obj.election.groups) or request.user.is_staff
        else:
            return True


class VotePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated and request.user.is_staff
        elif request.method == 'POST':
            return request.user.is_authenticated and is_verified(request.user.id)
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True


class TransferPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated and is_verified(request.user.id)
        elif request.method == 'POST':
            return request.user.is_authenticated and is_verified(request.user.id)
        elif request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated and request.user.is_staff
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
        if request.method == 'GET':
            if obj.groups.filter(name='RxC Conversations').exists():
                return True
            else:
                return request.user.has_perm('can_view', obj)
        elif request.method == 'POST':
            return request.user.is_authenticated
        elif request.method in ['PUT', 'PATCH']:
            return is_group_admin(request.user.id, obj.groups) or request.user.is_staff
        elif request.method in ['DELETE']:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return True
