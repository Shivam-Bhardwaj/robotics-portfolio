import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Launch browser for global setup
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Navigate to the application
    await page.goto('http://localhost:3000')
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
    
    // Verify basic page structure
    await page.waitForSelector('body', { timeout: 30000 })
    
    console.log('✓ Application is running and accessible')
    
    // Store any global state if needed
    await page.context().storageState({ path: 'tests/e2e/storage-state.json' })
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup