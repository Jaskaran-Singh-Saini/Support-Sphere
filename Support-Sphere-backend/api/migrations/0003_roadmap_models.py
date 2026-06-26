# Generated manually for Support-Sphere roadmap

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_post_comment'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('student', 'Student'), ('counselor', 'Counselor'), ('admin', 'Admin')], default='student', max_length=20)),
                ('display_name', models.CharField(blank=True, max_length=100)),
                ('preferred_language', models.CharField(default='en', max_length=10)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Counselor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('specialty', models.CharField(max_length=200)),
                ('bio', models.TextField(blank=True)),
                ('is_available', models.BooleanField(default=True)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='counselor_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('category', models.CharField(choices=[('meditation', 'Meditation'), ('article', 'Article'), ('exercise', 'Exercise'), ('assessment', 'Assessment')], max_length=50)),
                ('description', models.TextField()),
                ('content_url', models.URLField(blank=True)),
                ('language', models.CharField(default='en', max_length=10)),
                ('is_published', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='CrisisAlert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_snippet', models.TextField()),
                ('source', models.CharField(choices=[('chat', 'AI Chat'), ('forum', 'Forum')], max_length=20)),
                ('resolved', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AssessmentResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_slug', models.CharField(max_length=50)),
                ('score', models.PositiveIntegerField()),
                ('severity', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assessments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scheduled_at', models.DateTimeField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('counselor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointments', to='api.counselor')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='post',
            name='moderation_status',
            field=models.CharField(choices=[('approved', 'Approved'), ('flagged', 'Flagged'), ('pending', 'Pending Review')], default='approved', max_length=20),
        ),
        migrations.AddField(
            model_name='comment',
            name='moderation_status',
            field=models.CharField(choices=[('approved', 'Approved'), ('flagged', 'Flagged'), ('pending', 'Pending Review')], default='approved', max_length=20),
        ),
    ]
