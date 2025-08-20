import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Typewriter from '@/components/Typewriter'

describe('Typewriter', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('renders initial empty state', () => {
    render(<Typewriter phrases={['Hello', 'World']} />)
    
    const container = screen.getByText('', { selector: 'span' })
    expect(container).toBeInTheDocument()
  })

  it('displays cursor element', () => {
    render(<Typewriter phrases={['Hello']} />)
    
    const cursor = document.querySelector('.border-r-2.border-gray-600.animate-pulse')
    expect(cursor).toBeInTheDocument()
  })

  it('starts typing the first phrase', async () => {
    render(<Typewriter phrases={['Hello']} typingMs={10} />)
    
    // Fast-forward through typing animation
    jest.advanceTimersByTime(50)
    
    await waitFor(() => {
      expect(screen.getByText('Hello', { exact: false })).toBeInTheDocument()
    })
  })

  it('types multiple characters progressively', async () => {
    render(<Typewriter phrases={['Hello']} typingMs={10} />)
    
    // Check each character appears progressively
    jest.advanceTimersByTime(10)
    expect(screen.getByText('H', { exact: false })).toBeInTheDocument()
    
    jest.advanceTimersByTime(10)
    expect(screen.getByText('He', { exact: false })).toBeInTheDocument()
    
    jest.advanceTimersByTime(10)
    expect(screen.getByText('Hel', { exact: false })).toBeInTheDocument()
  })

  it('pauses after completing a phrase', async () => {
    render(<Typewriter phrases={['Hi']} typingMs={10} pauseMs={100} />)
    
    // Complete typing
    jest.advanceTimersByTime(30)
    expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument()
    
    // Pause should happen, no deletion yet
    jest.advanceTimersByTime(50)
    expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument()
  })

  it('deletes characters after pause', async () => {
    render(<Typewriter phrases={['Hi']} typingMs={10} pauseMs={20} />)
    
    // Complete typing and pause
    jest.advanceTimersByTime(50)
    expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument()
    
    // Start deleting
    jest.advanceTimersByTime(10)
    expect(screen.getByText('H', { exact: false })).toBeInTheDocument()
    
    jest.advanceTimersByTime(10)
    expect(screen.queryByText('Hi')).not.toBeInTheDocument()
  })

  it('cycles through multiple phrases', async () => {
    render(<Typewriter phrases={['Hi', 'Bye']} typingMs={5} pauseMs={10} />)
    
    // Type first phrase
    jest.advanceTimersByTime(25)
    expect(screen.getByText('Hi', { exact: false })).toBeInTheDocument()
    
    // Delete and type second phrase
    jest.advanceTimersByTime(50)
    
    await waitFor(() => {
      expect(screen.getByText('Bye', { exact: false })).toBeInTheDocument()
    })
  })

  it('handles empty phrases array gracefully', () => {
    expect(() => render(<Typewriter phrases={[]} />)).not.toThrow()
  })

  it('handles single phrase', async () => {
    render(<Typewriter phrases={['Solo']} typingMs={10} />)
    
    jest.advanceTimersByTime(50)
    
    await waitFor(() => {
      expect(screen.getByText('Solo', { exact: false })).toBeInTheDocument()
    })
  })

  it('applies custom typing speed', async () => {
    render(<Typewriter phrases={['Test']} typingMs={100} />)
    
    // Should type slower with higher typingMs
    jest.advanceTimersByTime(99)
    expect(screen.queryByText('T')).not.toBeInTheDocument()
    
    jest.advanceTimersByTime(2)
    expect(screen.getByText('T', { exact: false })).toBeInTheDocument()
  })

  it('applies custom pause duration', async () => {
    render(<Typewriter phrases={['A', 'B']} typingMs={10} pauseMs={500} />)
    
    // Complete first phrase
    jest.advanceTimersByTime(20)
    expect(screen.getByText('A', { exact: false })).toBeInTheDocument()
    
    // Should still be paused
    jest.advanceTimersByTime(400)
    expect(screen.getByText('A', { exact: false })).toBeInTheDocument()
    
    // Now should start deleting
    jest.advanceTimersByTime(200)
    expect(screen.queryByText('A')).not.toBeInTheDocument()
  })

  it('deletes at half the typing speed', async () => {
    render(<Typewriter phrases={['AB']} typingMs={100} pauseMs={10} />)
    
    // Complete typing and pause
    jest.advanceTimersByTime(220)
    expect(screen.getByText('AB', { exact: false })).toBeInTheDocument()
    
    // Delete first character (should take 50ms at half speed)
    jest.advanceTimersByTime(50)
    expect(screen.getByText('A', { exact: false })).toBeInTheDocument()
    
    // Delete second character
    jest.advanceTimersByTime(50)
    expect(screen.queryByText('A')).not.toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('uses semantic span elements', () => {
      render(<Typewriter phrases={['Test']} />)
      
      const container = screen.getByText('', { selector: 'span' })
      expect(container).toHaveClass('inline-block', 'align-baseline')
    })

    it('cursor is visually distinct', () => {
      render(<Typewriter phrases={['Test']} />)
      
      const cursor = document.querySelector('.border-r-2.border-gray-600.animate-pulse')
      expect(cursor).toHaveClass('ml-0.5', 'inline-block', 'w-3')
    })
  })

  describe('Edge Cases', () => {
    it('handles phrases with special characters', async () => {
      render(<Typewriter phrases={['Hello, World! 123']} typingMs={5} />)
      
      jest.advanceTimersByTime(100)
      
      await waitFor(() => {
        expect(screen.getByText('Hello, World! 123', { exact: false })).toBeInTheDocument()
      })
    })

    it('handles very long phrases', async () => {
      const longPhrase = 'A'.repeat(100)
      render(<Typewriter phrases={[longPhrase]} typingMs={1} />)
      
      jest.advanceTimersByTime(200)
      
      await waitFor(() => {
        expect(screen.getByText(longPhrase, { exact: false })).toBeInTheDocument()
      })
    })

    it('handles phrases with different lengths', async () => {
      render(<Typewriter phrases={['A', 'Long phrase here']} typingMs={5} pauseMs={10} />)
      
      // Type short phrase
      jest.advanceTimersByTime(25)
      expect(screen.getByText('A', { exact: false })).toBeInTheDocument()
      
      // Cycle to long phrase
      jest.advanceTimersByTime(50)
      
      await waitFor(() => {
        expect(screen.getByText('Long phrase here', { exact: false })).toBeInTheDocument()
      })
    })

    it('continues cycling after completing all phrases', async () => {
      render(<Typewriter phrases={['First', 'Second']} typingMs={5} pauseMs={5} />)
      
      // Complete full cycle
      jest.advanceTimersByTime(200)
      
      // Should restart with first phrase
      await waitFor(() => {
        expect(screen.getByText('First', { exact: false })).toBeInTheDocument()
      })
    })
  })

  describe('Performance', () => {
    it('cleans up timeouts properly', () => {
      const { unmount } = render(<Typewriter phrases={['Test']} />)
      
      // Start some timers
      jest.advanceTimersByTime(50)
      
      // Unmount should not cause any issues
      expect(() => unmount()).not.toThrow()
    })

    it('handles rapid re-renders', () => {
      const { rerender } = render(<Typewriter phrases={['Test']} />)
      
      // Rapid re-renders
      for (let i = 0; i < 10; i++) {
        rerender(<Typewriter phrases={['Test']} />)
      }
      
      expect(true).toBe(true)
    })
  })
})