@echo off
echo.
echo ============================================
echo     Pre-Deployment Check
echo ============================================
echo.

set ERRORS=0

:: Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js is not installed
    set /a ERRORS+=1
) else (
    echo [OK] Node.js is installed
)

:: Check npm
echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [X] npm is not installed
    set /a ERRORS+=1
) else (
    echo [OK] npm is installed
)

:: Check dependencies
echo Checking dependencies...
if not exist node_modules (
    echo [!] Dependencies not installed (run: npm install)
    set /a ERRORS+=1
) else (
    echo [OK] Dependencies installed
)

:: Check Firebase CLI
echo Checking Firebase CLI...
where firebase >nul 2>&1
if errorlevel 1 (
    echo [!] Firebase CLI not installed (run: npm install -g firebase-tools)
    set /a ERRORS+=1
) else (
    echo [OK] Firebase CLI installed
)

:: Check Firebase login
echo Checking Firebase authentication...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo [!] Not logged in to Firebase (run: firebase login)
    set /a ERRORS+=1
) else (
    echo [OK] Firebase authenticated
)

:: Check firebase.json
echo Checking Firebase configuration...
if not exist firebase.json (
    echo [X] firebase.json not found
    set /a ERRORS+=1
) else (
    echo [OK] firebase.json found
)

:: Check TypeScript
echo Checking TypeScript...
call npm run type-check >nul 2>&1
if errorlevel 1 (
    echo [!] TypeScript errors detected
    set /a ERRORS+=1
) else (
    echo [OK] TypeScript check passed
)

echo.
echo ============================================
if %ERRORS% GTR 0 (
    echo     RESULT: %ERRORS% issue(s) found
    echo     Please fix the issues above before deploying
) else (
    echo     RESULT: All checks passed!
    echo     Ready to deploy
)
echo ============================================
echo.
pause