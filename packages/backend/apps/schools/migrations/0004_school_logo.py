from django.db import migrations, models

import common.storages


class Migration(migrations.Migration):
    dependencies = [
        ("schools", "0003_school_uuid_updated_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="school",
            name="logo",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to=common.storages.UniqueFilePathGenerator("schools/logos"),
            ),
        ),
    ]
