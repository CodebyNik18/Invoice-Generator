from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone

def home(request):
    return render(request=request, template_name='index.html')

@login_required(login_url='log_in')
def invoice(request):
    print(request.user)
    return render(request=request, template_name='invoice.html')