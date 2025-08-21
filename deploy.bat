@echo off
setlocal enabledelayedexpansion

:: Colors for output
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "MAGENTA=[95m"
set "CYAN=[96m"
set "RESET=[0m"

:MENU
cls
echo.
echo %CYAN%================================================================%RESET%
echo %CYAN%          DEPLOYMENT AND TESTING SUITE                         %RESET%
echo %CYAN%================================================================%RESET%
echo.
echo %YELLOW%  DEPLOYMENT OPTIONS:%RESET%
echo     %GREEN%[1]%RESET% Deploy to Firebase
echo     %GREEN%[2]%RESET% Deploy to Vercel  
echo     %GREEN%[3]%RESET% Deploy to Both (Firebase + Vercel)
echo.
echo %YELLOW%  TESTING OPTIONS:%RESET%
echo     %GREEN%[4]%RESET% Local Development Server
echo     %GREEN%[5]%RESET% Run Tests (Unit + Integration)
echo     %GREEN%[6]%RESET% Run Tests with Coverage Report
echo     %GREEN%[7]%RESET% Run E2E Tests (Playwright)
echo.
echo %YELLOW%  ANALYSIS OPTIONS:%RESET%
echo     %GREEN%[8]%RESET% Performance Analysis (Lighthouse)
echo     %GREEN%[9]%RESET% Security Audit
echo     %GREEN%[A]%RESET% Accessibility Testing
echo.
echo %YELLOW%  COMBINED OPTIONS:%RESET%
echo     %GREEN%[B]%RESET% Full Test Suite + All Deployments
echo     %GREEN%[C]%RESET% Local Test + Deploy to Production
echo     %GREEN%[D]%RESET% Complete Analysis (Perf + Security + A11y)
echo.
echo %YELLOW%  MAINTENANCE:%RESET%
echo     %GREEN%[E]%RESET% Clean Build Artifacts
echo     %GREEN%[F]%RESET% Update Dependencies
echo     %GREEN%[G]%RESET% Pre-deployment Checks
echo.
echo     %RED%[X]%RESET% Exit
echo.
echo %CYAN%================================================================%RESET%
echo.
set /p choice="Select an option: "

:: Convert to uppercase
set choice=%choice:~0,1%
if /i "%choice%"=="1" goto DEPLOY_FIREBASE
if /i "%choice%"=="2" goto DEPLOY_VERCEL
if /i "%choice%"=="3" goto DEPLOY_BOTH
if /i "%choice%"=="4" goto LOCAL_DEV
if /i "%choice%"=="5" goto RUN_TESTS
if /i "%choice%"=="6" goto TEST_COVERAGE
if /i "%choice%"=="7" goto E2E_TESTS
if /i "%choice%"=="8" goto PERF_ANALYSIS
if /i "%choice%"=="9" goto SECURITY_AUDIT
if /i "%choice%"=="A" goto ACCESSIBILITY_TEST
if /i "%choice%"=="B" goto FULL_SUITE
if /i "%choice%"=="C" goto LOCAL_AND_DEPLOY
if /i "%choice%"=="D" goto COMPLETE_ANALYSIS
if /i "%choice%"=="E" goto CLEAN_BUILD
if /i "%choice%"=="F" goto UPDATE_DEPS
if /i "%choice%"=="G" goto PRE_CHECKS
if /i "%choice%"=="X" goto EXIT

echo %RED%Invalid option. Please try again.%RESET%
timeout /t 2 >nul
goto MENU

:: ============================================
:: DEPLOYMENT OPTIONS
:: ============================================

:DEPLOY_FIREBASE
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%         Deploying to Firebase Hosting                         %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%[1/4] Building application...%RESET%
call npm run build
if %errorlevel% neq 0 (
    echo %RED%Build failed!%RESET%
    pause
    goto MENU
)

echo %YELLOW%[2/4] Checking Firebase CLI...%RESET%
where firebase >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
)

echo %YELLOW%[3/4] Checking Firebase authentication...%RESET%
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo %YELLOW%Please login to Firebase...%RESET%
    call firebase login
)

