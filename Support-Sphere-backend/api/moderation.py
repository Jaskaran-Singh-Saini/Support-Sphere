from django.conf import settings


def contains_crisis_language(text: str) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in settings.CRISIS_KEYWORDS)


def contains_toxic_language(text: str) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in settings.TOXIC_KEYWORDS)


def moderation_status_for_text(text: str) -> str:
    if contains_toxic_language(text) or contains_crisis_language(text):
        return 'flagged'
    return 'approved'
