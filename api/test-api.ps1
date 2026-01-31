# OpenAvis API Test Script (PowerShell)
# This script tests all API endpoints locally

$API_BASE = "http://localhost:7071/api"
$EMAIL = "test@example.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OpenAvis API Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: GET /api/config
Write-Host "Test 1: GET /api/config" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_BASE/config" -Method Get
    Write-Host "✓ Config endpoint works" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Config endpoint failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# Test 2: POST /api/send-otp
Write-Host "Test 2: POST /api/send-otp" -ForegroundColor Yellow
try {
    $body = @{ email = $EMAIL } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$API_BASE/send-otp" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Send OTP endpoint works" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Gray
    Write-Host "Check your console logs for the OTP code" -ForegroundColor Yellow
} catch {
    Write-Host "✗ Send OTP endpoint failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# Test 3: POST /api/verify-otp (wrong code)
Write-Host "Test 3: POST /api/verify-otp (wrong code)" -ForegroundColor Yellow
try {
    $body = @{ email = $EMAIL; otp = "000000" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$API_BASE/verify-otp" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✗ Should have rejected wrong code" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✓ Verify OTP correctly rejects wrong code" -ForegroundColor Green
    } else {
        Write-Host "✗ Unexpected error" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: POST /api/verify-otp (correct code)
Write-Host "Test 4: POST /api/verify-otp (correct code)" -ForegroundColor Yellow
$OTP_CODE = Read-Host "Enter the OTP code from the logs"
try {
    $body = @{ email = $EMAIL; otp = $OTP_CODE } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$API_BASE/verify-otp" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Verify OTP accepts correct code" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Verify OTP failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

# Test 5: POST /api/signup
Write-Host "Test 5: POST /api/signup" -ForegroundColor Yellow
try {
    $body = @{
        email = "test@example.com"
        firstName = "Mario"
        lastName = "Rossi"
        phone = "3331234567"
        gender = "M"
        birthDate = "1990-01-01"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$API_BASE/signup" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Signup endpoint works" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Signup endpoint failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test suite completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
