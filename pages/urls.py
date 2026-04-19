from django.urls import path
from . import views

urlpatterns = [
    path('contact-us/', views.contact, name='contact'),
    path('privacy-policy/', views.privacy, name='privacy'),
    path('help/', views.help, name='help'),
    path('terms-and-conditions/', views.terms, name='terms'),
]