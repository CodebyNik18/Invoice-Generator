from django.urls import path
from . import views

urlpatterns = [
    path('log-in/', views.log_in, name='log_in'),
    path('sign-up/', views.signup, name='signin'),
]