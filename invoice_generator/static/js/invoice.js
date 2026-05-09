/* ─────────────────────────────────────────────
           STATE
        ───────────────────────────────────────────── */
let items = [];
let itemId = 0;

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    // Set today's date and due date (+30 days)
    const today = new Date();
    const due = new Date(); due.setDate(due.getDate() + 30);
    document.getElementById('invDate').value = fmt(today);
    document.getElementById('invDue').value = fmt(due);

    // Load from localStorage if available
    const saved = localStorage.getItem('invoiceflow_draft');
    if (saved) {
        try { restoreState(JSON.parse(saved)); }
        catch (e) { /* fresh start */ }
    }

    // Start with 2 blank items
    if (items.length === 0) { addItem(); addItem(); }

    update();

    // Nav scroll
    window.addEventListener('scroll', () => {
        document.getElementById('nav').classList.toggle('scrolled', scrollY > 5);
    }, { passive: true });
});

function fmt(d) {
    return d.toISOString().split('T')[0];
}

/* ─────────────────────────────────────────────
   SECTION TOGGLE
───────────────────────────────────────────── */
function toggleSection(header) {
    const body = header.nextElementSibling;
    const arrow = header.querySelector('.fs-toggle');
    const collapsed = body.classList.toggle('collapsed');
    arrow.style.transform = collapsed ? 'rotate(-90deg)' : '';
}

/* ─────────────────────────────────────────────
   LINE ITEMS
───────────────────────────────────────────── */
function addItem() {
    const id = ++itemId;
    items.push({ id, desc: '', qty: 1, rate: 0 });
    renderItems();
}

function removeItem(id) {
    items = items.filter(i => i.id !== id);
    renderItems();
    update();
}

function renderItems() {
    const tbody = document.getElementById('itemsBody');
    tbody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td class="item-desc">
        <input type="text" placeholder="Service or product description"
          value="${esc(item.desc)}"
          oninput="itemChange(${item.id},'desc',this.value)"
          style="width:100%"/>
      </td>
      <td class="item-num">
        <input type="number" value="${item.qty}" min="0" step="0.5"
          oninput="itemChange(${item.id},'qty',this.value)"
          style="width:100%;text-align:right"/>
      </td>
      <td class="item-num">
        <input type="number" value="${item.rate}" min="0"
          oninput="itemChange(${item.id},'rate',this.value)"
          style="width:100%;text-align:right"/>
      </td>
      <td class="item-amount">${getCur()}${num(item.qty * item.rate)}</td>
      <td style="text-align:center">
        <button class="del-btn" onclick="removeItem(${item.id})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </td>`;
        tbody.appendChild(tr);
    });
}

function itemChange(id, field, val) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (field === 'desc') item.desc = val;
    else item[field] = parseFloat(val) || 0;
    update();
}

