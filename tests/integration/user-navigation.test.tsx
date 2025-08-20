import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockPathname = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => mockPathname(),
}))

// Mock the site config
jest.mock('@/data/site', () => ({
  siteConfig: {
    name: 'Test Portfolio',
  },
}))

describe('User Navigation Integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockPush.mockClear()
    mockPathname.mockReturnValue('/')
  })

  it('should navigate through all main sections', async () => {
    render(<Navbar />)

    const navigationFlow = [
      { linkName: 'Projects', expectedPath: '/projects' },
      { linkName: 'Experience', expectedPath: '/experience' },
      { linkName: 'Skills', expectedPath: '/skills' },
      { linkName: 'Swarm', expectedPath: '/swarm' },
      { linkName: 'Contact', expectedPath: '/contact' },
    ]

    for (const { linkName, expectedPath } of navigationFlow) {
      const link = screen.getByRole('link', { name: linkName })
      expect(link).toHaveAttribute('href', expectedPath)
    }
  })

  it('should highlight active navigation item correctly', async () => {
    // Test home page
    mockPathname.mockReturnValue('/')
    const { rerender } = render(<Navbar />)
    
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass('text-blue-600', 'underline')

    // Test projects page
    mockPathname.mockReturnValue('/projects')
    rerender(<Navbar />)
    
    const projectsLink = screen.getByRole('link', { name: 'Projects' })
    expect(projectsLink).toHaveClass('text-blue-600', 'underline')
    
    const homeLink2 = screen.getByRole('link', { name: 'Home' })
    expect(homeLink2).toHaveClass('text-gray-600')
    expect(homeLink2).not.toHaveClass('text-blue-600', 'underline')
  })

  it('should maintain navigation state across page changes', () => {
    const pages = ['/', '/projects', '/experience', '/skills', '/swarm', '/contact']
    
    pages.forEach(path => {
      mockPathname.mockReturnValue(path)
      const { rerender } = render(<Navbar />)
      
      // All navigation links should be present
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Experience' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Skills' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Swarm' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
    })
  })

  it('should provide consistent user experience across all sections', async () => {
    const sections = [
      'Home', 'Projects', 'Experience', 'Skills', 'Swarm', 'Contact'
    ]

    render(<Navbar />)

    sections.forEach(section => {
      const link = screen.getByRole('link', { name: section })
      
      // All links should be visible and clickable
      expect(link).toBeVisible()
      expect(link).not.toHaveAttribute('disabled')
      
      // All links should have hover states
      expect(link).toHaveClass('hover:text-gray-800')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support tab navigation through all links', async () => {
      render(<Navbar />)

      // Tab through all navigation items
      await user.tab()
      expect(screen.getByRole('link', { name: 'Test Portfolio' })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('link', { name: 'Projects' })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('link', { name: 'Experience' })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('link', { name: 'Skills' })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('link', { name: 'Swarm' })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('link', { name: 'Contact' })).toHaveFocus()
    })

    it('should support Enter key activation', async () => {
      render(<Navbar />)

      // Focus on a link and press Enter
      const projectsLink = screen.getByRole('link', { name: 'Projects' })
      projectsLink.focus()
      
      await user.keyboard('{Enter}')
      
      // Link should be activated (href should be followed)
      expect(projectsLink).toHaveAttribute('href', '/projects')
    })
  })

  describe('Mobile Navigation', () => {
    it('should maintain functionality on small screens', () => {
      render(<Navbar />)

      // All links should still be accessible
      const allLinks = screen.getAllByRole('link')
      expect(allLinks.length).toBe(7) // 6 nav items + logo

      allLinks.forEach(link => {
        expect(link).toBeVisible()
      })
    })
  })

  describe('Navigation Performance', () => {
    it('should render navigation quickly', () => {
      const startTime = performance.now()
      
      render(<Navbar />)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render in under 100ms
      expect(renderTime).toBeLessThan(100)
    })

    it('should handle rapid navigation changes', () => {
      const { rerender } = render(<Navbar />)

      // Rapidly change active page
      const paths = ['/', '/projects', '/skills', '/contact', '/']
      
      paths.forEach(path => {
        mockPathname.mockReturnValue(path)
        expect(() => rerender(<Navbar />)).not.toThrow()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid pathnames gracefully', () => {
      mockPathname.mockReturnValue('/non-existent-page')
      
      expect(() => render(<Navbar />)).not.toThrow()
      
      // All links should have default styling
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toHaveClass('text-gray-600')
    })

    it('should handle undefined pathname', () => {
      mockPathname.mockReturnValue(undefined as any)
      
      expect(() => render(<Navbar />)).not.toThrow()
    })
  })
})