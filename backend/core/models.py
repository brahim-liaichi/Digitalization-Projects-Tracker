from django.db import models
from django.utils import timezone


class ProjectsRoot(models.Model):
    """Main projects folder to monitor"""

    name = models.CharField(max_length=255)
    path = models.CharField(max_length=512)  # Main projects folder path
    last_scan = models.DateTimeField(null=True, blank=True)
    auto_discover = models.BooleanField(default=True)  # Auto-discover projects
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    """Individual project folder"""

    name = models.CharField(max_length=255)
    root = models.ForeignKey(
        ProjectsRoot,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="projects",
    )
    folder_path = models.CharField(max_length=512)  # Full path or relative to root
    is_auto_discovered = models.BooleanField(
        default=False
    )  # Flag for auto-discovered projects
    last_scan = models.DateTimeField(null=True, blank=True)
    total_files = models.IntegerField(default=0)
    total_size = models.BigIntegerField(default=0)  # in bytes
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class FileRecord(models.Model):
    """Individual file record"""

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="files")
    path = models.CharField(max_length=512)  # Path relative to project folder
    filename = models.CharField(max_length=255)
    size = models.BigIntegerField(default=0)  # in bytes
    last_modified = models.DateTimeField()
    file_hash = models.CharField(
        max_length=64, blank=True, null=True
    )  # For detecting content changes
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.filename

    class Meta:
        unique_together = ("project", "path")


class ActivityLog(models.Model):
    """Record of changes in a project"""

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="activities"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    files_added = models.IntegerField(default=0)
    files_modified = models.IntegerField(default=0)
    files_deleted = models.IntegerField(default=0)
    size_change = models.BigIntegerField(default=0)  # can be negative

    def __str__(self):
        return f"{self.project.name} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
