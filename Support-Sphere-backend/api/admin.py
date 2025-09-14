from django.contrib import admin
from .models import Reflection, Post, Comment

# Register your models here.
admin.site.register(Reflection)
admin.site.register(Post)
admin.site.register(Comment)