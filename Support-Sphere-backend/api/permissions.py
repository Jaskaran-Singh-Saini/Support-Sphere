from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        profile = getattr(request.user, 'profile', None)
        return request.user.is_authenticated and profile and profile.role == 'student'


class IsCounselor(BasePermission):
    def has_permission(self, request, view):
        profile = getattr(request.user, 'profile', None)
        return request.user.is_authenticated and profile and profile.role == 'counselor'


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        profile = getattr(request.user, 'profile', None)
        return request.user.is_authenticated and (
            request.user.is_staff or (profile and profile.role == 'admin')
        )


class IsAuthenticatedOrReadOnlyPublicForum(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated
