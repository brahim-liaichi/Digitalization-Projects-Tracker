from django.contrib import admin
from .models import TaskCategory, Task, TaskComment


@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "color")
    search_fields = ("name",)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "category", "status", "priority", "due_date")
    list_filter = ("status", "priority", "category")
    search_fields = ("title", "description")


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ("task", "text", "created_at")
    list_filter = ("created_at",)
    search_fields = ("text",)
