@echo off
echo.
echo ========================================
echo     AUTO-DEPLOY TO FIREBASE AND VERCEL
echo ========================================
echo.

:: Build the application first
echo [1/3] Building application...
call npm run build
if errorlevel 1 (
    echo [X] Build failed
    exit /b 1
)
echo [OK] Build successful
echo.

:: Deploy to Firebase
echo [2/3] Deploying to Firebase...
call firebase deploy --only hosting
if errorlevel 1 (
    echo [X] Firebase deployment failed
) else (
    echo [OK] Firebase deployment successful
)
echo.

:: Deploy to Vercel
echo [3/3] Deploying to Vercel...
call vercel --prod
if errorlevel 1 (
    echo [X] Vercel deployment failed
) else (
    echo [OK] Vercel deployment successful
)

echo.
echo ========================================
echo     DEPLOYMENT COMPLETE
echo ========================================
echo.
echo Your site is now live at:
echo - Firebase: https://anti-mony.web.app
echo - Vercel: Check terminal output above
echo.