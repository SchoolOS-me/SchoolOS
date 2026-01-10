from django.urls import path

from apps.academics.views.parent import ParentChildrenAPI
from apps.academics.views.parent_result import ParentResultsAPI
from apps.academics.views.teacher import TeacherClassesAPI
from apps.academics.views.teacher_mark import TeacherMarksEntryAPI


urlpatterns = [
    path("teacher/classes/", TeacherClassesAPI.as_view()),
    
]


urlpatterns += [
    path("teacher/marks/", TeacherMarksEntryAPI.as_view()),
]

urlpatterns += [
    path("parent/children/", ParentChildrenAPI.as_view()),
    path("parent/results/", ParentResultsAPI.as_view()),
]

