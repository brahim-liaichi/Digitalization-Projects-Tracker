from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.models import Project
from .models import TaskCategory, Task, TaskComment
from .serializers import (
    TaskCategorySerializer,
    TaskSerializer,
    TaskDetailSerializer,
    TaskCommentSerializer,
)


class TaskCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for task categories
    """

    queryset = TaskCategory.objects.all()
    serializer_class = TaskCategorySerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint for tasks
    """

    queryset = Task.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TaskDetailSerializer
        return TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()

        # Filter by project if specified
        project_id = self.request.query_params.get("project", None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        # Filter by status if specified
        status = self.request.query_params.get("status", None)
        if status:
            queryset = queryset.filter(status=status)

        # Filter by priority if specified
        priority = self.request.query_params.get("priority", None)
        if priority:
            queryset = queryset.filter(priority=priority)

        # Filter by category if specified
        category_id = self.request.query_params.get("category", None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset

    @action(detail=True, methods=["post"])
    def add_comment(self, request, pk=None):
        """
        Add a comment to a task
        """
        task = self.get_object()
        data = request.data.copy()
        data["task"] = task.id

        serializer = TaskCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def comments(self, request, pk=None):
        """
        Get comments for a task
        """
        task = self.get_object()
        comments = task.comments.all().order_by("-created_at")
        serializer = TaskCommentSerializer(comments, many=True)
        return Response(serializer.data)


class TaskCommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for task comments
    """

    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer

    def get_queryset(self):
        queryset = TaskComment.objects.all()

        # Filter by task if specified
        task_id = self.request.query_params.get("task", None)
        if task_id:
            queryset = queryset.filter(task_id=task_id)

        return queryset
