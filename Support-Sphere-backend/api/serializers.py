from django.contrib.auth.models import User
from dj_rest_auth.serializers import LoginSerializer
from rest_framework import serializers

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


class EmailLoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            attrs['user'] = user
            return attrs
        raise serializers.ValidationError('Unable to log in with provided credentials.')


class ReflectionSerializer(serializers.ModelSerializer):
    formatted_date = serializers.DateTimeField(source='created_at', format='%d %b %Y', read_only=True)

    class Meta:
        model = Reflection
        fields = ['id', 'prompt1_text', 'prompt2_text', 'mood', 'created_at', 'formatted_date']

    def validate_mood(self, value):
        allowed = {'awful', 'bad', 'okay', 'good', 'great'}
        if value.lower() not in allowed:
            raise serializers.ValidationError(f'Mood must be one of: {", ".join(allowed)}')
        return value.lower()

    def validate_prompt1_text(self, value):
        if len(value) > 2000:
            raise serializers.ValidationError('Reflection text cannot exceed 2000 characters.')
        return value

    def validate_prompt2_text(self, value):
        if len(value) > 2000:
            raise serializers.ValidationError('Reflection text cannot exceed 2000 characters.')
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['prompt1_text'] = instance.decrypted_prompt1
        data['prompt2_text'] = instance.decrypted_prompt2
        return data


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author_username', 'created_at', 'moderation_status']
        read_only_fields = ['moderation_status']

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Comment cannot be empty.')
        if len(value) > 1000:
            raise serializers.ValidationError('Comment cannot exceed 1000 characters.')
        return value.strip()


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author_username', 'created_at', 'comments', 'moderation_status']
        read_only_fields = ['moderation_status']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Title cannot be empty.')
        if len(value) > 200:
            raise serializers.ValidationError('Title cannot exceed 200 characters.')
        return value.strip()

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Post content cannot be empty.')
        if len(value) > 5000:
            raise serializers.ValidationError('Post content cannot exceed 5000 characters.')
        return value.strip()

    def get_comments(self, obj):
        approved = obj.comments.filter(moderation_status='approved')
        return CommentSerializer(approved, many=True).data


class CounselorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counselor
        fields = ['id', 'name', 'specialty', 'bio', 'is_available']


class AppointmentSerializer(serializers.ModelSerializer):
    counselor_name = serializers.ReadOnlyField(source='counselor.name')

    class Meta:
        model = Appointment
        fields = ['id', 'counselor', 'counselor_name', 'scheduled_at', 'status', 'notes', 'created_at']
        read_only_fields = ['status']


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'title', 'category', 'description', 'content_url', 'language']


class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ['id', 'test_slug', 'score', 'severity', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField(source='user.email')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserProfile
        fields = ['email', 'username', 'role', 'display_name', 'preferred_language']