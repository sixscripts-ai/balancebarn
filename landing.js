// ============= Landing Page Specific JavaScript =============

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
    exitPopup.classList.add('active');
    exitIntentShown = true;
    sessionStorage.setItem('exitPopupShown', 'true');
}

function hideExitPopup() {
    exitPopup.classList.remove('active');
}

if (exitPopupClose) {
    exitPopupClose.addEventListener('click', hideExitPopup);
}

// Close popup when clicking overlay
if (exitPopup) {
    exitPopup.querySelector('.exit-popup-overlay').addEventListener('click', hideExitPopup);
}

// Handle exit popup form submission
if (exitPopupForm) {
    exitPopupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = exitPopupForm.querySelector('input[name="email"]').value;

        // Show success message
        toast('Success! Check your email for both guides.');
        hideExitPopup();

        // Here you would send the email to your backend
        console.log('Exit popup email:', email);
    });
}

// ============= Price Estimator =============
let selectedTransactions = 0;
let selectedServices = [];

// Handle transaction selection
document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        selectedTransactions = parseInt(this.dataset.value);
        const nextStep = this.dataset.next;

        // Hide current step
        document.querySelector('.form-step.active').classList.remove('active');

        // Show next step
        document.querySelector(`[data-step="${nextStep}"]`).classList.add('active');
    });
});

// Calculate price button
const calculateBtn = document.getElementById('calculatePrice');
if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        // Get selected services
        const checkboxes = document.querySelectorAll('input[name="service"]:checked');
        let servicesTotal = 0;
        checkboxes.forEach(cb => {
            servicesTotal += parseInt(cb.value);
        });

        // Calculate base price from transactions
        let basePrice = 0;
        if (selectedTransactions <= 50) {
            basePrice = 299;
        } else if (selectedTransactions <= 150) {
            basePrice = 399;
        } else if (selectedTransactions <= 300) {
            basePrice = 549;
        } else {
            basePrice = 699;
        }

        const totalPrice = basePrice + servicesTotal;

        // Determine recommended plan
        let plan = 'Essentials';
        if (totalPrice >= 500 && totalPrice < 700) {
            plan = 'Professional';
        } else if (totalPrice >= 700) {
            plan = 'Enterprise';
        }

        // Show result
        document.getElementById('estimatedAmount').textContent = totalPrice;
        document.getElementById('recommendedPlan').textContent = plan;

        // Hide form, show result
        document.querySelector('.estimator-form').style.display = 'none';
        document.getElementById('priceResult').style.display = 'block';

        // Scroll to result
        document.getElementById('priceResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Reset calculator
const resetBtn = document.getElementById('resetCalculator');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        // Reset selections
        selectedTransactions = 0;
        document.querySelectorAll('input[name="service"]').forEach(cb => {
            if (cb.value === '50') {
                cb.checked = true;
            } else {
                cb.checked = false;
            }
        });

        // Show form, hide result
        document.querySelector('.estimator-form').style.display = 'block';
        document.getElementById('priceResult').style.display = 'none';

        // Go back to step 1
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.querySelector('[data-step="1"]').classList.add('active');

        // Scroll to form
        document.querySelector('.estimator-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Send data to your backend
            const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    type: 'resource-download',
                    guide: guide
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            // Show success
            toast('Success! Check your email for your free guide.');
            form.reset();

            // Change button to success state
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Sent!';
            submitBtn.style.background = '#4CAF50';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Download form error:', error);
            toast('Sorry, something went wrong. Please try again or email us directly.', true);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});

// ============= Smooth Scroll for Anchor Links =============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============= Toast Notification Function =============
function toast(message, isError = false) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${isError ? '#f44336' : '#4CAF50'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10001;
        font-size: 15px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ============= Track User Engagement =============
let timeOnPage = 0;
setInterval(() => {
    timeOnPage++;

    // Show exit popup after 30 seconds if not shown yet
    if (timeOnPage === 30 && !exitIntentShown && !sessionStorage.getItem('exitPopupShown')) {
        showExitPopup();
    }
}, 1000);

console.log('Landing page scripts loaded successfully!');
