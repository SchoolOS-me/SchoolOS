from django.urls import path

from apps.academics.views.parent import ParentChildrenAPI
from apps.academics.views.parent_result import ParentResultsAPI
from apps.academics.views.teacher import TeacherClassesAPI
from apps.academics.views.teacher_mark import TeacherMarksEntryAPI
from apps.academics.views.admin import (
    ClassDetailAPI,
    ClassListCreateAPI,
    SectionDetailAPI,
    SectionListCreateAPI,
    StudentDetailAPI,
    StudentListCreateAPI,
    TeacherDetailAPI,
    TeacherListCreateAPI,
)


urlpatterns = [
    path("teacher/classes/", TeacherClassesAPI.as_view()),
    path("admin/teachers/", TeacherListCreateAPI.as_view()),
    path("admin/teachers/<uuid:uuid>/", TeacherDetailAPI.as_view()),
    path("admin/students/", StudentListCreateAPI.as_view()),
    path("admin/students/<uuid:uuid>/", StudentDetailAPI.as_view()),
    path("admin/classes/", ClassListCreateAPI.as_view()),
    path("admin/classes/<uuid:uuid>/", ClassDetailAPI.as_view()),
    path("admin/sections/", SectionListCreateAPI.as_view()),
    path("admin/sections/<uuid:uuid>/", SectionDetailAPI.as_view()),
]


urlpatterns += [
    path("teacher/marks/", TeacherMarksEntryAPI.as_view()),
]

urlpatterns += [
    path("parent/children/", ParentChildrenAPI.as_view()),
    path("parent/results/", ParentResultsAPI.as_view()),
]
