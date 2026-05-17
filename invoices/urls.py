from django.urls import path
from . import views

urlpatterns = [
    path('invoice-generator/', views.invoice, name='invoice')
]