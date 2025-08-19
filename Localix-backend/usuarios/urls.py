from django.urls import path
from . import views

app_name = 'usuarios'

urlpatterns = [
    # Autenticación
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Gestión de usuarios (solo admin)
    path('usuarios/', views.UsuarioListView.as_view(), name='usuario_list'),
    path('usuarios/create/', views.UsuarioCreateView.as_view(), name='usuario_create'),
    path('usuarios/<int:pk>/', views.UsuarioDetailView.as_view(), name='usuario_detail'),
    path('usuarios/<int:user_id>/toggle-status/', views.toggle_user_status, name='toggle_user_status'),
    
    # URLs para gestión de uso
    path('usage/expired/', views.usage_expired, name='usage_expired'),
    path('usage/status/', views.UsageStatusView.as_view(), name='usage_status'),
    path('usage/dashboard/', views.usage_dashboard, name='usage_dashboard'),
]
