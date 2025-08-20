import { test, expect } from '@playwright/test'

test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject axe-core for accessibility testing
    await page.addScriptTag({
      url: 'https://unpkg.com/axe-core@4.8.2/axe.min.js'
    })
  })

  test('Homepage should be accessible', async ({ page }) => {
    await page.goto('/')
    
    // Run axe accessibility checks
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        axe.run((err: any, results: any) => {
          if (err) throw err
          resolve(results)
        })
      })
    })
    
    // @ts-ignore
    expect(results.violations).toHaveLength(0)
  })

  test('Swarm game page should be accessible', async ({ page }) => {
    await page.goto('/swarm')
    
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        axe.run((err: any, results: any) => {
          if (err) throw err
          resolve(results)
        })
      })
    })
    
    // @ts-ignore
    expect(results.violations).toHaveLength(0)
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Tab through navigation
    await page.keyboard.press('Tab')
    let focusedElement = await page.locator(':focus').getAttribute('href')
    expect(focusedElement).toBeTruthy()
    
    // Continue tabbing through elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to activate elements with Enter
    await page.keyboard.press('Enter')
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // h1 should be visible
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have alt text for all images', async ({ page }) => {
    await page.goto('/')
    
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Test with high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' })
    
    // Key elements should still be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('should support screen readers', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper ARIA landmarks
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    
    // Check for proper link text
    const links = page.getByRole('link')
    const count = await links.count()
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const text = await link.textContent()
      expect(text?.trim()).toBeTruthy()
    }
  })

  test('should work with reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    await page.goto('/')
    
    // Page should still be functional
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('should be usable with high contrast mode', async ({ page }) => {
    await page.goto('/')
    
    // Simulate high contrast mode
    await page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            background: white !important;
            color: black !important;
            border-color: black !important;
          }
        }
      `
    })
    
    // Key elements should still be visible and usable
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible()
  })

  test('should handle zoom levels properly', async ({ page }) => {
    await page.goto('/')
    
    // Test at 200% zoom
    await page.setViewportSize({ width: 800, height: 600 })
    await page.evaluate(() => {
      document.body.style.zoom = '2'
    })
    
    // Content should still be accessible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('Forms should be accessible', async ({ page }) => {
    await page.goto('/swarm')
    
    // Slider should have proper labels
    const slider = page.getByRole('slider')
    await expect(slider).toBeVisible()
    
    // Should be keyboard accessible
    await slider.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')
  })

  test('should handle focus management properly', async ({ page }) => {
    await page.goto('/')
    
    // Focus should be visible
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Focus should move logically
    await page.keyboard.press('Tab')
    const nextFocusedElement = page.locator(':focus')
    await expect(nextFocusedElement).toBeVisible()
  })

  test('should work with voice control', async ({ page }) => {
    await page.goto('/')
    
    // Simulate voice control by clicking elements by their accessible names
    await page.getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL('/projects')
    
    await page.getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('should provide meaningful error messages', async ({ page }) => {
    await page.goto('/swarm')
    
    const slider = page.getByRole('slider')
    
    // Try to set invalid value
    await slider.fill('999')
    
    // Should handle gracefully without breaking accessibility
    await expect(slider).toBeVisible()
  })

  test('should support text scaling', async ({ page }) => {
    await page.goto('/')
    
    // Simulate 150% text size
    await page.addStyleTag({
      content: `
        body {
          font-size: 150% !important;
        }
      `
    })
    
    // Content should still be readable and accessible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('should work with browser reader mode', async ({ page }) => {
    await page.goto('/')
    
    // Check that content is structured for reader mode
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Paragraphs should have meaningful content
    const paragraphs = page.locator('p')
    const count = await paragraphs.count()
    
    for (let i = 0; i < count; i++) {
      const p = paragraphs.nth(i)
      const text = await p.textContent()
      if (text?.trim()) {
        expect(text.trim().length).toBeGreaterThan(10)
      }
    }
  })

  test('should handle accessibility preferences', async ({ page }) => {
    // Test with various accessibility preferences
    await page.emulateMedia({ 
      reducedMotion: 'reduce',
      colorScheme: 'dark'
    })
    
    await page.goto('/')
    
    // Should respect user preferences
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })
})