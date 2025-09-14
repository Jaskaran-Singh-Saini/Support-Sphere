from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Reflection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt1_text = models.TextField(blank=True)
    prompt2_text = models.TextField(blank=True)
    mood = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Reflection by {self.user.username} on {self.created_at.date()}'
    
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'