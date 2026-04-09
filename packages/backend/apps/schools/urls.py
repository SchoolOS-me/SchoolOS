from django.urls import path

from .views import (
    CurrentSchoolAPI,
    CurrentSchoolBulkImportAPI,
    CurrentSchoolFileImportAPI,
    CurrentSchoolImportPreviewAPI,
    SchoolListCreateAPI,
    SchoolDetailAPI,
    SchoolAdminCreateAPI,
    SchoolBrandingLookupAPI,
    SchoolBulkImportAPI,
    SchoolSubscriptionAssignAPI,
)


urlpatterns = [
    path("", SchoolListCreateAPI.as_view()),
    path("branding/<str:code>/", SchoolBrandingLookupAPI.as_view()),
    path("current/", CurrentSchoolAPI.as_view()),
    path("current/bulk-import/", CurrentSchoolBulkImportAPI.as_view()),
    path("current/bulk-import/preview/", CurrentSchoolImportPreviewAPI.as_view()),
    path("current/bulk-import/file/", CurrentSchoolFileImportAPI.as_view()),
    path("<uuid:school_uuid>/", SchoolDetailAPI.as_view()),
    path("<uuid:school_uuid>/admin/", SchoolAdminCreateAPI.as_view()),
    path("<uuid:school_uuid>/bulk-import/", SchoolBulkImportAPI.as_view()),
    path("<uuid:school_uuid>/subscription/", SchoolSubscriptionAssignAPI.as_view()),
]
