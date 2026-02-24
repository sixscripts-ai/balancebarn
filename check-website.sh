#!/bin/bash

# Comprehensive Website Check Script
# Checks for broken links, missing files, path inconsistencies

echo "🔍 WEBSITE HEALTH CHECK"
echo "======================="
echo ""

SITE_URL="https://thebalancebarn.com"
ERRORS=0
WARNINGS=0

echo "📋 CHECKING RESOURCE PATHS..."
echo "------------------------------"

# Check for path inconsistencies in pages/ folder
echo ""
echo "🔍 Checking CSS/JS paths in pages/ folder..."

# Files that should use ../ paths
FILES_NEEDING_PARENT=(
    "public/pages/contact.html"
)

# Files that should use regular paths (will be deployed flat)
FILES_FLAT=(
    "public/pages/about.html"
    "public/pages/services.html"
    "public/pages/assessment.html"
    "public/pages/landing.html"
    "public/pages/blog.html"
    "public/pages/barn.html"
)

# Check contact.html uses ../ paths
for file in "${FILES_NEEDING_PARENT[@]}"; do
    if [ -f "$file" ]; then
        if grep -q 'href="css/' "$file" || grep -q 'src="js/' "$file"; then
            echo "❌ ERROR: $file has incorrect paths (should use ../css/ and ../js/)"
            ((ERRORS++))
        else
            echo "✅ $file: Paths are correct (using ../ prefix)"
        fi
    fi
done

# Check other files use non-parent paths
for file in "${FILES_FLAT[@]}"; do
    if [ -f "$file" ]; then
        if grep -q 'href="css/' "$file" || grep -q 'src="js/' "$file"; then
            echo "✅ $file: Paths are correct (no ../ prefix)"
        else
            if grep -q 'href="../css/' "$file" || grep -q 'src="../js/' "$file"; then
                echo "⚠️  WARNING: $file uses ../ paths (should use css/ and js/ for flat deployment)"
                ((WARNINGS++))
            fi
        fi
    fi
done

echo ""
echo "🔍 Checking for missing files..."

# Check if critical files exist
CRITICAL_FILES=(
    "public/index.html"
    "public/css/styles.css"
    "public/css/landing.css"
    "public/js/script.js"
    "public/js/landing.js"
    "functions/api/sendEmail.js"
    "functions/api/health.js"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ ERROR: $file is missing!"
        ((ERRORS++))
    fi
done

echo ""
echo "🔍 Checking form handlers..."

# Check if all forms have proper handlers in script.js
if grep -q "contactForm" public/js/script.js; then
    echo "✅ Contact form handler found in script.js"
else
    echo "❌ ERROR: Contact form handler missing in script.js"
    ((ERRORS++))
fi

if grep -q "pdfDownloadForm" public/js/script.js; then
    echo "✅ PDF download form handler found in script.js"
else
    echo "❌ ERROR: PDF download form handler missing in script.js"
    ((ERRORS++))
fi

if grep -q "assessmentForm" public/js/script.js; then
    echo "✅ Assessment form handler found in script.js"
else
    echo "❌ ERROR: Assessment form handler missing in script.js"
    ((ERRORS++))
fi

echo ""
echo "🔍 Checking API endpoints..."

# Check if API files have correct exports
if [ -f "functions/api/sendEmail.js" ]; then
    if grep -q "export" functions/api/sendEmail.js || grep -q "addEventListener" functions/api/sendEmail.js; then
        echo "✅ sendEmail API has proper structure"
    else
        echo "⚠️  WARNING: sendEmail API might be missing event listener"
        ((WARNINGS++))
    fi
fi

echo ""
echo "🔍 Checking navigation consistency..."

# Check if all pages have consistent navigation
PAGES=(
    "public/pages/about.html"
    "public/pages/services.html"
    "public/pages/contact.html"
    "public/pages/assessment.html"
)

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        if grep -q "index.html" "$page"; then
            echo "✅ $(basename $page): Has link to home"
        else
            echo "⚠️  WARNING: $(basename $page): No link to home page"
            ((WARNINGS++))
        fi
    fi
done

echo ""
echo "🔍 Checking for duplicate IDs in index.html..."

# Check for duplicate form IDs
if grep -c "id=\"contactForm\"" public/index.html | grep -q "^[2-9]"; then
    echo "❌ ERROR: Duplicate contactForm IDs found in index.html"
    ((ERRORS++))
else
    echo "✅ No duplicate contactForm IDs"
fi

echo ""
echo "📊 SUMMARY"
echo "=========="
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ ✅ ✅ ALL CHECKS PASSED! ✅ ✅ ✅"
    echo ""
    echo "Website is healthy and ready for deployment!"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "✅ No critical errors found"
    echo "⚠️  Some warnings to review"
    exit 0
else
    echo "❌ Critical errors found! Please fix before deploying."
    exit 1
fi
