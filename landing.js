// ============= Landing Page Specific JavaScript =============
// Note: Toast function is provided by script.js as window.toast / window.showToast

// Exit Intent Popup
let exitIntentShown = false;
const exitPopup = document.getElementById('exitPopup');
const exitPopupClose = document.getElementById('exitPopupClose');
const exitPopupForm = document.getElementById('exitPopupForm');

// Show popup when mouse leaves viewport
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0 && !exitIntentShown && !sessionStorage.getItem('exitPopupShown')) {
        showExitPopup();
    }
});

// Show popup on mobile when user tries to scroll up at top
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0 && lastScrollTop > 50 && !exitIntentShown && !sessionStorage.getItem('exitPopupShown')) {
        setTimeout(() => {
            if (window.pageYOffset === 0) {
                showExitPopup();
            }
        }, 500);
    }
    lastScrollTop = scrollTop;
});

function showExitPopup() {
    if (exitPopup) {
        exitPopup.classList.add('active');
        exitIntentShown = true;
        sessionStorage.setItem('exitPopupShown', 'true');
    }
}

function hideExitPopup() {
    if (exitPopup) exitPopup.classList.remove('active');
}

if (exitPopupClose) {
    exitPopupClose.addEventListener('click', hideExitPopup);
}

if (exitPopup) {
    const overlay = exitPopup.querySelector('.exit-popup-overlay');
    if (overlay) overlay.addEventListener('click', hideExitPopup);
}

if (exitPopupForm) {
    exitPopupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = exitPopupForm.querySelector('input[name="email"]').value;
        if (window.showToast) window.showToast('Success! Check your email for both guides.');
        hideExitPopup();
        console.log('Exit popup email:', email);
    });
}

// ============= Price Estimator =============
let selectedTransactions = 0;

document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        selectedTransactions = parseInt(this.dataset.value);
        const nextStep = this.dataset.next;
        const currentActive = document.querySelector('.form-step.active');
        if (currentActive) currentActive.classList.remove('active');
        const nextEl = document.querySelector(`[data-step="${nextStep}"]`);
        if (nextEl) nextEl.classList.add('active');
    });
});

const calculateBtn = document.getElementById('calculatePrice');
if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[name="service"]:checked');
        let servicesTotal = 0;
        checkboxes.forEach(cb => { servicesTotal += parseInt(cb.value); });

        let basePrice = 0;
        if (selectedTransactions <= 50) basePrice = 299;
        else if (selectedTransactions <= 150) basePrice = 399;
        else if (selectedTransactions <= 300) basePrice = 549;
        else basePrice = 699;

        const totalPrice = basePrice + servicesTotal;
        let plan = 'Essentials';
        if (totalPrice >= 500 && totalPrice < 700) plan = 'Professional';
        else if (totalPrice >= 700) plan = 'Enterprise';

        const estimatedAmount = document.getElementById('estimatedAmount');
        const recommendedPlan = document.getElementById('recommendedPlan');
        const priceResult = document.getElementById('priceResult');
        const estimatorForm = document.querySelector('.estimator-form');

        if (estimatedAmount) estimatedAmount.textContent = totalPrice;
        if (recommendedPlan) recommendedPlan.textContent = plan;
        if (estimatorForm) estimatorForm.style.display = 'none';
        if (priceResult) {
            priceResult.style.display = 'block';
            priceResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

const resetBtn = document.getElementById('resetCalculator');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        selectedTransactions = 0;
        document.querySelectorAll('input[name="service"]').forEach(cb => {
            cb.checked = cb.value === '50';
        });

        const priceResult = document.getElementById('priceResult');
        const estimatorForm = document.querySelector('.estimator-form');
        if (estimatorForm) estimatorForm.style.display = 'block';
        if (priceResult) priceResult.style.display = 'none';

        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        const step1 = document.querySelector('[data-step="1"]');
        if (step1) step1.classList.add('active');
        if (estimatorForm) estimatorForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// ============= Simple Download Forms =============
document.querySelectorAll('.simple-download-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.querySelector('input[name="email"]').value;
        const guide = form.dataset.guide;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, type: 'resource-download', guide })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            if (window.showToast) window.showToast('Success! Check your email for your free guide.');
            form.reset();
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Sent!';
            submitBtn.style.background = '#4CAF50';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Download form error:', error);
            if (window.showToast) window.showToast('Sorry, something went wrong. Please try again or email us directly.', true);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});

// ============= Track User Engagement =============
let timeOnPage = 0;
setInterval(() => {
    timeOnPage++;
    if (timeOnPage === 30 && !exitIntentShown && !sessionStorage.getItem('exitPopupShown')) {
        showExitPopup();
    }
}, 1000);

console.log('Landing page scripts loaded successfully!');
