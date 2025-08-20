module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/projects',
        'http://localhost:3000/experience',
        'http://localhost:3000/skills',
        'http://localhost:3000/swarm',
        'http://localhost:3000/contact',
      ],
      startServerCommand: 'npm run start',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.85 }],
        'categories:pwa': ['off'], // PWA not required for portfolio
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Performance metrics
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 3000 }],
        
        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr': 'error',
        'aria-valid-attr-value': 'error',
        'button-name': 'error',
        'bypass': 'error',
        'document-title': 'error',
        'duplicate-id': 'error',
        'focus-traps': 'error',
        'focusable-controls': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'link-name': 'error',
        'list': 'error',
        'listitem': 'error',
        'meta-viewport': 'error',
        'tabindex': 'error',
        
        // Best Practices
        'errors-in-console': 'error',
        'external-anchors-use-rel-noopener': 'error',
        'geolocation-on-start': 'error',
        'no-document-write': 'error',
        'no-vulnerable-libraries': 'error',
        'notification-on-start': 'error',
        'password-inputs-can-be-pasted-into': 'error',
        'uses-https': 'error',
        'uses-http2': 'warn',
        
        // SEO
        'meta-description': 'error',
        'http-status-code': 'error',
        'font-size': 'error',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'tap-targets': 'error',
        'hreflang': 'warn',
        'canonical': 'warn',
        
        // Performance optimizations
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        'preload-lcp-image': 'warn',
        'total-byte-weight': ['warn', { maxNumericValue: 1600000 }], // 1.6MB
        'uses-long-cache-ttl': 'warn',
        'uses-rel-preconnect': 'warn',
        'uses-rel-preload': 'warn',
        'font-display': 'warn',
        'third-party-summary': 'warn',
        'third-party-facades': 'warn',
        'legacy-javascript': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}