from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import ProjectsRoot
from core.services.folder_monitor import ProjectsMonitor


class Command(BaseCommand):
    help = "Scan all project folders and detect changes"

    def add_arguments(self, parser):
        parser.add_argument(
            "--discover-only",
            action="store_true",
            help="Only discover new projects without scanning files",
        )

    def handle(self, *args, **options):
        discover_only = options.get("discover_only", False)
        monitor = ProjectsMonitor()

        # First scan all project roots for new projects
        self.stdout.write(
            self.style.NOTICE("Scanning project roots for new projects...")
        )
        roots = ProjectsRoot.objects.all()

        if not roots.exists():
            self.stdout.write(
                self.style.WARNING(
                    "No project roots configured. Please add a root folder in the admin panel."
                )
            )
            return

        for root in roots:
            self.stdout.write(f"Scanning root: {root.name} ({root.path})")
            result = monitor.scan_projects_root(root)

            if "error" in result:
                self.stdout.write(
                    self.style.ERROR(f'Error scanning root: {result["error"]}')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Found {result["new_projects"]} new projects, '
                        f'{result["removed_projects"]} projects no longer exist'
                    )
                )

        # If discover-only flag is set, stop here
        if discover_only:
            self.stdout.write(self.style.SUCCESS("Project discovery completed."))
            return

        # Always scan individual projects for file changes, unless discover-only flag is set
        self.stdout.write(
            self.style.NOTICE("Scanning individual projects for file changes...")
        )
        results = monitor.scan_all_projects()

        self.stdout.write(
            self.style.SUCCESS(
                f'Scanned {results["scanned_projects"]} of {results["total_projects"]} projects. '
                f'Found {results["total_files_added"]} new files, '
                f'{results["total_files_modified"]} modified files, '
                f'{results["total_files_deleted"]} deleted files. '
                f'Total size: {results.get("total_size", 0)} bytes across {results.get("total_files", 0)} files.'
            )
        )

        if results["errors"]:
            self.stdout.write(self.style.WARNING("Errors encountered:"))
            for error in results["errors"]:
                self.stdout.write(
                    self.style.ERROR(f'  {error["project"]}: {error["error"]}')
                )
