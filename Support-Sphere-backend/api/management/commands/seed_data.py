from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from api.models import Counselor, Resource, UserProfile


class Command(BaseCommand):
    help = 'Seed demo counselors, resources, and admin user'

    def handle(self, *args, **options):
        for user in User.objects.all():
            UserProfile.objects.get_or_create(user=user, defaults={'role': 'student'})

        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@university.edu', 'is_staff': True, 'is_superuser': True},
        )
        if created:
            admin.set_password('admin123')
            admin.save()
        admin.profile.role = 'admin'
        admin.profile.save()

        demo_student, created = User.objects.get_or_create(
            username='student',
            defaults={'email': 'student@university.edu'},
        )
        if created:
            demo_student.set_password('student123')
            demo_student.save()

        counselors = [
            ('Dr. Anjali Sharma', 'Academic Stress & Anxiety', 'Specializes in exam anxiety and academic burnout.'),
            ('Mr. Rohan Gupta', 'Career & Relationship Counseling', 'Helps students navigate career decisions and relationships.'),
            ('Ms. Priya Singh', 'Depression & Burnout', 'Focuses on mood disorders and emotional exhaustion.'),
        ]
        for name, specialty, bio in counselors:
            Counselor.objects.get_or_create(name=name, defaults={'specialty': specialty, 'bio': bio, 'is_available': True})

        resources = [
            ('Box Breathing Exercise', 'exercise', 'A 4-4-4-4 breathing technique to calm acute stress.', ''),
            ('Understanding Academic Anxiety', 'article', 'Learn how exam pressure affects the mind and body.', ''),
            ('10-Minute Guided Meditation', 'meditation', 'A short mindfulness session for daily reset.', ''),
            ('GAD-7 Self Assessment', 'assessment', 'Screen for generalized anxiety symptoms.', '/assessments/gad-7'),
        ]
        for title, category, description, url in resources:
            Resource.objects.get_or_create(
                title=title,
                defaults={'category': category, 'description': description, 'content_url': url},
            )

        self.stdout.write(self.style.SUCCESS('Seed data loaded successfully.'))
