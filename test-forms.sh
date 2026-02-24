#!/bin/bash

# Balance Barn - Form Testing Script
# Tests all forms and buttons on the website

BASE_URL="https://thebalancebarn.com"
API_URL="$BASE_URL/api/sendEmail"

echo "🧪 Testing Balance Barn Forms and Buttons"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test API endpoint
test_api() {
    local name=$1
    local data=$2

    echo -n "Testing $name... "

    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "$data")

    if echo "$response" | grep -q '"ok":true'; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Response: $response"
        ((FAILED++))
        return 1
    fi
}

# Function to check page loads
test_page() {
    local name=$1
    local url=$2

    echo -n "Testing $name page loads... "

    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $status_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $status_code)"
        ((FAILED++))
        return 1
    fi
}

echo -e "${BLUE}📄 Testing Page Loads${NC}"
echo "---------------------"
test_page "Homepage" "$BASE_URL/"
test_page "About" "$BASE_URL/about.html"
test_page "Services" "$BASE_URL/services.html"
test_page "Contact" "$BASE_URL/contact.html"
test_page "Assessment" "$BASE_URL/assessment.html"
test_page "Landing" "$BASE_URL/landing.html"
echo ""

echo -e "${BLUE}🔌 Testing API Endpoints${NC}"
echo "----------------------"
test_api "Health Check" '{}'
echo ""

echo -e "${BLUE}📝 Testing Contact Form${NC}"
echo "----------------------"
test_api "Contact Form" '{
  "type": "contact",
  "fullName": "Test User",
  "businessName": "Test Company",
  "email": "test@example.com",
  "phone": "555-1234",
  "message": "Test message from automated testing"
}'
echo ""

echo -e "${BLUE}📄 Testing PDF Download Form${NC}"
echo "---------------------------"
test_api "PDF Form" '{
  "type": "pdf",
  "name": "PDF Test User",
  "email": "pdftest@example.com"
}'
echo ""

echo -e "${BLUE}📋 Testing Assessment Form${NC}"
echo "-------------------------"
test_api "Assessment Form" '{
  "type": "assessment",
  "firstName": "John",
  "lastName": "Doe",
  "businessName": "Test Business LLC",
  "email": "assessment@example.com",
  "phone": "555-5678",
  "industry": "Technology",
  "businessStructure": "LLC",
  "revenue": "$50k-$100k",
  "services": "Bookkeeping, Payroll",
  "currentSetup": "QuickBooks",
  "urgency": "Within 1 month",
  "message": "Test assessment submission"
}'
echo ""

echo -e "${BLUE}🔗 Testing Static Assets${NC}"
echo "----------------------"
echo -n "Testing CSS loads... "
css_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/css/styles.css")
if [ "$css_status" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $css_status)"
    ((FAILED++))
fi

echo -n "Testing JavaScript loads... "
js_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/js/script.js")
if [ "$js_status" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $js_status)"
    ((FAILED++))
fi
echo ""

# Summary
echo "=========================================="
echo -e "${BLUE}Test Summary${NC}"
echo "=========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
