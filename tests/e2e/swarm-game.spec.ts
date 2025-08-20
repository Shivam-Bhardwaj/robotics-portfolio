import { test, expect } from '@playwright/test'

test.describe('Swarm Game Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/swarm')
  })

  test('should display swarm game canvas', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
    
    const canvas = page.locator('canvas')
    await expect(canvas).toHaveAttribute('width', '600')
    await expect(canvas).toHaveAttribute('height', '400')
  })

  test('should display robot count slider', async ({ page }) => {
    const slider = page.getByRole('slider')
    await expect(slider).toBeVisible()
    
    // Check default value
    await expect(slider).toHaveValue('15')
    
    // Check min/max values
    await expect(slider).toHaveAttribute('min', '5')
    await expect(slider).toHaveAttribute('max', '50')
  })

  test('should update robot count when slider changes', async ({ page }) => {
    const slider = page.getByRole('slider')
    
    // Change slider value
    await slider.fill('25')
    
    // Check that the label updates
    await expect(page.getByText('Robots: 25')).toBeVisible()
  })

  test('should display game instructions', async ({ page }) => {
    await expect(page.getByText('Click canvas to set target and gather the swarm.')).toBeVisible()
  })

  test('should display time counter', async ({ page }) => {
    await expect(page.getByText(/Time: \d+\.\d+s/)).toBeVisible()
  })

  test('should start game when canvas is clicked', async ({ page }) => {
    const canvas = page.locator('canvas')
    
    // Click on canvas
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Timer should start running
    await page.waitForTimeout(100)
    
    // Time should still be displayed (exact value may vary)
    await expect(page.getByText(/Time: /)).toBeVisible()
  })

  test('should handle multiple canvas clicks', async ({ page }) => {
    const canvas = page.locator('canvas')
    
    // Click multiple times
    await canvas.click({ position: { x: 100, y: 100 } })
    await canvas.click({ position: { x: 200, y: 200 } })
    await canvas.click({ position: { x: 300, y: 300 } })
    
    // Game should still be functional
    await expect(page.getByText(/Time: /)).toBeVisible()
  })

  test('should reset game when robot count changes', async ({ page }) => {
    const canvas = page.locator('canvas')
    const slider = page.getByRole('slider')
    
    // Start game
    await canvas.click()
    await page.waitForTimeout(100)
    
    // Change robot count
    await slider.fill('30')
    
    // Time should reset
    await expect(page.getByText('Time: 0.0s')).toBeVisible()
  })

  test('should handle rapid slider changes', async ({ page }) => {
    const slider = page.getByRole('slider')
    
    // Rapidly change values
    await slider.fill('10')
    await slider.fill('20')
    await slider.fill('30')
    await slider.fill('40')
    
    // Should end up with final value
    await expect(page.getByText('Robots: 40')).toBeVisible()
  })

  test('should work with different viewport sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(page.locator('canvas')).toBeVisible()
    await expect(page.getByRole('slider')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    await expect(page.locator('canvas')).toBeVisible()
    await expect(page.getByRole('slider')).toBeVisible()
  })

  test('should maintain game state during interactions', async ({ page }) => {
    const slider = page.getByRole('slider')
    const canvas = page.locator('canvas')
    
    // Set specific robot count
    await slider.fill('20')
    await expect(page.getByText('Robots: 20')).toBeVisible()
    
    // Start game
    await canvas.click({ position: { x: 250, y: 150 } })
    
    // Game should be running with correct robot count
    await expect(page.getByText('Robots: 20')).toBeVisible()
    await expect(page.getByText(/Time: /)).toBeVisible()
  })

  test('should handle edge cases for slider values', async ({ page }) => {
    const slider = page.getByRole('slider')
    
    // Test minimum value
    await slider.fill('5')
    await expect(page.getByText('Robots: 5')).toBeVisible()
    
    // Test maximum value
    await slider.fill('50')
    await expect(page.getByText('Robots: 50')).toBeVisible()
    
    // Test invalid high value (should clamp)
    await slider.fill('999')
    await expect(slider).toHaveValue('50')
  })

  test('should be accessible via keyboard', async ({ page }) => {
    // Tab to slider
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Use arrow keys to change value
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    
    // Value should change
    const slider = page.getByRole('slider')
    const value = await slider.inputValue()
    expect(parseInt(value)).toBeGreaterThan(15)
  })

  test('should load without errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    
    await page.goto('/swarm')
    await page.waitForLoadState('networkidle')
    
    expect(errors).toHaveLength(0)
  })
})

test.describe('Swarm Game Performance', () => {
  test('should handle animation smoothly', async ({ page }) => {
    await page.goto('/swarm')
    
    const canvas = page.locator('canvas')
    
    // Start game
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Let it run for a bit
    await page.waitForTimeout(2000)
    
    // Should still be responsive
    await canvas.click({ position: { x: 400, y: 300 } })
    
    // No JS errors should occur
    await expect(page.getByText(/Time: /)).toBeVisible()
  })

  test('should handle high robot counts', async ({ page }) => {
    await page.goto('/swarm')
    
    const slider = page.getByRole('slider')
    const canvas = page.locator('canvas')
    
    // Set maximum robots
    await slider.fill('50')
    await expect(page.getByText('Robots: 50')).toBeVisible()
    
    // Start game
    await canvas.click({ position: { x: 300, y: 200 } })
    
    // Should still work smoothly
    await page.waitForTimeout(1000)
    await expect(page.getByText(/Time: /)).toBeVisible()
  })
})

test.describe('Swarm Game Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/swarm')
    
    const slider = page.getByRole('slider')
    await expect(slider).toBeVisible()
    
    // Should be accessible
    await expect(slider).toHaveAttribute('type', 'range')
  })

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/swarm')
    
    // Check for proper structure
    const container = page.locator('.flex.flex-col.items-center')
    await expect(container).toBeVisible()
  })

  test('should provide meaningful text content', async ({ page }) => {
    await page.goto('/swarm')
    
    // All text should be meaningful
    await expect(page.getByText('Robots:')).toBeVisible()
    await expect(page.getByText('Time:')).toBeVisible()
    await expect(page.getByText('Click canvas to set target')).toBeVisible()
  })
})