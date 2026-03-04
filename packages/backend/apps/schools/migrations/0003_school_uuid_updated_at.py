import uuid

from django.db import migrations, models
import django.utils.timezone


def backfill_school_uuid(apps, schema_editor):
    School = apps.get_model("schools", "School")
    for school in School.objects.filter(uuid__isnull=True).only("id").iterator(chunk_size=500):
        School.objects.filter(id=school.id).update(uuid=uuid.uuid4())


class Migration(migrations.Migration):

    dependencies = [
        ("schools", "0002_school_tenant_and_contact_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="school",
            name="updated_at",
            field=models.DateTimeField(default=django.utils.timezone.now, auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="school",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, null=True, db_index=True, editable=False),
        ),
        migrations.RunPython(backfill_school_uuid, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="school",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False),
        ),
    ]
