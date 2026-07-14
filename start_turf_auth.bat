@echo off
REM ============================================================================
REM Turf Management System - Email Verification Setup & Run Script
REM This script sets up environment and starts the application
REM ============================================================================

echo.
echo ==================== TURF MANAGEMENT SYSTEM ====================
echo Email Verification & OTP Authentication
echo ============================================================
echo.

REM Colors and styling
color 0A
echo [*] Starting Turf Management System...
echo.

REM ============================================================================
REM 1. CHECK PREREQUISITES
REM ============================================================================
echo [Step 1] Checking Prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java is not installed or not in PATH
    echo Please install Java 17+ from https://www.oracle.com/java/technologies/
    pause
    exit /b 1
)
echo [✓] Java installed

REM Check Maven
mvn -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Maven is not installed or not in PATH
    echo Please install Maven from https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo [✓] Maven installed

REM Check MongoDB connectivity
echo [*] Checking MongoDB connection...
mongosh --eval "db.adminCommand('ping')" --quiet 2>nul >nul
if errorlevel 1 (
    echo [WARNING] MongoDB may not be running at localhost:27017
    echo Please start MongoDB before running the application
    echo.
    echo To start MongoDB:
    echo   1. Open new Command Prompt
    echo   2. Run: mongod
    echo.
    pause
)
echo [✓] MongoDB check complete
echo.

REM ============================================================================
REM 2. ENVIRONMENT VARIABLES
REM ============================================================================
echo [Step 2] Setting Environment Variables...
echo.
echo Please enter your Gmail configuration details:
echo.

set /p MAIL_USERNAME="Enter Gmail Address (e.g., your-email@gmail.com): "
set /p MAIL_PASSWORD="Enter 16-char App Password from Google Account: "

REM Validate inputs
if "%MAIL_USERNAME%"=="" (
    echo [ERROR] Email address is required
    pause
    exit /b 1
)

if "%MAIL_PASSWORD%"=="" (
    echo [ERROR] App password is required
    pause
    exit /b 1
)

echo.
echo [✓] Environment variables configured
echo.

REM ============================================================================
REM 3. BUILD PROJECT
REM ============================================================================
echo [Step 3] Building Project...
echo [*] Running: mvn clean install
echo.

call mvn clean install

if errorlevel 1 (
    echo.
    echo [ERROR] Maven build failed
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo [✓] Project built successfully
echo.

REM ============================================================================
REM 4. START APPLICATION
REM ============================================================================
echo [Step 4] Starting Application...
echo.
echo [*] Setting up environment...

REM Set environment variables for this session
set MAIL_HOST=smtp.gmail.com
set MAIL_PORT=587
set MONGODB_URI=mongodb://localhost:27017/turfdb
set JWT_SECRET=YourSuperSecretKeyForJWTSigning
set JWT_EXPIRATION_MS=86400000

echo [*] Starting application on port 9123...
echo.
echo ============================================================
echo Application is starting...
echo Once ready, open: http://localhost:9123/frontend/auth.html
echo.
echo To stop: Press Ctrl+C
echo ============================================================
echo.

REM Run Spring Boot application
call mvn spring-boot:run

REM If we get here, the application stopped
echo.
echo [!] Application stopped
pause
exit /b 0
