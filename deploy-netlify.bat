@echo off
echo Building project...
npm run build
echo.
echo Installing Netlify CLI...
npm install -g netlify-cli
echo.
echo Deploying to Netlify...
netlify deploy --prod --dir=out
pause