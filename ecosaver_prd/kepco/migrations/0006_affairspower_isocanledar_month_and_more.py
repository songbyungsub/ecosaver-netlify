# Generated by Django 4.1.7 on 2024-01-30 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kepco', '0005_remove_affairspower_isocanledar_month_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='affairspower',
            name='isocanledar_month',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='affairspower',
            name='isocanledar_week',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='affairspower',
            name='isocanledar_year',
            field=models.IntegerField(null=True),
        ),
    ]