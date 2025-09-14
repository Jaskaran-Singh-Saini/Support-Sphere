from django.urls import path,include
from .views import ChatbotView, ReflectionViewSet, PostViewSet, CommentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'reflections', ReflectionViewSet, basename='reflection')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    path('', include(router.urls)),
]