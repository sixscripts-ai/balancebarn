# Email Routing Setup Guide for thebalancebarn.com

This guide will help you set up email routing in Cloudflare so that emails sent to `support@thebalancebarn.com` are delivered to your inbox.

## Prerequisites
- Domain `thebalancebarn.com` must be added to Cloudflare
- You need access to the Cloudflare Dashboard
- A personal email address to receive forwarded emails

## Step-by-Step Instructions

### 1. Access Email Routing Dashboard

**Direct Link:** https://dash.cloudflare.com/9a5aca49515a11c70748d24c69b1b801/email/routing/overview

Or navigate manually:
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account: **Sixscripts@proton.me's Account**
3. Go to **Email** in the left sidebar
4. Click **Email Routing**

### 2. Select Your Domain

1. From the dropdown at the top, select: **thebalancebarn.com**
2. If you see a message about DNS records, Cloudflare will help you set them up automatically

### 3. Enable Email Routing

1. Click **Get started** or **Enable Email Routing**
2. Cloudflare will automatically add the required DNS records:
   - MX records (for receiving email)
   - TXT records (for SPF verification)
   - DKIM records (for email authentication)
3. Click **Add records and enable** when prompted

### 4. Add Destination Address

This is the REAL email address where you want to receive emails:

1. Click **Destination addresses**
2. Click **Create address**
3. Enter your personal email address (e.g., `aschtion2@gmail.com` or `sixscripts@proton.me`)
4. Click **Send**
5. **Important:** Check your inbox and click the verification link in the email from Cloudflare
6. Once verified, the status will change to "Verified"

### 5. Create Custom Email Address (Routing Rule)

Now create the `support@thebalancebarn.com` address:

1. Go to **Routing rules** tab
2. Click **Create address**
3. In the "Custom address" field, enter: `support`
4. The full address will show as: `support@thebalancebarn.com`
5. Under "Action", select **Send to an email**
6. Choose your verified destination address from step 4
7. Click **Save**

### 6. Optional: Add Additional Recipients

If you want emails to go to multiple addresses:

1. Add each destination address following step 4
2. When creating the routing rule, you can select multiple destinations
3. Or create a "Catch-all" rule to send all unmatched emails to a specific address

## Testing Email Routing

### Test 1: Send a Test Email from Cloudflare

1. In the Email Routing dashboard, click **Send test email**
2. Enter `support@thebalancebarn.com`
3. Click **Send test email**
4. Check your destination inbox - you should receive it within seconds

### Test 2: Test the Contact Form

1. Go to https://thebalancebarn.com/pages/contact.html
2. Fill out the form with test data
3. Submit it
4. Check your destination email inbox
5. You should receive a formatted email from "The Balance Barn"

## Current Configuration

Your email worker is already configured to send emails to:
- `support@thebalancebarn.com` (needs routing setup above)
- `aschtion2@gmail.com` (direct delivery)

The "from" address is set to: `support@thebalancebarn.com`

## DNS Records (Auto-configured)

After enabling Email Routing, these DNS records will be added automatically:

```
Type: MX
Name: thebalancebarn.com
Content: route1.mx.cloudflare.net (Priority: 52)
Content: route2.mx.cloudflare.net (Priority: 29)
Content: route3.mx.cloudflare.net (Priority: 30)

Type: TXT
Name: thebalancebarn.com
Content: v=spf1 include:_spf.mx.cloudflare.net ~all

Type: TXT
Name: _dmarc.thebalancebarn.com
Content: v=DMARC1; p=none; rua=mailto:...
```

## Troubleshooting

### Emails Not Arriving?

1. **Check destination address is verified**
   - Go to Destination addresses
   - Status should be "Verified" (green checkmark)
   - If not, resend verification email

2. **Check routing rule exists**
   - Go to Routing rules
   - You should see `support@thebalancebarn.com` → your destination
   - Status should be "Active"

3. **Check DNS records**
   - Go to DNS → Records
   - Look for MX records pointing to `route*.mx.cloudflare.net`
   - Look for TXT record with SPF: `v=spf1 include:_spf.mx.cloudflare.net ~all`

4. **Check spam folder**
   - First few emails might go to spam
   - Mark as "Not Spam" to train your email provider

5. **Wait for propagation**
   - DNS changes can take up to 24 hours
   - Usually happens within 5-10 minutes

### Worker Email Sending Issues?

If the contact form isn't sending emails:

1. Check the browser console for errors (F12)
2. Verify the API endpoint works:
   ```bash
   curl https://thebalancebarn.com/api/health
   ```
3. Check Cloudflare Pages Functions logs in the dashboard
4. Verify the email worker is deployed:
   ```bash
   curl https://email.sixscripts.workers.dev
   ```

## Important Notes

⚠️ **Email Routing is FREE** on Cloudflare
✅ **No limits** on the number of email addresses you can create
✅ **Instant forwarding** - emails arrive in seconds
✅ **Spam protection** included automatically
✅ **DKIM/SPF/DMARC** configured automatically

## Quick Links

- **Email Routing Dashboard**: https://dash.cloudflare.com/9a5aca49515a11c70748d24c69b1b801/email/routing/overview
- **DNS Records**: https://dash.cloudflare.com/9a5aca49515a11c70748d24c69b1b801/email/routing/dns
- **Email Logs**: https://dash.cloudflare.com/9a5aca49515a11c70748d24c69b1b801/email/routing/logs

## After Setup

Once email routing is configured:

1. ✅ Emails to `support@thebalancebarn.com` will forward to your inbox
2. ✅ Contact form submissions will be received
3. ✅ PDF download form submissions will be received
4. ✅ Assessment form submissions will be received

## Need Help?

If you encounter any issues:
1. Check the Cloudflare Email Routing logs
2. Verify DNS records are active
3. Ensure destination email is verified
4. Test with the built-in Cloudflare test email function

---

**Next Steps:**
1. Click this link to start: https://dash.cloudflare.com/9a5aca49515a11c70748d24c69b1b801/email/routing/overview
2. Follow steps 1-5 above
3. Send a test email
4. Test your contact form!
