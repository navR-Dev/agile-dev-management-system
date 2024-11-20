from django.contrib.auth.models import User
from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Sprint(models.Model):
    name = models.CharField(max_length=255)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='sprints')
    start_date = models.DateField()
    end_date = models.DateField()
    
    def __str__(self):
        return self.name


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(
        max_length=50, 
        choices=[('TO_DO', 'To Do'), ('IN_PROGRESS', 'In Progress'), ('DONE', 'Done')]
    )
    sprint = models.ForeignKey(Sprint, on_delete=models.CASCADE, related_name='tasks')
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # New foreign key to link Task with Project
    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='tasks',
    )

    def __str__(self):
        return self.title
    
class Issue(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('CLOSED', 'Closed'),
    ]
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='issues')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='OPEN')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')  # Added priority
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title