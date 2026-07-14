#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Turf Management System - Email Verification Setup & Run Script
    
.DESCRIPTION
    This PowerShell script sets up the environment and starts the Turf Management
    application with email verification and OTP authentication.
    
.NOTES
    Requires: Java 17+, Maven, MongoDB
#>

# Color definitions
$Colors = @{
    Success = 'Green'
    Error = 'Red'
    Warning = 'Yellow'
    Info = 'Cyan'
    Default = 'Gray'
}

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('Success', 'Error', 'Warning', 'Info', 'Default')]
        [string]$Type = 'Default'
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = $Colors[$Type]
    
    switch ($Type) {
        'Success' { $prefix = "[OK]" }
        'Error' { $prefix = "[FAIL]" }
        'Warning' { $prefix = "[WARN]" }
        'Info' { $prefix = "[INFO]" }
        'Default' { $prefix = "" }
    }
    
    Write-Host "$prefix $Message" -ForegroundColor $color
}

# Clear screen
Clear-Host

Write-Log "==================== TURF MANAGEMENT SYSTEM ====================" -Type 'Info'
Write-Log "Email Verification & OTP Authentication" -Type 'Info'
Write-Log "============================================================" -Type 'Info'
Write-Host

# Step 1: Check Prerequisites
Write-Log "Step 1: Checking Prerequisites..." -Type 'Info'
Write-Host

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Log "Java installed: $javaVersion" -Type 'Success'
} catch {
    Write-Log "Java is not installed. Install from https://www.oracle.com/java/" -Type 'Error'
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Maven
try {
    $mavenVersion = mvn -version 2>&1 | Select-String "Apache Maven"
    Write-Log "Maven installed: $mavenVersion" -Type 'Success'
} catch {
    Write-Log "Maven is not installed. Install from https://maven.apache.org/" -Type 'Error'
    Read-Host "Press Enter to exit"
    exit 1
}

# Check MongoDB
Write-Log "Checking MongoDB connection..." -Type 'Info'
try {
    $mongoCheck = mongosh --eval "db.adminCommand('ping')" --quiet 2>$null
    if ($?) {
        Write-Log "MongoDB is running" -Type 'Success'
    } else {
        Write-Log "MongoDB may not be running. Start it before running the application." -Type 'Warning'
    }
} catch {
    Write-Log "MongoDB connectivity check failed" -Type 'Warning'
}

Write-Host

# Step 2: Get Gmail Configuration
Write-Log "Step 2: Gmail Configuration Setup" -Type 'Info'
Write-Host
Write-Log "You need a Gmail account with App Password for email verification:" -Type 'Info'
Write-Log "1. Go to https://myaccount.google.com" -Type 'Default'
Write-Log "2. Click 'Security' in left sidebar" -Type 'Default'
Write-Log "3. Enable '2-Step Verification'" -Type 'Default'
Write-Log "4. Find 'App passwords' option" -Type 'Default'
Write-Log "5. Select Mail and Windows Computer" -Type 'Default'
Write-Log "6. Copy the 16-character password" -Type 'Default'
Write-Host

# Collect credentials
$mailUsername = Read-Host "Enter your Gmail address (e.g., your-email@gmail.com)"
$mailPassword = Read-Host "Enter 16-character App Password" -AsSecureString

# Validate inputs
if ([string]::IsNullOrEmpty($mailUsername)) {
    Write-Log "Email address is required" -Type 'Error'
    Read-Host "Press Enter to exit"
    exit 1
}

if ($mailPassword.Length -eq 0) {
    Write-Log "App password is required" -Type 'Error'
    Read-Host "Press Enter to exit"
    exit 1
}

# Convert secure string back to plain text for Maven
$mailPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($mailPassword))

Write-Log "Environment variables configured" -Type 'Success'
Write-Host

# Step 3: Build Project
Write-Log "Step 3: Building Project with Maven" -Type 'Info'
Write-Log "Running: mvn clean install" -Type 'Info'
Write-Host

Set-Location $PSScriptRoot
& mvn clean install

if ($LASTEXITCODE -ne 0) {
    Write-Log "Maven build failed. Check the errors above." -Type 'Error'
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Log "Project built successfully" -Type 'Success'
Write-Host

# Step 4: Set Environment Variables
Write-Log "Step 4: Setting Environment Variables" -Type 'Info'

$env:MAIL_HOST = "smtp.gmail.com"
$env:MAIL_PORT = "587"
$env:MAIL_USERNAME = $mailUsername
$env:MAIL_PASSWORD = $mailPasswordPlain
$env:MONGODB_URI = "mongodb://localhost:27017/turfdb"
$env:JWT_SECRET = "YourSuperSecretKeyForJWTSigning"
$env:JWT_EXPIRATION_MS = "86400000"

Write-Log "Environment variables set" -Type 'Success'
Write-Host

# Step 5: Start Application
Write-Log "Step 5: Starting Application" -Type 'Info'
Write-Log "Application will start on http://localhost:9123" -Type 'Info'
Write-Host
Write-Log "============================================================" -Type 'Info'
Write-Log "Once running, open:" -Type 'Info'
Write-Log "  http://localhost:9123/frontend/auth.html" -Type 'Success'
Write-Log "============================================================" -Type 'Info'
Write-Host
Write-Log "To stop the application: Press Ctrl+C" -Type 'Warning'
Write-Host

# Start the application
& mvn spring-boot:run

Write-Host
Write-Log "Application stopped" -Type 'Info'
Read-Host "Press Enter to exit"
