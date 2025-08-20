@echo off
echo ========================================
echo   Quick Firebase Deployment
echo ========================================
echo Firebase is already configured!
echo.

echo Step 1: Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors above.
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

echo Step 2: Deploying to Firebase...
echo (You may need to login first if not already logged in)
call firebase deploy --only hosting
echo.

echo ========================================
echo   Deployment Complete!
echo ========================================
pause