# Blog Subdomain Setup Guide

## Setting up blog.thebalancebarn.com

This guide will help you create a subdomain for your blog at `blog.thebalancebarn.com`.

### Option 1: Create a Separate Cloudflare Pages Project (Recommended)

This is the best option if you want a completely separate blog with its own deployment pipeline.

#### Steps:

1. **Create a new directory for your blog:**
   ```bash
   mkdir -p blog
   cd blog
   ```

2. **Create a basic blog structure:**
   - Add your blog HTML files
   - Create a simple index.html or use a static site generator (Hugo, Jekyll, etc.)

3. **Deploy blog as a separate Pages project:**
   ```bash
   wrangler pages project create balancebarn-blog
   wrangler pages deploy blog --project-name=balancebarn-blog
   ```

4. **Configure Custom Domain in Cloudflare Dashboard:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to: **Workers & Pages** → **balancebarn-blog** → **Custom domains**
   - Click **Set up a custom domain**
   - Enter: `blog.thebalancebarn.com`
   - Cloudflare will automatically create the necessary DNS records

### Option 2: Use Cloudflare DNS CNAME Record

If you want to point the blog subdomain to an external service or another hosting provider:

#### Steps:

1. **Go to Cloudflare Dashboard:**
   - Visit [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select your domain: **thebalancebarn.com**

2. **Navigate to DNS Settings:**
   - Click on **DNS** in the left sidebar

3. **Add CNAME Record:**
   - Click **Add record**
   - Type: `CNAME`
   - Name: `blog`
   - Target: Point to your blog hosting (e.g., `blog-subdomain.pages.dev` or external service)
   - Proxy status: Toggle orange cloud ON (proxied) or OFF (DNS only)
   - TTL: Auto
   - Click **Save**

### Option 3: Subdirectory in Current Project

If you want to keep everything in one project and use routing:

1. **Create blog directory in public folder:**
   ```bash
   mkdir -p public/blog
   ```

2. **Add blog content:**
   - Create `public/blog/index.html`
   - Add blog posts as HTML files

3. **Access at:** `thebalancebarn.com/blog`

Note: This won't give you `blog.thebalancebarn.com` as a subdomain, but rather a subdirectory.

---

## Recommended Approach: Separate Pages Project

### Step-by-Step Implementation:

```bash
# 1. Create blog directory structure
mkdir -p blog/posts blog/css blog/js blog/images

# 2. Create basic blog files (see below for templates)

# 3. Deploy blog
wrangler pages project create balancebarn-blog
wrangler pages deploy blog --project-name=balancebarn-blog

# 4. Add custom domain in Cloudflare Dashboard
# Go to: Workers & Pages → balancebarn-blog → Custom domains
# Add: blog.thebalancebarn.com
```

### Basic Blog Structure:

```
blog/
├── index.html          # Blog home page with post list
├── posts/
│   ├── post-1.html     # Individual blog posts
│   ├── post-2.html
│   └── ...
├── css/
│   └── blog.css        # Blog-specific styles
├── js/
│   └── blog.js         # Blog-specific JavaScript
└── images/
    └── ...             # Blog images
```

---

## DNS Propagation

After setting up the custom domain:
- DNS changes typically propagate within **5-10 minutes**
- Full global propagation may take up to **24-48 hours**
- Test with: `nslookup blog.thebalancebarn.com`

---

## Current Deployment Status

✅ **Main Site Deployed:**
- URL: https://a283116f.balancebarn.pages.dev
- Production: https://thebalancebarn.com

🔄 **Blog Subdomain:**
- Follow Option 1 above to create and deploy

---

## Next Steps

1. **Choose your approach** (Option 1 recommended)
2. **Create blog content** or choose a static site generator
3. **Deploy blog project**
4. **Configure custom domain** in Cloudflare Dashboard
5. **Test** at blog.thebalancebarn.com

---

## Support Resources

- [Cloudflare Pages Custom Domains](https://developers.cloudflare.com/pages/platform/custom-domains/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Static Site Generators Guide](https://jamstack.org/generators/)
