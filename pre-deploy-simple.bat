@echo off
setlocal enabledelayedexpansion

:: Colors for output (Windows 10+ supports ANSI codes)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "CYAN=[96m"
set "RESET=[0m"

echo.
echo %BLUE%============================================%RESET%
echo %BLUE%      Pre-Deployment Validation Suite      %RESET%
echo %BLUE%============================================%RESET%
echo.

:: Initialize counters
set WARNINGS=0
set ERRORS=0
set CHECKS_PASSED=0

:: 1. Environment validation
echo %CYAN%[1/8] Environment Validation%RESET%
echo ----------------------------------------

:: Check Node.js
echo Checking Node.js...
node -v >nul 2>&1
if !errorlevel! neq 0 (
    echo %RED%  X Node.js not installed%RESET%
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo   Node.js: !NODE_VERSION!
    node -e "process.exit(parseInt(process.version.slice(1).split('.')[0]) >= 18 ? 0 : 1)" 2>nul
    if !errorlevel! neq 0 (
        echo %RED%  X Node.js 18+ required%RESET%
        set /a ERRORS+=1
    ) else (
        echo %GREEN%  OK Node.js version OK%RESET%
        set /a CHECKS_PASSED+=1
    )
)

:: Check npm
echo Checking npm...
npm -v >nul 2>&1
if !errorlevel! neq 0 (
    echo %RED%  X npm not installed%RESET%
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo   npm: !NPM_VERSION!
    echo %GREEN%  OK npm OK%RESET%
    set /a CHECKS_PASSED+=1
)
echo.

:: 2. Project structure validation
echo %CYAN%[2/8] Project Structure%RESET%
echo ----------------------------------------

set REQUIRED_FILES=package.json tsconfig.json next.config.ts tailwind.config.ts
set MISSING_FILES=0

for %%f in (%REQUIRED_FILES%) do (
    if exist %%f (
        echo %GREEN%  OK %%f found%RESET%
        set /a CHECKS_PASSED+=1
    ) else (
        echo %RED%  X %%f missing%RESET%
        set /a ERRORS+=1
        set /a MISSING_FILES+=1
    )
)

if %MISSING_FILES% gtr 0 (
    echo %RED%  Critical files missing!%RESET%
)
echo.

:: 3. Dependencies check
echo %CYAN%[3/8] Dependencies Status%RESET%
echo ----------------------------------------

if exist node_modules (
    echo %GREEN%  OK node_modules exists%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %YELLOW%  ! node_modules not found - run 'npm install'%RESET%
    set /a WARNINGS+=1
)

:: Check for security vulnerabilities (simplified)
echo   Checking security...
npm audit --audit-level=high 2>nul | find "found 0" >nul
if !errorlevel! equ 0 (
    echo %GREEN%  OK No high vulnerabilities%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %YELLOW%  ! Security vulnerabilities may exist%RESET%
    echo     Run 'npm audit' for details
    set /a WARNINGS+=1
)
echo.

:: 4. Firebase configuration
echo %CYAN%[4/8] Firebase Configuration%RESET%
echo ----------------------------------------

if exist firebase.json (
    echo %GREEN%  OK firebase.json found%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %RED%  X firebase.json missing%RESET%
    set /a ERRORS+=1
)

if exist .firebaserc (
    echo %GREEN%  OK .firebaserc found%RESET%
    type .firebaserc | findstr "anti-mony" >nul
    if !errorlevel! equ 0 (
        echo %GREEN%  OK Project configured: anti-mony%RESET%
        set /a CHECKS_PASSED+=1
    )
) else (
    echo %YELLOW%  ! .firebaserc missing%RESET%
    set /a WARNINGS+=1
)
echo.

:: 5. Build configuration
echo %CYAN%[5/8] Build Configuration%RESET%
echo ----------------------------------------

:: Check Next.js configuration
if exist next.config.ts (
    type next.config.ts | findstr "output" >nul
    if !errorlevel! equ 0 (
        echo %GREEN%  OK Next.js config found%RESET%
        set /a CHECKS_PASSED+=1
    ) else (
        echo %YELLOW%  ! Static export may not be configured%RESET%
        set /a WARNINGS+=1
    )
)

