import os
import google.generativeai as genai
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Reflection
from .serializers import ReflectionSerializer

load_dotenv()

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    print(f"Error configuring Gemini API: {e}")

class ChatbotView(APIView):
    def post(self, request, *args, **kwargs):
        chat_history = request.data.get('history', [])
        
        if not chat_history:
            return Response({'reply': 'I\'m sorry, I didn\'t receive a message.'})

        user_message = chat_history[-1].get('text', '').lower()

        # --- Hybrid Safety System (remains the same) ---
        crisis_keywords = ['suicide', 'kill myself', 'self-harm', 'hopeless', 'end my life']
        if any(word in user_message for word in crisis_keywords):
            response_text = "It sounds like you are in immediate distress. Please use the Emergency SOS button to connect with a helpline right away. Your safety is the priority."
            return Response({'reply': response_text})

        # --- Format the history for the AI ---
        formatted_history = ""
        for message in chat_history:
            role = "User" if message.get('sender') == 'user' else "Willow"
            formatted_history += f"{role}: {message.get('text')}\n"

        try:
            model = genai.GenerativeModel('gemini-1.5-flash-latest')
            
            # --- New Prompt with Memory ---
            prompt = f"""
            You are Willow, a friendly and supportive wellness chatbot. Your goal is to be empathetic and provide helpful, initial support.

            Rules:
            1.  Analyze the conversation history provided.
            2.  Based on the history, provide a NEW and DIFFERENT simple, actionable coping strategy. DO NOT REPEAT suggestions.
            3.  After providing the new strategy, you can gently guide them towards other app features.            
            4.  Keep responses concise (2-4 sentences).
            5.  Never give medical advice.
            
            Here is the conversation history:
            ---
            {formatted_history}
            ---
            
            Your new, non-repetitive, empathetic, and supportive response is:
            """
            
            response = model.generate_content(prompt)
            response_text = response.text
        
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            response_text = "I'm here to listen. Could you tell me a little more about what's on your mind?"

        return Response({'reply': response_text})
    
class ReflectionViewSet(viewsets.ModelViewSet):
    serializer_class = ReflectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reflection.objects.filter(user = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)