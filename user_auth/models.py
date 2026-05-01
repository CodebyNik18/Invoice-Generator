from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=250, null=False, blank=False)
    phone = models.CharField(max_length=15, null=False, blank=False)

    def __str__(self):
        return self.user.get_full_name()