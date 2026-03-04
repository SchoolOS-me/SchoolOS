import uuid

from django.db import migrations, models
import django.utils.timezone


def backfill_user_uuid(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    for user in User.objects.filter(uuid__isnull=True).only("id").iterator(chunk_size=500):
        User.objects.filter(id=user.id).update(uuid=uuid.uuid4())


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="updated_at",
            field=models.DateTimeField(default=django.utils.timezone.now, auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="user",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, null=True, db_index=True, editable=False),
        ),
        migrations.RunPython(backfill_user_uuid, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="user",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False),
        ),
    ]
