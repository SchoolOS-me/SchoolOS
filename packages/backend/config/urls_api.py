from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from drf_yasg.generators import OpenAPISchemaGenerator
from rest_framework import permissions
from django.conf import settings
from django.contrib import admin
from django.urls import path, include

from common.graphql.views import DRFAuthenticatedGraphQLView

api_info = openapi.Info(title="Documentation", default_version="v1")


class HttpAndHttpsSchemaGenerator(OpenAPISchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        schema.schemes = ["http", "https"]
        return schema


schema_view = get_schema_view(
    api_info,
    public=True,
    generator_class=HttpAndHttpsSchemaGenerator,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    re_path(r'swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r"doc/", schema_view.with_ui("swagger")),
    re_path(r"redoc/", schema_view.with_ui("redoc")),
    re_path(r"admin/", admin.site.urls),
    path(
        "api/",
        include(
            [
                path("content/", include("apps.content.urls")),
                path("finances/", include("apps.finances.urls")),
                path("dashboard/", include("apps.dashboard.urls")),
                path("academics/", include("apps.academics.urls")),
                path("attendance/", include("apps.attendance.urls")),
    

            ]
        ),
    ),
]
