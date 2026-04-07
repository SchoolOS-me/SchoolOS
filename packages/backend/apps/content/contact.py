from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import serializers


class ContactRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    school_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    role = serializers.CharField(max_length=100, required=False, allow_blank=True)
    message = serializers.CharField(max_length=4000)

    def create(self, validated_data):
        recipients = settings.CONTACT_FORM_RECIPIENTS or settings.EMAIL_REPLY_ADDRESS
        subject = f"SchoolOS contact enquiry from {validated_data['name']}"
        lines = [
            "New contact form submission",
            "",
            f"Name: {validated_data['name']}",
            f"Email: {validated_data['email']}",
            f"Phone: {validated_data.get('phone') or '-'}",
            f"School: {validated_data.get('school_name') or '-'}",
            f"Role: {validated_data.get('role') or '-'}",
            "",
            "Message:",
            validated_data["message"],
        ]

        email = EmailMessage(
            subject=subject,
            body="\n".join(lines),
            from_email=settings.EMAIL_FROM_ADDRESS,
            to=recipients,
            reply_to=[validated_data["email"]],
        )
        email.send(fail_silently=False)
        return validated_data
