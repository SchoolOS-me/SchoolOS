from django.core.management.base import BaseCommand
from django.conf import settings

from apps.accounts.models import User
from apps.accounts.constants import UserRole


class Command(BaseCommand):
    help = "Bootstrap the platform SUPER_ADMIN user"

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            type=str,
            help="Email for the SUPER_ADMIN user",
            required=True,
        )
        parser.add_argument(
            "--password",
            type=str,
            help="Password for the SUPER_ADMIN user",
            required=True,
        )

    def handle(self, *args, **options):
        email = options["email"]
        password = options["password"]

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "role": UserRole.SUPER_ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "school": None,
            },
        )

        if created:
            user.set_password(password)
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"SUPER_ADMIN created successfully: {email}"
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"SUPER_ADMIN already exists: {email}"
                )
            )
