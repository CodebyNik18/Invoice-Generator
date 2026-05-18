from django.contrib import admin
from .models import Invoice, InvoiceDetails, InvoiceItems, InvoiceTerms, InvoiceTotal


admin.site.register(Invoice)
admin.site.register(InvoiceDetails)
admin.site.register(InvoiceItems)
admin.site.register(InvoiceTerms)
admin.site.register(InvoiceTotal)