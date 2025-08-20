import { FullConfig } from '@playwright/test'
import fs from 'fs'
import path from 'path'

async function globalTeardown(config: FullConfig) {
  try {
    // Clean up temporary files
    const storageStatePath = path.join(__dirname, 'storage-state.json')
    if (fs.existsSync(storageStatePath)) {
      fs.unlinkSync(storageStatePath)
    }
    
    // Generate test summary
    console.log('✓ Global teardown completed')
    console.log('Test artifacts saved in test-results/')
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
  }
}

export default globalTeardown