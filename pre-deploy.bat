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
echo %CYAN%[1/10] Environment Validation%RESET%
echo ----------------------------------------

:: Check Node.js
echo Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%  ✗ Node.js not installed%RESET%
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo   Node.js: !NODE_VERSION!
    node -e "process.exit(parseInt(process.version.slice(1).split('.')[0]) >= 18 ? 0 : 1)" 2>nul
    if !errorlevel! neq 0 (
        echo %RED%  ✗ Node.js 18+ required%RESET%
        set /a ERRORS+=1
    ) else (
        echo %GREEN%  ✓ Node.js version OK%RESET%
        set /a CHECKS_PASSED+=1
    )
)

:: Check npm
echo Checking npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%  ✗ npm not installed%RESET%
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo   npm: !NPM_VERSION!
    echo %GREEN%  ✓ npm OK%RESET%
    set /a CHECKS_PASSED+=1
)

:: Check Git
echo Checking Git...
where git >nul 2>&1
if !errorlevel! neq 0 (
    echo %YELLOW%  ⚠ Git not installed (optional)%RESET%
    set /a WARNINGS+=1
) else (
    git --version >temp_git.txt 2>&1
    set /p GIT_VERSION=<temp_git.txt
    del temp_git.txt >nul 2>&1
    echo   !GIT_VERSION!
    echo %GREEN%  ✓ Git OK%RESET%
    set /a CHECKS_PASSED+=1
)
echo.

:: 2. Project structure validation
echo %CYAN%[2/10] Project Structure%RESET%
echo ----------------------------------------

set REQUIRED_FILES=package.json tsconfig.json next.config.ts tailwind.config.ts
set MISSING_FILES=0

for %%f in (%REQUIRED_FILES%) do (
    if exist %%f (
        echo %GREEN%  ✓ %%f found%RESET%
        set /a CHECKS_PASSED+=1
    ) else (
        echo %RED%  ✗ %%f missing%RESET%
        set /a ERRORS+=1
        set /a MISSING_FILES+=1
    )
)

if %MISSING_FILES% gtr 0 (
    echo %RED%  Critical files missing!%RESET%
)
echo.

:: 3. Dependencies check
echo %CYAN%[3/10] Dependencies Status%RESET%
echo ----------------------------------------

if exist node_modules (
    echo %GREEN%  ✓ node_modules exists%RESET%
    set /a CHECKS_PASSED+=1
    
    :: Check for outdated packages
    echo   Checking for outdated packages...
    npm outdated --depth=0 2>nul | find /c "Package" >nul
    if %errorlevel% equ 0 (
        echo %YELLOW%  ⚠ Some packages are outdated%RESET%
        set /a WARNINGS+=1
    ) else (
        echo %GREEN%  ✓ All packages up to date%RESET%
    )
) else (
    echo %YELLOW%  ⚠ node_modules not found - run 'npm install'%RESET%
    set /a WARNINGS+=1
)

:: Check for security vulnerabilities
echo   Checking security...
npm audit --audit-level=high 2>nul | find "found 0" >nul
if %errorlevel% equ 0 (
    echo %GREEN%  ✓ No high vulnerabilities%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %YELLOW%  ⚠ Security vulnerabilities found%RESET%
    echo     Run 'npm audit' for details
    set /a WARNINGS+=1
)
echo.

:: 4. Firebase configuration
echo %CYAN%[4/10] Firebase Configuration%RESET%
echo ----------------------------------------

