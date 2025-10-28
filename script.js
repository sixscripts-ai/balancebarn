// ============= DOM Elements =============
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
const floatingCta = document.getElementById('floatingCta');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const pdfDownloadForm = document.getElementById('pdfDownloadForm');
const pricingToggle = document.getElementById('pricingToggle');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const dotsContainer = document.getElementById('dotsContainer');
// Results carousel elements
const prevResultBtn = document.getElementById('prevResult');
const nextResultBtn = document.getElementById('nextResult');
const resultsDots = document.getElementById('resultsDots');

// ============= State =============
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialCount = testimonialCards.length;
let autoAdvanceInterval;
// Results carousel state
let currentResult = 0;
const resultSlides = document.querySelectorAll('.result-slide');
const resultCount = resultSlides.length;

// ============= Navigation =============
window.addEventListener('scroll', () => {
    // Navbar scroll effect
    if (navbar) {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }

    // Progress bar
    if (progressBar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = scrollProgress + '%';
    }

    // Floating CTA visibility
    if (floatingCta) {
        const contactSection = document.getElementById('contact');
        const contactTop = contactSection ? contactSection.offsetTop : Number.MAX_SAFE_INTEGER;
        const shouldShow = window.scrollY > 400 && window.scrollY < contactTop - 200;
        if (shouldShow) floatingCta.classList.add('show');
        else floatingCta.classList.remove('show');
    }
});

// Handle window resize - ensure menu is visible on desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('mobile-open');
    }
});

// Hamburger menu
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-open');
    });
}

// Close menu on link click (only on mobile)
if (navMenu) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            // Only close menu on mobile devices
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('mobile-open');
            }
        });
    });
}

// ============= Scroll Animations =============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Trigger stat counter animation
            if (entry.target.classList.contains('stat-item')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));

// ============= Stat Counter Animation =============
function animateCounter(element) {
    const numberEl = element.querySelector('.stat-number');
    if (!numberEl || numberEl.dataset.animated) return;

    const target = parseInt(numberEl.getAttribute('data-target'));
    const duration = 2000;
    const startTime = Date.now();

    numberEl.dataset.animated = 'true';

    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(target * progress);

        numberEl.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            numberEl.textContent = target;
        }
    }

    updateCounter();
}

// ============= Pricing Toggle =============
if (pricingToggle) pricingToggle.addEventListener('change', (e) => {
    const isAnnual = e.target.checked;
    document.querySelectorAll('.amount').forEach(el => {
        const monthly = parseFloat(el.getAttribute('data-monthly'));
        const annual = parseFloat((monthly * 12 * 0.85).toFixed(0));
        el.textContent = isAnnual ? annual : monthly;
    });
});

// ============= Testimonial Carousel =============
function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < testimonialCount; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToTestimonial(i));
        dotsContainer.appendChild(dot);
    }
}

function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.carousel-dot').forEach(dot => dot.classList.remove('active'));

    testimonialCards[index].classList.add('active');
    document.querySelectorAll('.carousel-dot')[index].classList.add('active');
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCount;
    showTestimonial(currentTestimonial);
    resetAutoAdvance();
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCount) % testimonialCount;
    showTestimonial(currentTestimonial);
    resetAutoAdvance();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    showTestimonial(currentTestimonial);
    resetAutoAdvance();
}

function startAutoAdvance() {
    autoAdvanceInterval = setInterval(nextTestimonial, 6000);
}

function resetAutoAdvance() {
    clearInterval(autoAdvanceInterval);
    startAutoAdvance();
}

if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);

// Pause auto-advance on hover
const testimonialTrack = document.querySelector('.testimonial-track');
if (testimonialCount > 0) {
    if (testimonialTrack) {
        testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoAdvanceInterval));
        testimonialTrack.addEventListener('mouseleave', startAutoAdvance);
    }
    createDots();
    startAutoAdvance();
}

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (testimonialTrack) {
    testimonialTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    testimonialTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        nextTestimonial();
    } else if (touchEndX - touchStartX > 50) {
        prevTestimonial();
    }
}

// ============= FAQ Accordion =============
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
        // Close other open items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('open');
            }
        });

        item.classList.toggle('open');
    });
});

// ============= Contact Form =============
if (contactForm) contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
        fullName: formData.get('fullName'),
        businessName: formData.get('businessName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        website: formData.get('website') // honeypot
    };

    // Log form data (in production, send to server)
    try {
        const res = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json().catch(() => ({ ok: true }));
        toast(json.ok ? 'Thank you! We\'ll be in touch within 24 hours.' : 'Thanks!');
        contactForm.reset();
    } catch (err) {
        console.error('Form submit failed:', err);
        toast('Sorry, something went wrong. Please email ask@thebalancebarn.cc.', true);
    }
});

