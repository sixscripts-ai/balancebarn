# Development Guide

## Getting Started

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   # or
   npm run serve
   ```

   The site will be available at `http://localhost:8025`

3. **File Structure**
   - Edit HTML pages in `public/` (homepage) or `public/pages/` (other pages)
   - Edit styles in `public/css/`
   - Edit JavaScript in `public/js/`
   - API functions are in `src/api/`

### Making Changes

#### Updating Styles
- Main stylesheet: `public/css/styles.css`
- Landing page specific: `public/css/landing.css`

#### Updating Pages
- Homepage: `public/index.html`
- Other pages: `public/pages/*.html`

#### Adding New Pages
1. Create HTML file in `public/pages/`
2. Use relative paths:
   - CSS: `../css/styles.css`
   - JS: `../js/script.js`
   - Other pages: `contact.html` (same directory)
   - Homepage: `../index.html`

#### API Development
- API endpoints: `src/api/`
- Email worker: `worker-email/src/index.js`

### Best Practices

1. **File Organization**
   - Keep HTML pages in their designated folders
   - Store static assets in `public/assets/`
   - Separate concerns (HTML, CSS, JS)

2. **Path References**
   - Always use relative paths
   - Test navigation after changes
   - Verify asset loading

3. **Before Committing**
   ```bash
   # Check for errors
   npm run build

   # Test locally
   npm run serve
   ```

4. **Code Style**
   - Use consistent indentation (4 spaces)
   - Comment complex logic
   - Follow existing naming conventions

## Deployment

### Cloudflare Pages

1. **Build Configuration**
   - Build command: `npm run build`
   - Build output directory: `public`
   - Root directory: `/`

2. **Environment Variables**
   Set these in Cloudflare dashboard:
   - `NODE_VERSION`: `18`
   - Add any API keys or secrets

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Custom Domain
1. Go to Cloudflare Pages dashboard
2. Navigate to your project
3. Click "Custom domains"
4. Add `thebalancebarn.com`
5. Follow DNS configuration steps

## Troubleshooting

### Paths Not Working
- Check relative paths are correct
- Verify files exist in expected locations
- Clear browser cache

### Styles Not Loading
- Check CSS file paths in HTML
- Verify CSS files are in `public/css/`
- Check browser console for 404 errors

### Scripts Not Running
- Verify JS file paths
- Check browser console for errors
- Ensure scripts are loaded after DOM

## Project Structure

```
public/                 # Root for web server
├── index.html         # Homepage (root level)
├── pages/            # All other pages
├── css/              # Stylesheets
├── js/               # Client scripts
└── assets/           # Static files

src/                   # Backend source
└── api/              # API endpoints

config/               # Configuration
└── wrangler.toml    # Cloudflare config

docs/                 # Documentation
worker-email/        # Email worker
```

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Project Documentation](./docs/)

## Support

For questions or issues:
- Check `docs/` folder for detailed documentation
- Review existing code examples
- Contact: support@thebalancebarn.com