:: Check for previous builds
if exist .next (
    echo %YELLOW%  ! Previous build exists (.next)%RESET%
    echo     Will be cleaned during deployment
    set /a WARNINGS+=1
)
if exist out (
    echo %YELLOW%  ! Previous export exists (out)%RESET%
    echo     Will be cleaned during deployment
    set /a WARNINGS+=1
)
echo.

:: 6. Code quality pre-check
echo %CYAN%[6/8] Code Quality Pre-Check%RESET%
echo ----------------------------------------

:: Quick TypeScript check
echo Running quick TypeScript check...
call npm run type-check 2>nul
if !errorlevel! equ 0 (
    echo %GREEN%  OK No TypeScript errors%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %RED%  X TypeScript errors detected%RESET%
    set /a ERRORS+=1
)

:: Quick lint check
echo Running quick lint check...
call npm run lint 2>nul
if !errorlevel! equ 0 (
    echo %GREEN%  OK No linting errors%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %YELLOW%  ! Linting issues detected%RESET%
    echo     Run 'npm run lint:fix' to auto-fix
    set /a WARNINGS+=1
)
echo.

:: 7. Performance checks
echo %CYAN%[7/8] Build Performance Estimate%RESET%
echo ----------------------------------------

:: Count source files
set FILE_COUNT=0
for /f %%a in ('dir /b /s src\*.tsx src\*.ts 2^>nul ^| find /c /v ""') do set FILE_COUNT=%%a
echo   Source files: !FILE_COUNT!

:: Estimate build time
if !FILE_COUNT! gtr 50 (
    echo %YELLOW%  ! Large project - build may take several minutes%RESET%
    set /a WARNINGS+=1
) else (
    echo %GREEN%  OK Build should complete quickly%RESET%
    set /a CHECKS_PASSED+=1
)
echo.

:: 8. Domain configuration
echo %CYAN%[8/8] Domain Configuration%RESET%
echo ----------------------------------------
echo   Primary domain: https://shivambhardwaj.com
echo   Firebase URLs:
echo     - https://anti-mony.web.app
echo     - https://anti-mony.firebaseapp.com
echo   %YELLOW%Note: Ensure DNS is properly configured%RESET%
echo.

:: Summary
echo %BLUE%============================================%RESET%
echo %BLUE%         Pre-Deployment Summary            %RESET%
echo %BLUE%============================================%RESET%
echo.

echo Total checks performed
echo %GREEN%  Passed: %CHECKS_PASSED%%RESET%
echo %YELLOW%  Warnings: %WARNINGS%%RESET%
echo %RED%  Errors: %ERRORS%%RESET%
echo.

if %ERRORS% gtr 0 (
    echo %RED%============================================%RESET%
    echo %RED%   X DEPLOYMENT NOT RECOMMENDED            %RESET%
    echo %RED%   Please fix errors before deploying      %RESET%
    echo %RED%============================================%RESET%
    echo.
    echo Recommended actions:
    echo   1. Fix all errors marked in red above
    echo   2. Run 'npm install' if dependencies are missing
    echo   3. Fix TypeScript/linting errors
    echo   4. Ensure all required files are present
    set EXIT_CODE=1
) else if %WARNINGS% gtr 5 (
    echo %YELLOW%============================================%RESET%
    echo %YELLOW%   ! MULTIPLE WARNINGS DETECTED            %RESET%
    echo %YELLOW%   Review warnings before deployment       %RESET%
    echo %YELLOW%============================================%RESET%
    echo.
    echo Consider:
    echo   1. Running 'npm audit fix' for security issues
    echo   2. Updating outdated packages
    echo   3. Installing CLI tools (Firebase, Vercel)
    set EXIT_CODE=0
) else (
    echo %GREEN%============================================%RESET%
    echo %GREEN%   OK READY FOR DEPLOYMENT                 %RESET%
    echo %GREEN%   All critical checks passed              %RESET%
    echo %GREEN%============================================%RESET%
    echo.
    echo You can now run:
    echo   - deploy.bat firebase    (Firebase deployment)
    echo   - deploy.bat vercel      (Vercel deployment)
    echo   - deploy.bat both        (Deploy to both)
    echo   - test.bat               (Run full test suite)
    set EXIT_CODE=0
)

echo.
pause
exit /b %EXIT_CODE%