if exist firebase.json (
    echo %GREEN%  ✓ firebase.json found%RESET%
    set /a CHECKS_PASSED+=1
    
    :: Check Firebase CLI
    where firebase >nul 2>&1
    if %errorlevel% neq 0 (
        echo %YELLOW%  ⚠ Firebase CLI not installed%RESET%
        echo     Run: npm install -g firebase-tools
        set /a WARNINGS+=1
    ) else (
        echo %GREEN%  ✓ Firebase CLI installed%RESET%
        
        :: Check Firebase login
        firebase projects:list >nul 2>&1
        if %errorlevel% neq 0 (
            echo %YELLOW%  ⚠ Not logged in to Firebase%RESET%
            echo     Run: firebase login
            set /a WARNINGS+=1
        ) else (
            echo %GREEN%  ✓ Firebase authenticated%RESET%
            set /a CHECKS_PASSED+=1
        )
    )
) else (
    echo %RED%  ✗ firebase.json missing%RESET%
    set /a ERRORS+=1
)

if exist .firebaserc (
    echo %GREEN%  ✓ .firebaserc found%RESET%
    type .firebaserc | findstr "anti-mony" >nul
    if %errorlevel% equ 0 (
        echo %GREEN%  ✓ Project configured: anti-mony%RESET%
        set /a CHECKS_PASSED+=1
    )
) else (
    echo %YELLOW%  ⚠ .firebaserc missing%RESET%
    set /a WARNINGS+=1
)
echo.

:: 5. Vercel configuration
echo %CYAN%[5/10] Vercel Configuration%RESET%
echo ----------------------------------------

where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo %YELLOW%  ⚠ Vercel CLI not installed%RESET%
    echo     Run: npm install -g vercel
    set /a WARNINGS+=1
) else (
    echo %GREEN%  ✓ Vercel CLI installed%RESET%
    set /a CHECKS_PASSED+=1
)

if exist .vercel\project.json (
    echo %GREEN%  ✓ Vercel project linked%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %YELLOW%  ⚠ Vercel project not linked%RESET%
    echo     Run: vercel link
    set /a WARNINGS+=1
)
echo.

:: 6. Build configuration
echo %CYAN%[6/10] Build Configuration%RESET%
echo ----------------------------------------

:: Check Next.js configuration
if exist next.config.ts (
    type next.config.ts | findstr "output.*export" >nul
    if %errorlevel% equ 0 (
        echo %GREEN%  ✓ Static export configured%RESET%
        set /a CHECKS_PASSED+=1
    ) else (
        echo %YELLOW%  ⚠ Static export may not be configured%RESET%
        set /a WARNINGS+=1
    )
)

:: Check for previous builds
if exist .next (
    echo %YELLOW%  ⚠ Previous build exists (.next)%RESET%
    echo     Will be cleaned during deployment
    set /a WARNINGS+=1
)
if exist out (
    echo %YELLOW%  ⚠ Previous export exists (out)%RESET%
    echo     Will be cleaned during deployment
    set /a WARNINGS+=1
)
echo.

:: 7. Code quality pre-check
echo %CYAN%[7/10] Code Quality Pre-Check%RESET%
echo ----------------------------------------

:: Quick TypeScript check
echo Running quick TypeScript check...
call npm run type-check 2>nul
if %errorlevel% equ 0 (
    echo %GREEN%  ✓ No TypeScript errors%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %RED%  ✗ TypeScript errors detected%RESET%
    set /a ERRORS+=1
)

:: Quick lint check
echo Running quick lint check...
call npm run lint 2>nul
if %errorlevel% equ 0 (
    echo %GREEN%  ✓ No linting errors%RESET%
    set /a CHECKS_PASSED+=1
) else (
    echo %YELLOW%  ⚠ Linting issues detected%RESET%
    echo     Run 'npm run lint:fix' to auto-fix
    set /a WARNINGS+=1
)
echo.

:: 8. Git status (if available)
echo %CYAN%[8/10] Version Control Status%RESET%
echo ----------------------------------------

