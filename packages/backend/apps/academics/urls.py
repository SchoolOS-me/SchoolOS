from django.urls import path

from apps.academics.views.parent import ParentChildrenAPI
from apps.academics.views.parent_result import ParentResultsAPI
from apps.academics.views.teacher import TeacherClassesAPI
from apps.academics.views.teacher_mark import TeacherMarksEntryAPI
from apps.academics.views.admin import (
    TeacherCreateAPI,
    StudentCreateAPI,
    ClassCreateAPI,
    SectionCreateAPI,
    TeacherListAPI,
    StudentListAPI,
    ClassListAPI,
    SectionListAPI,
)


urlpatterns = [
    path("teacher/classes/", TeacherClassesAPI.as_view()),
    path("admin/teachers/", TeacherListAPI.as_view()),
    path("admin/teachers/create/", TeacherCreateAPI.as_view()),
    path("admin/students/", StudentListAPI.as_view()),
    path("admin/students/create/", StudentCreateAPI.as_view()),
    path("admin/classes/", ClassListAPI.as_view()),
    path("admin/classes/create/", ClassCreateAPI.as_view()),
    path("admin/sections/", SectionListAPI.as_view()),
    path("admin/sections/create/", SectionCreateAPI.as_view()),
]


urlpatterns += [
    path("teacher/marks/", TeacherMarksEntryAPI.as_view()),
]

urlpatterns += [
    path("parent/children/", ParentChildrenAPI.as_view()),
    path("parent/results/", ParentResultsAPI.as_view()),
]
