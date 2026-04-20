/* Cursor glow */
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

/* Navbar scroll */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10));

/* Hamburger */
const burger = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
burger.addEventListener('click', () => { burger.classList.toggle('open'); mobMenu.classList.toggle('open'); });
function closeMob() { burger.classList.remove('open'); mobMenu.classList.remove('open'); }

/* FAQ accordion */
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

/* Form submit */
function submitForm() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3800);
    /* Wire to Django: document.querySelector('form').submit(); */
}

/* Scroll reveal */
const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('vis'), i * 70);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));