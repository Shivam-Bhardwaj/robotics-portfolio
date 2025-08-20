@echo off
echo ========================================
echo   Preparing for Netlify Drop Deployment
echo ========================================
echo.

echo Building project for deployment...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors above.
    pause
    exit /b 1
)

echo.
echo ✓ Build completed successfully!
echo.
echo Next steps:
echo 1. Go to https://app.netlify.com/drop
echo 2. Drag and drop the 'out' folder to the website
echo 3. Get your live URL instantly!
echo.
echo The 'out' folder is ready for deployment.
echo.
start explorer "out"
pause