import json
import os
import threading

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
    UserProfile,
)
from .notifications import send_crisis_email
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
    recent = chat_history[-10:] if len(chat_history) > 10 else chat_history
    formatted_history = ""
    for message in recent:
        role = "Student" if message.get("sender") == "user" else "Willow"
        formatted_history += f"{role}: {message.get('text', '').strip()}\n"

    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = (
        "You are Willow, a compassionate wellness companion for university students in India.\n\n"
        "YOUR PERSONA:\n"
        "- Warm, calm, non-judgmental like a trusted older sibling who knows about mental health\n"
        "- You remember everything said earlier in this conversation and refer back naturally\n"
        "- Simple everyday language, no clinical jargon\n"
        "- Culturally aware of Indian student pressures: exams, family expectations, career anxiety\n\n"
        "STRICT RULES:\n"
        "1. NEVER diagnose, prescribe, or give medical advice\n"
        "2. NEVER make up facts, studies, or statistics\n"
        "3. If student seems in crisis refer to: Tele-MANAS (14416) or iCall (+91-9152987821)\n"
        "4. Keep responses to 3-5 sentences unless asked for more\n"
        "5. Ask one gentle follow-up question at the end\n"
        "6. Do not repeat the same suggestion twice in a conversation\n\n"
        "RESPONSE STYLE:\n"
        "- Briefly acknowledge what the student said\n"
        "- Offer one concrete actionable coping suggestion\n"
        "- End with a warm open-ended question\n\n"
        "CONVERSATION SO FAR:\n"
        "---\n"
        f"{formatted_history}"
        "---\n\n"
        "Willow\'s response:"
    )
    response = model.generate_content(prompt)
    return response.text.strip()


class ChatbotView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'chat'

    def post(self, request, *args, **kwargs):
        chat_history = request.data.get('history', [])
        if not chat_history:
            return Response({'reply': "I'm sorry, I didn't receive a message."})

        user_message = chat_history[-1].get('text', '')

        if contains_crisis_language(user_message):
            alert = CrisisAlert.objects.create(
                user=request.user if request.user.is_authenticated else None,
                message_snippet=user_message[:500],
                source='chat',
            )
            # Send email in background thread so it doesn't block the response
            threading.Thread(
                target=send_crisis_email,
                args=(request.user if request.user.is_authenticated else None,
                      user_message[:500], 'chat'),
                daemon=True,
            ).start()
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
            threading.Thread(
                target=send_crisis_email,
                args=(self.request.user, combined[:500], 'forum'),
                daemon=True,
            ).start()
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
            'total_reflections': Reflection.objects.count(),
            'unique_students_reflected': Reflection.objects.values('user').distinct().count(),
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(UserProfileSerializer(profile).data)

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            allowed = {k: v for k, v in serializer.validated_data.items()
                       if k in ('display_name', 'preferred_language')}
            for attr, value in allowed.items():
                setattr(profile, attr, value)
            profile.save()
            return Response(UserProfileSerializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CrisisAlertListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        alerts = CrisisAlert.objects.select_related('user').order_by('-created_at')[:50]
        data = [
            {
                'id': a.id,
                'username': a.user.username if a.user else 'Anonymous',
                'email': a.user.email if a.user else '',
                'snippet': a.message_snippet,
                'source': a.source,
                'resolved': a.resolved,
                'created_at': a.created_at.strftime('%d %b %Y %H:%M'),
            }
            for a in alerts
        ]
        return Response(data)


class CrisisAlertResolveView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            alert = CrisisAlert.objects.get(pk=pk)
            alert.resolved = True
            alert.save()
            return Response({'status': 'resolved'})
        except CrisisAlert.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.select_related('profile').order_by('-date_joined')
        data = [
            {
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'role': getattr(u.profile, 'role', 'student') if hasattr(u, 'profile') else 'student',
                'date_joined': u.date_joined.strftime('%d %b %Y'),
                'is_active': u.is_active,
            }
            for u in users
        ]
        return Response(data)


class CounselorInvitationView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from .models import CounselorInvitation
        invitations = CounselorInvitation.objects.select_related('invited_by').order_by('-created_at')
        data = [
            {
                'id': inv.id,
                'name': inv.name,
                'email': inv.email,
                'specialty': inv.specialty,
                'status': inv.status,
                'invited_by': inv.invited_by.username if inv.invited_by else 'System',
                'created_at': inv.created_at.strftime('%d %b %Y %H:%M'),
            }
            for inv in invitations
        ]
        return Response(data)

    def post(self, request):
        from .models import CounselorInvitation
        email = request.data.get('email', '').strip().lower()
        name = request.data.get('name', '').strip()
        specialty = request.data.get('specialty', '').strip()

        if not email or not name:
            return Response({'detail': 'Name and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if CounselorInvitation.objects.filter(email=email).exists():
            return Response({'detail': 'An invitation for this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        invitation = CounselorInvitation.objects.create(
            email=email,
            name=name,
            specialty=specialty,
            invited_by=request.user,
            status='pending',
        )

        # Send invitation email
        try:
            from django.core.mail import send_mail
            send_mail(
                subject='You have been invited as a Counselor — Support Sphere',
                message=f"""
Dear {name},

You have been invited to join Support Sphere as a Counselor.

Please contact your administrator to complete your registration.

Your registered email: {email}
Specialty: {specialty or 'Not specified'}

Welcome aboard,
Support Sphere Team
                """.strip(),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception as e:
            logger.warning('Failed to send counselor invitation email: %s', e)

        return Response({
            'id': invitation.id,
            'name': invitation.name,
            'email': invitation.email,
            'status': invitation.status,
            'created_at': invitation.created_at.strftime('%d %b %Y %H:%M'),
            'message': f'Invitation sent to {email}',
        }, status=status.HTTP_201_CREATED)