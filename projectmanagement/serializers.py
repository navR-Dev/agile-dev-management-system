from rest_framework import serializers
from .models import Project, Sprint, Task, Issue
from django.contrib.auth.models import User

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class SprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprint
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'title', 'description', 'project', 'status', 'assignee', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']  # Make sure the id and timestamps are read-only

    def validate(self, data):
        # Example: Ensure the assignee is a valid user if provided
        if data.get('assignee') and not User.objects.filter(id=data['assignee'].id).exists():
            raise serializers.ValidationError("Assignee is not a valid user.")
        return data