from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Todo(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    priority = models.IntegerField(default=1, validators=[MaxValueValidator(10), MinValueValidator(1)])
    x = models.FloatField(default=1.0)
    y = models.FloatField(default=1.0)

    def _str_(self):
        return self.title


class Edges(models.Model):
    source = models.IntegerField(default=1)
    target = models.IntegerField(default=1)
