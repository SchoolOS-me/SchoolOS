from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginAPI,
    TokenLoginAPI,
    LogoutAPI,
    MeAPI,
    PasswordResetRequestAPI,
    PasswordResetConfirmAPI,
)


urlpatterns = [
    path("login/", LoginAPI.as_view()),
    path("token/", TokenLoginAPI.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("logout/", LogoutAPI.as_view()),
    path("me/", MeAPI.as_view()),
    path("password/reset/", PasswordResetRequestAPI.as_view()),
    path("password/reset/confirm/", PasswordResetConfirmAPI.as_view()),
]