echo %YELLOW%[4/4] Deploying to Firebase...%RESET%
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo %RED%Deployment failed!%RESET%
    pause
    goto MENU
)

echo.
echo %GREEN%[OK] Successfully deployed to Firebase!%RESET%
echo   URL: https://anti-mony.web.app
echo.
pause
goto MENU

:DEPLOY_VERCEL
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%            Deploying to Vercel                                %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%[1/3] Checking Vercel CLI...%RESET%
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
)

echo %YELLOW%[2/3] Building application...%RESET%
call npm run build
if %errorlevel% neq 0 (
    echo %RED%Build failed!%RESET%
    pause
    goto MENU
)

echo %YELLOW%[3/3] Deploying to Vercel...%RESET%
call vercel --prod
if %errorlevel% neq 0 (
    echo %RED%Deployment failed!%RESET%
    pause
    goto MENU
)

echo.
echo %GREEN%[OK] Successfully deployed to Vercel!%RESET%
echo.
pause
goto MENU

:DEPLOY_BOTH
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%       Deploying to Firebase and Vercel                        %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%Building application once for both platforms...%RESET%
call npm run build
if %errorlevel% neq 0 (
    echo %RED%Build failed!%RESET%
    pause
    goto MENU
)

echo.
echo %CYAN%Deploying to Firebase...%RESET%
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo %RED%Firebase deployment failed!%RESET%
) else (
    echo %GREEN%[OK] Firebase deployment successful!%RESET%
)

echo.
echo %CYAN%Deploying to Vercel...%RESET%
call vercel --prod
if %errorlevel% neq 0 (
    echo %RED%Vercel deployment failed!%RESET%
) else (
    echo %GREEN%[OK] Vercel deployment successful!%RESET%
)

echo.
pause
goto MENU

:: ============================================
:: TESTING OPTIONS
:: ============================================

:LOCAL_DEV
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%         Starting Local Development Server                     %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%Starting development server...%RESET%
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
goto MENU

:RUN_TESTS
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%           Running Test Suite                                  %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%Running unit and integration tests...%RESET%
call npm test -- --passWithNoTests
if %errorlevel% neq 0 (
    echo %RED%Some tests failed!%RESET%
) else (
    echo %GREEN%[OK] All tests passed!%RESET%
)
echo.
pause
goto MENU

:TEST_COVERAGE
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%        Running Tests with Coverage Report                     %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%Running tests with coverage analysis...%RESET%
call npm run test:coverage
echo.
echo %CYAN%Coverage report generated in /coverage directory%RESET%
echo.
pause
goto MENU

:E2E_TESTS
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%          Running End-to-End Tests                             %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%Installing Playwright browsers if needed...%RESET%
call npx playwright install
echo.
echo %YELLOW%Running E2E tests...%RESET%
call npm run test:e2e
echo.
pause
goto MENU

:: ============================================
:: ANALYSIS OPTIONS
:: ============================================

:PERF_ANALYSIS
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%         Performance Analysis (Lighthouse)                     %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%Building production version...%RESET%
call npm run build
if %errorlevel% neq 0 (
    echo %RED%Build failed!%RESET%
    pause
    goto MENU
)

echo %YELLOW%Starting production server...%RESET%
start /B npm run start

echo %YELLOW%Waiting for server to start...%RESET%
timeout /t 5 >nul

echo %YELLOW%Running Lighthouse analysis...%RESET%
call npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html --view
echo.
echo %GREEN%[OK] Performance report generated: lighthouse-report.html%RESET%
echo.

:: Kill the production server
taskkill /F /IM node.exe >nul 2>&1

pause
goto MENU

:SECURITY_AUDIT
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%            Security Audit                                     %RESET%
echo %BLUE%================================================================%RESET%
echo.

echo %YELLOW%Running npm audit...%RESET%
call npm audit
echo.

echo %YELLOW%Running dependency check...%RESET%
call npx depcheck
echo.

echo %YELLOW%Checking for known vulnerabilities...%RESET%
call npm run security:audit
echo.

