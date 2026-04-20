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

function goToContact() {
    window.location.href = 'contact.html';
}

function focusSearch(term) {
    const input = document.getElementById('searchInput');
    input.value = term;
    filterArticles(term);
    input.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function filterArticles(q) {
    const value = q.trim().toLowerCase();
    const cards = document.querySelectorAll('.art-card');
    let visible = 0;

    cards.forEach((card) => {
        const text = (card.textContent + ' ' + (card.dataset.text || '')).toLowerCase();
        const show = !value || text.includes(value);
        card.style.display = show ? '' : 'none';
        if (show) visible += 1;
    });

    document.getElementById('noResults').classList.toggle('show', visible === 0 && value.length > 0);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('vis'), index * 70);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));