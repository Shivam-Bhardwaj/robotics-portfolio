import { test, expect } from '@playwright/test'
import { playAudit } from 'playwright-lighthouse'

// Note: This requires lighthouse to be installed
// npm install -D playwright-lighthouse

test.describe('Lighthouse Performance Audits', () => {
  test('Homepage should meet performance standards', async ({ page }) => {
    await page.goto('/')
    
    // Run Lighthouse audit
    await playAudit({
      page,
      thresholds: {
        performance: 85,
        accessibility: 95,
        'best-practices': 90,
        seo: 85,
        pwa: 50, // PWA score might be lower for portfolio sites
      },
      port: 9222, // Chrome debugging port
    })
  })

  test('Swarm page should meet performance standards', async ({ page }) => {
    await page.goto('/swarm')
    
    await playAudit({
      page,
      thresholds: {
        performance: 75, // Slightly lower due to canvas animations
        accessibility: 95,
        'best-practices': 90,
        seo: 80,
      },
      port: 9222,
    })
  })
})

// Manual Lighthouse testing utility
export class LighthouseUtils {
  static async runBasicPerformanceChecks(page: any) {
    // Basic performance metrics that don't require full Lighthouse
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      }
    })

    return metrics
  }

  static async checkResourceSizes(page: any) {
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map((resource: any) => ({
        name: resource.name,
        size: resource.transferSize || 0,
        type: resource.initiatorType,
        duration: resource.duration,
      }))
    })

    return resources
  }

  static async measureRenderPerformance(page: any) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0
        let startTime = performance.now()
        let lastFrameTime = startTime

        function measureFrame() {
          const currentTime = performance.now()
          const frameDuration = currentTime - lastFrameTime
          lastFrameTime = currentTime
          frameCount++

          if (frameCount >= 30) { // Measure 30 frames
            const totalDuration = currentTime - startTime
            const averageFPS = (frameCount / totalDuration) * 1000
            resolve({
              averageFPS,
              frameCount,
              totalDuration
            })
          } else {
            requestAnimationFrame(measureFrame)
          }
        }

        requestAnimationFrame(measureFrame)
      })
    })
  }
}

test.describe('Custom Performance Metrics', () => {
  test('Should have fast DOM content loaded time', async ({ page }) => {
    await page.goto('/')
    
    const metrics = await LighthouseUtils.runBasicPerformanceChecks(page)
    
    expect(metrics.domContentLoaded).toBeLessThan(1500) // < 1.5s
    expect(metrics.firstContentfulPaint).toBeLessThan(2000) // < 2s
  })

  test('Should load resources efficiently', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const resources = await LighthouseUtils.checkResourceSizes(page)
    
    // Check JavaScript bundle sizes
    const jsResources = resources.filter(r => r.type === 'script' && r.name.includes('.js'))
    const totalJSSize = jsResources.reduce((sum, r) => sum + r.size, 0)
    
    expect(totalJSSize).toBeLessThan(500 * 1024) // < 500KB total JS
    
    // Check CSS sizes
    const cssResources = resources.filter(r => r.type === 'link' && r.name.includes('.css'))
    const totalCSSSize = cssResources.reduce((sum, r) => sum + r.size, 0)
    
    expect(totalCSSSize).toBeLessThan(100 * 1024) // < 100KB total CSS
  })

  test('Should maintain smooth animations', async ({ page }) => {
    await page.goto('/swarm')
    
    // Start animation
    const canvas = page.locator('canvas')
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Measure frame rate
    const renderMetrics = await LighthouseUtils.measureRenderPerformance(page)
    
    // @ts-ignore
    expect(renderMetrics.averageFPS).toBeGreaterThan(30) // At least 30 FPS
  })

  test('Should handle memory efficiently', async ({ page }) => {
    await page.goto('/')
    
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })

    // Navigate and interact
    await page.getByRole('link', { name: 'Swarm' }).click()
    await page.waitForLoadState('networkidle')

    const canvas = page.locator('canvas')
    await canvas.click()
    await page.waitForTimeout(3000) // Let simulation run

    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })

    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory
      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(30 * 1024 * 1024) // < 30MB increase
    }
  })

  test('Should have fast Time to Interactive', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Wait for main content to be interactive
    await page.waitForFunction(() => {
      const mainButton = document.querySelector('a[href="/projects"]')
      const nav = document.querySelector('nav')
      return mainButton && nav && !document.querySelector('.loading')
    })
    
    const timeToInteractive = Date.now() - startTime
    
    expect(timeToInteractive).toBeLessThan(3000) // < 3s TTI
  })

  test('Should optimize Critical Rendering Path', async ({ page }) => {
    // Measure render-blocking resources
    const renderBlockingResources: string[] = []
    
    page.on('response', (response) => {
      const url = response.url()
      const contentType = response.headers()['content-type'] || ''
      
      // Check for render-blocking CSS
      if (contentType.includes('text/css') && !url.includes('async')) {
        renderBlockingResources.push(url)
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Should minimize render-blocking resources
    expect(renderBlockingResources.length).toBeLessThan(3)
  })

  test('Should have efficient font loading', async ({ page }) => {
    const fontRequests: any[] = []
    
    page.on('response', async (response) => {
      const url = response.url()
      if (url.includes('font') || response.headers()['content-type']?.includes('font')) {
        fontRequests.push({
          url,
          size: (await response.body()).length,
          status: response.status()
        })
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check font loading efficiency
    fontRequests.forEach(font => {
      expect(font.status).toBe(200)
      expect(font.size).toBeLessThan(200 * 1024) // < 200KB per font
    })
    
    // Total font size should be reasonable
    const totalFontSize = fontRequests.reduce((sum, font) => sum + font.size, 0)
    expect(totalFontSize).toBeLessThan(500 * 1024) // < 500KB total fonts
  })
})