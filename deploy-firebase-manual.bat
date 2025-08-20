@echo off
echo ========================================
echo   Deploying to Firebase Hosting
echo ========================================
echo.

echo Step 1: Building project for Firebase...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors above.
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

echo Step 2: Installing Firebase CLI (if not already installed)...
call npm install -g firebase-tools
echo.

echo Step 3: Login to Firebase (browser will open)...
call firebase login
echo.

echo Step 4: Initialize Firebase project (if not done)...
echo If asked, select:
echo - Use an existing project OR create a new one
echo - Configure as a single-page app: YES
echo - Set up automatic builds and deploys with GitHub: NO
echo.
call firebase init hosting
echo.

echo Step 5: Deploying to Firebase...
call firebase deploy
echo.

echo ========================================
echo   Firebase Deployment Complete!
echo ========================================
echo Your site will be available at:
echo https://YOUR-PROJECT-ID.web.app
echo https://YOUR-PROJECT-ID.firebaseapp.com
echo.
pause