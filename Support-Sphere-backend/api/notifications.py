"""
Crisis alert notification engine.
Called whenever a student's message triggers the crisis keyword detector.
Sends an async email to all CRISIS_ALERT_RECIPIENTS defined in settings.
"""
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

logger = logging.getLogger(__name__)


def send_crisis_email(user, snippet: str, source: str) -> None:
    """
    Send an out-of-band email alert to counselors/admins when a crisis is detected.

    Args:
        user:    Django User instance (may be None for anonymous users)
        snippet: The message text that triggered the alert (already truncated)
        source:  'chat' | 'forum'
    """
    recipients = getattr(settings, 'CRISIS_ALERT_RECIPIENTS', [])
    if not recipients:
        logger.warning(
            'Crisis detected but CRISIS_ALERT_RECIPIENTS is empty — no email sent.'
        )
        return

    username = user.username if user and user.is_authenticated else 'Anonymous'
    email = user.email if user and user.is_authenticated else 'N/A'
    timestamp = timezone.now().strftime('%d %b %Y %H:%M:%S %Z')
    source_label = {'chat': 'AI Chat', 'forum': 'Peer Forum'}.get(source, source)

    subject = f'[Support Sphere] ⚠️ Crisis Alert — {source_label}'

    body = f"""
CRISIS ALERT — Support Sphere
==============================

A student's message has been flagged as a potential crisis situation and requires immediate attention.

Details
-------
Timestamp : {timestamp}
Source    : {source_label}
Username  : {username}
Email     : {email}

Message Snippet
---------------
"{snippet}"

Action Required
---------------
Please log in to the admin dashboard to review this alert and follow up with the student.

Dashboard: {getattr(settings, 'ADMIN_DASHBOARD_URL', 'http://localhost/admin/dashboard')}

---
This is an automated alert from Support Sphere.
Do NOT reply to this email.
""".strip()

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
        logger.info(
            'Crisis alert email sent to %d recipient(s) for user %s',
            len(recipients),
            username,
        )
    except Exception as exc:
        # Never let email failure crash the app — just log it
        logger.error('Failed to send crisis alert email: %s', exc)