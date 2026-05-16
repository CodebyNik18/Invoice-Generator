from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from user_auth.models import Profile
from django.contrib.auth import authenticate, login
from brevo import Brevo
from brevo.transactional_emails import SendTransacEmailRequestSender, SendTransacEmailRequestToItem
from dotenv import load_dotenv
import resend
import os
from faker import Faker

load_dotenv()

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
            
        if login_method == 'otp':

            username = request.POST['email']

            if not username:
                messages.error(request, "Please enter your Email for OTP verification...")
                return redirect('log_in')
            
            if not User.objects.filter(username=username).exists():
                messages.error(request, "Please enter valid Email...")
                return redirect('log_in')
            
            request.session['otp_email'] = username
            otp_sending(request)
            messages.success(request, "OTP has been sent to your Email...")
            return render(request, "otp_verify.html")
    return render(request=request, template_name='login.html')


def otp_sending(request):
    fake = Faker()
    otp = fake.random_number(fix_len=True, digits=6)
    username = request.session['otp_email']
    otp_email = f"""
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;color:#222;">

<h1 style="margin-bottom:10px;">InvoiceFlow</h1>

<p>Hi { username },</p>

<p>Use the verification code below to securely sign in to your account.</p>

<div style="margin:30px 0;text-align:center;">
    <div style="display:inline-block;background:#f5f5f5;padding:16px 32px;border-radius:10px;font-size:34px;font-weight:700;letter-spacing:8px;">
        { otp }
    </div>
</div>

<p>If you didn’t try to sign in, you can safely ignore this email.</p>

<br>

<p style="color:#666;font-size:13px;">
    — InvoiceFlow Security Team
</p>

</div>
        """
    client = Brevo(api_key=os.getenv("BREVO_API_KEY"))
    client.transactional_emails.send_transac_email(
        html_content=otp_email,
        sender=SendTransacEmailRequestSender(
            email=os.getenv('EMAIL'),
            name="InvoiceFlow",
        ),
        subject="OTP verification Email...",
        to=[
            SendTransacEmailRequestToItem(
                email=username,
            )
        ],
    )
            
def otp_verify(request):
    return render(request, 'otp_verify.html')


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

        user_email = f"""
<h2>Welcome to Invoice Generator 🚀</h2>

<p>Hi { first_name+last_name },</p>

<p>Thank you for creating an account with us! Your account has been successfully registered.</p>

<hr>

<h3>Your Account Details:</h3>
<p><strong>Email:</strong> { email }</p>
<p><strong>Business Name:</strong> { business_name }</p>
<p><strong>Phone:</strong> { phone }</p>
<hr>

<p>You can now start creating and managing your invoices.</p>


<br>

<p>If you did not create this account, please ignore this email.</p>

<hr>

<p style="font-size:12px;color:gray;">
This is an automated message. Please do not reply.
</p>
"""     
        admin_email = f"""
<h2>New User Registration 🚀</h2>

<p>A new user has created an account on your website.</p>

<hr>

<h3>User Details:</h3>
<p><strong>Name:</strong> { first_name+last_name }</p>
<p><strong>Email:</strong> { email }</p>
<p><strong>Business Name:</strong> { business_name }</p>
<p><strong>Phone:</strong> { phone }</p>

<hr>

<p>
You may want to monitor this account or take any necessary action.
</p>

<hr>

<p style="font-size:12px;color:gray;">
System Notification - Invoice Generator
</p>
"""
        client = Brevo(api_key=os.getenv("BREVO_API_KEY"))
        client.transactional_emails.send_transac_email(
            html_content=user_email,
            sender=SendTransacEmailRequestSender(
                email=os.getenv('EMAIL'),
                name="InvoiceFlow",
            ),
            subject="Account Creation Successful...",
            to=[
                SendTransacEmailRequestToItem(
                    email=email,
                    name=first_name,
                )
            ],
        )
        resend.api_key = os.getenv("RESEND_API_KEY")
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": [os.getenv("EMAIL")],
            'subject': "New Account Creation",
            'html': admin_email
        })
        messages.success(request=request, message="Account Created Successfully, You can Login now...")
        return redirect('signin')
    return render(request=request, template_name='signin.html')
