from django.core.management.base import BaseCommand, CommandError
from core.models import Project
from core.services.folder_monitor import FolderMonitor


class Command(BaseCommand):
    help = "Scan a specific project folder for changes"

    def add_arguments(self, parser):
        parser.add_argument("project_id", type=int, help="ID of the project to scan")

    def handle(self, *args, **options):
        project_id = options["project_id"]

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise CommandError(f"Project with ID {project_id} does not exist")

        self.stdout.write(f"Scanning project: {project.name} ({project.folder_path})")

        try:
            monitor = FolderMonitor(project)
            result = monitor.scan_folder()

            self.stdout.write(
                self.style.SUCCESS(
                    f'Scan completed. Found {result["files_added"]} new files, '
                    f'{result["files_modified"]} modified files, '
                    f'{result["files_deleted"]} deleted files. '
                    f'Size change: {result["size_change"]} bytes.'
                )
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error scanning project: {str(e)}"))
