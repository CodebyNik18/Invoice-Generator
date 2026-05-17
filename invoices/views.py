from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url='log_in')
def invoice(request):
    print(request.user)
    if request.method == 'POST':
        print(request.POST)
        print(request.FILES)

        logo = request.FILES.get('logo')
        if logo:
            print(f'Logo uploaded: {logo.name} ({logo.content_type}, {logo.size} bytes)')

    return render(request=request, template_name='invoice.html')
