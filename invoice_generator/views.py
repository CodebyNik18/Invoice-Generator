from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request=request, template_name='index.html')

def login(request):
    return render(request=request, template_name='login.html')

def signup(request):
    return render(request=request, template_name='signin.html')