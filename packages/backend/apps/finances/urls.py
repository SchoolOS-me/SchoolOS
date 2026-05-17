from django.urls import path, include

from .fee_views import FeePaymentDetailAPI, FeePaymentListCreateAPI, FeeReportAPI

stripe_urls = [
    path("", include("djstripe.urls", namespace="djstripe")),
]

urlpatterns = [
    path("admin/fee-payments/", FeePaymentListCreateAPI.as_view()),
    path("admin/fee-payments/<uuid:uuid>/", FeePaymentDetailAPI.as_view()),
    path("admin/reports/fees/", FeeReportAPI.as_view()),
    path("stripe/", include(stripe_urls)),
]
