from django.urls import path,include
from .views import ChatbotView, ReflectionViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'reflections', ReflectionViewSet, basename='reflection')

urlpatterns = [
    path('chat/', ChatbotView.as_view(), name='chatbot'),
    path('', include(router.urls)),
]