from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ScanAllView

router = DefaultRouter()
router.register(r"roots", views.ProjectsRootViewSet)
router.register(r"projects", views.ProjectViewSet)

app_name = "core"

urlpatterns = [
    path("", include(router.urls)),
    path("scan-all/", ScanAllView.as_view(), name="scan-all"),
]
