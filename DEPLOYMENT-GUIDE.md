# Deployment Guide

## Option 1: Vercel (Recommended)

### Manual Deployment Steps:
1. Open Command Prompt in project folder
2. Run: `vercel`
3. Follow the prompts:
   - Login to Vercel (browser will open)
   - Choose "Link to existing project" or "Create new project"
   - Select your project settings
   - Deploy!

### Commands to run:
```bash
# In the project directory
cd "C:\Users\Curio\OneDrive\Desktop\SbT\my website\robotics-portfolio"
vercel
```

### If you get errors:
```bash
# First build the project
npm run build

# Then deploy
vercel --prod
```

## Option 2: Netlify Drop (Easiest for beginners)

1. Build the project: Run `build.bat`
2. Go to https://app.netlify.com/drop
3. Drag and drop the `out` folder to the website
4. Get instant live URL!

## Option 3: GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source: GitHub Actions
4. Create workflow file (I can help with this)

## Option 4: Firebase Hosting

1. Run `deploy-firebase.bat`
2. Follow authentication steps
3. Deploy to Firebase

## Quick Netlify Drop Method (No CLI needed):

1. Double-click `build.bat` to create the `out` folder
2. Go to https://app.netlify.com/drop
3. Drag the entire `out` folder to the drop zone
4. Get your live website URL instantly!

This is the easiest method if Vercel CLI isn't working.