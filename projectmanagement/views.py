# project_management/views.py

from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
from .models import Sprint, Project, Task, Issue
from .serializers import ProjectSerializer
from datetime import date

@csrf_exempt
def add_project(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            description = data.get('description')

            # Set the owner as the authenticated user or the first user in the database
            owner = request.user if request.user.is_authenticated else User.objects.first()
            
            if not owner:
                return JsonResponse({"status": "error", "message": "No users found in the database."}, status=404)

            project = Project.objects.create(name=name, description=description, owner=owner)
            return JsonResponse({
                "status": "success", 
                "project": {
                    "id": project.id, 
                    "name": project.name, 
                    "description": project.description,
                    "owner": {"id": owner.id, "username": owner.username}
                }
            })
        except Exception as e:
            print("Error adding project:", e)
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

@csrf_exempt
def add_task(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            description = data.get('description')
            sprint_id = data.get('sprint_id')
            assignee_id = data.get('assignee_id')
            status = data.get('status', 'TO_DO')

            sprint = Sprint.objects.get(id=sprint_id)
            assignee = User.objects.get(id=assignee_id) if assignee_id else None

            task = Task.objects.create(
                title=title,
                description=description,
                sprint=sprint,
                assignee=assignee,
                status=status
            )

            return JsonResponse({"status": "success", "task": {"id": task.id, "title": task.title}})
        except Sprint.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Sprint not found"}, status=404)
        except User.DoesNotExist:
            return JsonResponse({"status": "error", "message": "User (assignee) not found"}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

@csrf_exempt
def add_sprint(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            project_id = data.get('project_id')

            project = Project.objects.get(id=project_id)

            sprint = Sprint.objects.create(
                name=name,
                start_date=start_date,
                end_date=end_date,
                project=project
            )

            return JsonResponse({"status": "success", "sprint": {"id": sprint.id, "name": sprint.name}})
        except Project.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Project not found"}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

def get_owner_id(request):
    owner = request.user if request.user.is_authenticated else User.objects.first()
    if owner:
        return JsonResponse({"ownerId": owner.id})
    else:
        return JsonResponse({"status": "error", "message": "No users found in the database"}, status=404)

@api_view(['GET'])
def get_projects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response({"projects": serializer.data})

def ongoing_sprints(request):
    today = date.today()
    sprints = Sprint.objects.filter(start_date__lte=today, end_date__gte=today)
    sprint_data = [{"id": sprint.id, "name": sprint.name, "start_date": sprint.start_date, "end_date": sprint.end_date} for sprint in sprints]
    return JsonResponse({"sprints": sprint_data})

def recent_tasks(request):
    tasks = Task.objects.order_by('-created_at')[:5]
    task_data = [{"id": task.id, "title": task.title, "status": task.status} for task in tasks]
    return JsonResponse({"tasks": task_data})

def new_issues(request):
    issues = Issue.objects.filter(status="new")
    issue_data = [
        {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "status": issue.status,
            "assignee": issue.assignee.username if issue.assignee else None,
            "created_at": issue.created_at,
            "updated_at": issue.updated_at,
            "project": issue.project.name if issue.project else None
        }
        for issue in issues
    ]
    return JsonResponse({"issues": issue_data})

@csrf_exempt
def add_issue(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get("title")
            description = data.get("description")
            status = data.get("status", "new")
            priority = data.get("priority")
            assignee_id = data.get("assignee_id")

            issue = Issue.objects.create(
                title=title,
                description=description,
                status=status,
                priority=priority,
                assignee_id=assignee_id,
            )
            
            return JsonResponse({"status": "success", "message": "Issue created successfully", "issue_id": issue.id}, status=201)
        
        except (json.JSONDecodeError, KeyError) as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)

@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        organization = data.get("organization")
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")

        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "User already exists"}, status=400)
        
        user = User.objects.create_user(username=username, password=password)
        login(request, user)  # Log the user in after creation
        return JsonResponse({"message": "User created and logged in successfully", "auth_status": True})

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({"message": "Logged in successfully", "auth_status": True})
        else:
            return JsonResponse({"error": "Invalid credentials", "auth_status": False}, status=400)

def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})

@csrf_exempt
def session_view(request):
    if request.user.is_authenticated:
        return JsonResponse({"user": request.user.username, "auth_status": True})
    return JsonResponse({"error": "User not authenticated", "auth_status": False}, status=401)