pause
goto MENU

:ACCESSIBILITY_TEST
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%          Accessibility Testing                                %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %YELLOW%Running accessibility tests...%RESET%
call npm run test:a11y
echo.
pause
goto MENU

:: ============================================
:: COMBINED OPTIONS
:: ============================================

:FULL_SUITE
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%     Full Test Suite + All Deployments                         %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %CYAN%Step 1/5: Running tests...%RESET%
call npm test -- --passWithNoTests
if %errorlevel% neq 0 (
    echo %YELLOW%Warning: Some tests failed%RESET%
)

echo.
echo %CYAN%Step 2/5: Running coverage analysis...%RESET%
call npm run test:coverage

echo.
echo %CYAN%Step 3/5: Building application...%RESET%
call npm run build
if %errorlevel% neq 0 (
    echo %RED%Build failed! Stopping deployment.%RESET%
    pause
    goto MENU
)

echo.
echo %CYAN%Step 4/5: Deploying to Firebase...%RESET%
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo %RED%Firebase deployment failed!%RESET%
) else (
    echo %GREEN%[OK] Firebase deployment successful!%RESET%
)

echo.
echo %CYAN%Step 5/5: Deploying to Vercel...%RESET%
call vercel --prod
if %errorlevel% neq 0 (
    echo %RED%Vercel deployment failed!%RESET%
) else (
    echo %GREEN%[OK] Vercel deployment successful!%RESET%
)

echo.
echo %GREEN%================================================================%RESET%
echo %GREEN%     Full deployment suite completed!                          %RESET%
echo %GREEN%================================================================%RESET%
echo.
pause
goto MENU

:LOCAL_AND_DEPLOY
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%     Local Test + Production Deployment                        %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

echo %CYAN%Step 1/4: Running tests...%RESET%
call npm test -- --passWithNoTests
if %errorlevel% neq 0 (
    echo %RED%Tests failed! Fix issues before deploying.%RESET%
    pause
    goto MENU
)

echo.
echo %CYAN%Step 2/4: Type checking...%RESET%
call npm run type-check
if %errorlevel% neq 0 (
    echo %RED%TypeScript errors found!%RESET%
    pause
    goto MENU
)

echo.
echo %CYAN%Step 3/4: Building application...%RESET%
call npm run build
if %errorlevel% neq 0 (
    echo %RED%Build failed!%RESET%
    pause
    goto MENU
)

echo.
echo %CYAN%Step 4/4: Choose deployment target:%RESET%
echo   [1] Firebase
echo   [2] Vercel
echo   [3] Both
set /p deploy_choice="Select: "

if "%deploy_choice%"=="1" (
    call firebase deploy --only hosting
) else if "%deploy_choice%"=="2" (
    call vercel --prod
) else if "%deploy_choice%"=="3" (
    call firebase deploy --only hosting
    call vercel --prod
)

echo.
echo %GREEN%Deployment completed!%RESET%
pause
goto MENU

:COMPLETE_ANALYSIS
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%        Complete Analysis Suite                                %RESET%
echo %BLUE%================================================================%RESET%
echo.

call :CHECK_DEPS
if %errorlevel% neq 0 goto MENU

:: Create reports directory if it doesn't exist
if not exist reports mkdir reports

echo %CYAN%1/4: Performance Analysis...%RESET%
call npm run build
start /B npm run start
timeout /t 5 >nul
call npx lighthouse http://localhost:3000 --output json --output-path ./reports/lighthouse.json --quiet
taskkill /F /IM node.exe >nul 2>&1
echo %GREEN%[OK] Performance analysis complete%RESET%

echo.
echo %CYAN%2/4: Security Audit...%RESET%
call npm audit --json > ./reports/security.json
echo %GREEN%[OK] Security audit complete%RESET%

echo.
echo %CYAN%3/4: Accessibility Testing...%RESET%
call npm run test:a11y -- --json > ./reports/accessibility.json 2>nul
echo %GREEN%[OK] Accessibility testing complete%RESET%

