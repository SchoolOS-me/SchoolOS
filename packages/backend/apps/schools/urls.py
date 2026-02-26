from django.urls import path

from .views import (
    SchoolListCreateAPI,
    SchoolDetailAPI,
    SchoolAdminCreateAPI,
    SchoolSubscriptionAssignAPI,
)


urlpatterns = [
    path("", SchoolListCreateAPI.as_view()),
    path("<int:school_id>/", SchoolDetailAPI.as_view()),
    path("<int:school_id>/admin/", SchoolAdminCreateAPI.as_view()),
    path("<int:school_id>/subscription/", SchoolSubscriptionAssignAPI.as_view()),
]
