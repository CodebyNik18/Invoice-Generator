from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Invoice, InvoiceDetails, InvoiceTerms, InvoiceTotal, InvoiceItems


@login_required(login_url='log_in')
def invoice(request):
    if request.method == 'POST':
        
        user = request.user
        # Invoice
        logo = request.FILES.get('logo', '')

        from_name = request.POST.get('from_name', '')
        from_address = request.POST.get('from_address', '')
        from_email = request.POST.get('from_email', '')
        from_phone = request.POST.get('from_phone', '')

        to_name = request.POST.get('to_name', '')
        to_email = request.POST.get('to_email', '')
        to_address = request.POST.get('to_address', '')

        #InvoiceDetails
        invoice_number = request.POST.get('invoice_number', '')
        po_number = request.POST.get('po_number', '')

        invoice_date = request.POST.get('invoice_date', '')
        due_date = request.POST.get('due_date', '')

        currency = request.POST.get('currency', '')

        #InvoiceItems
        item_desc = request.POST.getlist('item_desc')
        item_qty = request.POST.getlist('item_qty')
        item_rate = request.POST.getlist('item_rate')
        item_id = request.POST.getlist('item_id')
        item_amount = request.POST.getlist('item_amount')

        #InvoiceTotal
        tax_rate = request.POST.get('tax_rate', '')
        discount_rate = request.POST.get('discount_rate', '')
        subtotal = request.POST.get('subtotal', '')

        tax_amount = request.POST.get('tax_amount', '')
        discount_amount = request.POST.get('discount_amount', '')
        total_amount = request.POST.get('total_amount', '')

        #Invoice Terms
        notes = request.POST.get('notes', '')
        terms = request.POST.get('terms', '')

        invoice = Invoice.objects.create(
            user=user,
            logo=logo,
            from_name=from_name,
            from_address=from_address,
            from_email=from_email,
            from_phone=from_phone,
            to_name=to_name,
            to_address=to_address,
            to_email=to_email
        )
        InvoiceDetails.objects.create(
            invoice=invoice,
            invoice_number=invoice_number,
            po_number=po_number,
            invoice_date=invoice_date,
            due_date=due_date,
            currency=currency
        )
        InvoiceItems.objects.create(
            invoice=invoice,
            item_desc=item_desc,
            item_qty=item_qty,
            item_rate=item_rate,
            item_id=item_id,
            item_amount=item_amount
        )
        InvoiceTotal.objects.create(
            invoice=invoice,
            tax_rate=tax_rate,
            discount_rate=discount_rate,
            subtotal=subtotal,
            tax_amount=tax_amount,
            discount_amount=discount_amount,
            total_amount=total_amount
        )
        InvoiceTerms.objects.create(
            invoice=invoice,
            notes=notes,
            terms=terms
        )

    return render(request=request, template_name='invoice.html')
