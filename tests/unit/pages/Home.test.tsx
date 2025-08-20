import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the Typewriter component
jest.mock('@/components/Typewriter', () => {
  return function MockTypewriter({ phrases }: { phrases: string[] }) {
    return <span data-testid="typewriter">{phrases[0]}</span>
  }
})

// Mock site config
jest.mock('@/data/site', () => ({
  siteConfig: {
    name: 'Shivam Bhardwaj',
    role: 'Robotics Engineer',
    location: 'San Francisco, CA',
    links: {
      github: 'https://github.com/test',
    },
  },
}))

describe('Home Page', () => {
  it('renders the main heading with gradient text', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Shivam Bhardwaj')
    expect(heading).toHaveClass('bg-clip-text', 'text-transparent', 'bg-gradient-to-r')
  })

  it('displays role and location', () => {
    render(<Home />)
    
    expect(screen.getByText('Robotics Engineer • San Francisco, CA')).toBeInTheDocument()
  })

  it('renders typewriter component with correct phrases', () => {
    render(<Home />)
    
    const typewriter = screen.getByTestId('typewriter')
    expect(typewriter).toBeInTheDocument()
    expect(typewriter).toHaveTextContent('The gap between prototype and product? I live there.')
  })

  it('displays professional description', () => {
    render(<Home />)
    
    const description = screen.getByText(/As both a hands-on engineer and project manager/)
    expect(description).toBeInTheDocument()
    expect(description).toHaveTextContent(/Meta, Applied Materials, Google/)
  })

  it('renders all navigation buttons', () => {
    render(<Home />)
    
    expect(screen.getByRole('link', { name: 'View Projects' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'My Skills' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Play Swarm Game' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('has correct link destinations', () => {
    render(<Home />)
    
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'My Skills' })).toHaveAttribute('href', '/skills')
    expect(screen.getByRole('link', { name: 'Play Swarm Game' })).toHaveAttribute('href', '/swarm')
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/test')
  })

  it('has proper styling for primary CTA button', () => {
    render(<Home />)
    
    const primaryButton = screen.getByRole('link', { name: 'View Projects' })
    expect(primaryButton).toHaveClass('bg-blue-600', 'text-white', 'hover:bg-blue-500')
  })

  it('has proper styling for secondary buttons', () => {
    render(<Home />)
    
    const secondaryButtons = [
      screen.getByRole('link', { name: 'My Skills' }),
      screen.getByRole('link', { name: 'Play Swarm Game' }),
      screen.getByRole('link', { name: 'GitHub' }),
    ]

    secondaryButtons.forEach(button => {
      expect(button).toHaveClass('border', 'border-gray-300', 'hover:bg-gray-50')
    })
  })

  it('GitHub link opens in new tab', () => {
    render(<Home />)
    
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has responsive layout classes', () => {
    render(<Home />)
    
    const section = screen.getByRole('heading', { level: 1 }).closest('section')
    expect(section).toHaveClass('flex', 'flex-col', 'items-center', 'text-center')
    expect(section).toHaveClass('py-14', 'md:py-20')
  })

  it('contains background decorative elements', () => {
    render(<Home />)
    
    const backgroundDiv = document.querySelector('.pointer-events-none.absolute.inset-0.-z-10')
    expect(backgroundDiv).toBeInTheDocument()
    
    const blobs = document.querySelectorAll('.rounded-full.blur-3xl')
    expect(blobs).toHaveLength(2)
  })

  it('has responsive text sizing', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-4xl', 'md:text-6xl')
    
    const subtitle = screen.getByText('Robotics Engineer • San Francisco, CA')
    expect(subtitle).toHaveClass('text-base', 'md:text-lg')
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Home />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })

    it('all links are keyboard accessible', () => {
      render(<Home />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toBeVisible()
        expect(link).not.toHaveAttribute('tabindex', '-1')
      })
    })

    it('has meaningful link text', () => {
      render(<Home />)
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link.textContent?.trim()).toBeTruthy()
      })
    })

    it('external link has proper security attributes', () => {
      render(<Home />)
      
      const githubLink = screen.getByRole('link', { name: 'GitHub' })
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Content Structure', () => {
    it('displays content in logical order', () => {
      render(<Home />)
      
      const content = screen.getByRole('heading', { level: 1 }).closest('section')
      const children = Array.from(content?.children || [])
      
      // Should have background, heading area, typewriter, description, and buttons
      expect(children.length).toBeGreaterThan(3)
    })

    it('typewriter phrases are meaningful', () => {
      render(<Home />)
      
      const typewriter = screen.getByTestId('typewriter')
      expect(typewriter.textContent).toContain('prototype and product')
    })
  })

  describe('Visual Design', () => {
    it('uses gradient colors consistently', () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('bg-gradient-to-r', 'from-fuchsia-600', 'to-cyan-600')
    })

    it('has proper spacing between elements', () => {
      render(<Home />)
      
      const section = screen.getByRole('heading', { level: 1 }).closest('section')
      expect(section).toHaveClass('gap-8')
    })

    it('uses consistent color scheme', () => {
      render(<Home />)
      
      const descriptions = screen.getAllByText(/text-gray-700|text-gray-600/)
      expect(descriptions.length).toBeGreaterThan(0)
    })
  })
})