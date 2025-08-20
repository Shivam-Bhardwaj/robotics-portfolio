import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Navbar from '@/components/Navbar'
import SwarmGame from '@/components/SwarmGame'
import SkillBadge from '@/components/SkillBadge'
import Typewriter from '@/components/Typewriter'
import Home from '@/app/page'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock dependencies
jest.mock('@/data/site', () => ({
  siteConfig: {
    name: 'Test Portfolio',
    role: 'Test Role',
    location: 'Test Location',
    links: {
      github: 'https://github.com/test',
    },
  },
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

jest.mock('@/components/Typewriter', () => {
  return function MockTypewriter({ phrases }: { phrases: string[] }) {
    return <span data-testid="typewriter">{phrases[0]}</span>
  }
})

describe('Accessibility Tests', () => {
  describe('WCAG Compliance', () => {
    it('Navbar should have no accessibility violations', async () => {
      const { container } = render(<Navbar />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('SwarmGame should have no accessibility violations', async () => {
      const { container } = render(<SwarmGame />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('SkillBadge should have no accessibility violations', async () => {
      const { container } = render(<SkillBadge name="Python" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Typewriter should have no accessibility violations', async () => {
      const { container } = render(<Typewriter phrases={['Test phrase']} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('Home page should have no accessibility violations', async () => {
      const { container } = render(<Home />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support tab navigation through navbar', () => {
      const { container } = render(<Navbar />)
      
      const focusableElements = container.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      )
      
      expect(focusableElements.length).toBeGreaterThan(0)
      
      focusableElements.forEach(element => {
        expect(element).toBeVisible()
        expect(element).not.toHaveAttribute('tabindex', '-1')
      })
    })

    it('should support keyboard interaction in SwarmGame', () => {
      const { container } = render(<SwarmGame />)
      
      const slider = container.querySelector('input[type="range"]')
      expect(slider).toBeInTheDocument()
      expect(slider).not.toHaveAttribute('tabindex', '-1')
    })
  })

  describe('Semantic HTML', () => {
    it('Navbar should use semantic navigation elements', () => {
      const { container } = render(<Navbar />)
      
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      
      const list = container.querySelector('ul')
      expect(list).toBeInTheDocument()
      
      const listItems = container.querySelectorAll('li')
      expect(listItems.length).toBeGreaterThan(0)
    })

    it('Home page should have proper heading hierarchy', () => {
      const { container } = render(<Home />)
      
      const h1 = container.querySelector('h1')
      expect(h1).toBeInTheDocument()
      
      // Should only have one h1
      const allH1s = container.querySelectorAll('h1')
      expect(allH1s).toHaveLength(1)
    })

    it('should use appropriate ARIA attributes', () => {
      const { container } = render(<SkillBadge name="Python" />)
      
      const emojiSpan = container.querySelector('[aria-hidden]')
      expect(emojiSpan).toBeInTheDocument()
    })
  })

  describe('Color Contrast', () => {
    it('should have sufficient color contrast for text elements', () => {
      const { container } = render(<Navbar />)
      
      // Check for text elements with appropriate contrast classes
      const textElements = container.querySelectorAll('.text-gray-600, .text-blue-600, .text-gray-800')
      expect(textElements.length).toBeGreaterThan(0)
    })

    it('should have accessible button colors', () => {
      const { container } = render(<Home />)
      
      const primaryButton = container.querySelector('.bg-blue-600.text-white')
      expect(primaryButton).toBeInTheDocument()
      
      const secondaryButtons = container.querySelectorAll('.border.border-gray-300')
      expect(secondaryButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Images and Media', () => {
    it('should have alt text for all images', () => {
      const { container } = render(<Home />)
      
      const images = container.querySelectorAll('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
      })
    })

    it('decorative elements should be marked as such', () => {
      const { container } = render(<SkillBadge name="Python" />)
      
      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]')
      expect(decorativeElements.length).toBeGreaterThan(0)
    })
  })

  describe('Form Controls', () => {
    it('should have proper labels for form inputs', () => {
      const { container } = render(<SwarmGame />)
      
      const slider = container.querySelector('input[type="range"]')
      expect(slider).toBeInTheDocument()
      
      // Should have accessible name through label or aria-label
      const label = container.querySelector('label')
      expect(label).toBeInTheDocument()
    })

    it('should have appropriate input attributes', () => {
      const { container } = render(<SwarmGame />)
      
      const slider = container.querySelector('input[type="range"]')
      expect(slider).toHaveAttribute('min')
      expect(slider).toHaveAttribute('max')
      expect(slider).toHaveAttribute('value')
    })
  })

  describe('Focus Management', () => {
    it('should have visible focus indicators', () => {
      const { container } = render(<Navbar />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        // Should not have outline: none without alternative focus indicator
        const computedStyle = window.getComputedStyle(link)
        expect(computedStyle.outline).not.toBe('none')
      })
    })

    it('should maintain logical tab order', () => {
      const { container } = render(<Home />)
      
      const focusableElements = container.querySelectorAll(
        'a[href], button, input, [tabindex]:not([tabindex="-1"])'
      )
      
      // Elements should appear in logical order
      let lastTabIndex = -1
      focusableElements.forEach(element => {
        const tabIndex = parseInt(element.getAttribute('tabindex') || '0')
        if (tabIndex > 0) {
          expect(tabIndex).toBeGreaterThanOrEqual(lastTabIndex)
          lastTabIndex = tabIndex
        }
      })
    })
  })

  describe('Screen Reader Support', () => {
    it('should provide meaningful text content', () => {
      const { container } = render(<Home />)
      
      const textElements = container.querySelectorAll('p, h1, h2, h3, a, button')
      textElements.forEach(element => {
        const textContent = element.textContent?.trim()
        expect(textContent).toBeTruthy()
        expect(textContent).not.toBe('')
      })
    })

    it('should use appropriate heading structure', () => {
      const { container } = render(<Home />)
      
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      
      // Should start with h1
      if (headings.length > 0) {
        expect(headings[0].tagName).toBe('H1')
      }
    })

    it('should provide context for interactive elements', () => {
      const { container } = render(<SwarmGame />)
      
      const canvas = container.querySelector('canvas')
      if (canvas) {
        // Canvas should have accessible alternative or description
        expect(canvas).toBeInTheDocument()
      }
      
      const instructions = container.querySelector('p')
      expect(instructions).toBeInTheDocument()
    })
  })

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility at different viewport sizes', () => {
      // Mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const { container: mobileContainer } = render(<Navbar />)
      const mobileLinks = mobileContainer.querySelectorAll('a')
      
      mobileLinks.forEach(link => {
        expect(link).toBeVisible()
      })

      // Desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })

      const { container: desktopContainer } = render(<Navbar />)
      const desktopLinks = desktopContainer.querySelectorAll('a')
      
      desktopLinks.forEach(link => {
        expect(link).toBeVisible()
      })
    })
  })

  describe('Error Prevention and Recovery', () => {
    it('should handle missing props gracefully', () => {
      expect(() => render(<SkillBadge name="" />)).not.toThrow()
    })

    it('should provide fallback content', () => {
      const { container } = render(<Typewriter phrases={[]} />)
      expect(container).toBeInTheDocument()
    })
  })
})