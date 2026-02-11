import datetime
import json
import os
from pathlib import Path

from dotenv import load_dotenv

from . import monitoring

# -------------------------------------------------------------------
# Environment helpers (replacement for django-environ)
# -------------------------------------------------------------------

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


# -------------------------------------------------------------------
# Base
# -------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

# ENVIRONMENT_NAME = env_str("ENVIRONMENT_NAME", "")
ENVIRONMENT_NAME = env_str("ENVIRONMENT_NAME", "local")
IS_LOCAL = ENVIRONMENT_NAME.lower() == "local"

DEBUG = env_bool("DJANGO_DEBUG", True)
SECRET_KEY = env_str("DJANGO_SECRET_KEY", "unsafe-secret")

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", [])

ASGI_APPLICATION = "config.asgi.application"
WSGI_APPLICATION = "config.wsgi.application"

# -------------------------------------------------------------------
# Monitoring / Sentry
# -------------------------------------------------------------------

SENTRY_DSN = env_str("SENTRY_DSN")
SENTRY_TRACES_SAMPLE_RATE = float(env_str("SENTRY_TRACES_SAMPLE_RATE", 0.2))
LAMBDA_TASKS_BASE_HANDLER = env_str(
    "LAMBDA_TASKS_BASE_HANDLER",
    "common.tasks.LambdaTask",
)
WORKERS_EVENT_BUS_NAME = env_str("WORKERS_EVENT_BUS_NAME", None)



monitoring.init(
    SENTRY_DSN,
    ENVIRONMENT_NAME,
    SENTRY_TRACES_SAMPLE_RATE,
)

# -------------------------------------------------------------------
# Applications
# -------------------------------------------------------------------

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

ROOT_URLCONF = "config.urls_api"
ROOT_HOSTCONF = "config.hosts"
DEFAULT_HOST = "api"
PARENT_HOST = env_str("PARENT_HOST", "")
AUTH_USER_MODEL = "accounts.User"

# -------------------------------------------------------------------
# CORS
# -------------------------------------------------------------------

CORS_ALLOW_ALL_ORIGINS = IS_LOCAL
CORS_ALLOWED_ORIGINS = [] if IS_LOCAL else env_list("CORS_ALLOWED_ORIGINS", [])
CORS_ALLOW_CREDENTIALS = env_bool("CORS_ALLOW_CREDENTIALS", False)

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
OTP_AUTH_TOKEN_COOKIE=env_str("OTP_AUTH_TOKEN_COOKIE","otp-auth-token-cookie")
DJSTRIPE_FOREIGN_KEY_TO_FIELD = "id"
HASHID_FIELD_SALT = env_str(
    "HASHID_FIELD_SALT",
    "local-dev-salt-change-me",
)
LAMBDA_TASKS_BASE_HANDLER = env_str(
    "LAMBDA_TASKS_BASE_HANDLER",
    "common.tasks.LambdaTask",
)

WORKERS_EVENT_BUS_NAME = env_str(
    "WORKERS_EVENT_BUS_NAME",
    None,
)


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env_str("POSTGRES_DB", "kcs_db"),
        "USER": env_str("POSTGRES_USER", "kcs"),
        "PASSWORD": env_str("POSTGRES_PASSWORD", "Kcs123@#"),
        "HOST": env_str("POSTGRES_HOST", "127.0.0.1"),
        "PORT": env_str("POSTGRES_PORT", "5432"),
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

LANGUAGE_CODE = "en"
TIME_ZONE = "UTC"
USE_TZ = True

# -------------------------------------------------------------------
# Static / Storage
# -------------------------------------------------------------------

STATIC_URL = "/static/"
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
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
}
OPENAI_API_KEY=env_str("OPENAI_API_KEY","")
DJSTRIPE_WEBHOOK_VALIDATION = "retrieve_event"




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

CELERY_RESULT_BACKEND = "django-db"
CELERY_BROKER_URL = f"{REDIS_CONNECTION}/0"
CELERY_BROKER_TRANSPORT_OPTIONS = {"visibility_timeout": 3600}

# -------------------------------------------------------------------
# Security
# -------------------------------------------------------------------

CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", [])

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