// ============= PDF Download Form =============
if (pdfDownloadForm) pdfDownloadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(pdfDownloadForm);
    const honeypot = formData.get('honeypot');

    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
        toast('Thank you for your interest!');
        return;
    }

    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        type: 'pdf-download'
    };

    // Basic validation
    if (!data.name || data.name.trim().length < 2) {
        toast('Please enter your name', true);
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailPattern.test(data.email)) {
        toast('Please enter a valid email address', true);
        return;
    }

    // Show loading state
    const submitBtn = pdfDownloadForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    try {
        // Send data to server (you'll provide the PDF file later)
        const res = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Network response was not ok');

        // Hide form and show success message
        pdfDownloadForm.style.display = 'none';
        document.getElementById('pdfSuccess').style.display = 'block';

        // In production, trigger PDF download here
        // window.location.href = '/path-to-your-pdf.pdf';

    } catch (err) {
        console.error('PDF form submit failed:', err);
        toast('Sorry, something went wrong. Please try again or email us at ask@thebalancebarn.cc.', true);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Add animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);

function toast(message, isError = false) {
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, ${isError ? '#EF4444, #DC2626' : '#10B981, #059669'});
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.4s ease-out;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

// ============= Smooth Scroll Anchor Links =============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============= Initialization =============
console.log('✅ Balance Barn premium website loaded successfully!');

// ============= Results Carousel (Minimal) =============
function buildResultsDots() {
    if (!resultsDots) return;
    resultsDots.innerHTML = '';
    for (let i = 0; i < resultCount; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Go to result ${i + 1}`);
        dot.addEventListener('click', () => goToResult(i));
        resultsDots.appendChild(dot);
    }
}

function showResult(index) {
    if (!resultSlides.length) return;
    resultSlides.forEach(slide => slide.classList.remove('active'));
    const dots = resultsDots ? resultsDots.querySelectorAll('.carousel-dot') : [];
    dots.forEach(d => d.classList.remove('active'));

    resultSlides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
}

function nextResult() {
    currentResult = (currentResult + 1) % resultCount;
    showResult(currentResult);
}

function prevResult() {
    currentResult = (currentResult - 1 + resultCount) % resultCount;
    showResult(currentResult);
}

function goToResult(i) {
    currentResult = i;
    showResult(currentResult);
}

// Toggle details
document.querySelectorAll('.result-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('aria-controls');
        const panel = document.getElementById(targetId);
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        // close others
        document.querySelectorAll('.result-toggle').forEach(b => {
            const id = b.getAttribute('aria-controls');
            const p = document.getElementById(id);
            if (p && (b !== btn)) {
                b.setAttribute('aria-expanded', 'false');
                p.hidden = true;
            }
        });
        btn.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
    });
});

// Nav buttons
if (prevResultBtn) prevResultBtn.addEventListener('click', prevResult);
if (nextResultBtn) nextResultBtn.addEventListener('click', nextResult);

// Touch support
const resultsTrack = document.querySelector('.results-track');
if (resultsTrack && resultCount > 0) {
    let startX = 0;
    let endX = 0;
    resultsTrack.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    });
    resultsTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].screenX;
        if (startX - endX > 50) nextResult();
        else if (endX - startX > 50) prevResult();
    });
}

if (resultCount > 0) {
    buildResultsDots();
    showResult(0);
}

// ============= Assessment Form Handler =============
const assessmentForm = document.getElementById('assessmentForm');
if (assessmentForm) {
    assessmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot check
        if (assessmentForm.website && assessmentForm.website.value) return;

        // Collect form data
        const formData = new FormData(assessmentForm);
        const services = formData.getAll('services');
        formData.delete('services');

        const data = {
            type: 'assessment',
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            businessName: formData.get('businessName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            industry: formData.get('industry'),
            businessStructure: formData.get('businessStructure'),
            revenue: formData.get('revenue'),
            services: services.join(', '),
            currentSetup: formData.get('currentSetup'),
            urgency: formData.get('urgency'),
            message: formData.get('message') || 'No additional details provided'
        };

        // Show loading state
        const submitBtn = assessmentForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const res = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Network response was not ok');

            // Show success message
            assessmentForm.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-check-circle" style="font-size: 64px; color: #28a745; margin-bottom: 20px;"></i>
                    <h3 style="color: var(--aggie-maroon); margin-bottom: 15px; font-size: 24px;">Assessment Received!</h3>
                    <p style="color: var(--text-light); font-size: 16px; margin-bottom: 10px;">Thank you for your detailed information.</p>
                    <p style="color: var(--text-light); font-size: 16px;">We'll review your assessment and contact you within 24 business hours with personalized recommendations.</p>
                    <a href="index.html" style="display: inline-block; margin-top: 25px; padding: 12px 24px; background: linear-gradient(135deg, var(--aggie-maroon), var(--brand-light)); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Return to Home</a>
                </div>
            `;

        } catch (err) {
            console.error('Assessment form submit failed:', err);
            toast('Sorry, something went wrong. Please try again or call us at (512) 737-8559.', true);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}
