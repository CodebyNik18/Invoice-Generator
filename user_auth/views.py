from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from user_auth.models import Profile


def login(request):
    return render(request=request, template_name='login.html')

def signup(request):
    if request.method == 'POST':

        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        business_name = request.POST['business_name']
        phone = request.POST['phone']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        agree_terms = request.POST.get('agree_terms')

        if not first_name or not email or not password1 or not password2:
            messages.error(request=request, message="All '*' fields are required...")
            return redirect('signin')
        
        if not agree_terms:
            messages.error(request=request, message="Please Agree to Terms and Policy...")
            return redirect('signin')
        
        if password1 != password2:
            messages.error(request=request, message="Password didn't match. Try Again...")
            return redirect('signin')

        if User.objects.filter(email=email).exists():
            messages.error(request=request, message="This Email already Exists...")
            return redirect('signin')
        
        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=email,
            email=email,
            password=password1
        )
        Profile.objects.create(
            user=user,
            business_name=business_name,
            phone=phone
        )

        messages.success(request=request, message="Account Created Successfully, You can Login now...")
        return redirect('signin')
    return render(request=request, template_name='signin.html')