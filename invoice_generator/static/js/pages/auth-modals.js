function openModal(type) {
    document.getElementById(type + 'Modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(type) {
    document.getElementById(type + 'Modal').classList.remove('open');
    document.body.style.overflow = '';
}

function switchModal(fromType, toType) {
    closeModal(fromType);
    setTimeout(() => openModal(toType), 260);
}

function overlayClose(event, type) {
    if (event.target === event.currentTarget) {
        closeModal(type);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal('login');
        closeModal('signup');
        document.body.style.overflow = '';
    }
});

function doAuth(type) {
    alert(type === 'login' ? 'Redirect → /accounts/login/' : 'Redirect → /accounts/register/');
}
