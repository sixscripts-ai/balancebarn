# QuickBooks Certification Badges

## Required Badge Images

Please save the 4 QuickBooks certification badge PNG images to this directory with these exact filenames:

1. **qb-level1.png** - QuickBooks ProAdvisor Level 1 certification badge
2. **qb-level2.png** - QuickBooks ProAdvisor Level 2 certification badge
3. **qb-payroll.png** - QuickBooks Payroll Certified badge
4. **qb-bookkeeper.png** - Intuit Trained Bookkeeper badge

## Current Status

✅ Logo files saved:
- logo-maroon.png (for light backgrounds)
- logo-white.png (for dark backgrounds)

❌ Certification badges PENDING:
- qb-level1.png
- qb-level2.png
- qb-payroll.png
- qb-bookkeeper.png

## Where They Appear

These badges appear at the bottom of the footer on:
- `/pages/about.html`
- `/pages/services.html`

They are displayed at 80px height with 0.9 opacity for a subtle, professional look.

## After Adding Badges

Once you've saved all 4 badge images, redeploy with:
```bash
cd /opt/sixscripts/kickstater/balancebarn
npx wrangler pages deploy public --project-name=balancebarn --commit-dirty=true
```
