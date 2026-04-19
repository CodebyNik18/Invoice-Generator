/* Cursor glow */
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

/* Navbar */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20));

/* Hamburger */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger.addEventListener('click', () => { burger.classList.toggle('open'); mobileNav.classList.toggle('open'); });
function closeMobile() { burger.classList.remove('open'); mobileNav.classList.remove('open'); }

/* Modals */
function openModal(t) { document.getElementById(t + 'Modal').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(t) { document.getElementById(t + 'Modal').classList.remove('open'); document.body.style.overflow = ''; }
function switchModal(a, b) { closeModal(a); setTimeout(() => openModal(b), 260); }
function overlayClose(e, t) { if (e.target === e.currentTarget) closeModal(t); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal('login'); closeModal('signup'); document.body.style.overflow = ''; } });

/* Wire to Django — replace alerts with actual form submissions */
function doAuth(t) {
    /* Example Django redirect: window.location.href = t==='login' ? '/accounts/login/' : '/accounts/register/'; */
    alert(t === 'login' ? 'Redirect → /accounts/login/' : 'Redirect → /accounts/register/');
}

/* Scroll reveal */
const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), i * 80); io.unobserve(e.target); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));