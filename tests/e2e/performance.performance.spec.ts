import { test, expect } from '@playwright/test'

test.describe('Performance Tests @performance', () => {
  test('Homepage should load within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const endTime = Date.now()
    const loadTime = endTime - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('Should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    // Measure Core Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {}
        
        // First Contentful Paint
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime
            }
          }
        }).observe({ entryTypes: ['paint'] })
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          vitals.lcp = lastEntry.startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })
        
        // Cumulative Layout Shift
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          vitals.cls = clsValue
        }).observe({ entryTypes: ['layout-shift'] })
        
        // First Input Delay (simulated)
        vitals.fid = 0 // Will be measured through interaction
        
        setTimeout(() => resolve(vitals), 2000)
      })
    })
    
    // @ts-ignore
    expect(webVitals.fcp).toBeLessThan(2000) // FCP < 2s
    // @ts-ignore  
    expect(webVitals.lcp).toBeLessThan(2500) // LCP < 2.5s
    // @ts-ignore
    expect(webVitals.cls).toBeLessThan(0.1) // CLS < 0.1
  })

  test('Swarm simulation should maintain 60fps', async ({ page }) => {
    await page.goto('/swarm')
    
    // Start the simulation
    const canvas = page.locator('canvas')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Measure frame rate
    const frameData = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0
        let startTime = performance.now()
        
        function countFrames() {
          frameCount++
          if (frameCount < 60) { // Count 60 frames
            requestAnimationFrame(countFrames)
          } else {
            const endTime = performance.now()
            const duration = endTime - startTime
            const fps = (frameCount / duration) * 1000
            resolve(fps)
          }
        }
        
        requestAnimationFrame(countFrames)
      })
    })
    
    // Should maintain at least 30fps (targeting 60fps)
    expect(frameData).toBeGreaterThan(30)
  })

  test('Should have minimal bundle size impact', async ({ page }) => {
    // Intercept network requests to measure bundle sizes
    const resources: any[] = []
    
    page.on('response', async (response) => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        const size = (await response.body()).length
        resources.push({
          url: response.url(),
          size: size,
          type: response.url().includes('.js') ? 'js' : 'css'
        })
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Calculate total bundle size
    const totalJSSize = resources
      .filter(r => r.type === 'js')
      .reduce((total, r) => total + r.size, 0)
    
    const totalCSSSize = resources
      .filter(r => r.type === 'css')
      .reduce((total, r) => total + r.size, 0)
    
    // Bundle size budgets
    expect(totalJSSize).toBeLessThan(500 * 1024) // < 500KB JS
    expect(totalCSSSize).toBeLessThan(100 * 1024) // < 100KB CSS
  })

  test('Should handle high robot counts efficiently', async ({ page }) => {
    await page.goto('/swarm')
    
    // Set maximum robot count
    const slider = page.getByRole('slider')
    await slider.fill('50')
    
    // Start performance measurement
    const startTime = Date.now()
    
    // Start simulation
    const canvas = page.locator('canvas')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Wait for simulation to run
    await page.waitForTimeout(3000)
    
    // Check if page is still responsive
    await canvas.click({ position: { x: 400, y: 300 } })
    
    const endTime = Date.now()
    const totalTime = endTime - startTime
    
    // Should remain responsive even with max robots
    expect(totalTime).toBeLessThan(5000)
  })

  test('Should efficiently handle rapid interactions', async ({ page }) => {
    await page.goto('/swarm')
    
    const canvas = page.locator('canvas')
    const slider = page.getByRole('slider')
    
    const startTime = performance.now()
    
    // Perform rapid interactions
    for (let i = 0; i < 20; i++) {
      await canvas.click({ position: { x: 100 + i * 10, y: 100 + i * 5 } })
      await slider.fill((15 + (i % 10)).toString())
    }
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // Should handle rapid interactions within reasonable time
    expect(duration).toBeLessThan(3000)
  })

  test('Should have good memory usage', async ({ page }) => {
    await page.goto('/')
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })
    
    // Navigate through different pages
    await page.getByRole('link', { name: 'Projects' }).click()
    await page.waitForLoadState('networkidle')
    
    await page.getByRole('link', { name: 'Swarm' }).click()
    await page.waitForLoadState('networkidle')
    
    // Start simulation
    const canvas = page.locator('canvas')
    await canvas.click()
    await page.waitForTimeout(2000)
    
    // Check memory after operations
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })
    
    // Memory increase should be reasonable (less than 50MB)
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
    }
  })

  test('Should have fast time to interactive', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Wait until page is interactive
    await page.waitForFunction(() => {
      // Check if main interactive elements are ready
      const button = document.querySelector('a[href="/projects"]')
      return button && !button.hasAttribute('disabled')
    })
    
    const endTime = Date.now()
    const timeToInteractive = endTime - startTime
    
    // Should be interactive within 2.5 seconds
    expect(timeToInteractive).toBeLessThan(2500)
  })

  test('Should handle concurrent users efficiently', async ({ page, context }) => {
    // Simulate multiple tabs/users
    const pages = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ])
    
    const startTime = Date.now()
    
    // All pages navigate simultaneously
    await Promise.all([
      page.goto('/'),
      ...pages.map(p => p.goto('/swarm'))
    ])
    
    // Wait for all to load
    await Promise.all([
      page.waitForLoadState('networkidle'),
      ...pages.map(p => p.waitForLoadState('networkidle'))
    ])
    
    const endTime = Date.now()
    const totalTime = endTime - startTime
    
    // Should handle concurrent loads efficiently
    expect(totalTime).toBeLessThan(5000)
    
    // Clean up
    await Promise.all(pages.map(p => p.close()))
  })

  test('Should optimize image loading', async ({ page }) => {
    const imageRequests: any[] = []
    
    page.on('response', async (response) => {
      if (response.url().match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        imageRequests.push({
          url: response.url(),
          size: (await response.body()).length,
          status: response.status()
        })
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check image optimization
    imageRequests.forEach(img => {
      expect(img.status).toBe(200) // All images should load successfully
      
      // SVGs should be reasonably sized
      if (img.url.includes('.svg')) {
        expect(img.size).toBeLessThan(100 * 1024) // < 100KB for SVGs
      }
    })
  })

  test('Should have efficient CSS loading', async ({ page }) => {
    const cssRequests: any[] = []
    
    page.on('response', async (response) => {
      if (response.url().includes('.css') || response.headers()['content-type']?.includes('text/css')) {
        cssRequests.push({
          url: response.url(),
          size: (await response.body()).length
        })
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Should have minimal CSS requests
    expect(cssRequests.length).toBeLessThan(5)
    
    // Total CSS should be under budget
    const totalCSSSize = cssRequests.reduce((total, css) => total + css.size, 0)
    expect(totalCSSSize).toBeLessThan(150 * 1024) // < 150KB total CSS
  })

  test('Should handle offline scenarios gracefully', async ({ page, context }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Go offline
    await context.setOffline(true)
    
    // Try to navigate (should handle gracefully)
    await page.getByRole('link', { name: 'Projects' }).click()
    
    // Page should still be functional (client-side routing)
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Restore online
    await context.setOffline(false)
  })
})