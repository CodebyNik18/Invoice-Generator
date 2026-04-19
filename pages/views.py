from django.shortcuts import render


def contact(request):
    return render(request=request, template_name="contact.html")

def help(request):
    return render(request=request, template_name="help.html")

def privacy(request):
    return render(request=request, template_name="privacy.html")

def terms(request):
    return render(request=request, template_name="terms.html")