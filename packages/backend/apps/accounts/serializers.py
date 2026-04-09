from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=False, allow_blank=True)
    email = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = (attrs.get("identifier") or attrs.get("email") or "").strip()
        password = attrs["password"]
        data = {}
        request = self.context.get("request")

        if not identifier:
            raise serializers.ValidationError({"identifier": "Email or phone number is required."})

        user = User.objects.filter(
            Q(email__iexact=identifier) | Q(phone_number=identifier)
        ).select_related("school").first()

        if not user or not user.check_password(password) or not user.is_active:
            raise serializers.ValidationError({"detail": "No active account found with those credentials."})

        refresh = RefreshToken.for_user(user)
        refresh["role"] = user.role
        refresh["email"] = user.email or ""
        if user.phone_number:
            refresh["phone_number"] = user.phone_number

        access = refresh.access_token
        access["role"] = user.role
        access["email"] = user.email or ""
        if user.phone_number:
            access["phone_number"] = user.phone_number

        school = getattr(user, "school", None)
        data["user"] = {
            "uuid": str(user.uuid),
            "email": user.email,
            "phone_number": user.phone_number,
            "role": user.role,
            "school_uuid": str(school.uuid) if school else None,
            "school_name": school.name if school else None,
            "school_code": school.code if school else None,
            "school_logo_url": request.build_absolute_uri(school.logo.url) if request and school and school.logo else (school.logo.url if school and school.logo else None),
            "school_theme_mode": school.theme_mode if school else None,
        }
        data["access"] = str(access)
        data["refresh"] = str(refresh)

        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email__iexact=value).exists():
            # Do not reveal whether the email exists
            return value
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        validate_password(value)
        return value
