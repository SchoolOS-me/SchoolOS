from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

User = get_user_model()


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfTokenAPI(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        return Response({"detail": "CSRF cookie set."}, status=status.HTTP_200_OK)


class LoginAPI(APIView):
    """
    Custom login endpoint that returns JWT tokens plus user info.
    """

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class TokenLoginAPI(TokenObtainPairView):
    """
    Standard JWT login endpoint with user info in the response.
    """

    serializer_class = LoginSerializer


class MeAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        school = getattr(user, "school", None)
        return Response(
            {
                "uuid": str(user.uuid),
                "email": user.email,
                "phone_number": user.phone_number,
                "role": user.role,
                "school_uuid": str(school.uuid) if school else None,
                "school_name": school.name if school else None,
            }
        )


class LogoutAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        refresh_token = serializer.validated_data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)


class PasswordResetRequestAPI(APIView):
    """
    Generates a password reset token. Email sending is optional and can be added later.
    """

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email).first()

        if not user:
            return Response({"detail": "If the email exists, a reset token was generated."})

        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        return Response(
            {
                "detail": "Reset token generated.",
                "uid": uid,
                "token": token,
            }
        )


class PasswordResetConfirmAPI(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        password = serializer.validated_data["password"]

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Invalid reset token"}, status=status.HTTP_400_BAD_REQUEST)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"detail": "Invalid reset token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()

        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