/* ─────────────────────────────────────────────
   UPDATE PREVIEW
───────────────────────────────────────────── */
function update() {
    const cur = getCur();
    const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const discRate = parseFloat(document.getElementById('discRate').value) || 0;
    const tax = subtotal * taxRate / 100;
    const disc = subtotal * discRate / 100;
    const total = subtotal + tax - disc;

    // Form totals
    document.getElementById('fSubtotal').textContent = cur + num(subtotal);
    document.getElementById('fTax').textContent = cur + num(tax);
    document.getElementById('fDisc').textContent = '-' + cur + num(disc);
    document.getElementById('fTotal').textContent = cur + num(total);

    // ── PREVIEW ──
    // From
    const fromName = v('fromName'), fromAddr = v('fromAddr'), fromEmail = v('fromEmail'), fromPhone = v('fromPhone');
    const fromLines = [fromName, fromAddr, fromEmail, fromPhone].filter(Boolean).join('\n');
    const prevFrom = document.getElementById('prevFrom');
    if (fromLines) { prevFrom.textContent = fromLines; prevFrom.style.color = ''; prevFrom.style.fontStyle = ''; prevFrom.style.fontSize = ''; }
    else { prevFrom.textContent = 'Your business details'; prevFrom.style.color = 'rgba(26,46,32,.4)'; prevFrom.style.fontStyle = 'italic'; prevFrom.style.fontSize = '.78rem'; }

    // To
    const toName = v('toName'), toAddr = v('toAddr'), toEmail = v('toEmail');
    const toLines = [toName, toAddr, toEmail].filter(Boolean).join('\n');
    const prevTo = document.getElementById('prevTo');
    if (toLines) { prevTo.textContent = toLines; prevTo.style.color = ''; prevTo.style.fontStyle = ''; prevTo.style.fontSize = ''; }
    else { prevTo.textContent = 'Client details'; prevTo.style.color = 'rgba(26,46,32,.4)'; prevTo.style.fontStyle = 'italic'; prevTo.style.fontSize = '.78rem'; }

    // Invoice number & PO
    document.getElementById('prevNum').textContent = '#' + (v('invNum') || 'INV-2026-001');
    const po = v('poNum');
    document.getElementById('prevPoWrap').style.display = po ? '' : 'none';
    document.getElementById('prevPo').textContent = po;

    // Dates
    const invDate = v('invDate'), invDue = v('invDue');
    document.getElementById('prevDate').textContent = invDate ? fmtDisplay(invDate) : '—';
    document.getElementById('prevDue').textContent = invDue ? fmtDisplay(invDue) : '—';

    // Items in preview table
    const prevItems = document.getElementById('prevItems');
    prevItems.innerHTML = '';
    if (items.length === 0) {
        prevItems.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:1.2rem;color:rgba(26,46,32,.3);font-size:.8rem;font-style:italic">No items added yet</td></tr>`;
    } else {
        items.forEach(item => {
            const tr = document.createElement('tr');
            const amt = item.qty * item.rate;
            tr.innerHTML = `
        <td>${esc(item.desc) || '<span style="color:rgba(26,46,32,.3);font-style:italic">Untitled item</span>'}</td>
        <td style="text-align:right">${item.qty}</td>
        <td style="text-align:right">${cur}${num(item.rate)}</td>
        <td>${cur}${num(amt)}</td>`;
            prevItems.appendChild(tr);
        });
    }

    // Totals
    document.getElementById('prevSubtotal').textContent = cur + num(subtotal);
    document.getElementById('prevTaxLabel').textContent = `Tax (${taxRate}%)`;
    document.getElementById('prevTax').textContent = cur + num(tax);
    document.getElementById('prevDiscRow').style.display = discRate > 0 ? '' : 'none';
    document.getElementById('prevDiscLabel').textContent = `Discount (${discRate}%)`;
    document.getElementById('prevDisc').textContent = '-' + cur + num(disc);
    document.getElementById('prevTotal').textContent = cur + num(total);

    // Notes & Terms
    const notes = v('notes'), terms = v('terms');
    const notesWrap = document.getElementById('prevNotesWrap');
    if (notes || terms) {
        notesWrap.style.display = '';
        document.getElementById('prevNotes').textContent = notes;
        document.getElementById('prevTerms').textContent = terms;
        document.getElementById('prevNotes').style.display = notes ? '' : 'none';
        document.getElementById('prevTerms').style.display = terms ? '' : 'none';
    } else {
        notesWrap.style.display = 'none';
    }

    // Also update item row amounts in form
    document.querySelectorAll('#itemsBody tr').forEach((tr, i) => {
        const amtCell = tr.querySelector('.item-amount');
        if (amtCell && items[i]) amtCell.textContent = cur + num(items[i].qty * items[i].rate);
    });

    autoSave();
}

function fmtDisplay(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ─────────────────────────────────────────────
   LOGO
───────────────────────────────────────────── */
function uploadLogo(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const src = e.target.result;
        // form preview
        document.getElementById('logoPreview').src = src;
        document.getElementById('logoPreview').style.display = 'block';
        document.getElementById('logoIcon').style.display = 'none';
        document.getElementById('logoText').style.display = 'none';
        // invoice preview
        const prevLogo = document.getElementById('prevLogo');
        const placeholder = document.querySelector('.inv-logo-placeholder');
        prevLogo.src = src;
        prevLogo.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
        localStorage.setItem('invoiceflow_logo', src);
    };
    reader.readAsDataURL(file);
}

/* ─────────────────────────────────────────────
   AUTO-SAVE
───────────────────────────────────────────── */
let saveTimer;
function autoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        const state = getState();
        localStorage.setItem('invoiceflow_draft', JSON.stringify(state));
    }, 800);
}

function getState() {
    return {
        fromName: v('fromName'), fromAddr: v('fromAddr'), fromEmail: v('fromEmail'), fromPhone: v('fromPhone'),
        toName: v('toName'), toAddr: v('toAddr'), toEmail: v('toEmail'),
        invNum: v('invNum'), invDate: v('invDate'), invDue: v('invDue'), poNum: v('poNum'),
        currency: document.getElementById('currency').value,
        taxRate: v('taxRate'), discRate: v('discRate'),
        notes: v('notes'), terms: v('terms'),
        items: items.map(i => ({ ...i }))
    };
}

