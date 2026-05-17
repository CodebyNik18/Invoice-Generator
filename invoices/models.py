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

    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)


class InvoiceDetails(models.Model):
    invoice = models.OneToOneField(to=Invoice, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=100, blank=True, null=True)
    invoice_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    currency = models.CharField(max_length=10, blank=True, null=True)
    po_number = models.CharField(max_length=50, blank=True, null=True)

class InvoiceItems(models.Model):
    invoice = models.ForeignKey(to=Invoice, on_delete=models.CASCADE)
    item_desc = models.CharField(max_length=300, blank=True, null=True)
    item_qty = models.CharField(blank=True, null=True)
    item_rate = models.CharField(blank=True, null=True)
    item_id = models.CharField(blank=True, null=True)
    item_amount = models.CharField(blank=True, null=True)

class InvoiceTotal(models.Model):
    invoice = models.OneToOneField(to=Invoice, on_delete=models.CASCADE)
    pass # 'tax_rate': ['18'], 'discount_rate': ['0'], 'subtotal': ['0.00'], 'tax_amount': ['0.00'], 'discount_amount': ['0.00'], 'total_amount': ['0.00']

class InvoiceTerms(models.Model):
    invoice = models.OneToOneField(to=Invoice, on_delete=models.CASCADE)
    pass # 'notes': [''], 'terms': ['']