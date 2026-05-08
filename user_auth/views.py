from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from user_auth.models import Profile
from django.contrib.auth import authenticate, login


def log_in(request):
    if request.method == 'POST':
        login_method = request.POST['login_method']
        if login_method == 'password':

            username = request.POST['email']
            password = request.POST['password']

            if not username or not password:
                messages.error(request, "Please Fill all Details for LogIn...")
                return redirect('log_in')

            user = authenticate(request=request, username=username, password=password)
            if user:
                login(request, user)
                return render(request=request, template_name="invoice.html")
            
            else:
                messages.error(request, "Invalid Credentials...")
                return redirect('log_in')
            
    return render(request=request, template_name='login.html')

def signup(request):
    if request.method == 'POST':

        #Getting Details of Form
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        business_name = request.POST['business_name']
        phone = request.POST['phone']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        agree_terms = request.POST.get('agree_terms')

        #Conditions Checking
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
        
        #Creating User
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