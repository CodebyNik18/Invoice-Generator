const glow = document.getElementById('glow');
if (glow) {
    document.addEventListener('mousemove', event => {
        glow.style.left = event.clientX + 'px';
        glow.style.top = event.clientY + 'px';
    });
}

const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
    });
}

function hideMessage(alert) {
    if (!alert || alert.classList.contains('is-hiding')) return;
    alert.classList.add('is-hiding');
    setTimeout(() => alert.remove(), 220);
}

document.querySelectorAll('.alert').forEach(alert => {
    alert.querySelector('.close-btn')?.addEventListener('click', () => hideMessage(alert));
    setTimeout(() => hideMessage(alert), 5000);
});

function togglePw(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const shouldShow = input.type === 'password';
    input.type = shouldShow ? 'text' : 'password';
    button?.setAttribute('aria-label', shouldShow ? 'Hide password' : 'Show password');
}

function checkStrength(value) {
    const bar = document.getElementById('pwBar');
    const label = document.getElementById('pwLabel');
    if (!bar || !label) return;

    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    const states = [
        { width: '0%', text: 'Enter a password', color: 'var(--terra)' },
        { width: '25%', text: 'Weak password', color: 'var(--terra)' },
        { width: '55%', text: 'Getting stronger', color: '#d99a21' },
        { width: '78%', text: 'Good password', color: 'var(--green)' },
        { width: '100%', text: 'Strong password', color: 'var(--green-dark)' },
    ];
    const state = value ? states[score] : states[0];

    bar.style.width = state.width;
    bar.style.background = state.color;
    label.textContent = state.text;
}
