from rest_framework import serializers
from .models import Reflection, Post, Comment

class ReflectionSerializer(serializers.ModelSerializer):

    formatted_date = serializers.DateTimeField(source = 'created_at', format='%d %b %Y', read_only = True)
    class Meta:
        model = Reflection
        fields = ['id', 'prompt1_text', 'prompt2_text', 'mood', 'created_at', 'formatted_date']

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author_username', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author_username', 'created_at', 'comments']