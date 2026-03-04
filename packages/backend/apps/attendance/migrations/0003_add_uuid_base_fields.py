import uuid

from django.db import migrations, models
import django.utils.timezone


def backfill_attendance_uuid(apps, schema_editor):
    AttendanceSession = apps.get_model("attendance", "AttendanceSession")
    StudentAttendance = apps.get_model("attendance", "StudentAttendance")

    for session in AttendanceSession.objects.filter(uuid__isnull=True).only("id").iterator(chunk_size=500):
        AttendanceSession.objects.filter(id=session.id).update(uuid=uuid.uuid4())

    for record in StudentAttendance.objects.filter(uuid__isnull=True).only("id").iterator(chunk_size=500):
        StudentAttendance.objects.filter(id=record.id).update(uuid=uuid.uuid4())


class Migration(migrations.Migration):

    dependencies = [
        ("attendance", "0002_attendancesession_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="attendancesession",
            name="updated_at",
            field=models.DateTimeField(default=django.utils.timezone.now, auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="attendancesession",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, null=True, db_index=True, editable=False),
        ),
        migrations.AddField(
            model_name="studentattendance",
            name="created_at",
            field=models.DateTimeField(default=django.utils.timezone.now, auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="studentattendance",
            name="updated_at",
            field=models.DateTimeField(default=django.utils.timezone.now, auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="studentattendance",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, null=True, db_index=True, editable=False),
        ),
        migrations.RunPython(backfill_attendance_uuid, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="attendancesession",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False),
        ),
        migrations.AlterField(
            model_name="studentattendance",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False),
        ),
    ]
