from rest_framework import serializers
from .models import Project, Sprint, Task, Issue
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    assignee = serializers.StringRelatedField()  # Shows assignee's name

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'assignee', 'created_at']

class SprintSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True)  # Nested tasks within each sprint

    class Meta:
        model = Sprint
        fields = ['id', 'name', 'start_date', 'end_date', 'tasks']

class ProjectSerializer(serializers.ModelSerializer):
    sprints = SprintSerializer(many=True)  # Nested sprints within each project
    owner = serializers.StringRelatedField()  # Shows owner's name

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'created_at', 'sprints']


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