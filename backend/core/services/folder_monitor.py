import os
import hashlib
import datetime
from pathlib import Path
from django.utils import timezone
from django.db.models import Sum
from core.models import ProjectsRoot, Project, FileRecord, ActivityLog


class ProjectsMonitor:
    """Monitors the main projects folder and manages project discovery"""

    def scan_projects_root(self, root):
        """
        Scan the main projects folder to discover project subfolders

        Args:
            root: A ProjectsRoot instance

        Returns:
            dict: Stats about discovered and removed projects
        """
        if not os.path.exists(root.path):
            print(f"Warning: Projects root path does not exist: {root.path}")
            return {
                "error": "Path does not exist",
                "new_projects": 0,
                "removed_projects": 0,
            }

        # Get existing projects for this root
        existing_projects = {
            p.folder_path: p for p in Project.objects.filter(root=root)
        }

        # Track statistics
        new_projects = 0
        removed_projects = 0

        # Scan for subdirectories (potential projects)
        try:
            with os.scandir(root.path) as entries:
                current_projects = {}

                # Find all subdirectories
                for entry in entries:
                    if entry.is_dir():
                        project_path = os.path.abspath(entry.path)
                        project_name = os.path.basename(project_path)
                        current_projects[project_path] = project_name

                        # If this is a new project, create it
                        if project_path not in existing_projects:
                            Project.objects.create(
                                name=project_name,
                                root=root,
                                folder_path=project_path,
                                is_auto_discovered=True,
                            )
                            new_projects += 1

                # Find projects that no longer exist
                for path, project in existing_projects.items():
                    if path not in current_projects:
                        # Project folder no longer exists
                        project.active = False
                        project.save()
                        removed_projects += 1

            # Update last scan time
            root.last_scan = timezone.now()
            root.save()

            return {"new_projects": new_projects, "removed_projects": removed_projects}

        except Exception as e:
            print(f"Error scanning projects root: {str(e)}")
            return {"error": str(e), "new_projects": 0, "removed_projects": 0}

    def scan_all_projects(self):
        """
        Scan all active projects for changes

        Returns:
            dict: Summary of changes across all projects
        """
        active_projects = Project.objects.filter(active=True)

        results = {
            "total_projects": active_projects.count(),
            "scanned_projects": 0,
            "total_files_added": 0,
            "total_files_modified": 0,
            "total_files_deleted": 0,
            "total_size_change": 0,  # Track the overall size change
            "errors": [],
        }

        for project in active_projects:
            try:
                monitor = FolderMonitor(project)
                scan_result = monitor.scan_folder()

                results["scanned_projects"] += 1
                results["total_files_added"] += scan_result["files_added"]
                results["total_files_modified"] += scan_result["files_modified"]
                results["total_files_deleted"] += scan_result["files_deleted"]
                results["total_size_change"] += scan_result[
                    "size_change"
                ]  # Add size change

            except Exception as e:
                results["errors"].append({"project": project.name, "error": str(e)})

        # Calculate grand totals (these values come from the database after all scans)
        total_size = (
            active_projects.aggregate(Sum("total_size"))["total_size__sum"] or 0
        )
        total_files = (
            active_projects.aggregate(Sum("total_files"))["total_files__sum"] or 0
        )

        # Add these to the results
        results["total_size"] = total_size
        results["total_files"] = total_files

        return results


class FolderMonitor:
    """Monitors a specific project folder for file changes"""

    def __init__(self, project):
        self.project = project
        self.folder_path = project.folder_path

    def scan_folder(self):
        """
        Scan the folder and record changes

        Returns:
            dict: Statistics about changes detected
        """
        if not os.path.exists(self.folder_path):
            raise FileNotFoundError(
                f"Project folder does not exist: {self.folder_path}"
            )

        # Get previous file records
        previous_files = {f.path: f for f in self.project.files.all()}
        current_files = {}

        # Stats for activity log
        files_added = 0
        files_modified = 0
        files_deleted = 0
        old_total_size = self.project.total_size
        new_total_size = 0

        # Scan current folder structure
        for root, _, files in os.walk(self.folder_path):
            for filename in files:
                full_path = os.path.join(root, filename)
                # Get path relative to project folder
                rel_path = os.path.relpath(full_path, self.folder_path)

                # Get file stats
                try:
                    stat_info = os.stat(full_path)
                    size = stat_info.st_size
                    last_modified = datetime.datetime.fromtimestamp(
                        stat_info.st_mtime, tz=timezone.get_current_timezone()
                    )

                    # Track file
                    current_files[rel_path] = {
                        "filename": filename,
                        "size": size,
                        "last_modified": last_modified,
                    }

                    new_total_size += size

                    # Check if file is new or modified
                    if rel_path not in previous_files:
                        # New file
                        FileRecord.objects.create(
                            project=self.project,
                            path=rel_path,
                            filename=filename,
                            size=size,
                            last_modified=last_modified,
                        )
                        files_added += 1
                    else:
                        # Existing file - check if modified
                        prev_record = previous_files[rel_path]
                        if (
                            prev_record.size != size
                            or prev_record.last_modified != last_modified
                        ):
                            # File was modified
                            prev_record.size = size
                            prev_record.last_modified = last_modified
                            prev_record.save()
                            files_modified += 1

                except Exception as e:
                    print(f"Error processing file {full_path}: {e}")

        # Find deleted files
        for path, record in previous_files.items():
            if path not in current_files:
                record.delete()
                files_deleted += 1

        # Update project stats
        self.project.total_files = len(current_files)
        self.project.total_size = new_total_size
        self.project.last_scan = timezone.now()
        self.project.save()

        # Create activity log if there were any changes
        if files_added > 0 or files_modified > 0 or files_deleted > 0:
            size_change = new_total_size - old_total_size
            ActivityLog.objects.create(
                project=self.project,
                files_added=files_added,
                files_modified=files_modified,
                files_deleted=files_deleted,
                size_change=size_change,
            )

        return {
            "files_added": files_added,
            "files_modified": files_modified,
            "files_deleted": files_deleted,
            "size_change": new_total_size - old_total_size,
        }

    @staticmethod
    def get_project_activity(project, start_date=None, end_date=None):
        """
        Get activity stats for a project between dates

        Args:
            project: Project instance
            start_date: Start date for filtering
            end_date: End date for filtering

        Returns:
            QuerySet: Filtered activity logs
        """
        query = ActivityLog.objects.filter(project=project)

        if start_date:
            query = query.filter(timestamp__gte=start_date)
        if end_date:
            query = query.filter(timestamp__lte=end_date)

        return query.order_by("timestamp")
