from rest_framework import serializers
from .models import TaskCategory, Task, TaskComment


class TaskCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCategory
        fields = ["id", "name", "description", "color"]


class TaskCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComment
        fields = ["id", "task", "text", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]


class TaskSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    priority_display = serializers.CharField(
        source="get_priority_display", read_only=True
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "project",
            "category",
            "status",
            "status_display",
            "priority",
            "priority_display",
            "due_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class TaskDetailSerializer(serializers.ModelSerializer):
    """Detailed task serializer with comments"""

    status_display = serializers.CharField(source="get_status_display", read_only=True)
    priority_display = serializers.CharField(
        source="get_priority_display", read_only=True
    )
    comments = TaskCommentSerializer(many=True, read_only=True)
    category_details = TaskCategorySerializer(source="category", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "project",
            "category",
            "category_details",
            "status",
            "status_display",
            "priority",
            "priority_display",
            "due_date",
            "created_at",
            "updated_at",
            "comments",
        ]
        read_only_fields = ["created_at", "updated_at", "comments", "category_details"]
