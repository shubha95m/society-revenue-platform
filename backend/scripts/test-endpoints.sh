#!/bin/bash

# Test all backend API endpoints
# Run: bash scripts/test-endpoints.sh

API_BASE="http://localhost:4000/api"
PASS=0
FAIL=0

# Colors
GREEN='\033[0.32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "======================================================"
echo "  Testing Society Revenue Platform API Endpoints"
echo "======================================================"
echo ""

# Function to test endpoint
test_endpoint() {
  local name=$1
  local method=$2
  local url=$3
  local token=$4
  local expected_status=$5

  if [ -z "$token" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$API_BASE$url")
  else
    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$API_BASE$url" -H "Authorization: Bearer $token")
  fi

  if [ "$response" == "$expected_status" ]; then
    echo -e "${GREEN}✓${NC} $name (HTTP $response)"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $name (HTTP $response, expected $expected_status)"
    ((FAIL++))
  fi
}

# 1. AUTHENTICATION ENDPOINTS
echo -e "${BLUE}[1] Testing Authentication Endpoints${NC}"
echo "---------------------------------------------------"

# Login and get tokens
ADMIN_TOKEN=$(curl -s -X POST "$API_BASE/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@societyrevenue.com","password":"Admin@123456"}' | jq -r '.data.session.token')
SOCIETY_TOKEN=$(curl -s -X POST "$API_BASE/auth/login" -H "Content-Type: application/json" -d '{"email":"rajesh@greenvalley.com","password":"Test@123456"}' | jq -r '.data.session.token')
RESIDENT_TOKEN=$(curl -s -X POST "$API_BASE/auth/login" -H "Content-Type: application/json" -d '{"email":"john.doe@example.com","password":"Test@123456"}' | jq -r '.data.session.token')
VENDOR_TOKEN=$(curl -s -X POST "$API_BASE/auth/login" -H "Content-Type: application/json" -d '{"email":"vendor@freshgroceries.com","password":"Test@123456"}' | jq -r '.data.session.token')

test_endpoint "Health Check" "GET" "/health" "" "200"
test_endpoint "Admin Login" "POST" "/auth/login" "" "200"
test_endpoint "Get Session" "GET" "/auth/session" "$ADMIN_TOKEN" "200"
echo ""

# 2. PLATFORM ADMIN ENDPOINTS
echo -e "${BLUE}[2] Testing Platform Admin Endpoints${NC}"
echo "---------------------------------------------------"
test_endpoint "Admin Dashboard" "GET" "/admin/dashboard" "$ADMIN_TOKEN" "200"
test_endpoint "List Societies" "GET" "/admin/societies" "$ADMIN_TOKEN" "200"
test_endpoint "List Vendors" "GET" "/admin/vendors" "$ADMIN_TOKEN" "200"
test_endpoint "Pending Societies" "GET" "/admin/societies/pending" "$ADMIN_TOKEN" "200"
test_endpoint "Pending Vendors" "GET" "/admin/vendors/pending" "$ADMIN_TOKEN" "200"
test_endpoint "Analytics" "GET" "/admin/analytics" "$ADMIN_TOKEN" "200"
test_endpoint "Admin - Unauthorized" "GET" "/admin/dashboard" "$RESIDENT_TOKEN" "403"
echo ""

# 3. VENDOR ENDPOINTS
echo -e "${BLUE}[3] Testing Vendor Endpoints${NC}"
echo "---------------------------------------------------"
test_endpoint "Vendor Dashboard" "GET" "/vendor/dashboard" "$VENDOR_TOKEN" "200"
test_endpoint "Vendor Orders" "GET" "/vendor/orders" "$VENDOR_TOKEN" "200"
test_endpoint "Vendor Contracts" "GET" "/vendor/contracts" "$VENDOR_TOKEN" "200"
test_endpoint "Vendor Discover" "GET" "/vendor/discover" "$VENDOR_TOKEN" "200"
test_endpoint "Vendor Earnings" "GET" "/vendor/earnings" "$VENDOR_TOKEN" "200"
test_endpoint "Vendor - Unauthorized" "GET" "/vendor/dashboard" "$ADMIN_TOKEN" "403"
echo ""

# 4. SOCIETY ADMIN ENDPOINTS
echo -e "${BLUE}[4] Testing Society Admin Endpoints${NC}"
echo "---------------------------------------------------"
test_endpoint "Society Dashboard" "GET" "/society-admin/dashboard" "$SOCIETY_TOKEN" "200"
test_endpoint "Society Residents" "GET" "/society-admin/residents" "$SOCIETY_TOKEN" "200"
test_endpoint "Society Analytics" "GET" "/society-admin/analytics" "$SOCIETY_TOKEN" "200"
test_endpoint "Society Revenue" "GET" "/society-admin/revenue" "$SOCIETY_TOKEN" "200"
echo ""

# 5. RESIDENT ENDPOINTS
echo -e "${BLUE}[5] Testing Resident Endpoints${NC}"
echo "---------------------------------------------------"
test_endpoint "Resident Dashboard" "GET" "/resident/dashboard" "$RESIDENT_TOKEN" "200"
test_endpoint "Resident Orders" "GET" "/resident/orders" "$RESIDENT_TOKEN" "200"
test_endpoint "Resident Complaints" "GET" "/resident/complaints" "$RESIDENT_TOKEN" "200"
echo ""

# 6. SHARED ENDPOINTS
echo -e "${BLUE}[6] Testing Shared Endpoints${NC}"
echo "---------------------------------------------------"
test_endpoint "List Notices (Society)" "GET" "/notices" "$SOCIETY_TOKEN" "200"
test_endpoint "List Votes (Resident)" "GET" "/votes" "$RESIDENT_TOKEN" "200"
test_endpoint "List Amenities (Society)" "GET" "/amenities" "$SOCIETY_TOKEN" "200"
test_endpoint "List Orders" "GET" "/orders" "$RESIDENT_TOKEN" "200"
echo ""

# SUMMARY
echo "======================================================"
echo "  Test Summary"
echo "======================================================"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "Total: $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi
