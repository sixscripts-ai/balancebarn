# Project Structure

## Overview

The Balance Barn website follows a professional, scalable architecture with clear separation of concerns.

## Directory Layout

```
balancebarn/
│
├── 📁 public/                      # Public web root (served to users)
│   ├── index.html                 # Homepage (root level for SEO)
│   │
│   ├── 📁 pages/                  # Internal pages
│   │   ├── about.html             # About us page
│   │   ├── services.html          # Services listing
│   │   ├── contact.html           # Contact form
│   │   ├── assessment.html        # Free assessment form
│   │   └── landing.html           # Alternative landing page
│   │
│   ├── 📁 css/                    # Stylesheets
│   │   ├── styles.css             # Main stylesheet
│   │   ├── landing.css            # Landing page styles
│   │   └── styles.css.bak         # Backup file
│   │
│   ├── 📁 js/                     # Client-side JavaScript
│   │   ├── script.js              # Main application logic
│   │   └── landing.js             # Landing page interactions
│   │
│   └── 📁 assets/                 # Static assets
│       ├── 📁 images/             # Image files
│       └── 📁 downloads/          # Downloadable resources
│           ├── barnhvac.pdf
│           └── profit-leaks-plugged-hvac-guide.pdf
│
├── 📁 src/                        # Source code (backend)
│   └── 📁 api/                    # API endpoints
│       ├── health.js              # Health check endpoint
│       └── sendEmail.js           # Email sending logic
│
├── 📁 config/                     # Configuration files
│   └── wrangler.toml              # Cloudflare Workers config
│
├── 📁 docs/                       # Documentation
│   ├── README.md                  # Original readme
│   ├── CLOUDFLARE_SETUP.md        # Deployment guide
│   └── DEPLOYMENT_COMPLETE.md     # Deployment checklist
│
├── 📁 worker-email/               # Email worker (Cloudflare)
│   ├── wrangler.toml              # Worker configuration
│   └── 📁 src/
│       └── index.js               # Worker entry point
│
├── 📄 package.json                # Node.js dependencies
├── 📄 README.md                   # Main documentation
├── 📄 DEVELOPMENT.md              # Development guide
├── 📄 STRUCTURE.md                # This file
└── 📄 .gitignore                  # Git ignore rules
```

## File Organization Principles

### 1. **Public Directory**
- Contains all files served directly to users
- Homepage (`index.html`) at root for SEO
- Subdirectories for organization

### 2. **Pages Folder**
- All internal pages in `public/pages/`
- Consistent navigation structure
- Relative path references:
  - CSS: `../css/styles.css`
  - JS: `../js/script.js`
  - Pages: `about.html` (same directory)
  - Home: `../index.html`

### 3. **Assets Organization**
- **CSS**: Centralized in `public/css/`
- **JavaScript**: Centralized in `public/js/`
- **Static Files**: Organized by type in `public/assets/`

### 4. **Source Code**
- Backend logic in `src/`
- API functions in `src/api/`
- Cloudflare Workers in `worker-email/`

### 5. **Configuration**
- All config files in `config/`
- Environment-specific settings isolated
- Worker configs in respective directories

### 6. **Documentation**
- Technical docs in `docs/`
- User-facing docs at root
- Development guides separate

## Path Reference Guide

### From Homepage (`public/index.html`)
```html
<!-- CSS -->
<link rel="stylesheet" href="css/styles.css">

<!-- JS -->
<script src="js/script.js"></script>

<!-- Pages -->
<a href="pages/about.html">About</a>

<!-- Assets -->
<img src="assets/images/logo.png">
```

### From Pages (`public/pages/*.html`)
```html
<!-- CSS -->
<link rel="stylesheet" href="../css/styles.css">

<!-- JS -->
<script src="../js/script.js"></script>

<!-- Other pages -->
<a href="contact.html">Contact</a>

<!-- Homepage -->
<a href="../index.html">Home</a>

<!-- Assets -->
<img src="../assets/images/logo.png">
```

## Deployment Structure

### Cloudflare Pages
```
Build command: npm run build
Build output: public/
Root directory: /
```

The `public/` directory becomes the web root:
- `public/index.html` → `https://thebalancebarn.com/`
- `public/pages/about.html` → `https://thebalancebarn.com/pages/about.html`
- `public/css/styles.css` → `https://thebalancebarn.com/css/styles.css`

### API Routes
- Health check: `https://thebalancebarn.com/api/health`
- Contact form: `https://thebalancebarn.com/api/sendEmail`

## Benefits of This Structure

✅ **Scalability**: Easy to add new pages/features
✅ **Maintainability**: Clear organization, easy to find files
✅ **SEO-Friendly**: Homepage at root, clean URLs
✅ **Professional**: Industry-standard structure
✅ **Separation of Concerns**: Frontend/backend clearly divided
✅ **Easy Deployment**: Simple build process
✅ **Version Control**: Logical grouping for commits

## Migration Notes

### Previous Structure → New Structure
```
about.html              → public/pages/about.html
styles.css              → public/css/styles.css
script.js               → public/js/script.js
assets/downloads/       → public/assets/downloads/
functions/api/          → src/api/
wrangler.toml          → config/wrangler.toml
README.md              → docs/README.md (old) + README.md (new)
```

## Development Workflow

1. **Edit files** in their respective directories
2. **Test locally** with `npm run serve`
3. **Build** with `npm run build` (if needed)
4. **Deploy** with `npm run deploy` or via Cloudflare dashboard
5. **Document changes** in relevant markdown files

## Future Expansion

Potential additions while maintaining structure:
- `public/assets/fonts/` - Custom web fonts
- `public/assets/videos/` - Video content
- `src/utils/` - Shared utility functions
- `src/middleware/` - Request middleware
- `tests/` - Unit and integration tests
- `scripts/` - Build and deployment scripts

---

**Last Updated**: October 28, 2025
**Maintained By**: The Balance Barn Development Team
