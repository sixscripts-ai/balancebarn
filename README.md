# The Balance Barn - Enhanced Website

A premium, modern, and dynamic version of The Balance Barn website with smooth animations, social proof, and enhanced user interactions.

## What's New

### 1. Hero Section Animations
- Smooth fade-in and slide-up animations for headline, subtitle, and CTA button
- Staggered timing creates a polished, professional first impression
- Animations are subtle and quick (not distracting)

### 2. Services Section - Scroll-Triggered Animations
- Service cards animate into view as you scroll down
- Staggered effect creates a flowing, engaging experience
- Cards fade in and slide up with slight delays between each

### 3. Testimonials Carousel (NEW)
- Full testimonial carousel section between services and contact
- Features:
  - Click/swipe navigation
  - Auto-advance every 6 seconds (pauses on hover)
  - Smooth transitions between testimonials
  - Navigation dots for quick access
  - Touch/swipe support for mobile
  - 5-star ratings displayed prominently
  - Client names and quotes

### 4. Enhanced Footer Interactions
- Contact links (phone/email) now have smooth hover effects
- Color transitions to teal accent (#1ABC9C)
- Animated underline that slides in from left to right
- Clear visual feedback for clickable elements

### 5. Accessibility
- Full `prefers-reduced-motion` support
- Users with motion sensitivity get instant, simple fades instead of complex animations
- All animations are lightweight and performant (CSS transforms + opacity)

## Files

- `index.html` - Complete HTML structure with semantic markup
- `styles.css` - Modern CSS with animations, responsive design, and accessibility
- `script.js` - Testimonial carousel logic, scroll animations, and form handling

## How to Use

### Local Testing

Open `index.html` directly in your browser, or serve it with:

```bash
# Python 3
python3 -m http.server 8000

# Then visit http://localhost:8000
```

### Customization

**Testimonials:**
Edit the testimonial cards in `index.html` (lines 95-118) to add real client reviews.

**Colors:**
All colors are defined as CSS variables in `styles.css`:
```css
--primary-teal: #1ABC9C;
--dark-bg: #2C3E50;
--light-bg: #ECF0F1;
```

**Timing:**
Adjust animation speeds in `styles.css` and auto-advance timing in `script.js` (line 48).

## Features Implemented

✅ Hero fade-in and slide-up animations
✅ Scroll-triggered service card animations with staggered delays
✅ Full testimonials carousel with:
  - Click navigation (prev/next buttons)
  - Touch/swipe support for mobile
  - Auto-advance with pause-on-hover
  - Navigation dots
  - 5-star ratings
✅ Enhanced footer link hover states (color + underline animation)
✅ Full accessibility support (`prefers-reduced-motion`)
✅ Responsive design (mobile, tablet, desktop)
✅ Smooth scroll for anchor links
✅ Performance-optimized animations (CSS transforms)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Deployment and Email Setup (Netlify)

This repo includes a serverless function to send contact form emails using Nodemailer.

### Environment Variables
Set these in Netlify Site Settings → Environment variables:

- `SMTP_HOST` (e.g., smtp.gmail.com)
- `SMTP_PORT` (e.g., 587)
- `SMTP_SECURE` (`true` for 465, `false` for 587)
- `SMTP_USER` (your SMTP username)
- `SMTP_PASS` (password/app password)
- `CONTACT_TO` (where to receive form emails)
- `CONTACT_FROM` (optional, defaults to SMTP_USER)

### Deploy
1. Connect the folder to Netlify (drag-and-drop or Git repo).
2. Ensure `netlify.toml` and `netlify/functions/sendEmail.js` are present at deploy time.
3. After deploy, test the form on `/contact.html` or the home page contact section.

Forms POST to `/.netlify/functions/sendEmail` and include a honeypot field `website` for basic spam protection.

---

If using another host, replace the fetch URL in `script.js` with your API endpoint and deploy the function on your platform (e.g., AWS Lambda, Vercel Functions).
