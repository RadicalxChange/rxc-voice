# Generated by Django 3.1.2 on 2020-12-01 20:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_conversation'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='site_id',
            field=models.CharField(default='polis_site_id_cG2opQF5hsqj9jGCsr', max_length=256),
            preserve_default=False,
        ),
    ]
