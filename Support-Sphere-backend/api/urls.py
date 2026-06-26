from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminAnalyticsView,
    AppointmentViewSet,
    AssessmentResultViewSet,
    ChatbotView,
    CommentViewSet,
    CounselorViewSet,
    MeView,
    PostViewSet,
    ReflectionViewSet,
    ResourceViewSet,
)

router = DefaultRouter()
router.register(r'reflections', ReflectionViewSet, basename='reflection')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'counselors', CounselorViewSet, basename='counselor')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'assessments', AssessmentResultViewSet, basename='assessment')

urlpatterns = [
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('', include(router.urls)),
]
