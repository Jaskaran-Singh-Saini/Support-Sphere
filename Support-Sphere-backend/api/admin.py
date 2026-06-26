from django.contrib import admin

from .models import (
    Appointment,
    AssessmentResult,
    Comment,
    Counselor,
    CrisisAlert,
    Post,
    Reflection,
    Resource,
    UserProfile,
)

admin.site.register(Reflection)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(UserProfile)
admin.site.register(Counselor)
admin.site.register(Appointment)
admin.site.register(Resource)
admin.site.register(CrisisAlert)
admin.site.register(AssessmentResult)
