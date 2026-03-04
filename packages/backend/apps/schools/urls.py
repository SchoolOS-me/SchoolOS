from django.urls import path

from .views import (
    SchoolListCreateAPI,
    SchoolDetailAPI,
    SchoolAdminCreateAPI,
    SchoolSubscriptionAssignAPI,
)


urlpatterns = [
    path("", SchoolListCreateAPI.as_view()),
    path("<uuid:school_uuid>/", SchoolDetailAPI.as_view()),
    path("<uuid:school_uuid>/admin/", SchoolAdminCreateAPI.as_view()),
    path("<uuid:school_uuid>/subscription/", SchoolSubscriptionAssignAPI.as_view()),
]
