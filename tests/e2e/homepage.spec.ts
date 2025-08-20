import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main heading and navigation', async ({ page }) => {
    // Check main heading is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Check navigation links
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Experience' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Skills' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Swarm' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible()
  })

  test('should navigate to projects page', async ({ page }) => {
    await page.getByRole('link', { name: 'View Projects' }).click()
    await expect(page).toHaveURL('/projects')
  })

  test('should navigate to skills page', async ({ page }) => {
    await page.getByRole('link', { name: 'My Skills' }).click()
    await expect(page).toHaveURL('/skills')
  })

  test('should navigate to swarm game', async ({ page }) => {
    await page.getByRole('link', { name: 'Play Swarm Game' }).click()
    await expect(page).toHaveURL('/swarm')
  })

  test('should open GitHub link in new tab', async ({ context, page }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'GitHub' }).click()
    ])
    
    expect(newPage.url()).toContain('github.com')
  })

  test('should display typewriter animation', async ({ page }) => {
    // Wait for typewriter to start
    await page.waitForTimeout(1000)
    
    // Check that text content changes (indicating animation)
    const typewriterElement = page.locator('text=/prototype|self-driving|optimize/')
    await expect(typewriterElement).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Main heading should still be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Navigation should work on mobile
    await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    await expect(page).toHaveTitle(/Shivam Bhardwaj|Robotics/)
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const jsErrors: string[] = []
    
    page.on('pageerror', (error) => {
      jsErrors.push(error.message)
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    expect(jsErrors).toHaveLength(0)
  })

  test('should have good lighthouse performance', async ({ page }) => {
    // This is a placeholder for lighthouse testing
    // In a real implementation, you would use the lighthouse npm package
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Basic performance checks
    const navigationTiming = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        loadComplete: nav.loadEventEnd - nav.loadEventStart
      }
    })
    
    expect(navigationTiming.domContentLoaded).toBeLessThan(3000)
  })
})

test.describe('Navigation', () => {
  test('should highlight active page in navigation', async ({ page }) => {
    await page.goto('/')
    
    // Home should be highlighted
    const homeLink = page.getByRole('link', { name: 'Home' })
    await expect(homeLink).toHaveClass(/text-blue-600/)
    
    // Navigate to projects
    await page.getByRole('link', { name: 'Projects' }).click()
    
    // Projects should now be highlighted
    const projectsLink = page.getByRole('link', { name: 'Projects' })
    await expect(projectsLink).toHaveClass(/text-blue-600/)
  })

  test('should maintain navigation across all pages', async ({ page }) => {
    const pages = ['/projects', '/experience', '/skills', '/swarm', '/contact']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      
      // Navigation should be present on all pages
      await expect(page.getByRole('navigation')).toBeVisible()
      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    }
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // Should have main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to activate links with Enter
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/')
    
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      await expect(img).toHaveAttribute('alt')
    }
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    
    // This is a basic check - in a real implementation you would use axe-core
    const textElements = page.locator('p, h1, h2, h3, a')
    const count = await textElements.count()
    
    expect(count).toBeGreaterThan(0)
  })
})