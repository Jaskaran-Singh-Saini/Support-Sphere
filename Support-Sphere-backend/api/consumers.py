import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from .moderation import contains_crisis_language
from .models import CrisisAlert
from .notifications import send_crisis_email
from .views import CRISIS_RESPONSE, generate_willow_reply


@database_sync_to_async
def log_crisis_alert(user, snippet):
    real_user = user if (user and not isinstance(user, AnonymousUser) and user.is_authenticated) else None
    alert = CrisisAlert.objects.create(
        user=real_user,
        message_snippet=snippet,
        source='chat',
    )
    # Email runs in the same sync thread (already off the event loop via database_sync_to_async)
    send_crisis_email(real_user, snippet, 'chat')
    return alert


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        payload = json.loads(text_data)
        history = payload.get('history', [])
        if not history:
            await self.send(text_data=json.dumps({'reply': "I'm sorry, I didn't receive a message."}))
            return

        user_message = history[-1].get('text', '')
        user = self.scope.get('user', AnonymousUser())

        if contains_crisis_language(user_message):
            await log_crisis_alert(user, user_message[:500])
            await self.send(text_data=json.dumps({
                'reply': CRISIS_RESPONSE,
                'crisis_detected': True,
            }))
            return

        try:
            reply = await database_sync_to_async(generate_willow_reply)(history)
        except Exception:
            reply = "I'm here to listen. Could you tell me a little more about what's on your mind?"

        await self.send(text_data=json.dumps({'reply': reply}))