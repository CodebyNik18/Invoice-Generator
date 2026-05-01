from django.shortcuts import render


def login(request):
    return render(request=request, template_name='login.html')

def signup(request):
    return render(request=request, template_name='signin.html')