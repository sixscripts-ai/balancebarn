(function () {
  const funnelHTML = `
  <section id="lead-funnel" class="pricing" style="padding: 60px 0; background: var(--bg-light);">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Get Your Growth Plan Today</h2>
        <p class="section-subtitle">A quick, no-pressure call to map your next 90 days of wins.</p>
      </div>
      <div class="lead-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;">
        <form id="leadForm" class="lead-form" style="padding: 28px; background: #fff; border-radius: 12px; border:1px solid var(--border-light); display: grid; gap: 12px;">
          <div style="font-weight:700; color:var(--text-dark);">Lead Capture</div>
          <input name="fullName" placeholder="Full Name" required style="padding:12px; border:1px solid var(--border-light); border-radius:6px;" />
          <input name="email" type="email" placeholder="Email" required style="padding:12px; border:1px solid var(--border-light); border-radius:6px;" />
          <input name="phone" placeholder="Phone (optional)" style="padding:12px; border:1px solid var(--border-light); border-radius:6px;" />
          <select name="interest" style="padding:12px; border:1px solid var(--border-light); border-radius:6px;">
            <option value="Growth Plan">Growth Plan</option>
            <option value="Bookkeeping Review">Bookkeeping Review</option>
            <option value="QuickBooks Setup">QuickBooks Setup</option>
            <option value="Other">Other</option>
          </select>
          <textarea name="message" placeholder="Tell us a little about your needs..." rows="4" style="padding:12px; border:1px solid var(--border-light); border-radius:6px;"></textarea>
          <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off"/>
          <button type="submit" class="btn-primary" style="justify-content:center; padding:12px 14px; font-size:16px;"><i class="fas fa-paper-plane"></i> Get My Growth Plan</button>
          <p style="font-size:12px; color:var(--text-light); margin:0;">By submitting, you agree to be contacted by The Balance Barn.</p>
        </form>
        <div class="lead-props" style="padding:28px; background:#fff; border-radius:12px; border:1px solid var(--border-light);">
          <h3 style="margin-bottom:10px;">Why Balance Barn?</h3>
          <ul style="margin:0; padding-left:20px; color:var(--text-light); line-height:1.6;">
            <li>U.S.-based bookkeeping experts</li>
            <li>No-obligation strategy calls</li>
            <li>Fast turnaround and clear next steps</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="testimonials" id="testimonials" style="background: #f8f8f8; padding: 60px 24px;">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">What clients say</h2>
        <p class="section-subtitle">Real results from real businesses</p>
      </div>
      <div class="testimonial-carousel" aria-label="Client testimonials">
        <button class="carousel-btn prev" id="prevTestimonial" aria-label="Previous">‹</button>
        <div class="testimonial-track" style="display:flex; overflow:hidden; min-height:100px;">
          <div class="testimonial-card active" style="min-width:100%; padding:16px;">
            <div class="testimonial-quote">"Balanced and accurate books. We finally understand our cash flow."</div>
            <div class="testimonial-author">- Small Biz Owner, TX</div>
          </div>
          <div class="testimonial-card" style="min-width:100%; padding:16px;">
            <div class="testimonial-quote">"Responsive, trustworthy, and incredibly helpful during tax season."</div>
            <div class="testimonial-author">- CFO, Tech Startup</div>
          </div>
          <div class="testimonial-card" style="min-width:100%; padding:16px;">
            <div class="testimonial-quote">"We rely on The Balance Barn for timely insights and clean books."</div>
            <div class="testimonial-author">- Physician Practice</div>
          </div>
        </div>
        <button class="carousel-btn next" id="nextTestimonial" aria-label="Next">›</button>
      </div>
      <div class="carousel-dots" id="dotsContainer" style="margin-top:12px;"></div>
    </div>
  </section>

  <section class="faq" id="faq" style="padding: 60px 24px; background: var(--bg-light);">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">FAQ</h2>
        <p class="section-subtitle">Answers to common questions about working with us</p>
      </div>
      <div class="faq-grid" style="margin-top:20px;">
        <div class="faq-item"><div class="faq-question"><h3>Do you offer a free first call?</h3><span>+</span></div><div class="faq-answer"><p>Yes—our initial discovery call is complimentary and designed to map your needs.</p></div></div>
        <div class="faq-item"><div class="faq-question"><h3>Can you help with QuickBooks setup?</h3><span>+</span></div><div class="faq-answer"><p>Absolutely. We can configure, train, and migrate to ensure a clean start.</p></div></div>
        <div class="faq-item"><div class="faq-question"><h3>How fast can you start?</h3><span>+</span></div><div class="faq-answer"><p>We typically onboard within 1–2 weeks depending on scope.</p></div></div>
      </div>
    </div>
  </section>
  `;
  const footerEl = document.querySelector('footer.footer');
  if (footerEl && !document.getElementById('leadForm')) {
    footerEl.parentNode.insertBefore(document.createRange().createContextualFragment(funnelHTML), footerEl);
  }

  function toast(message, isError) {
    if (typeof window.toast === 'function') {
      window.toast(message, isError);
      return;
    }
    alert(message);
  }

  function setupLeadForm() {
    const leadForm = document.getElementById('leadForm');
    if (!leadForm) return;
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        fullName: leadForm.querySelector('[name="fullName"]').value,
        email: leadForm.querySelector('[name="email"]').value,
        phone: leadForm.querySelector('[name="phone"]').value,
        message: leadForm.querySelector('[name="message"]').value
      };
      if (!data.fullName || !data.email) {
        toast('Please provide your name and email.', true);
        return;
      }
      try {
        const res = await fetch('/api/sendEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          toast("Thanks! We'll be in touch soon.");
          leadForm.reset();
        } else {
          toast('Something went wrong. Please try again later.', true);
        }
      } catch (err) {
        toast('Network error. Please try again.', true);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setupLeadForm);
})();
