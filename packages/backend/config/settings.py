import datetime
import json
import os
from pathlib import Path

from dotenv import load_dotenv

from . import monitoring


load_dotenv()


def env_str(key, default=None):
    return os.environ.get(key, default)


def env_bool(key, default=False):
    return os.environ.get(key, str(default)).lower() in ("1", "true", "yes", "on")


def env_int(key, default=0):
    try:
        return int(os.environ.get(key, default))
    except (TypeError, ValueError):
        return default


def env_list(key, default=None, sep=","):
    value = os.environ.get(key)
    if not value:
        return default or []
    return [v.strip() for v in value.split(sep) if v.strip()]



BASE_DIR = Path(__file__).resolve().parent.parent
ENVIRONMENT_NAME = env_str("ENVIRONMENT_NAME", "local")
IS_LOCAL = ENVIRONMENT_NAME.lower() == "local"

DEBUG = env_bool("DJANGO_DEBUG", True)
SECRET_KEY = env_str("DJANGO_SECRET_KEY", "unsafe-secret")

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", [])

ASGI_APPLICATION = "config.asgi.application"
WSGI_APPLICATION = "config.wsgi.application"
SENTRY_DSN = env_str("SENTRY_DSN")
SENTRY_TRACES_SAMPLE_RATE = float(env_str("SENTRY_TRACES_SAMPLE_RATE", 0.2))
LAMBDA_TASKS_BASE_HANDLER = env_str(
    "LAMBDA_TASKS_BASE_HANDLER",
    "common.tasks.LambdaTask",
)
WORKERS_EVENT_BUS_NAME = env_str("WORKERS_EVENT_BUS_NAME", None)
OTP_AUTH_TOKEN_COOKIE = env_str("OTP_AUTH_TOKEN_COOKIE", "otp-auth-token-cookie")
LANGUAGE_CODE = env_str("LANGUAGE_CODE", "en")
TIME_ZONE = env_str("TIME_ZONE", "UTC")
STATIC_URL = env_str("STATIC_URL", "/static/")
DEFAULT_HOST = env_str("DEFAULT_HOST", "api")
DJSTRIPE_FOREIGN_KEY_TO_FIELD = env_str("DJSTRIPE_FOREIGN_KEY_TO_FIELD", "id")
DJSTRIPE_WEBHOOK_VALIDATION = env_str("DJSTRIPE_WEBHOOK_VALIDATION", "retrieve_event")
CELERY_RESULT_BACKEND = env_str("CELERY_RESULT_BACKEND", "django-db")
EMAIL_BACKEND = env_str("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = env_str("EMAIL_HOST", "")
EMAIL_PORT = env_int("EMAIL_PORT", 587)
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
EMAIL_USE_SSL = env_bool("EMAIL_USE_SSL", False)
EMAIL_HOST_USER = env_str("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env_str("EMAIL_HOST_PASSWORD", "")
EMAIL_FROM_ADDRESS = env_str("EMAIL_FROM_ADDRESS", EMAIL_HOST_USER or "noreply@schoolos.me")
EMAIL_REPLY_ADDRESS = env_list("EMAIL_REPLY_ADDRESS", [EMAIL_FROM_ADDRESS])
CONTACT_FORM_RECIPIENTS = env_list("CONTACT_FORM_RECIPIENTS", EMAIL_REPLY_ADDRESS)



monitoring.init(
    SENTRY_DSN,
    ENVIRONMENT_NAME,
    SENTRY_TRACES_SAMPLE_RATE,
)


DJANGO_CORE_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "corsheaders",
    "djstripe",
    "django_hosts",
    "drf_yasg",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "social_django",
    "whitenoise",
    "channels",
    # "aws_xray_sdk.ext.django",
]

LOCAL_APPS = [
    "apps.schools",
    "apps.accounts",
    "apps.attendance",
    "apps.content",
    "apps.finances",
    "apps.notifications",
    "apps.websockets",
    "apps.integrations",
    "apps.multitenancy",
    "apps.academics",
    "apps.dashboard",
   
]

INSTALLED_APPS = ["daphne"] + DJANGO_CORE_APPS + THIRD_PARTY_APPS + LOCAL_APPS

ENABLE_XRAY = env_bool("ENABLE_XRAY", False)

if ENABLE_XRAY:
    INSTALLED_APPS.append("aws_xray_sdk.ext.django")

# -------------------------------------------------------------------
# Middleware
# -------------------------------------------------------------------

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
APPEND_SLASH = False

ROOT_URLCONF = "config.urls_api"
ROOT_HOSTCONF = "config.hosts"
PARENT_HOST = env_str("PARENT_HOST", "")
AUTH_USER_MODEL = "accounts.User"

# -------------------------------------------------------------------
# CORS
# -------------------------------------------------------------------

LOCAL_CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_ALL_ORIGINS = env_bool("CORS_ALLOW_ALL_ORIGINS", False)
CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    LOCAL_CORS_ALLOWED_ORIGINS if IS_LOCAL else [],
)
CORS_ALLOW_CREDENTIALS = env_bool("CORS_ALLOW_CREDENTIALS", IS_LOCAL)