function restoreState(s) {
    const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
    set('fromName', s.fromName); set('fromAddr', s.fromAddr); set('fromEmail', s.fromEmail); set('fromPhone', s.fromPhone);
    set('toName', s.toName); set('toAddr', s.toAddr); set('toEmail', s.toEmail);
    set('invNum', s.invNum); set('invDate', s.invDate); set('invDue', s.invDue); set('poNum', s.poNum);
    set('currency', s.currency); set('taxRate', s.taxRate); set('discRate', s.discRate);
    set('notes', s.notes); set('terms', s.terms);
    if (s.items && s.items.length) {
        items = s.items;
        itemId = Math.max(...items.map(i => i.id), 0);
        renderItems();
    }
    // Logo
    const logo = localStorage.getItem('invoiceflow_logo');
    if (logo) {
        document.getElementById('logoPreview').src = logo;
        document.getElementById('logoPreview').style.display = 'block';
        document.getElementById('logoIcon').style.display = 'none';
        document.getElementById('logoText').style.display = 'none';
        document.getElementById('prevLogo').src = logo;
        document.getElementById('prevLogo').style.display = 'block';
        const ph = document.querySelector('.inv-logo-placeholder');
        if (ph) ph.style.display = 'none';
    }
}

function saveDraft() {
    autoSave();
    toast('Draft saved successfully!', 'green');
    /* Wire to Django: fetch('/api/invoices/save/', { method:'POST', body:JSON.stringify(getState()) }) */
}

function clearForm() {
    if (!confirm('Reset all fields? This cannot be undone.')) return;
    localStorage.removeItem('invoiceflow_draft');
    localStorage.removeItem('invoiceflow_logo');
    location.reload();
}

