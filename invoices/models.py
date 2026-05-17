from django.db import models
from django.contrib.auth.models import User


class Invoice(models.Model):
    # using FK for connecting user to its details
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)

    # Business Details
    logo = models.ImageField(upload_to='logo/', blank=True, null=True)
    from_name = models.CharField(max_length=200, blank=True, null=True)
    from_address = models.CharField(max_length=300, blank=True, null=True)
    from_email = models.EmailField(blank=True, null=True)
    from_phone = models.CharField(max_length=15, blank=True, null=True)

    # Client Details
    to_name = models.CharField(max_length=200, blank=True, null=True)
    to_email = models.EmailField(blank=True, null=True)
    to_address = models.CharField(max_length=300, blank=True, null=True)


class InvoiceDetails(models.Model):
    invoice = models.OneToOneField(to=Invoice, on_delete=models.CASCADE)
    pass #'invoice_number': ['INV-2026-001'], 'invoice_date': ['2026-05-17'], 'due_date': ['2026-06-16'], 'currency': ['₹'], 'po_number': ['']

class InvoiceItems(models.Model):
    invoice = models.ForeignKey(to=Invoice, on_delete=models.CASCADE)
    pass #'item_desc': ['', ''], 'item_qty': ['1', '1'], 'item_rate': ['0', '0'], 'item_id': ['1', '2'], 'item_amount': ['0.00', '0.00']

class InvoiceTotal(models.Model):
    invoice = models.OneToOneField(to=Invoice, on_delete=models.CASCADE)
    pass # 'tax_rate': ['18'], 'discount_rate': ['0'], 'subtotal': ['0.00'], 'tax_amount': ['0.00'], 'discount_amount': ['0.00'], 'total_amount': ['0.00']

class InvoiceTerms(models.Model):
    invoice = models.OneToOneField(to=Invoice, on_delete=models.CASCADE)
    pass # 'notes': [''], 'terms': ['']