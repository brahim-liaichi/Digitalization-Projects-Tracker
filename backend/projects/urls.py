from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"categories", views.TaskCategoryViewSet)
router.register(r"tasks", views.TaskViewSet)
router.register(r"comments", views.TaskCommentViewSet)

app_name = "projects"

urlpatterns = [
    path("", include(router.urls)),
]
