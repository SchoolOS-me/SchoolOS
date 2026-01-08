import importlib

from django.conf import settings
from celery import shared_task
from .services.export.services import user as user_services
from django.core.exceptions import ImproperlyConfigured

handler_path = settings.LAMBDA_TASKS_BASE_HANDLER

if not handler_path or "." not in handler_path:
    raise ImproperlyConfigured(
        "LAMBDA_TASKS_BASE_HANDLER must be a dotted path "
        "(e.g. 'common.tasks.LambdaTask')"
    )

module_name, class_name = handler_path.rsplit(".", 1)
LambdaTask = getattr(importlib.import_module(module_name), class_name)


class ExportUserData(LambdaTask):
    def __init__(self):
        super().__init__(name="EXPORT_USER_DATA", source='backend.export_user')


@shared_task(bind=True)
def export_user_data(self, user_ids, admin_email):
    user_services.process_user_data_export(user_ids=user_ids, admin_email=admin_email)
