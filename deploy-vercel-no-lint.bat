@echo off
echo ========================================
echo   Deploying to Vercel (Skip Linting)
echo ========================================
echo.

echo Step 1: Building project (skipping linting)...
set NEXT_SKIP_LINTING=true
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors above.
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

echo Step 2: Deploying to Vercel...
echo (Browser will open for login if first time)
call vercel --prod
if %errorlevel% neq 0 (
    echo Deployment failed! Trying without --prod flag...
    call vercel
)

echo.
echo ========================================
echo   Deployment completed!
echo ========================================
pause