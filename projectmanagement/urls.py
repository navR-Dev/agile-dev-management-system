from django.urls import path
from . import views

urlpatterns = [
    path('add_project/', views.add_project, name='add_project'),
    path('add_task/', views.add_task, name='add_task'),
    path('add_sprint/', views.add_sprint, name='add_sprint'),
    path('ongoing_sprints/', views.ongoing_sprints, name='ongoing_sprints'),
    path('recent_tasks/', views.recent_tasks, name='recent_tasks'),
    path('new_issues/', views.new_issues, name='new_issues'),
    path('add_issue/', views.add_issue, name='add_issue'),
    path('get_owner_id/', views.get_owner_id, name='get_owner_id'),  # New endpoint to get the owner ID
    path('get_projects/', views.get_projects, name='get_projects'),
]
