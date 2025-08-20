# Troubleshooting Guide

This guide provides solutions to common issues encountered during development, building, and deployment of the Robotics Portfolio website.

## Table of Contents

- [Development Issues](#development-issues)
- [Build Issues](#build-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)
- [Component Issues](#component-issues)
- [TypeScript Issues](#typescript-issues)
- [Styling Issues](#styling-issues)
- [Interactive Features Issues](#interactive-features-issues)
- [Browser Compatibility](#browser-compatibility)
- [Getting Help](#getting-help)

## Development Issues

### Development Server Won't Start

**Issue:** `npm run dev` fails to start or crashes

**Solutions:**

1. **Check Node.js version**
   ```bash
   node --version  # Should be 18.0 or higher
   npm --version   # Should be 8.0 or higher
   ```

2. **Clear cache and reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run dev
   ```

3. **Check for port conflicts**
   ```bash
   # Default port 3000 might be in use
   npm run dev -- --port 3001
   ```

4. **Verify environment setup**
   ```bash
   # Check if all required dependencies are installed
   npm list --depth=0
   ```

### Hot Reload Not Working

**Issue:** Changes not reflecting in browser during development

**Solutions:**

1. **Check file watchers**
   ```bash
   # On Linux/macOS, increase file watcher limit
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart development server**
   ```bash
   # Stop with Ctrl+C, then restart
   npm run dev
   ```

3. **Clear browser cache**
   - Hard refresh: Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (macOS)
   - Open DevTools > Network tab > check "Disable cache"

### Module Resolution Errors

**Issue:** Cannot resolve module paths or TypeScript path aliases

**Solutions:**

1. **Check tsconfig.json paths**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"],
         "@/components/*": ["./src/components/*"],
         "@/data/*": ["./src/data/*"]
       }
     }
   }
   ```

2. **Verify file extensions**
   ```typescript
   // Use explicit extensions for non-TypeScript files
   import data from '@/data/site.ts';  // Good
   import data from '@/data/site';     // May cause issues
   ```

3. **Restart TypeScript server in VS Code**
   - Cmd/Ctrl + Shift + P
   - "TypeScript: Restart TS Server"

## Build Issues

### Build Fails with TypeScript Errors

**Issue:** `npm run build` fails due to TypeScript compilation errors

**Solutions:**

1. **Run type checking separately**
   ```bash
   npm run type-check  # Identifies specific type errors
   ```

2. **Common type fixes**
   ```typescript
   // Fix missing type definitions
   interface ComponentProps {
     children?: React.ReactNode;  // Add ? for optional props
     onClick?: () => void;        // Use ? for optional callbacks
   }
   
   // Fix any types
   const data: ProjectData[] = projectsData;  // Use specific types
   ```

3. **Check for unused imports**
   ```bash
   npm run lint:fix  # Automatically fix import issues
   ```

### Build Fails with Memory Issues

**Issue:** Build process runs out of memory

**Solutions:**

1. **Increase Node.js memory limit**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. **Add to package.json scripts**
   ```json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
     }
   }
   ```

3. **Clear build cache**
   ```bash
   rm -rf .next
   npm run build
   ```

### Static Export Issues

**Issue:** `npm run export` fails or produces incorrect output

**Solutions:**

1. **Check next.config.ts configuration**
   ```typescript
   const nextConfig = {
     output: 'export',        // Required for static export
     trailingSlash: true,     // Ensures proper routing
     images: {
       unoptimized: true,     // Required for static hosting
     },
   };
   ```

2. **Verify no server-side features**
   ```typescript
   // Avoid these in static export
   export async function getServerSideProps() { /* ... */ }  // Not allowed
   
   // Use these instead
   export async function generateStaticParams() { /* ... */ }  // Allowed
   ```

3. **Check for dynamic imports**
   ```typescript
   // Ensure dynamic components have proper fallbacks
   const DynamicComponent = dynamic(() => import('./Component'), {
     ssr: false,  // Disable SSR for client-only components
   });
   ```

## Deployment Issues

### Firebase Deployment Fails

**Issue:** `firebase deploy` fails or deploys incorrectly

**Solutions:**

1. **Check Firebase configuration**
   ```json
   // firebase.json
   {
     "hosting": {
       "public": "out",     // Must match export directory
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ]
     }
   }
   ```

2. **Verify build output**
   ```bash
   npm run build
   npm run export
   ls out/  # Should contain index.html and other files
   ```

3. **Check Firebase CLI version**
   ```bash
   firebase --version  # Update if outdated
   npm install -g firebase-tools
   ```

4. **Re-authenticate Firebase**
   ```bash
   firebase logout
   firebase login
   ```

### Vercel Deployment Issues

**Issue:** Vercel build fails or application doesn't work correctly

**Solutions:**

1. **Check build settings in Vercel dashboard**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: (leave empty)
   Install Command: npm install
   ```

2. **Verify environment variables**
   - Check Vercel dashboard > Project > Settings > Environment Variables
   - Ensure all required variables are set

3. **Check build logs**
   - Go to Vercel dashboard > Deployments
   - Click on failed deployment to view logs

### Custom Domain Issues

**Issue:** Custom domain not working or SSL certificate issues

**Solutions:**

1. **Verify DNS configuration**
   ```bash
   # Check DNS propagation
   nslookup yourdomain.com
   dig yourdomain.com
   ```

2. **Common DNS settings**
   ```
   # For Firebase Hosting
   Type: A, Name: @, Value: 151.101.1.195
   Type: A, Name: @, Value: 151.101.65.195
   
   # For Vercel
   Type: CNAME, Name: www, Value: cname.vercel-dns.com
   ```

3. **Wait for propagation**
   - DNS changes can take 24-48 hours to propagate globally
   - Use online DNS checkers to verify propagation

## Performance Issues

### Slow Page Loading

**Issue:** Pages take too long to load

**Solutions:**

1. **Analyze bundle size**
   ```bash
   npm run build:analyze  # If script exists
   # Or use webpack-bundle-analyzer manually
   ```

2. **Optimize images**
   ```bash
   # Use image optimization tools
   npm install -g imagemin-cli
   imagemin public/*.{jpg,png} --out-dir=public/optimized
   ```

3. **Check for large dependencies**
   ```bash
   npm list --depth=0 --production
   # Remove unused dependencies
   npm uninstall unused-package
   ```

### Slow Animations

**Issue:** Framer Motion animations are janky or slow

**Solutions:**

1. **Use transform properties**
   ```typescript
   // Good - hardware accelerated
   <motion.div
     animate={{ x: 100, y: 100, scale: 1.2 }}
     transition={{ type: "spring" }}
   />
   
   // Avoid - causes layout recalculation
   <motion.div
     animate={{ left: 100, top: 100, width: 200 }}
   />
   ```

2. **Reduce motion for accessibility**
   ```typescript
   const shouldReduceMotion = useReducedMotion();
   
   <motion.div
     animate={shouldReduceMotion ? {} : { x: 100 }}
   />
   ```

3. **Optimize animation complexity**
   ```typescript
   // Simplify complex animations
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.3 }}  // Shorter durations
   />
   ```

## Component Issues

### Swarm Game Not Working

**Issue:** Interactive swarm game doesn't respond or crashes

**Solutions:**

1. **Check canvas support**
   ```typescript
   useEffect(() => {
     const canvas = canvasRef.current;
     if (!canvas) {
       console.error('Canvas not supported');
       return;
     }
     const ctx = canvas.getContext('2d');
     if (!ctx) {
       console.error('2D context not supported');
       return;
     }
   }, []);
   ```

2. **Verify mouse event handling**
   ```typescript
   const handleMouseMove = useCallback((event: MouseEvent) => {
     const canvas = canvasRef.current;
     if (!canvas) return;
     
     const rect = canvas.getBoundingClientRect();
     const x = event.clientX - rect.left;
     const y = event.clientY - rect.top;
     
     setMousePosition({ x, y });
   }, []);
   ```

3. **Check animation loop**
   ```typescript
   useEffect(() => {
     let animationId: number;
     
     const animate = () => {
       updateRobots();
       render();
       animationId = requestAnimationFrame(animate);
     };
     
     animate();
     
     return () => {
       if (animationId) {
         cancelAnimationFrame(animationId);
       }
     };
   }, []);
   ```

### Typewriter Component Issues

**Issue:** Typewriter animation not working or displaying incorrectly

**Solutions:**

1. **Check phrase array**
   ```typescript
   // Ensure phrases is not empty
   const phrases = useMemo(() => 
     props.phrases.filter(phrase => phrase.trim().length > 0), 
     [props.phrases]
   );
   ```

2. **Verify timing configuration**
   ```typescript
   const defaultConfig = {
     speed: 50,           // Typing speed in ms
     deleteSpeed: 30,     // Deletion speed in ms
     pauseDuration: 2000, // Pause between phrases in ms
   };
   ```

3. **Debug animation state**
   ```typescript
   useEffect(() => {
     console.log('Typewriter state:', {
       currentPhrase,
       currentText,
       isDeleting,
       phraseIndex
     });
   }, [currentPhrase, currentText, isDeleting, phraseIndex]);
   ```

## TypeScript Issues

### Type Definition Errors

**Issue:** TypeScript cannot find type definitions

**Solutions:**

1. **Install missing type definitions**
   ```bash
   npm install --save-dev @types/react @types/react-dom @types/node
   ```

2. **Create custom type definitions**
   ```typescript
   // src/types/global.d.ts
   declare module '*.svg' {
     const content: any;
     export default content;
   }
   
   declare module '*.json' {
     const value: any;
     export default value;
   }
   ```

3. **Update tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "typeRoots": ["./src/types", "./node_modules/@types"],
       "types": ["node", "react", "react-dom"]
     }
   }
   ```

### Strict Mode Errors

**Issue:** TypeScript strict mode causing compilation errors

**Solutions:**

1. **Fix null/undefined checks**
   ```typescript
   // Before
   const element = document.getElementById('myId');
   element.style.display = 'none';  // Error: element might be null
   
   // After
   const element = document.getElementById('myId');
   if (element) {
     element.style.display = 'none';
   }
   ```

2. **Add proper typing for event handlers**
   ```typescript
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
     event.preventDefault();
     // Handler logic
   };
   ```

3. **Use type assertions carefully**
   ```typescript
   // Avoid
   const data = response as any;
   
   // Better
   interface ApiResponse {
     id: string;
     name: string;
   }
   const data = response as ApiResponse;
   ```

## Styling Issues

### Tailwind CSS Not Working

**Issue:** Tailwind CSS classes not being applied

**Solutions:**

1. **Check Tailwind configuration**
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       './src/**/*.{js,ts,jsx,tsx}',  // Ensure correct paths
       './app/**/*.{js,ts,jsx,tsx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

2. **Verify CSS imports**
   ```css
   /* src/app/globals.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Check PostCSS configuration**
   ```javascript
   // postcss.config.js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

### Responsive Design Issues

**Issue:** Layout breaks on different screen sizes

**Solutions:**

1. **Use mobile-first approach**
   ```typescript
   // Good
   <div className="text-sm md:text-base lg:text-lg">
   
   // Avoid
   <div className="lg:text-lg md:text-base text-sm">
   ```

2. **Test on multiple screen sizes**
   ```typescript
   // Common breakpoints to test
   // Mobile: 320px - 768px
   // Tablet: 768px - 1024px
   // Desktop: 1024px+
   ```

3. **Use CSS Grid for complex layouts**
   ```typescript
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
   ```

## Interactive Features Issues

### Mouse Events Not Working

**Issue:** Mouse interactions don't work correctly

**Solutions:**

1. **Check event listeners**
   ```typescript
   useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
       // Handle mouse move
     };
     
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
   }, []);
   ```

2. **Verify touch device support**
   ```typescript
   const handleTouch = (e: TouchEvent) => {
     e.preventDefault();
     const touch = e.touches[0];
     // Handle touch event
   };
   
   useEffect(() => {
     element.addEventListener('touchmove', handleTouch, { passive: false });
   }, []);
   ```

### Canvas Rendering Issues

**Issue:** Canvas elements not rendering correctly

**Solutions:**

1. **Check canvas dimensions**
   ```typescript
   useEffect(() => {
     const canvas = canvasRef.current;
     if (canvas) {
       // Set display size (CSS)
       canvas.style.width = '100%';
       canvas.style.height = '400px';
       
       // Set actual size (for drawing)
       canvas.width = canvas.offsetWidth;
       canvas.height = canvas.offsetHeight;
     }
   }, []);
   ```

2. **Handle high-DPI displays**
   ```typescript
   const setupCanvas = (canvas: HTMLCanvasElement) => {
     const ctx = canvas.getContext('2d');
     const dpr = window.devicePixelRatio || 1;
     
     canvas.width = canvas.offsetWidth * dpr;
     canvas.height = canvas.offsetHeight * dpr;
     
     ctx?.scale(dpr, dpr);
   };
   ```

## Browser Compatibility

### Safari Issues

**Common Safari-specific issues and solutions:**

1. **CSS Grid issues**
   ```css
   /* Use prefixes for better Safari support */
   .grid-container {
     display: -webkit-grid;
     display: grid;
     -webkit-grid-template-columns: repeat(3, 1fr);
     grid-template-columns: repeat(3, 1fr);
   }
   ```

2. **Date handling**
   ```typescript
   // Safari doesn't parse YYYY-MM-DD format well
   const date = new Date('2023-12-25');  // May fail in Safari
   const date = new Date(2023, 11, 25);  // Better
   ```

### Internet Explorer (Legacy Support)

**If IE support is required:**

1. **Add polyfills**
   ```bash
   npm install --save core-js
   ```

2. **Use Babel configuration**
   ```json
   // .babelrc
   {
     "presets": [
       ["@babel/preset-env", {
         "targets": "> 0.25%, not dead",
         "useBuiltIns": "usage",
         "corejs": 3
       }]
     ]
   }
   ```

## Getting Help

### Debug Information to Collect

When reporting issues, include:

1. **Environment information**
   ```bash
   node --version
   npm --version
   # Browser version
   # Operating system
   ```

2. **Error messages**
   - Full console output
   - Browser DevTools errors
   - Build logs

3. **Steps to reproduce**
   - Exact commands run
   - Expected vs actual behavior
   - Screenshots or videos

### Useful Debug Commands

```bash
# Check dependency versions
npm list

# Clear all caches
rm -rf .next node_modules package-lock.json
npm install

# Run with verbose logging
DEBUG=* npm run dev

# Check for package vulnerabilities
npm audit

# Verify TypeScript configuration
npx tsc --showConfig
```

### Community Resources

- **GitHub Issues**: Report bugs and feature requests
- **Stack Overflow**: General development questions
- **Next.js Documentation**: Framework-specific guidance
- **React Documentation**: Component and hook guidance
- **TypeScript Handbook**: Type system guidance

### Contacting Support

If you cannot resolve an issue:

1. Search existing GitHub issues
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Environment information
   - Error messages/logs
   - Screenshots if applicable

**Contact Information:**
- Email: contact@shivambhardwaj.com
- GitHub: [Shivam-Bhardwaj](https://github.com/Shivam-Bhardwaj)

---

This troubleshooting guide covers the most common issues encountered with the Robotics Portfolio. Keep this document updated as new issues and solutions are discovered.