echo.
echo %CYAN%4/4: Test Coverage...%RESET%
call npm run test:coverage
echo %GREEN%[OK] Coverage analysis complete%RESET%

echo.
echo %GREEN%================================================================%RESET%
echo %GREEN%     All analyses complete! Check /reports directory           %RESET%
echo %GREEN%================================================================%RESET%
echo.
pause
goto MENU

:: ============================================
:: MAINTENANCE OPTIONS
:: ============================================

:CLEAN_BUILD
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%         Cleaning Build Artifacts                              %RESET%
echo %BLUE%================================================================%RESET%
echo.

echo %YELLOW%Removing build directories...%RESET%
if exist .next (
    rmdir /s /q .next
    echo   Removed .next
)
if exist out (
    rmdir /s /q out
    echo   Removed out
)
if exist coverage (
    rmdir /s /q coverage
    echo   Removed coverage
)
if exist .turbo (
    rmdir /s /q .turbo
    echo   Removed .turbo
)

echo.
echo %GREEN%[OK] Build artifacts cleaned!%RESET%
echo.
pause
goto MENU

:UPDATE_DEPS
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%         Updating Dependencies                                 %RESET%
echo %BLUE%================================================================%RESET%
echo.

echo %YELLOW%Checking for outdated packages...%RESET%
call npm outdated
echo.

set /p update_confirm="Do you want to update dependencies? (y/n): "
if /i "%update_confirm%"=="y" (
    echo %YELLOW%Updating dependencies...%RESET%
    call npm update
    echo.
    echo %GREEN%[OK] Dependencies updated!%RESET%
) else (
    echo Update cancelled.
)

echo.
pause
goto MENU

:PRE_CHECKS
cls
echo %BLUE%================================================================%RESET%
echo %BLUE%         Pre-deployment Checks                                 %RESET%
echo %BLUE%================================================================%RESET%
echo.

set CHECKS_PASSED=1

echo %CYAN%Checking environment...%RESET%
echo.

:: Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo   %RED%[X] Node.js not installed%RESET%
    set CHECKS_PASSED=0
) else (
    echo   %GREEN%[OK] Node.js installed%RESET%
)

:: npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo   %RED%[X] npm not installed%RESET%
    set CHECKS_PASSED=0
) else (
    echo   %GREEN%[OK] npm installed%RESET%
)

:: Dependencies
if not exist node_modules (
    echo   %YELLOW%! Dependencies not installed%RESET%
    set CHECKS_PASSED=0
) else (
    echo   %GREEN%[OK] Dependencies installed%RESET%
)

:: TypeScript
call npm run type-check >nul 2>&1
if %errorlevel% neq 0 (
    echo   %YELLOW%! TypeScript errors detected%RESET%
    set CHECKS_PASSED=0
) else (
    echo   %GREEN%[OK] TypeScript check passed%RESET%
)

:: Firebase
where firebase >nul 2>&1
if %errorlevel% neq 0 (
    echo   %YELLOW%! Firebase CLI not installed%RESET%
) else (
    echo   %GREEN%[OK] Firebase CLI installed%RESET%
)

:: Vercel
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo   %YELLOW%! Vercel CLI not installed%RESET%
) else (
    echo   %GREEN%[OK] Vercel CLI installed%RESET%
)

echo.
if %CHECKS_PASSED%==1 (
    echo %GREEN%All critical checks passed!%RESET%
) else (
    echo %YELLOW%Some checks need attention.%RESET%
)
echo.
pause
goto MENU

:: ============================================
:: HELPER FUNCTIONS
:: ============================================

:CHECK_DEPS
if not exist node_modules (
    echo %YELLOW%Installing dependencies...%RESET%
    call npm install
    if %errorlevel% neq 0 (
        echo %RED%Failed to install dependencies!%RESET%
        pause
        exit /b 1
    )
)
exit /b 0

:EXIT
cls
echo.
echo %CYAN%Thank you for using the Deployment Suite!%RESET%
echo.
timeout /t 2 >nul
exit /b 0