from django.urls import path
from . import views

urlpatterns = [
    path('log-in/', views.login, name='login'),
    path('sign-up/', views.signup, name='signin'),
]