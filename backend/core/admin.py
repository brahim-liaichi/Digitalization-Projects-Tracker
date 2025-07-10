from django.contrib import admin
from .models import ProjectsRoot, Project, FileRecord, ActivityLog


@admin.register(ProjectsRoot)
class ProjectsRootAdmin(admin.ModelAdmin):
    list_display = ("name", "path", "last_scan", "auto_discover")
    search_fields = ("name", "path")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "root",
        "folder_path",
        "is_auto_discovered",
        "last_scan",
        "total_files",
        "active",
    )
    list_filter = ("root", "is_auto_discovered", "active")
    search_fields = ("name", "folder_path")


@admin.register(FileRecord)
class FileRecordAdmin(admin.ModelAdmin):
    list_display = ("filename", "project", "size", "last_modified")
    list_filter = ("project",)
    search_fields = ("filename", "path")


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = (
        "project",
        "timestamp",
        "files_added",
        "files_modified",
        "files_deleted",
    )
    list_filter = ("project", "timestamp")
