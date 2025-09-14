from rest_framework import serializers
from .models import Reflection

class ReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reflection
        fields = ['id', 'prompt1_text', 'prompt2_text', 'mood', 'created_at']