from django.urls import path

from .views import (
    SchoolListCreateAPI,
    SchoolDetailAPI,
    SchoolAdminCreateAPI,
    SchoolBulkImportAPI,
    SchoolSubscriptionAssignAPI,
)


urlpatterns = [
    path("", SchoolListCreateAPI.as_view()),
    path("<uuid:school_uuid>/", SchoolDetailAPI.as_view()),
    path("<uuid:school_uuid>/admin/", SchoolAdminCreateAPI.as_view()),
    path("<uuid:school_uuid>/bulk-import/", SchoolBulkImportAPI.as_view()),
    path("<uuid:school_uuid>/subscription/", SchoolSubscriptionAssignAPI.as_view()),
]
