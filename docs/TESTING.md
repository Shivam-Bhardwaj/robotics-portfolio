# Testing Guide

This document provides comprehensive guidance on testing the Robotics Portfolio application. Our testing strategy ensures code quality, security, accessibility, and performance.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Coverage Guidelines](#coverage-guidelines)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## 🎯 Testing Philosophy

Our testing approach follows the **testing pyramid** principle:

1. **Unit Tests** (70%): Fast, isolated tests for individual components and functions
2. **Integration Tests** (20%): Tests for component interactions and user workflows
3. **End-to-End Tests** (10%): Full user journey tests across the entire application

### Quality Gates

All code must pass:
- ✅ Unit tests with 70%+ coverage
- ✅ Integration tests for critical user flows
- ✅ End-to-end tests for main user journeys
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Performance benchmarks
- ✅ Security vulnerability scans

## 🛠️ Testing Stack

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Jest** | Unit testing framework | `jest.config.js` |
| **React Testing Library** | Component testing | `jest.setup.js` |
| **Playwright** | E2E testing | `playwright.config.ts` |
| **jest-axe** | Accessibility testing | Integrated with RTL |
| **Lighthouse** | Performance testing | `lighthouserc.js` |
| **ESLint** | Code quality | `eslint.config.mjs` |

## 🧪 Test Types

### Unit Tests
Test individual components, hooks, and utility functions in isolation.

**Location**: `tests/unit/`

**Examples**:
- Component rendering
- Props handling
- Event handlers
- Utility functions
- Custom hooks

### Integration Tests
Test component interactions and user workflows.

**Location**: `tests/integration/`

**Examples**:
- Navigation between pages
- Form submissions
- API interactions
- State management

### End-to-End Tests
Test complete user journeys across the application.

**Location**: `tests/e2e/`

**Examples**:
- User registration flow
- Complete simulation interaction
- Cross-browser compatibility

### Accessibility Tests
Ensure WCAG 2.1 AA compliance.

**Location**: `tests/accessibility/`

**Examples**:
- Screen reader compatibility
- Keyboard navigation
- Color contrast
- Focus management

### Performance Tests
Validate application performance metrics.

**Location**: `tests/performance/`

**Examples**:
- Page load times
- Bundle size optimization
- Animation frame rates
- Memory usage

### Security Tests
Identify security vulnerabilities.

**Location**: `tests/security/`

**Examples**:
- XSS prevention
- CSRF protection
- Input sanitization
- Security headers

## 🚀 Running Tests

### Quick Commands

```bash
# Run all tests
npm run test:all

# Unit tests
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage

# Integration tests
npm run test -- --testPathPattern=integration

# E2E tests
npm run test:e2e            # All browsers
npm run test:e2e:ui         # With UI
npm run test:e2e:debug      # Debug mode

# Accessibility tests
npm run test:a11y

# Performance tests
npm run test:performance

# Security tests
npm run test:security
```

### Detailed Test Execution

#### Unit Tests
```bash
# Run specific test file
npm test -- RoombaSimulation.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Run with verbose output
npm test -- --verbose

# Run in silent mode
npm test -- --silent
```

#### E2E Tests
```bash
# Run specific browser
npx playwright test --project=chromium

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run with specific grep pattern
npx playwright test --grep "navigation"
```

### Performance Testing
```bash
# Lighthouse audit
npm run test:performance

# Custom performance tests
npx playwright test --grep @performance

# Bundle analysis
npm run build:analyze
```

## ✍️ Writing Tests

### Test File Structure

```
tests/
├── unit/
│   ├── components/
│   │   ├── Component.test.tsx
│   │   └── __snapshots__/
│   ├── pages/
│   └── utils/
├── integration/
│   ├── user-flows.test.tsx
│   └── navigation.test.tsx
├── e2e/
│   ├── homepage.spec.ts
│   └── swarm-game.spec.ts
├── accessibility/
│   └── a11y.test.tsx
├── performance/
│   └── lighthouse.test.ts
├── security/
│   └── security.test.ts
└── utils/
    ├── test-helpers.ts
    └── testing-library.tsx
```

### Unit Test Template

```tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from '@/components/ComponentName'

describe('ComponentName', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Setup code
  })

  afterEach(() => {
    // Cleanup code
  })

  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    render(<ComponentName />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })

  describe('Edge Cases', () => {
    it('should handle missing props', () => {
      expect(() => render(<ComponentName />)).not.toThrow()
    })
  })
})
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete user journey', async ({ page }) => {
    // Act
    await page.getByRole('button', { name: 'Start' }).click()
    
    // Assert
    await expect(page.getByText('Success')).toBeVisible()
  })

  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    // Test mobile-specific behavior
  })
})
```

### Testing Best Practices

#### ✅ Do's
- Write descriptive test names
- Test behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Mock external dependencies
- Test edge cases and error states
- Keep tests focused and simple
- Use proper cleanup in afterEach
- Test accessibility in every component test

#### ❌ Don'ts
- Don't test implementation details
- Don't test external libraries
- Don't use querySelector when semantic queries are available
- Don't write overly complex test setup
- Don't skip error handling tests
- Don't forget to test keyboard navigation
- Don't ignore console warnings/errors

### Custom Test Utilities

```typescript
// tests/utils/test-helpers.ts
export const createMockRobot = (overrides = {}) => ({
  x: 100,
  y: 100,
  angle: 0,
  // ... other properties
  ...overrides
})

export const simulateCanvasClick = (canvas, x, y) => {
  const event = new MouseEvent('click', { clientX: x, clientY: y })
  canvas.dispatchEvent(event)
}
```

## 📊 Coverage Guidelines

### Coverage Targets

| Metric | Minimum | Target |
|--------|---------|--------|
| Statements | 70% | 80% |
| Branches | 70% | 80% |
| Functions | 70% | 80% |
| Lines | 70% | 80% |

### Coverage Commands

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html

# Generate coverage badge
node scripts/coverage-report.js

# Check coverage thresholds
npm run test:coverage && echo "Coverage passed"
```

### Coverage Exclusions

Files excluded from coverage:
- Test files (`*.test.ts`, `*.spec.ts`)
- Configuration files
- Type definitions (`*.d.ts`)
- Build output
- Node modules

### Improving Coverage

1. **Identify uncovered code**:
   ```bash
   npm run test:coverage
   # Check HTML report for red lines
   ```

2. **Add missing tests**:
   - Test error conditions
   - Test edge cases
   - Test different prop combinations
   - Test event handlers

3. **Remove dead code**:
   - Delete unused functions
   - Remove unreachable code paths

## 🔄 CI/CD Integration

### GitHub Actions Workflow

Our CI/CD pipeline runs:

1. **Lint & Type Check** - Code quality validation
2. **Security Scan** - Vulnerability detection
3. **Unit Tests** - Component and function tests
4. **Integration Tests** - User workflow tests
5. **Build** - Application compilation
6. **E2E Tests** - Cross-browser testing
7. **Performance Tests** - Lighthouse audits
8. **Accessibility Tests** - WCAG compliance
9. **Quality Gate** - Overall quality assessment
10. **Deploy** - Production deployment (main branch)

### Quality Gates

Tests must pass before deployment:

```yaml
- name: Quality Gate
  run: |
    # All tests must pass
    npm run test:ci
    
    # Coverage must meet thresholds
    npm run test:coverage
    
    # No high-severity security issues
    npm run security:scan
    
    # Performance must meet benchmarks
    npm run test:performance
```

### Branch Protection

- **Main branch**: Requires PR reviews + passing tests
- **Develop branch**: Requires passing tests
- **Feature branches**: Run full test suite on PR

## 🔧 Troubleshooting

### Common Issues

#### Tests Timeout
```bash
# Increase timeout globally
jest --testTimeout=10000

# Or in specific test
test('should work', () => {
  // test code
}, 10000)
```

#### Canvas Tests Failing
```typescript
// Mock canvas context
jest.mock('canvas', () => ({
  getContext: jest.fn(() => ({
    fillRect: jest.fn(),
    // ... other canvas methods
  }))
}))
```

#### E2E Tests Flaky
```typescript
// Add proper waits
await page.waitForLoadState('networkidle')
await expect(element).toBeVisible({ timeout: 10000 })

// Use retry logic
test.describe.configure({ retries: 2 })
```

#### Memory Issues
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm test

# Or in package.json
"test": "NODE_OPTIONS='--max-old-space-size=4096' jest"
```

### Debugging Tests

#### Unit Tests
```bash
# Debug specific test
npm test -- --runInBand --detectOpenHandles ComponentName.test.tsx

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

#### E2E Tests
```bash
# Debug mode (pauses execution)
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Trace viewer
npx playwright test --trace on
npx playwright show-trace test-results/trace.zip
```

### Performance Issues

#### Slow Tests
```bash
# Run tests in parallel
npm test -- --maxWorkers=4

# Skip slow tests in development
npm test -- --testPathIgnorePatterns=e2e
```

#### Test File Organization
- Keep test files small and focused
- Use describe blocks to group related tests
- Split large test files into smaller ones
- Use shared setup in beforeEach/beforeAll

### Getting Help

1. **Check documentation**: This file and component docs
2. **Review examples**: Look at existing test files
3. **Run individual tests**: Isolate the problem
4. **Check CI logs**: See full error output
5. **Ask for help**: Create an issue with reproduction steps

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance Metrics](https://web.dev/metrics/)

---

*This testing guide is a living document. Please update it as testing practices evolve.*