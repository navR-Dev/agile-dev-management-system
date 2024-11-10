# project_management/views.py
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Sprint, Project, Task, Issue
from datetime import date

@csrf_exempt
def add_project(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            description = data.get('description')

            # Set the owner automatically (use the logged-in user or fetch the first user)
            owner = User.objects.first()  # Replace with actual owner logic, or use request.user for logged-in users

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
            title = data.get('title')  # Changed from 'name' to 'title'
            description = data.get('description')
            sprint_id = data.get('sprint_id')  # Using sprint_id to reference the Sprint
            assignee_id = data.get('assignee_id')  # Optional assignee (could be None)
            status = data.get('status', 'TO_DO')  # Default to 'TO_DO' if not provided

            # Fetch the Sprint using the sprint_id
            sprint = Sprint.objects.get(id=sprint_id)

            # Optionally fetch the assignee if provided, otherwise leave it as None
            assignee = User.objects.get(id=assignee_id) if assignee_id else None

            # Create the task with the provided details
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

            # Fetch the project using project_id
            project = Project.objects.get(id=project_id)

            # Create the sprint
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

# API to get the first user or the authenticated user's ID
def get_owner_id(request):
    owner = request.user if request.user.is_authenticated else User.objects.first()
    if owner:
        return JsonResponse({"ownerId": owner.id})
    else:
        return JsonResponse({"status": "error", "message": "No users found in the database"}, status=404)

def get_projects(request):
    try:
        projects = Project.objects.all()
        project_list = [{"id": project.id, "name": project.name} for project in projects]
        return JsonResponse({"projects": project_list})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)

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
    # Fetch issues with status "new"
    issues = Issue.objects.filter(status="new")

    # Prepare the issue data with all relevant fields
    issue_data = [
        {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "status": issue.status,
            "assignee": issue.assignee.username if issue.assignee else None,  # Assuming assignee is a User instance
            "created_at": issue.created_at,
            "updated_at": issue.updated_at,
            "project": issue.project.name if issue.project else None  # Assuming project is a Project instance
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
            status = data.get("status", "new")  # Default to "new" if no status is provided
            priority = data.get("priority")
            assignee_id = data.get("assignee_id")  # Optional, adjust based on your needs

            # Create and save the new issue
            issue = Issue.objects.create(
                title=title,
                description=description,
                status=status,
                priority=priority,
                assignee_id=assignee_id,
            )
            
            # Return a success response with the new issue's ID
            return JsonResponse({"status": "success", "message": "Issue created successfully", "issue_id": issue.id}, status=201)
        
        except (json.JSONDecodeError, KeyError) as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)