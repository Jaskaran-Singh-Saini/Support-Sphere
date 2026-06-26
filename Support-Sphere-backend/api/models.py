from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .encryption import decrypt_text, encrypt_text


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('counselor', 'Counselor'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    display_name = models.CharField(max_length=100, blank=True)
    preferred_language = models.CharField(max_length=10, default='en')

    def __str__(self):
        return f'{self.user.username} ({self.role})'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


class Reflection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt1_text = models.TextField(blank=True)
    prompt2_text = models.TextField(blank=True)
    mood = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.prompt1_text and not self.prompt1_text.startswith('gAAAA'):
            self.prompt1_text = encrypt_text(self.prompt1_text)
        if self.prompt2_text and not self.prompt2_text.startswith('gAAAA'):
            self.prompt2_text = encrypt_text(self.prompt2_text)
        super().save(*args, **kwargs)

    @property
    def decrypted_prompt1(self):
        return decrypt_text(self.prompt1_text)

    @property
    def decrypted_prompt2(self):
        return decrypt_text(self.prompt2_text)

    def __str__(self):
        return f'Reflection by {self.user.username} on {self.created_at.date()}'


class Post(models.Model):
    MODERATION_CHOICES = [
        ('approved', 'Approved'),
        ('flagged', 'Flagged'),
        ('pending', 'Pending Review'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    moderation_status = models.CharField(max_length=20, choices=MODERATION_CHOICES, default='approved')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    moderation_status = models.CharField(max_length=20, choices=Post.MODERATION_CHOICES, default='approved')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'


class Counselor(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='counselor_profile')
    name = models.CharField(max_length=200)
    specialty = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    counselor = models.ForeignKey(Counselor, on_delete=models.CASCADE, related_name='appointments')
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.student.username} with {self.counselor.name}'


class Resource(models.Model):
    CATEGORY_CHOICES = [
        ('meditation', 'Meditation'),
        ('article', 'Article'),
        ('exercise', 'Exercise'),
        ('assessment', 'Assessment'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    content_url = models.URLField(blank=True)
    language = models.CharField(max_length=10, default='en')
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class CrisisAlert(models.Model):
    SOURCE_CHOICES = [
        ('chat', 'AI Chat'),
        ('forum', 'Forum'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    message_snippet = models.TextField()
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Crisis alert ({self.source}) at {self.created_at}'


class AssessmentResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessments')
    test_slug = models.CharField(max_length=50)
    score = models.PositiveIntegerField()
    severity = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.test_slug} - {self.user.username}'
