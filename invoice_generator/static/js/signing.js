/* ── Cursor glow ── */
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
}, { passive: true });

/* ── Nav scroll shadow ── */
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', scrollY > 5);
}, { passive: true });

/* ── Password show/hide ── */
function togglePw(inputId, btn) {
    const inp = document.getElementById(inputId);
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.innerHTML = isText
        ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

/* ── Password strength bar (visual only — real validation is Django) ── */
function checkStrength(val) {
    const bar = document.getElementById('pwBar');
    const label = document.getElementById('pwLabel');
    if (!val) { bar.style.width = '0%'; label.textContent = 'Enter a password'; return; }

    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
        { pct: '15%', color: '#d4663a', text: 'Too short' },
        { pct: '30%', color: '#e8826a', text: 'Weak' },
        { pct: '55%', color: '#e8b86a', text: 'Fair' },
        { pct: '75%', color: '#7aab8e', text: 'Good' },
        { pct: '100%', color: '#2e6b4a', text: 'Strong ✓' },
    ];
    const lvl = levels[Math.min(score, 4)];
    bar.style.width = lvl.pct;
    bar.style.background = lvl.color;
    label.textContent = lvl.text;
    label.style.color = lvl.color;
}