import React from 'react'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('Navbar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the navbar with site name', () => {
    render(<Navbar />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('displays all navigation links', () => {
    render(<Navbar />)
    
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Swarm' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('highlights active page based on pathname', () => {
    mockUsePathname.mockReturnValue('/projects')
    render(<Navbar />)
    
    const projectsLink = screen.getByRole('link', { name: 'Projects' })
    expect(projectsLink).toHaveClass('text-blue-600', 'underline')
  })

  it('applies default styling to non-active links', () => {
    mockUsePathname.mockReturnValue('/projects')
    render(<Navbar />)
    
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass('text-gray-600')
    expect(homeLink).not.toHaveClass('text-blue-600', 'underline')
  })

  it('has correct link hrefs', () => {
    render(<Navbar />)
    
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '/experience')
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '/skills')
    expect(screen.getByRole('link', { name: 'Swarm' })).toHaveAttribute('href', '/swarm')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('has proper responsive layout classes', () => {
    render(<Navbar />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('bg-white', 'text-gray-800', 'shadow', 'p-4')
    
    const container = nav.firstChild
    expect(container).toHaveClass('container', 'mx-auto', 'flex', 'justify-between', 'items-center')
  })

  it('renders site logo/name as link to home', () => {
    render(<Navbar />)
    
    const logoLinks = screen.getAllByRole('link')
    const logoLink = logoLinks.find(link => link.getAttribute('href') === '/' && link.classList.contains('text-2xl'))
    
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveClass('text-2xl', 'font-bold', 'text-gray-900')
  })

  describe('Different pathname scenarios', () => {
    const testCases = [
      { pathname: '/', activeLink: 'Home' },
      { pathname: '/projects', activeLink: 'Projects' },
      { pathname: '/experience', activeLink: 'Experience' },
      { pathname: '/skills', activeLink: 'Skills' },
      { pathname: '/swarm', activeLink: 'Swarm' },
      { pathname: '/contact', activeLink: 'Contact' },
    ]

    testCases.forEach(({ pathname, activeLink }) => {
      it(`highlights ${activeLink} when pathname is ${pathname}`, () => {
        mockUsePathname.mockReturnValue(pathname)
        render(<Navbar />)
        
        const activeLinkElement = screen.getByRole('link', { name: activeLink })
        expect(activeLinkElement).toHaveClass('text-blue-600', 'underline')
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic navigation element', () => {
      render(<Navbar />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('uses proper list structure for navigation items', () => {
      render(<Navbar />)
      
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      
      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(6) // 6 navigation items
    })

    it('all links are keyboard accessible', () => {
      render(<Navbar />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toBeVisible()
        expect(link).not.toHaveAttribute('tabindex', '-1')
      })
    })
  })

  describe('Hover states', () => {
    it('applies hover classes to navigation links', () => {
      render(<Navbar />)
      
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).toHaveClass('hover:text-gray-800')
    })
  })

  describe('Edge cases', () => {
    it('handles undefined pathname gracefully', () => {
      mockUsePathname.mockReturnValue(undefined as any)
      
      expect(() => render(<Navbar />)).not.toThrow()
    })

    it('handles non-matching pathname', () => {
      mockUsePathname.mockReturnValue('/non-existent-page')
      render(<Navbar />)
      
      // All links should have default styling
      const links = ['Home', 'Projects', 'Experience', 'Skills', 'Swarm', 'Contact']
      links.forEach(linkName => {
        const link = screen.getByRole('link', { name: linkName })
        expect(link).toHaveClass('text-gray-600')
        expect(link).not.toHaveClass('text-blue-600', 'underline')
      })
    })
  })
})