# -------------------------------------------------------------------
# Templates
# -------------------------------------------------------------------

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# -------------------------------------------------------------------
# Logging
# -------------------------------------------------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {
        "handlers": ["console"],
        "level": env_str("DJANGO_LOG_LEVEL", "INFO"),
    },
}

# -------------------------------------------------------------------
# Database
# -------------------------------------------------------------------

DB_CONNECTION = json.loads(env_str("DB_CONNECTION", "{}"))
DB_PROXY_ENDPOINT = env_str("DB_PROXY_ENDPOINT")
HASHID_FIELD_SALT = env_str(
    "HASHID_FIELD_SALT",
    "local-dev-salt-change-me",
)


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env_str("POSTGRES_DB"),
        "USER": env_str("POSTGRES_USER"),
        "PASSWORD": env_str("POSTGRES_PASSWORD"),
        "HOST": env_str("POSTGRES_HOST"),
        "PORT": env_str("POSTGRES_PORT"),
    }
}

# -------------------------------------------------------------------
# Redis / Channels / Cache
# -------------------------------------------------------------------

REDIS_CONNECTION = env_str("REDIS_CONNECTION")


CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    }
}
XRAY_RECORDER = {
    "AUTO_INSTRUMENT": False,
}


# -------------------------------------------------------------------
# Auth / Users
# -------------------------------------------------------------------


AUTHENTICATION_BACKENDS = (
    "social_core.backends.google.GoogleOAuth2",
    "social_core.backends.facebook.FacebookOAuth2",
    "django.contrib.auth.backends.ModelBackend",
)

# -------------------------------------------------------------------
# Internationalization
# -------------------------------------------------------------------

USE_TZ = True

# -------------------------------------------------------------------
# Static / Storage
# -------------------------------------------------------------------

STATIC_ROOT = BASE_DIR / "static"

STORAGES = {
    "default": {"BACKEND": "common.storages.CustomS3Boto3Storage"},
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"
    },
}

# -------------------------------------------------------------------
# Django REST Framework / JWT
# -------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
}
OPENAI_API_KEY = env_str("OPENAI_API_KEY", "")
STRIPE_ENABLED = env_bool("STRIPE_ENABLED", False)




SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": datetime.timedelta(
        minutes=env_int("ACCESS_TOKEN_LIFETIME_MINUTES", 5)
    ),
    "REFRESH_TOKEN_LIFETIME": datetime.timedelta(
        days=env_int("ACCESS_TOKEN_LIFETIME_DAYS", 7)
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# -------------------------------------------------------------------
# Graphene / GraphQL
# -------------------------------------------------------------------

GRAPHENE = {
    "SCHEMA": "config.schema.schema",
    "DEFAULT_PERMISSION_CLASSES": (
        "common.acl.policies.IsAuthenticatedFullAccess",
    ),
    "MIDDLEWARE": [
        "common.middleware.SentryMiddleware",
        "apps.multitenancy.middleware.TenantUserRoleMiddleware",
    ],
}

# -------------------------------------------------------------------
# Celery
# -------------------------------------------------------------------

CELERY_BROKER_URL = f"{REDIS_CONNECTION}/0"
CELERY_BROKER_TRANSPORT_OPTIONS = {"visibility_timeout": 3600}

# -------------------------------------------------------------------
# Security
# -------------------------------------------------------------------

LOCAL_CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CSRF_TRUSTED_ORIGINS = env_list(
    "CSRF_TRUSTED_ORIGINS",
    LOCAL_CSRF_TRUSTED_ORIGINS if IS_LOCAL else [],
)

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
