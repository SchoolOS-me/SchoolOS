from rest_framework import generics

from common.acl import policies
from . import serializers
from .contact import ContactRequestSerializer


class ContentfulWebhook(generics.CreateAPIView):
    permission_classes = (policies.AnyoneFullAccess,)
    serializer_class = serializers.ContentfulWebhookSerializer


class ContactRequestAPI(generics.CreateAPIView):
    authentication_classes = ()
    permission_classes = (policies.AnyoneFullAccess,)
    serializer_class = ContactRequestSerializer
