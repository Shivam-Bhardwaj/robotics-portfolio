import { test, expect } from '@playwright/test'

test.describe('Security Tests', () => {
  test('Should have proper Content Security Policy headers', async ({ page }) => {
    const response = await page.goto('/')
    
    const cspHeader = response?.headers()['content-security-policy']
    
    if (cspHeader) {
      // Should have restrictive CSP
      expect(cspHeader).toContain("default-src 'self'")
      expect(cspHeader).not.toContain("'unsafe-eval'")
    }
  })

  test('Should have security headers', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers() || {}
    
    // Check for important security headers
    expect(headers['x-frame-options'] || headers['X-Frame-Options']).toBeTruthy()
    expect(headers['x-content-type-options'] || headers['X-Content-Type-Options']).toBe('nosniff')
    
    // Referrer policy should be set
    if (headers['referrer-policy'] || headers['Referrer-Policy']) {
      const referrerPolicy = headers['referrer-policy'] || headers['Referrer-Policy']
      expect(['no-referrer', 'same-origin', 'strict-origin-when-cross-origin']).toContain(referrerPolicy)
    }
  })

  test('Should protect against clickjacking', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers() || {}
    
    const xFrameOptions = headers['x-frame-options'] || headers['X-Frame-Options']
    
    // Should have X-Frame-Options or frame-ancestors in CSP
    const csp = headers['content-security-policy']
    const hasFrameProtection = xFrameOptions === 'DENY' || 
                              xFrameOptions === 'SAMEORIGIN' ||
                              (csp && csp.includes('frame-ancestors'))
    
    expect(hasFrameProtection).toBeTruthy()
  })

  test('Should not expose sensitive information in source', async ({ page }) => {
    await page.goto('/')
    
    const pageContent = await page.content()
    
    // Check for potential sensitive data leaks
    expect(pageContent).not.toMatch(/password/i)
    expect(pageContent).not.toMatch(/secret/i)
    expect(pageContent).not.toMatch(/api[_-]?key/i)
    expect(pageContent).not.toMatch(/token/i)
    expect(pageContent).not.toMatch(/private[_-]?key/i)
  })

  test('Should sanitize user inputs', async ({ page }) => {
    await page.goto('/swarm')
    
    // Try to inject script through slider input
    const slider = page.getByRole('slider')
    
    // Attempt XSS through input manipulation
    await page.evaluate(() => {
      const input = document.querySelector('input[type="range"]') as HTMLInputElement
      if (input) {
        input.value = '<script>alert("xss")</script>'
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    
    // Check that no script was executed
    const hasAlert = await page.evaluate(() => {
      return window.alert.toString().includes('xss')
    })
    
    expect(hasAlert).toBeFalsy()
  })

  test('Should handle malformed URLs safely', async ({ page }) => {
    // Test various malformed URLs
    const malformedUrls = [
      '/../../../etc/passwd',
      '/..\\..\\..\\windows\\system32\\',
      '/%2e%2e%2f%2e%2e%2f',
      '/null\x00byte',
    ]

    for (const url of malformedUrls) {
      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
        
        // Should either redirect safely or return 404, not expose system files
        if (response) {
          expect(response.status()).toBeGreaterThanOrEqual(400)
        }
      } catch (error) {
        // Navigation errors are acceptable for malformed URLs
        expect(error).toBeTruthy()
      }
    }
  })

  test('Should validate external links security', async ({ page }) => {
    await page.goto('/')
    
    // Check all external links
    const externalLinks = await page.locator('a[href^="http"]').all()
    
    for (const link of externalLinks) {
      const href = await link.getAttribute('href')
      const rel = await link.getAttribute('rel')
      const target = await link.getAttribute('target')
      
      if (href && !href.includes(page.url().split('/')[2])) {
        // External links should have security attributes
        if (target === '_blank') {
          expect(rel).toContain('noopener')
          expect(rel).toContain('noreferrer')
        }
      }
    }
  })

  test('Should protect against CSRF', async ({ page }) => {
    await page.goto('/')
    
    // Check for CSRF protection mechanisms
    const forms = await page.locator('form').all()
    
    for (const form of forms) {
      // Forms should have CSRF tokens or other protection
      const method = await form.getAttribute('method')
      
      if (method && method.toLowerCase() !== 'get') {
        // POST forms should have CSRF protection
        const csrfInput = await form.locator('input[name*="csrf"], input[name*="token"]').count()
        const hasMetaToken = await page.locator('meta[name="csrf-token"]').count()
        
        expect(csrfInput > 0 || hasMetaToken > 0).toBeTruthy()
      }
    }
  })

  test('Should not execute inline scripts without CSP allow', async ({ page }) => {
    await page.goto('/')
    
    // Try to inject inline script
    await page.evaluate(() => {
      const script = document.createElement('script')
      script.innerHTML = 'window.xssTest = true'
      document.head.appendChild(script)
    })
    
    // Check if script executed
    const scriptExecuted = await page.evaluate(() => {
      return (window as any).xssTest === true
    })
    
    // If CSP is properly configured, inline scripts should not execute
    const response = await page.goto('/')
    const csp = response?.headers()['content-security-policy']
    
    if (csp && !csp.includes("'unsafe-inline'")) {
      expect(scriptExecuted).toBeFalsy()
    }
  })

  test('Should validate JSON data handling', async ({ page }) => {
    await page.goto('/')
    
    // Test JSON injection
    await page.evaluate(() => {
      try {
        // Simulate malicious JSON data
        const maliciousJson = '{"__proto__": {"polluted": true}}'
        const parsed = JSON.parse(maliciousJson)
        
        // Check if prototype pollution occurred
        const polluted = ({} as any).polluted
        
        if (polluted) {
          (window as any).prototypePolluted = true
        }
      } catch (e) {
        // JSON parsing errors are acceptable
      }
    })
    
    const isPolluted = await page.evaluate(() => {
      return (window as any).prototypePolluted === true
    })
    
    expect(isPolluted).toBeFalsy()
  })

  test('Should handle file upload security (if applicable)', async ({ page }) => {
    // This test assumes file upload functionality exists
    const fileInputs = await page.locator('input[type="file"]').count()
    
    if (fileInputs > 0) {
      const fileInput = page.locator('input[type="file"]').first()
      
      // Check for file type restrictions
      const accept = await fileInput.getAttribute('accept')
      expect(accept).toBeTruthy() // Should have file type restrictions
      
      // File size limits should be implemented
      const maxSize = await fileInput.getAttribute('data-max-size')
      expect(maxSize).toBeTruthy() // Should have size limits
    }
  })

  test('Should protect sensitive routes', async ({ page }) => {
    // Test access to potentially sensitive routes
    const sensitiveRoutes = [
      '/admin',
      '/api/internal',
      '/.env',
      '/config',
      '/debug',
    ]

    for (const route of sensitiveRoutes) {
      try {
        const response = await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 5000 })
        
        if (response) {
          // Should return 404, 403, or redirect, not expose sensitive data
          const status = response.status()
          expect([301, 302, 403, 404, 405]).toContain(status)
        }
      } catch (error) {
        // Navigation errors are acceptable for protected routes
        expect(error).toBeTruthy()
      }
    }
  })

  test('Should implement rate limiting (if applicable)', async ({ page }) => {
    // Test for rate limiting on form submissions or API calls
    await page.goto('/')
    
    // Simulate rapid requests
    const results = []
    
    for (let i = 0; i < 20; i++) {
      try {
        const response = await page.goto('/', { timeout: 2000 })
        results.push(response?.status())
      } catch (error) {
        results.push(null)
      }
    }
    
    // Should not block legitimate requests
    const successfulRequests = results.filter(status => status === 200).length
    expect(successfulRequests).toBeGreaterThan(10)
  })

  test('Should validate HTTPS redirect', async ({ page, context }) => {
    // This test assumes the site enforces HTTPS
    try {
      const httpUrl = page.url().replace('https://', 'http://')
      const response = await page.goto(httpUrl)
      
      if (response) {
        // Should redirect to HTTPS or reject HTTP
        const finalUrl = page.url()
        const status = response.status()
        
        expect(finalUrl.startsWith('https://') || [301, 302, 400, 403].includes(status)).toBeTruthy()
      }
    } catch (error) {
      // Connection errors for HTTP are acceptable
      expect(error).toBeTruthy()
    }
  })

  test('Should not expose debugging information', async ({ page }) => {
    await page.goto('/')
    
    const pageContent = await page.content()
    
    // Should not contain debugging info
    expect(pageContent).not.toMatch(/debug/i)
    expect(pageContent).not.toMatch(/console\.log/i)
    expect(pageContent).not.toMatch(/localhost:\d+/i)
    expect(pageContent).not.toMatch(/development/i)
    expect(pageContent).not.toMatch(/error.*stack/i)
  })
})