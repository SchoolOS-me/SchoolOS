import uuid

from django.db import migrations, models
import django.utils.timezone


ACADEMICS_MODELS = [
    "academicyear",
    "schoolclass",
    "section",
    "subject",
    "sectionsubject",
    "student",
    "teacher",
    "teachingassignment",
    "exam",
    "examsubject",
    "studentexam",
    "studentmark",
    "studentresult",
    "gradingrule",
    "classteacher",
]


def add_base_fields(model_name: str):
    return [
        migrations.AddField(
            model_name=model_name,
            name="created_at",
            field=models.DateTimeField(default=django.utils.timezone.now, auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name=model_name,
            name="updated_at",
            field=models.DateTimeField(default=django.utils.timezone.now, auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name=model_name,
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, null=True, db_index=True, editable=False),
        ),
    ]


def alter_uuid_field(model_name: str):
    return migrations.AlterField(
        model_name=model_name,
        name="uuid",
        field=models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False),
    )


def backfill_academics_uuid(apps, schema_editor):
    for model_name in ACADEMICS_MODELS:
        Model = apps.get_model("academics", model_name)
        for row in Model.objects.filter(uuid__isnull=True).only("id").iterator(chunk_size=500):
            Model.objects.filter(id=row.id).update(uuid=uuid.uuid4())


class Migration(migrations.Migration):

    dependencies = [
        ("academics", "0006_merge_20260211_1833"),
    ]

    operations = [
        *add_base_fields("academicyear"),
        *add_base_fields("schoolclass"),
        *add_base_fields("section"),
        *add_base_fields("subject"),
        *add_base_fields("sectionsubject"),
        *add_base_fields("student"),
        *add_base_fields("teacher"),
        *add_base_fields("teachingassignment"),
        *add_base_fields("exam"),
        *add_base_fields("examsubject"),
        *add_base_fields("studentexam"),
        *add_base_fields("studentmark"),
        *add_base_fields("studentresult"),
        *add_base_fields("gradingrule"),
        *add_base_fields("classteacher"),
        migrations.RunPython(backfill_academics_uuid, migrations.RunPython.noop),
        *[alter_uuid_field(model_name) for model_name in ACADEMICS_MODELS],
    ]
