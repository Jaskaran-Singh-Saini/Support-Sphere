import json
import os

import google.generativeai as genai
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from dotenv import load_dotenv
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .moderation import contains_crisis_language, moderation_status_for_text
from .models import (
    Appointment,
    AssessmentResult,
    Comment,
    Counselor,
    CrisisAlert,
    Post,
    Reflection,
    Resource,
)
from .permissions import IsAdminUser, IsAuthenticatedOrReadOnlyPublicForum
from .serializers import (
    AppointmentSerializer,
    AssessmentResultSerializer,
    CommentSerializer,
    CounselorSerializer,
    PostSerializer,
    ReflectionSerializer,
    ResourceSerializer,
    UserProfileSerializer,
)

load_dotenv()

try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
except Exception as exc:
    print(f'Error configuring Gemini API: {exc}')


CRISIS_RESPONSE = (
    'It sounds like you are in immediate distress. Please contact a crisis helpline right away: '
    'Tele-MANAS (14416), iCall (+91-9152987821), or Vandrevala Foundation (1860-2662-345). '
    'Your safety is the priority.'
)


def generate_willow_reply(chat_history):
    formatted_history = ''
    for message in chat_history:
        role = 'User' if message.get('sender') == 'user' else 'Willow'
        formatted_history += f"{role}: {message.get('text')}\n"

    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    prompt = f"""
    You are Willow, a friendly and supportive wellness chatbot for students.
    Rules:
    1. Be empathetic and provide simple, actionable coping strategies.
    2. Keep responses concise (2-4 sentences).
    3. Never give medical advice or diagnose conditions.
    4. Gently suggest counseling or peer forums when appropriate.

    Conversation history:
    ---
    {formatted_history}
    ---

    Your supportive response:
    """
    response = model.generate_content(prompt)
    return response.text


class ChatbotView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'chat'

    def post(self, request, *args, **kwargs):
        chat_history = request.data.get('history', [])
        if not chat_history:
            return Response({'reply': "I'm sorry, I didn't receive a message."})

        user_message = chat_history[-1].get('text', '')

        if contains_crisis_language(user_message):
            CrisisAlert.objects.create(
                user=request.user if request.user.is_authenticated else None,
                message_snippet=user_message[:500],
                source='chat',
            )
            return Response({'reply': CRISIS_RESPONSE, 'crisis_detected': True})

        try:
            reply = generate_willow_reply(chat_history)
        except Exception as exc:
            print(f'Error calling Gemini API: {exc}')
            reply = "I'm here to listen. Could you tell me a little more about what's on your mind?"

        return Response({'reply': reply})


class ReflectionViewSet(viewsets.ModelViewSet):
    serializer_class = ReflectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reflection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(moderation_status='approved').order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnlyPublicForum]

    def perform_create(self, serializer):
        content = self.request.data.get('content', '')
        title = self.request.data.get('title', '')
        combined = f'{title} {content}'
        status_value = moderation_status_for_text(combined)
        if contains_crisis_language(combined):
            CrisisAlert.objects.create(
                user=self.request.user,
                message_snippet=combined[:500],
                source='forum',
            )
        serializer.save(author=self.request.user, moderation_status=status_value)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(moderation_status='approved')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnlyPublicForum]

    def perform_create(self, serializer):
        content = self.request.data.get('content', '')
        status_value = moderation_status_for_text(content)
        post_id = self.request.data.get('post')
        post = Post.objects.get(id=post_id)
        serializer.save(author=self.request.user, post=post, moderation_status=status_value)


class CounselorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Counselor.objects.all()
    serializer_class = CounselorSerializer
    permission_classes = [AllowAny]


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'counselor' and hasattr(user, 'counselor_profile'):
            return Appointment.objects.filter(counselor=user.counselor_profile)
        if profile and profile.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user, status='pending')

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        profile = getattr(request.user, 'profile', None)
        if not (profile and profile.role in ('counselor', 'admin')):
            return Response({'detail': 'Only counselors or admins can confirm.'}, status=status.HTTP_403_FORBIDDEN)
        appointment.status = 'confirmed'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)


class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Resource.objects.filter(is_published=True)
    serializer_class = ResourceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        language = self.request.query_params.get('lang', 'en')
        return Resource.objects.filter(is_published=True, language=language)


class AssessmentResultViewSet(viewsets.ModelViewSet):
    serializer_class = AssessmentResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AssessmentResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        mood_map = settings.MOOD_SCORES
        reflections = Reflection.objects.all()
        mood_scores = [mood_map.get(r.mood.lower(), 3) for r in reflections]
        avg_mood = round(sum(mood_scores) / len(mood_scores), 1) if mood_scores else 0

        monthly = (
            Reflection.objects.annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        mood_trend = {
            'labels': [entry['month'].strftime('%b %Y') for entry in monthly if entry['month']],
            'values': [entry['count'] for entry in monthly if entry['month']],
        }

        issue_counts = AssessmentResult.objects.values('test_slug').annotate(count=Count('id'))
        issues = {
            'labels': [item['test_slug'].upper() for item in issue_counts],
            'values': [item['count'] for item in issue_counts],
        }

        return Response({
            'weekly_highlights': {
                'anxiety_reports': AssessmentResult.objects.filter(test_slug='gad-7').count(),
                'avg_mood_score': avg_mood,
                'sessions_booked': Appointment.objects.count(),
                'new_users': User.objects.count(),
                'crisis_alerts': CrisisAlert.objects.filter(resolved=False).count(),
            },
            'mood_trend': mood_trend,
            'issues': issues,
            'forum_posts': Post.objects.count(),
            'flagged_content': Post.objects.filter(moderation_status='flagged').count()
            + Comment.objects.filter(moderation_status='flagged').count(),
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        if not profile:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserProfileSerializer(profile).data)