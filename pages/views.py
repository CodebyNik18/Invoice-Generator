from django.shortcuts import render, redirect
from django.contrib import messages
import resend
import os

def help(request):
    return render(request=request, template_name="help.html")

def privacy(request):
    return render(request=request, template_name="privacy.html")

def terms(request):
    return render(request=request, template_name="terms.html")

resend.api_key = os.getenv('RESEND_API_KEY')

def contact(request):

    if request.method == 'POST':

        first_name = request.POST.get('firstname', '')
        last_name = request.POST.get('lastname', '')
        full_name = first_name+last_name
        email = request.POST.get('email', '')
        topic = request.POST.get('topic', '')
        message = request.POST.get('message', '')


        if not first_name or not email or not topic:
            messages.error(request=request, message="All '*' are required...")
            return redirect('contact')
        
        email_message = f"""
Hello Admin,

You have received a new message from your website contact form.

---

## Sender Details:

Name   : { full_name }
Email  : { email }
Topic  : { topic }

---

## Message:

{ message }

---

Please respond to the user at their email address above.

This is an automated notification from your website.
"""
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": ["contact.aigr0@gmail.com"],
            "subject": "New Contact Form",
            "text": email_message,
        })
        
        messages.success(request=request, message="Message sent successfully, Our Team will Contact You...")
        return redirect('contact')
    return render(request=request, template_name="contact.html")