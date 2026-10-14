from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('dashboard/', login_required(TemplateView.as_view(template_name='dashboard.html'), login_url='/'), name='dashboard'),
    path('api/', include('api.urls')),
]
