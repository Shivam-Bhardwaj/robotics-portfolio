# Deployment Guide

This guide covers all deployment options and configurations for the Robotics Portfolio website.

## Table of Contents

- [Overview](#overview)
- [Build Process](#build-process)
- [Firebase Hosting (Primary)](#firebase-hosting-primary)
- [Vercel Deployment](#vercel-deployment)
- [Static Export](#static-export)
- [GitHub Pages](#github-pages)
- [Custom Domain Configuration](#custom-domain-configuration)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Analytics](#monitoring-and-analytics)

## Overview

The Robotics Portfolio is a static Next.js application that can be deployed to various hosting platforms. The recommended deployment methods are Firebase Hosting and Vercel, both offering excellent performance and developer experience.

### Deployment Requirements

- Node.js 18.0 or higher
- Build tools (npm/yarn/pnpm)
- Git for version control
- Hosting platform account

## Build Process

### Local Build

Before deploying, ensure the application builds successfully locally:

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build the application
npm run build

# Test the build locally
npm run start
```

### Build Output

Next.js generates optimized static files in the `.next` directory:

```
.next/
├── static/              # Static assets with cache-friendly names
├── server/              # Server-side components (not used in static export)
└── standalone/          # Standalone application (if configured)
```

For static hosting, use the export command:

```bash
npm run export
```

This creates an `out/` directory with all static files ready for deployment.

## Firebase Hosting (Primary)

Firebase Hosting is the primary deployment platform for the Robotics Portfolio.

### Prerequisites

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not already done)**
   ```bash
   firebase init hosting
   ```

### Configuration

The project includes a `firebase.json` configuration file:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

3. **Verify deployment**
   - Check the deployment URL provided by Firebase
   - Test all pages and functionality
   - Verify responsive design on different devices

### Custom Domain Setup

1. **Add custom domain in Firebase Console**
   - Go to Firebase Console > Hosting
   - Click "Add custom domain"
   - Enter your domain (e.g., shivambhardwaj.com)

2. **Configure DNS records**
   ```
   Type: A
   Name: @
   Value: 151.101.1.195
   
   Type: A
   Name: @
   Value: 151.101.65.195
   ```

3. **Verify domain ownership**
   - Follow Firebase's domain verification process
   - SSL certificate will be automatically provisioned

## Vercel Deployment

Vercel offers seamless Next.js deployment with automatic optimizations.

### Automatic Deployment

1. **Connect GitHub repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure project settings**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: (leave empty - Next.js default)
   Install Command: npm install
   Development Command: npm run dev
   ```

3. **Deploy**
   - Vercel automatically builds and deploys
   - Every push to main branch triggers new deployment
   - Pull requests get preview deployments

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables

Configure environment variables in Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add any required environment variables
- Redeploy to apply changes

## Static Export

For hosting on any static file server (Nginx, Apache, CDN):

### Generate Static Files

```bash
# Build and export
npm run build
npm run export

# The 'out' directory contains all static files
```

### Server Configuration

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/out/directory;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

#### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/out/directory
    
    # Handle client-side routing
    <Directory "/path/to/out/directory">
        Options -Indexes
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Cache static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

## GitHub Pages

Deploy to GitHub Pages for free static hosting:

### Setup GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: |
          npm run build
          npm run export
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Configure GitHub Pages

1. Go to repository Settings > Pages
2. Select "GitHub Actions" as source
3. Save configuration
4. Push to main branch to trigger deployment

## Custom Domain Configuration

### DNS Configuration

For apex domain (example.com):
```
Type: A
Name: @
Value: [Your hosting provider's IP]

Type: AAAA (if IPv6 supported)
Name: @
Value: [Your hosting provider's IPv6]
```

For subdomain (www.example.com):
```
Type: CNAME
Name: www
Value: [Your hosting provider's domain]
```

### SSL/TLS Configuration

Most modern hosting platforms (Firebase, Vercel, GitHub Pages) provide automatic SSL certificate provisioning. For custom servers:

1. **Let's Encrypt (recommended)**
   ```bash
   # Install Certbot
   sudo apt-get install certbot python3-certbot-nginx
   
   # Generate certificate
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

2. **Configure auto-renewal**
   ```bash
   sudo crontab -e
   # Add line: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Environment Configuration

### Production Environment Variables

Create environment-specific configuration:

```typescript
// src/config/environment.ts
export const config = {
  production: process.env.NODE_ENV === 'production',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://shivambhardwaj.com',
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@shivambhardwaj.com',
  },
};
```

### Build-time Configuration

Add to `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
```

## Performance Optimization

### Build Optimization

1. **Bundle Analysis**
   ```bash
   npm run build:analyze
   ```

2. **Image Optimization**
   - Use next/image component (when not using static export)
   - Optimize images before adding to public folder
   - Use appropriate formats (WebP, AVIF)

3. **Code Splitting**
   - Automatic with Next.js App Router
   - Use dynamic imports for large components

### CDN Configuration

Configure CDN for better global performance:

```typescript
// next.config.ts
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : '',
};
```

### Caching Strategy

```javascript
// Cache-Control headers for different asset types
const cacheConfig = {
  static: 'public, max-age=31536000, immutable', // 1 year
  html: 'public, max-age=0, must-revalidate',     // Always revalidate
  api: 'public, max-age=3600',                    // 1 hour
};
```

## Monitoring and Analytics

### Google Analytics Setup

1. **Add tracking code**
   ```typescript
   // src/lib/analytics.ts
   export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
   
   export const pageview = (url: string) => {
     window.gtag('config', GA_TRACKING_ID, {
       page_path: url,
     });
   };
   ```

2. **Add to layout**
   ```tsx
   // src/app/layout.tsx
   import Script from 'next/script';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <head>
           <Script
             src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
             strategy="afterInteractive"
           />
           <Script id="google-analytics" strategy="afterInteractive">
             {`
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', '${GA_TRACKING_ID}');
             `}
           </Script>
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

### Performance Monitoring

1. **Core Web Vitals**
   - Use Google PageSpeed Insights
   - Monitor Lighthouse scores
   - Track real user metrics

2. **Error Tracking**
   - Implement error boundaries
   - Use services like Sentry for production monitoring

3. **Uptime Monitoring**
   - Configure uptime monitoring (UptimeRobot, Pingdom)
   - Set up alerts for downtime

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Static Export Issues**
   - Ensure no server-side features are used
   - Check for dynamic imports that need static paths
   - Verify image optimization is disabled

3. **Routing Issues**
   - Configure server rewrites for client-side routing
   - Check trailing slash configuration
   - Verify 404 page handling

4. **Performance Issues**
   - Analyze bundle size
   - Optimize images
   - Enable compression
   - Configure proper caching headers

### Debug Commands

```bash
# Check build output
npm run build -- --debug

# Analyze bundle
npm run build:analyze

# Test static export
npm run export && npx serve out

# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint
```

---

This deployment guide covers all major deployment scenarios and configurations. Choose the deployment method that best fits your requirements and infrastructure.