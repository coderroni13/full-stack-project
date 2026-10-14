from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.get_csrf_token, name='api_csrf'),
    path('register/', views.register_user, name='api_register'),
    path('login/', views.login_user, name='api_login'),
    path('logout/', views.logout_user, name='api_logout'),
    path('profile/', views.get_profile, name='api_profile'),
    path('deposit/', views.deposit_funds, name='api_deposit'),
    path('withdraw/', views.withdraw_funds, name='api_withdraw'),
    path('transfer/', views.transfer_funds, name='api_transfer'),
]

