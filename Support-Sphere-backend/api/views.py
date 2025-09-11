# from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class ChatbotView(APIView):
    def post(self, request, *args, **kwargs):
        user_message = request.data.get('message', '').lower()
        response_text = "I'm here to listen. Could you tell me more about that?"

        # Crisis Detection
        if any(word in user_message for word in ['suicide', 'kill myself', 'self_harm', 'hopeless']):
            response_text = "It sounds like you are in immediate distress. Please use the Emergency SOS button to connect with a helpline right away. Your safety is the priority"
        #Rule-Based Response
        elif 'anxious' in user_message or 'stress' in user_message:
            response_text = "It sounds like you're feeling a lot of pressure. Many students feel this way. Have you considered trying a breathing exercise from our Self-Help section?"
        elif 'exam' in user_message:
            response_text = "Exam periods can be very stressful. Remember to take short breaks and ensure you're getting enough sleep. The GAD-7 assessment might also be helpful."
        elif 'sad' in user_message or 'lonely' in user_message:
            response_text = "I'm sorry to hear you're feeling down. Sometimes talking to others can help. Our Peers Forum is a safe space to connect."
        
        return Response({'reply': response_text})