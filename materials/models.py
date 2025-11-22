from django.db import models
from django.conf import settings

class Material(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="materials")
    title = models.CharField(max_length=255, blank=True)
    raw_text = models.TextField()

    segmented_data = models.JSONField(null=True, blank=True)
    summary_data = models.JSONField(null=True, blank=True)
    quiz_data = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title if self.title else f"Material {self.id}"
