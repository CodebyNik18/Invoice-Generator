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

/* ── Tab switcher (Password ↔ OTP) ── */
function switchTab(tab) {
    const isPw = (tab === 'password');
    document.getElementById('tabPassword').classList.toggle('active', isPw);
    document.getElementById('tabOtp').classList.toggle('active', !isPw);
    document.getElementById('panelPassword').style.display = isPw ? '' : 'none';
    document.getElementById('panelOtp').style.display = isPw ? 'none' : '';
}

/* ── Password show/hide ── */
function togglePw(inputId, btn) {
    const inp = document.getElementById(inputId);
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    /* Swap eye / eye-off icon */
    btn.innerHTML = isText
        ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

/* ── OTP Step 1 → Step 2 visual transition ──
   Called after "Send OTP" form submits successfully.
   In practice Django re-renders the page with
   otpStep2 active. This JS version handles the
   same-page transition if you use AJAX later.
*/
function showOtpStep2(email) {
    document.getElementById('otpStep1').classList.remove('active');
    document.getElementById('otpStep1').style.display = 'none';
    document.getElementById('otpStep2').classList.add('active');
    document.getElementById('otpStep2').style.display = 'block';
    /* Show "sent to" strip */
    document.getElementById('otpStep2SentMsg').classList.add('show');
    document.getElementById('sentToEmail').textContent = email || 'your email';
    document.getElementById('hiddenOtpEmail').value = email || '';
    /* Start countdown */
    startCountdown(60);
    /* Focus first OTP box */
    document.getElementById('otp1').focus();
}

function goBackToStep1() {
    document.getElementById('otpStep2').style.display = 'none';
    document.getElementById('otpStep1').style.display = 'block';
}

/* ── OTP countdown timer (display only) ── */
let countdownTimer;
function startCountdown(seconds) {
    clearInterval(countdownTimer);
    let s = seconds;
    const el = document.getElementById('countdown');
    const resendBtn = document.getElementById('resendBtn');
    resendBtn.classList.remove('visible');
    el.closest('.resend-timer').style.display = '';
    countdownTimer = setInterval(() => {
        s--;
        el.textContent = s;
        if (s <= 0) {
            clearInterval(countdownTimer);
            el.closest('.resend-timer').style.display = 'none';
            resendBtn.classList.add('visible');
        }
    }, 1000);
}

/* ── Resend OTP ── */
function resendOtp() {
    /* Submit the request form again with the same email.
       Django handles rate-limiting and sending. */
    const email = document.getElementById('hiddenOtpEmail').value
        || document.getElementById('otp_email').value;
    const form = document.getElementById('otpRequestForm');
    document.getElementById('otp_email').value = email;
    form.submit();
}

/* ── OTP input: auto-advance and auto-fill combined field ── */
const otpInputs = document.querySelectorAll('.otp-fields input[type=text]');
otpInputs.forEach((inp, i) => {
    inp.addEventListener('input', e => {
        /* Keep only last digit typed */
        inp.value = inp.value.replace(/\D/g, '').slice(-1);
        inp.classList.toggle('filled', inp.value !== '');
        /* Advance to next box */
        if (inp.value && i < otpInputs.length - 1) otpInputs[i + 1].focus();
        /* Build combined hidden field — Django reads name="otp_code" */
        document.getElementById('otpCombined').value =
            [...otpInputs].map(x => x.value).join('');
    });

    inp.addEventListener('keydown', e => {
        /* Backspace: clear and go back */
        if (e.key === 'Backspace' && !inp.value && i > 0) {
            otpInputs[i - 1].value = '';
            otpInputs[i - 1].classList.remove('filled');
            otpInputs[i - 1].focus();
        }
        /* Arrow keys */
        if (e.key === 'ArrowLeft' && i > 0) otpInputs[i - 1].focus();
        if (e.key === 'ArrowRight' && i < otpInputs.length - 1) otpInputs[i + 1].focus();
    });

    /* Handle paste of full OTP (e.g. "123456") */
    inp.addEventListener('paste', e => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData)
            .getData('text').replace(/\D/g, '').slice(0, 6);
        pasted.split('').forEach((ch, j) => {
            if (otpInputs[j]) {
                otpInputs[j].value = ch;
                otpInputs[j].classList.add('filled');
            }
        });
        document.getElementById('otpCombined').value = pasted;
        /* Focus last filled box */
        const last = Math.min(pasted.length, otpInputs.length) - 1;
        if (otpInputs[last]) otpInputs[last].focus();
    });
});