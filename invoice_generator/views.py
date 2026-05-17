from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone

def home(request):
    return render(request=request, template_name='index.html')