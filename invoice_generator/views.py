from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request=request, template_name='index.html')

def login(request):
    return HttpResponse("Login")

def signup(request):
    return HttpResponse("SignUp")