from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework.views import APIView

from .models import ProjectsRoot, Project, FileRecord, ActivityLog
from .serializers import (
    ProjectsRootSerializer,
    ProjectSerializer,
    ProjectDetailSerializer,
    FileRecordSerializer,
    ActivityLogSerializer,
)
from .services.folder_monitor import ProjectsMonitor, FolderMonitor


class ProjectsRootViewSet(viewsets.ModelViewSet):
    """
    API endpoint for projects root folders
    """

    queryset = ProjectsRoot.objects.all()
    serializer_class = ProjectsRootSerializer

    @action(detail=True, methods=["post"])
    def scan(self, request, pk=None):
        """
        Trigger a scan of the projects root folder to discover projects
        """
        root = self.get_object()

        try:
            monitor = ProjectsMonitor()
            result = monitor.scan_projects_root(root)

            return Response(
                {
                    "success": True,
                    "message": "Scan completed successfully",
                    "result": result,
                }
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": f"Error scanning projects root: {str(e)}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint for projects
    """

    queryset = Project.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjectDetailSerializer
        return ProjectSerializer

    @action(detail=True, methods=["post"])
    def scan(self, request, pk=None):
        """
        Trigger a scan of the project folder
        """
        project = self.get_object()

        try:
            monitor = FolderMonitor(project)
            result = monitor.scan_folder()

            return Response(
                {
                    "success": True,
                    "message": "Scan completed successfully",
                    "result": result,
                }
            )
        except Exception as e:
            return Response(
                {"success": False, "message": f"Error scanning project: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def files(self, request, pk=None):
        """
        Get files for a project
        """
        project = self.get_object()

        # Support filtering
        filename = request.query_params.get("filename", None)

        files = FileRecord.objects.filter(project=project)
        if filename:
            files = files.filter(filename__icontains=filename)

        # Support pagination
        page = self.paginate_queryset(files)
        if page is not None:
            serializer = FileRecordSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = FileRecordSerializer(files, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def activity(self, request, pk=None):
        """
        Get activity logs for a project
        """
        project = self.get_object()

        # Get date range from query parameters
        days = request.query_params.get("days", None)
        start_date = request.query_params.get("start_date", None)
        end_date = request.query_params.get("end_date", None)

        # Convert dates or use defaults
        if days:
            days = int(days)
            start_date = timezone.now() - timedelta(days=days)
            end_date = timezone.now()
        elif start_date:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").replace(
                tzinfo=timezone.get_current_timezone()
            )
            if end_date:
                end_date = datetime.strptime(end_date, "%Y-%m-%d").replace(
                    tzinfo=timezone.get_current_timezone()
                )
            else:
                end_date = timezone.now()
        else:
            # Default to last 30 days
            start_date = timezone.now() - timedelta(days=30)
            end_date = timezone.now()

        # Get activity logs
        activity_logs = ActivityLog.objects.filter(
            project=project, timestamp__gte=start_date, timestamp__lte=end_date
        ).order_by("timestamp")

        # Support pagination
        page = self.paginate_queryset(activity_logs)
        if page is not None:
            serializer = ActivityLogSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ActivityLogSerializer(activity_logs, many=True)

        # Calculate summary stats
        total_added = sum(log.files_added for log in activity_logs)
        total_modified = sum(log.files_modified for log in activity_logs)
        total_deleted = sum(log.files_deleted for log in activity_logs)
        net_size_change = sum(log.size_change for log in activity_logs)

        return Response(
            {
                "logs": serializer.data,
                "summary": {
                    "period_start": start_date,
                    "period_end": end_date,
                    "total_added": total_added,
                    "total_modified": total_modified,
                    "total_deleted": total_deleted,
                    "net_size_change": net_size_change,
                    "active_days": activity_logs.values("timestamp__date")
                    .distinct()
                    .count(),
                },
            }
        )


class ScanAllView(APIView):
    """
    API endpoint for scanning all projects
    """

    def post(self, request):
        monitor = ProjectsMonitor()

        # First discover projects
        roots = ProjectsRoot.objects.all()
        discovery_results = {}

        for root in roots:
            result = monitor.scan_projects_root(root)
            discovery_results[root.name] = result

        # Then scan files
        scan_results = monitor.scan_all_projects()

        # Combine results
        combined_results = {"discovery": discovery_results, "scan": scan_results}

        return Response(combined_results)
