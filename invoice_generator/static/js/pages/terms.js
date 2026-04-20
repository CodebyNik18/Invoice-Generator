const glow = document.getElementById('glow');
document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10));

const burger = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobMenu.classList.toggle('open');
});

function closeMob() {
    burger.classList.remove('open');
    mobMenu.classList.remove('open');
}