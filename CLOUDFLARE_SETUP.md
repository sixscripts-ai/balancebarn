# Cloudflare Pages Setup Instructions

This project is configured for Cloudflare Pages with Cloudflare Email (beta) to send form submissions. No third-party email API is required.

## Prerequisites
1. Cloudflare account
2. Cloudflare Email Routing enabled for your zone (thebalancebarn.cc)

## Configure Email Binding (SEND_EMAIL)

In your Cloudflare Pages project:
1. Go to Settings → Functions → Bindings
2. Add a new Binding
   - Type: Email
   - Name: SEND_EMAIL
3. Save

Make sure Email Routing for your domain (thebalancebarn.cc) is set up and you have a destination address. The site sends emails to: ask@thebalancebarn.cc

## Deploy to Cloudflare Pages

1. Push your code to GitHub
2. Go to Cloudflare Pages dashboard
3. Create a new project
4. Connect your GitHub repository
5. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: /
6. No environment variables are required for email sending (we use the Email binding)
7. Deploy

## Local Development

To test locally:

```bash
npm install -g wrangler
wrangler pages dev .
```

Email bindings are not available in local dev. For local testing, forms will submit but email won't send. You can temporarily log the payload inside `/functions/sendEmail.js` if needed.

## Form Endpoints

All forms now use: `/api/sendEmail`

- Contact form (index.html)
- PDF download form (index.html)
- Assessment form (assessment.html)

## Email Features

✅ Beautiful HTML emails with branding
✅ Different templates for contact vs assessment forms
✅ Spam protection (honeypot)
✅ CORS enabled
✅ Error handling
✅ Reply-to set to submitter's email

## Troubleshooting

**Emails not sending?**
- Ensure Email Routing is enabled for thebalancebarn.cc
- Verify the SEND_EMAIL binding exists in Pages → Settings → Functions → Bindings
- Check Cloudflare Pages function logs for errors

**CORS errors?**
- Make sure you're testing on the actual domain, not file://
- Check browser console for specific error

**Testing locally?**
- Use `wrangler pages dev .` instead of opening HTML files directly
- This ensures the `/api/sendEmail` route works properly
