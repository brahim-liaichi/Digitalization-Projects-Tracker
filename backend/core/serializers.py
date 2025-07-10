from rest_framework import serializers
from .models import ProjectsRoot, Project, FileRecord, ActivityLog


class ProjectsRootSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectsRoot
        fields = ["id", "name", "path", "last_scan", "auto_discover", "created_at"]
        read_only_fields = ["last_scan", "created_at"]


class FileRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileRecord
        fields = [
            "id",
            "path",
            "filename",
            "size",
            "last_modified",
            "file_hash",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "project",
            "timestamp",
            "files_added",
            "files_modified",
            "files_deleted",
            "size_change",
        ]
        read_only_fields = ["timestamp"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "root",
            "folder_path",
            "is_auto_discovered",
            "last_scan",
            "total_files",
            "total_size",
            "active",
            "created_at",
        ]
        read_only_fields = ["last_scan", "total_files", "total_size", "created_at"]


class ProjectDetailSerializer(serializers.ModelSerializer):
    """More detailed project serializer with recent activity and stats"""

    recent_activity = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "root",
            "folder_path",
            "is_auto_discovered",
            "last_scan",
            "total_files",
            "total_size",
            "active",
            "created_at",
            "recent_activity",
        ]
        read_only_fields = [
            "last_scan",
            "total_files",
            "total_size",
            "created_at",
            "recent_activity",
        ]

    def get_recent_activity(self, obj):
        # Get the 5 most recent activity logs
        recent_logs = obj.activities.all().order_by("-timestamp")[:5]
        return ActivityLogSerializer(recent_logs, many=True).data
