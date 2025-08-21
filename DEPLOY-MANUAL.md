# Manual Firebase Deployment Guide

If the deployment scripts are crashing, follow these manual steps:

## Prerequisites

1. **Check Node.js is installed:**
   ```bash
   node --version
   ```
   Should show v18.0.0 or higher

2. **Check Firebase CLI is installed:**
   ```bash
   firebase --version
   ```
   If not installed, run:
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase:**
   ```bash
   firebase login
   ```

## Deployment Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Application
```bash
npm run build
```

This creates the `/out` directory with static files.

### Step 3: Deploy to Firebase
```bash
firebase deploy --only hosting
```

## Alternative: Deploy with npx (no global install needed)
```bash
npx firebase-tools deploy --only hosting
```

## Troubleshooting

### If terminal crashes:
1. Open a new terminal/command prompt
2. Navigate to project directory:
   ```bash
   cd C:\Users\Curio\OneDrive\Desktop\SbT\shivambhardwaj.com
   ```
3. Try deployment with verbose logging:
   ```bash
   firebase deploy --only hosting --debug
   ```

### If build fails:
1. Clean previous builds:
   ```bash
   rmdir /s /q .next out
   ```
2. Rebuild:
   ```bash
   npm run build
   ```

### If Firebase CLI issues:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Reinstall Firebase tools:
   ```bash
   npm uninstall -g firebase-tools
   npm install -g firebase-tools
   ```

## Quick Deploy (Copy & Paste)

Run these commands one by one:

```bash
npm install
npm run build
firebase deploy --only hosting
```

## Deployment URLs

After successful deployment, your site will be available at:
- https://anti-mony.web.app
- https://anti-mony.firebaseapp.com
- https://shivambhardwaj.com (if domain is configured)

## Verify Deployment

1. Open browser and go to: https://anti-mony.web.app
2. Check browser console for any errors (F12)
3. Test all interactive features

## Firebase Console

Monitor your deployment at:
https://console.firebase.google.com/project/anti-mony/hosting