where git >nul 2>&1
if !errorlevel! equ 0 (
    :: Check if in git repo
    git rev-parse --git-dir >nul 2>&1
    if !errorlevel! equ 0 (
        :: Check for uncommitted changes
        git diff-index --quiet HEAD -- 2>nul
        if !errorlevel! neq 0 (
            echo %YELLOW%  ⚠ Uncommitted changes detected%RESET%
            echo     Consider committing before deployment
            set /a WARNINGS+=1
        ) else (
            echo %GREEN%  ✓ All changes committed%RESET%
            set /a CHECKS_PASSED+=1
        )
        
        :: Show current branch
        git branch --show-current >temp_branch.txt 2>&1
        set /p BRANCH=<temp_branch.txt
        del temp_branch.txt >nul 2>&1
        echo   Current branch: !BRANCH!
        
        :: Show last commit
        git log -1 --oneline >temp_commit.txt 2>&1
        set /p LAST_COMMIT=<temp_commit.txt
        del temp_commit.txt >nul 2>&1
        echo   Last commit: !LAST_COMMIT!
    ) else (
        echo %YELLOW%  ⚠ Not a git repository%RESET%
        set /a WARNINGS+=1
    )
) else (
    echo   Git not available
)
echo.

:: 9. Performance checks
echo %CYAN%[9/10] Build Performance Estimate%RESET%
echo ----------------------------------------

:: Check node_modules size
if exist node_modules (
    for /f "tokens=3" %%a in ('dir node_modules /s ^| findstr "File(s)"') do set NODE_SIZE=%%a
    echo   node_modules size: !NODE_SIZE! bytes
)

:: Count source files
for /f %%a in ('dir /b /s src\*.tsx src\*.ts 2^>nul ^| find /c /v ""') do set FILE_COUNT=%%a
echo   Source files: !FILE_COUNT!

:: Estimate build time
if !FILE_COUNT! gtr 50 (
    echo %YELLOW%  ⚠ Large project - build may take several minutes%RESET%
    set /a WARNINGS+=1
) else (
    echo %GREEN%  ✓ Build should complete quickly%RESET%
    set /a CHECKS_PASSED+=1
)
echo.

:: 10. Domain configuration
echo %CYAN%[10/10] Domain Configuration%RESET%
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

set /a TOTAL_CHECKS=CHECKS_PASSED+ERRORS+WARNINGS
echo Total checks: %TOTAL_CHECKS%
echo %GREEN%  Passed: %CHECKS_PASSED%%RESET%
echo %YELLOW%  Warnings: %WARNINGS%%RESET%
echo %RED%  Errors: %ERRORS%%RESET%
echo.

if %ERRORS% gtr 0 (
    echo %RED%╔════════════════════════════════════════════╗%RESET%
    echo %RED%║   ✗ DEPLOYMENT NOT RECOMMENDED            ║%RESET%
    echo %RED%║   Please fix errors before deploying      ║%RESET%
    echo %RED%╚════════════════════════════════════════════╝%RESET%
    echo.
    echo Recommended actions:
    echo   1. Fix all errors marked in red above
    echo   2. Run 'npm install' if dependencies are missing
    echo   3. Fix TypeScript/linting errors
    echo   4. Ensure all required files are present
    set EXIT_CODE=1
) else if %WARNINGS% gtr 5 (
    echo %YELLOW%╔════════════════════════════════════════════╗%RESET%
    echo %YELLOW%║   ⚠ MULTIPLE WARNINGS DETECTED            ║%RESET%
    echo %YELLOW%║   Review warnings before deployment       ║%RESET%
    echo %YELLOW%╚════════════════════════════════════════════╝%RESET%
    echo.
    echo Consider:
    echo   1. Running 'npm audit fix' for security issues
    echo   2. Updating outdated packages
    echo   3. Committing changes to version control
    echo   4. Installing CLI tools (Firebase, Vercel)
    set EXIT_CODE=0
) else (
    echo %GREEN%╔════════════════════════════════════════════╗%RESET%
    echo %GREEN%║   ✓ READY FOR DEPLOYMENT                  ║%RESET%
    echo %GREEN%║   All critical checks passed              ║%RESET%
    echo %GREEN%╚════════════════════════════════════════════╝%RESET%
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
