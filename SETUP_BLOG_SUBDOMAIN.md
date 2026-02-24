# Setting Up blog.thebalancebarn.com Subdomain

## ✅ What's Already Done

1. **Cloudflare Pages Project Created**: `balancebarn-blog`
2. **Project Deployed**: https://1ad5a17e.balancebarn-blog.pages.dev

---

## 🎯 Steps to Add Custom Subdomain in Cloudflare

### Method 1: Through Cloudflare Pages (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Log in to your account

2. **Navigate to Workers & Pages**
   - Click on **Workers & Pages** in the left sidebar
   - Find and click on **balancebarn-blog**

3. **Add Custom Domain**
   - Click on the **Custom domains** tab
   - Click **Set up a custom domain** button
   - Enter: `blog.thebalancebarn.com`
   - Click **Continue**

4. **Cloudflare Will Automatically:**
   - Create the necessary DNS CNAME record
   - Configure SSL/TLS certificate
   - Set up the subdomain routing

5. **Wait for Activation**
   - DNS propagation: 5-10 minutes (usually instant)
   - SSL certificate: 1-2 minutes
   - Your blog will be live at: https://blog.thebalancebarn.com

---

### Method 2: Manual DNS Configuration (Alternative)

If you prefer to set up DNS manually:

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Select domain: **thebalancebarn.com**

2. **Navigate to DNS Settings**
   - Click **DNS** in the left sidebar

3. **Add CNAME Record**
   - Click **Add record**
   - **Type**: CNAME
   - **Name**: blog
   - **Target**: balancebarn-blog.pages.dev
   - **Proxy status**: Proxied (orange cloud ON)
   - **TTL**: Auto
   - Click **Save**

4. **Then Add to Pages Project**
   - Go back to Workers & Pages → balancebarn-blog → Custom domains
   - Add `blog.thebalancebarn.com`
   - Cloudflare will verify the DNS record

---

## 🔍 Verification Steps

After setup, verify your subdomain is working:

```bash
# Check DNS resolution
nslookup blog.thebalancebarn.com

# Test HTTPS (wait 2-5 minutes for SSL)
curl -I https://blog.thebalancebarn.com
```

Or simply visit in your browser:
- https://blog.thebalancebarn.com

---

## 📊 Current Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Main Site | ✅ Deployed | https://thebalancebarn.com |
| Main Site (Pages) | ✅ Live | https://a283116f.balancebarn.pages.dev |
| Blog Project | ✅ Created | balancebarn-blog |
| Blog (Pages) | ✅ Deployed | https://1ad5a17e.balancebarn-blog.pages.dev |
| Blog Subdomain | ⏳ Pending Setup | blog.thebalancebarn.com |

---

## 🚀 Next Steps After Subdomain Setup

1. **Upload Your Blog Files**
   - Place your full blog system in `/opt/sixscripts/kickstater/balancebarn/blog`
   - Deploy with: `wrangler pages deploy blog --project-name=balancebarn-blog`

2. **Link Blog from Main Site** (optional)
   - Add blog link to main navigation
   - Update footer with blog link

3. **Test Everything**
   - Verify blog loads at subdomain
   - Check database connections
   - Test blog functionality

---

## 🔧 Troubleshooting

### Subdomain Not Working?
- Wait 5-10 minutes for DNS propagation
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Check DNS with: `dig blog.thebalancebarn.com`

### SSL Certificate Issues?
- Wait 1-2 minutes after adding custom domain
- Ensure SSL/TLS encryption mode is "Full" in Cloudflare
- Check: **SSL/TLS** → **Overview** → Set to "Full" or "Full (strict)"

### 404 or Page Not Found?
- Ensure blog files are deployed: `wrangler pages deploy blog --project-name=balancebarn-blog`
- Check that `index.html` exists in the blog directory

---

## 📝 Quick Command Reference

```bash
# Deploy blog updates
wrangler pages deploy blog --project-name=balancebarn-blog

# List all projects
wrangler pages project list

# Check deployment status
wrangler pages deployment list --project-name=balancebarn-blog
```

---

## ✨ Expected Result

Once complete, you'll have:
- **Main Site**: https://thebalancebarn.com
- **Blog**: https://blog.thebalancebarn.com

Both running as separate Cloudflare Pages projects, fully managed and deployed! 🎉
