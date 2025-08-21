@echo off
echo.
echo ============================================
echo     Simple Firebase Deployment
echo ============================================
echo.

:: Step 1: Check dependencies
echo [1/5] Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)
echo Dependencies OK
echo.

:: Step 2: Build the application
echo [2/5] Building application...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Build successful
echo.

:: Step 3: Check if out directory exists
echo [3/5] Checking build output...
if not exist out (
    echo ERROR: Build directory 'out' not found
    pause
    exit /b 1
)
echo Build output verified
echo.

:: Step 4: Check Firebase CLI
echo [4/5] Checking Firebase CLI...
where firebase >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI not found. Installing...
    call npm install -g firebase-tools
    if errorlevel 1 (
        echo ERROR: Failed to install Firebase CLI
        pause
        exit /b 1
    )
)
echo Firebase CLI ready
echo.

:: Step 5: Deploy to Firebase
echo [5/5] Deploying to Firebase...
echo.
call firebase deploy --only hosting
if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed
    echo.
    echo Possible issues:
    echo - Not logged in to Firebase (run: firebase login)
    echo - Firebase project not initialized (run: firebase init)
    echo - Network connection issues
    pause
    exit /b 1
)

echo.
echo ============================================
echo     Deployment Successful!
echo ============================================
echo.
echo Your site is deployed to:
echo - https://anti-mony.web.app
echo - https://anti-mony.firebaseapp.com
echo.
pause