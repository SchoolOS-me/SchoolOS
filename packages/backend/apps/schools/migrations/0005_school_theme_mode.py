from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("schools", "0004_school_logo"),
    ]

    operations = [
        migrations.AddField(
            model_name="school",
            name="theme_mode",
            field=models.CharField(
                choices=[("light", "Light"), ("dark", "Dark"), ("system", "System")],
                default="system",
                max_length=16,
            ),
        ),
    ]
