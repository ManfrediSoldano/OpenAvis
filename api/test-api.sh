#!/bin/bash

# OpenAvis API Test Script
# This script tests all API endpoints locally

API_BASE="http://localhost:7071/api"
EMAIL="test@example.com"

echo "========================================"
echo "OpenAvis API Test Suite"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: GET /api/config
echo -e "${YELLOW}Test 1: GET /api/config${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_BASE/config")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Config endpoint works${NC}"
    echo "Response: $body"
else
    echo -e "${RED}✗ Config endpoint failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 2: POST /api/send-otp
echo -e "${YELLOW}Test 2: POST /api/send-otp${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/send-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\"}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Send OTP endpoint works${NC}"
    echo "Response: $body"
    echo -e "${YELLOW}Check your console logs for the OTP code${NC}"
else
    echo -e "${RED}✗ Send OTP endpoint failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 3: POST /api/verify-otp (with wrong code)
echo -e "${YELLOW}Test 3: POST /api/verify-otp (wrong code)${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"otp\":\"000000\"}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "400" ]; then
    echo -e "${GREEN}✓ Verify OTP correctly rejects wrong code${NC}"
    echo "Response: $body"
else
    echo -e "${RED}✗ Unexpected response (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 4: POST /api/verify-otp (interactive - enter the real code)
echo -e "${YELLOW}Test 4: POST /api/verify-otp (correct code)${NC}"
read -p "Enter the OTP code from the logs: " OTP_CODE

response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"otp\":\"$OTP_CODE\"}")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Verify OTP accepts correct code${NC}"
    echo "Response: $body"
else
    echo -e "${RED}✗ Verify OTP failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 5: POST /api/signup
echo -e "${YELLOW}Test 5: POST /api/signup${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "firstName":"Mario",
    "lastName":"Rossi",
    "phone":"3331234567",
    "gender":"M",
    "birthDate":"1990-01-01"
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Signup endpoint works${NC}"
    echo "Response: $body"
else
    echo -e "${RED}✗ Signup endpoint failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

echo "========================================"
echo "Test suite completed"
echo "========================================"
