"""
Django settings for support_sphere project.
"""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

_SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', '')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 'yes')
if not _SECRET_KEY:
    if not DEBUG:
        raise RuntimeError('DJANGO_SECRET_KEY must be set in production (DEBUG=False).')
    _SECRET_KEY = 'django-insecure-dev-only-do-not-use-in-production'
SECRET_KEY = _SECRET_KEY
ALLOWED_HOSTS = [h.strip() for h in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if h.strip()] or ['*']
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'drf_spectacular',
    'api',
    'corsheaders',
    'channels',
]

# Daphne must be first in INSTALLED_APPS when running under ASGI (Docker/prod).
# In local dev with `runserver` it's not installed in the venv, so skip it.
import importlib.util as _ilu
if _ilu.find_spec('daphne') is not None:
    INSTALLED_APPS.insert(0, 'daphne')

SITE_ID = 1
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_UNIQUE_EMAIL = True

# Required for allauth email-based login to work with dj-rest-auth
AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Tell dj-rest-auth to return JWT tokens, not knox/session keys
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_RETURN_EXPIRATION': False,
    'USER_DETAILS_SERIALIZER': 'api.serializers.UserProfileSerializer',
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'support_sphere.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'support_sphere.wsgi.application'
ASGI_APPLICATION = 'support_sphere.asgi.application'

POSTGRES_HOST = os.getenv('POSTGRES_HOST', '').strip()
if POSTGRES_HOST:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('POSTGRES_DB', 'support_sphere'),
            'USER': os.getenv('POSTGRES_USER', 'postgres'),
            'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'postgres'),
            'HOST': POSTGRES_HOST,
            'PORT': os.getenv('POSTGRES_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

REDIS_HOST = os.getenv('REDIS_HOST', '')
if REDIS_HOST:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels_redis.core.RedisChannelLayer',
            'CONFIG': {'hosts': [(REDIS_HOST, 6379)]},
        }
    }
else:
    # Local dev without Redis — InMemoryChannelLayer works fine for single-process
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origin.strip()
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '30/minute',
        'user': '120/minute',
        'chat': '20/minute',
        'auth': '10/minute',
    },
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_HTTPONLY': False,
    'TOKEN_MODEL': None,
}

# Tell allauth to use email-only login (no username)
ACCOUNT_USER_MODEL_USERNAME_FIELD = None

FIELD_ENCRYPTION_KEY = os.getenv('FIELD_ENCRYPTION_KEY', '')

CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'self-harm', 'self harm', 'hopeless',
    'end my life', 'want to die', 'hurt myself', 'no reason to live',
]

TOXIC_KEYWORDS = [
    'idiot', 'stupid', 'kill you', 'hate you', 'worthless', 'loser',
    'shut up', 'dumb', 'ugly', 'pathetic',
]

MOOD_SCORES = {
    'great': 5,
    'good': 4,
    'okay': 3,
    'low': 2,
    'bad': 1,
}

# ── Email (crisis alerts) ──────────────────────────────────────────────────
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@supportsphere.app')
CRISIS_ALERT_RECIPIENTS = [
    e.strip() for e in os.getenv('CRISIS_ALERT_RECIPIENTS', '').split(',') if e.strip()
]

# ── Production Security Hardening ─────────────────────────────────────────────
if not DEBUG:
    # HTTPS enforcement
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000       # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # Clickjacking & content-type sniffing
    X_FRAME_OPTIONS = 'DENY'
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True

    # Referrer policy
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# ── Logging ───────────────────────────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{asctime}] {levelname} {name}: {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'api': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}

# ── Swagger / OpenAPI Docs ─────────────────────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE': 'Support Sphere API',
    'DESCRIPTION': '''
## Support Sphere — Mental Health Platform API

A comprehensive REST API for the Support Sphere student mental health platform.

### Features
- 🔐 JWT-based authentication with role-based access control
- 🤖 AI-powered chat with crisis detection
- 📅 Counselor booking and appointment management
- 📝 Encrypted reflection journaling
- 📊 Mood tracking and progress analytics
- 🏥 Crisis alert system with email notifications
- 💬 Moderated peer support forum

### Authentication
All protected endpoints require a Bearer JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```
Obtain a token via `POST /api/auth/login/`

### Roles
- **student** — default role, access to personal data and public endpoints
- **counselor** — access to appointment management and student cases
- **admin** — full access including analytics, crisis alerts, and user management
    ''',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'TAGS': [
        {'name': 'auth', 'description': 'Registration, login, token refresh'},
        {'name': 'users', 'description': 'User profile management'},
        {'name': 'chat', 'description': 'AI chatbot (Willow) and crisis detection'},
        {'name': 'reflections', 'description': 'Encrypted journal reflections'},
        {'name': 'counselors', 'description': 'Counselor profiles and availability'},
        {'name': 'appointments', 'description': 'Booking and appointment management'},
        {'name': 'forum', 'description': 'Moderated peer support forum'},
        {'name': 'resources', 'description': 'Self-help resources and wellness content'},
        {'name': 'assessments', 'description': 'GAD-7, PHQ-9 and GHQ-12 assessments'},
        {'name': 'admin', 'description': 'Admin-only analytics, crisis alerts, user management'},
    ],
}