/* ─────────────────────────────────────────────
   PDF DOWNLOAD (jsPDF)
───────────────────────────────────────────── */
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const cur = getCur();
    const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
    const taxRate = parseFloat(v('taxRate')) || 0;
    const discRate = parseFloat(v('discRate')) || 0;
    const tax = subtotal * taxRate / 100;
    const disc = subtotal * discRate / 100;
    const total = subtotal + tax - disc;
    const W = 210, pad = 18;
    let y = pad;

    // Header bar
    doc.setFillColor(26, 46, 32);
    doc.rect(0, 0, W, 28, 'F');

    // INVOICE text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE', pad, 17);

    // Invoice number
    doc.setFontSize(9);
    doc.setTextColor(180, 220, 200);
    doc.text('#' + (v('invNum') || 'INV-2026-001'), W - pad, 11, { align: 'right' });
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text('Date: ' + (v('invDate') ? fmtDisplay(v('invDate')) : '—'), W - pad, 17, { align: 'right' });
    doc.text('Due:  ' + (v('invDue') ? fmtDisplay(v('invDue')) : '—'), W - pad, 23, { align: 'right' });

    y = 38;

    // FROM / TO
    doc.setTextColor(26, 46, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text('FROM', pad, y);
    doc.text('BILL TO', W / 2 + 2, y);
    y += 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(26, 46, 32);
    const fromName = v('fromName') || 'Your Business';
    const toName = v('toName') || 'Client Name';
    doc.text(fromName, pad, y);
    doc.text(toName, W / 2 + 2, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80);
    const fromLines = [v('fromAddr'), v('fromEmail'), v('fromPhone')].filter(Boolean);
    const toLines = [v('toAddr'), v('toEmail')].filter(Boolean);
    const maxLines = Math.max(fromLines.length, toLines.length);
    for (let i = 0; i < maxLines; i++) {
        if (fromLines[i]) doc.text(fromLines[i], pad, y);
        if (toLines[i]) doc.text(toLines[i], W / 2 + 2, y);
        y += 4.5;
    }

    y += 5;

    // Items table header
    doc.setFillColor(26, 46, 32);
    doc.rect(pad, y, W - pad * 2, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(200, 220, 210);
    doc.text('DESCRIPTION', pad + 2, y + 4.5);
    doc.text('QTY', W - 85, y + 4.5, { align: 'right' });
    doc.text('RATE', W - 58, y + 4.5, { align: 'right' });
    doc.text('AMOUNT', W - pad, y + 4.5, { align: 'right' });
    y += 10;

    // Items
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    items.forEach((item, idx) => {
        if (idx % 2 === 0) { doc.setFillColor(248, 248, 248); doc.rect(pad, y - 3, W - pad * 2, 7, 'F'); }
        doc.setTextColor(30);
        doc.text(item.desc || 'Untitled item', pad + 2, y + 1.5);
        doc.setTextColor(80);
        doc.text(String(item.qty), W - 85, y + 1.5, { align: 'right' });
        doc.text(cur + num(item.rate), W - 58, y + 1.5, { align: 'right' });
        doc.setTextColor(26, 46, 32);
        doc.setFont('helvetica', 'bold');
        doc.text(cur + num(item.qty * item.rate), W - pad, y + 1.5, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        y += 7;
    });

    y += 4;

    // Totals block
    const tCol = W - pad - 50;
    doc.setDrawColor(220);
    doc.line(tCol, y, W - pad, y);
    y += 5;

    const tRow = (label, val, bold) => {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100);
        doc.text(label, tCol, y);
        doc.setTextColor(26, 46, 32);
        doc.text(val, W - pad, y, { align: 'right' });
        y += 5.5;
    };
    tRow('Subtotal', cur + num(subtotal));
    tRow(`Tax (${taxRate}%)`, cur + num(tax));
    if (discRate > 0) tRow(`Discount (${discRate}%)`, '-' + cur + num(disc));

    y += 1;
    doc.setFillColor(26, 46, 32);
    doc.roundedRect(tCol - 4, y - 4, W - pad - tCol + 4 + pad, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Total Due', tCol, y + 2.5);
    doc.setFontSize(11);
    doc.text(cur + num(total), W - pad, y + 2.5, { align: 'right' });
    y += 14;

    // Notes
    const notes = v('notes'), terms = v('terms');
    if (notes || terms) {
        doc.setDrawColor(220); doc.line(pad, y, W - pad, y); y += 5;
        if (notes) {
            doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(100);
            doc.text('NOTES', pad, y); y += 4;
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(80);
            const wrapped = doc.splitTextToSize(notes, W - pad * 2);
            doc.text(wrapped, pad, y); y += wrapped.length * 4.5;
        }
        if (terms) {
            y += 2;
            doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(100);
            doc.text('TERMS', pad, y); y += 4;
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120);
            const wt = doc.splitTextToSize(terms, W - pad * 2);
            doc.text(wt, pad, y);
        }
    }

    // Footer
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(160);
    doc.text('Generated with InvoiceFlow · invoiceflow.in', W / 2, 290, { align: 'center' });

    const fname = 'Invoice-' + (v('invNum') || 'draft').replace(/\s/g, '-') + '.pdf';
    doc.save(fname);
    toast('PDF downloaded!', 'green');
}

function printInvoice() {
    window.print();
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => toast('Link copied!', 'green'));
}

/* ─────────────────────────────────────────────
   MOBILE TABS
───────────────────────────────────────────── */
function showTab(tab) {
    const form = document.getElementById('panelForm');
    const preview = document.getElementById('panelPreview');
    const tForm = document.getElementById('tabForm');
    const tPrev = document.getElementById('tabPreview');
    if (tab === 'form') {
        form.classList.remove('mob-hidden');
        preview.classList.add('mob-hidden');
        tForm.classList.add('active');
        tPrev.classList.remove('active');
    } else {
        form.classList.add('mob-hidden');
        preview.classList.remove('mob-hidden');
        tForm.classList.remove('active');
        tPrev.classList.add('active');
    }
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
let toastTimer;
function toast(msg, type) {
    const el = document.getElementById('toast');
    const msgEl = document.getElementById('toastMsg');
    msgEl.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function v(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function num(n) { return (parseFloat(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function getCur() { const el = document.getElementById('currency'); return el ? el.value : '₹'; }

/* ─────────────────────────────────────────────
   PRINT STYLES (inline)
───────────────────────────────────────────── */
const printStyle = document.createElement('style');
printStyle.textContent = `
@media print {
  nav, .panel-form, .preview-label, .preview-actions, .mob-tabs, #glow, .toast { display:none!important; }
  .app { height:auto!important; padding-top:0!important; }
  .panel-preview { padding:0!important; background:#fff!important; }
  .invoice-sheet { box-shadow:none!important; border-radius:0!important; max-width:100%!important; }
  body { background:#fff!important; }
}`;
document.head.appendChild(printStyle);