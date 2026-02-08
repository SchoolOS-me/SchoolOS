from django.urls import path

from .views import SchoolListCreateAPI, SchoolDetailAPI


urlpatterns = [
    path("", SchoolListCreateAPI.as_view()),
    path("<int:school_id>/", SchoolDetailAPI.as_view()),
]
