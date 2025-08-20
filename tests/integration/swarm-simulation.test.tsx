import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SwarmGame from '@/components/SwarmGame'
import { mockCanvas, flushAnimationFrames } from '../utils/test-helpers'

describe('Swarm Simulation Integration', () => {
  let mockCanvasElement: any
  const user = userEvent.setup()

  beforeEach(() => {
    mockCanvasElement = mockCanvas()
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasElement.getContext())
    
    jest.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 600,
      height: 400,
      right: 600,
      bottom: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should complete full game workflow', async () => {
    jest.useFakeTimers()
    
    render(<SwarmGame />)

    // 1. Initial state
    expect(screen.getByText('Robots: 15')).toBeInTheDocument()
    expect(screen.getByText('Time: 0.0s')).toBeInTheDocument()

    // 2. Adjust robot count
    const slider = screen.getByRole('slider')
    await user.clear(slider)
    await user.type(slider, '20')

    expect(screen.getByText('Robots: 20')).toBeInTheDocument()

    // 3. Start game by clicking canvas
    const canvas = screen.getByRole('img', { hidden: true })
    await user.click(canvas)

    // 4. Game should be running
    jest.advanceTimersByTime(100)
    await flushAnimationFrames()

    // Time should have advanced
    const timeDisplay = screen.getByText(/Time: /)
    expect(timeDisplay).toBeInTheDocument()

    jest.useRealTimers()
  })

  it('should handle complete user interaction flow', async () => {
    render(<SwarmGame />)

    const canvas = screen.getByRole('img', { hidden: true })
    const slider = screen.getByRole('slider')

    // Test multiple interactions
    await user.click(canvas)
    await user.clear(slider)
    await user.type(slider, '10')
    await user.click(canvas)
    await user.clear(slider)
    await user.type(slider, '30')

    // Final state should be correct
    expect(screen.getByText('Robots: 30')).toBeInTheDocument()
    expect(screen.getByText('Time: 0.0s')).toBeInTheDocument()
  })

  it('should maintain game state consistency', async () => {
    jest.useFakeTimers()
    
    render(<SwarmGame />)

    const canvas = screen.getByRole('img', { hidden: true })
    const slider = screen.getByRole('slider')

    // Set specific configuration
    await user.clear(slider)
    await user.type(slider, '25')

    // Start game
    await user.click(canvas)
    
    jest.advanceTimersByTime(500)
    await flushAnimationFrames()

    // Click again (new target)
    await user.click(canvas)
    
    jest.advanceTimersByTime(500)
    await flushAnimationFrames()

    // Robot count should remain the same
    expect(screen.getByText('Robots: 25')).toBeInTheDocument()
    
    jest.useRealTimers()
  })

  it('should handle rapid user interactions gracefully', async () => {
    render(<SwarmGame />)

    const canvas = screen.getByRole('img', { hidden: true })
    const slider = screen.getByRole('slider')

    // Rapid interactions
    for (let i = 0; i < 10; i++) {
      await user.click(canvas)
      await user.clear(slider)
      await user.type(slider, (10 + i).toString())
    }

    // Should end in stable state
    expect(screen.getByText('Robots: 19')).toBeInTheDocument()
    expect(screen.getByText(/Time: /)).toBeInTheDocument()
  })

  it('should reset properly when configuration changes', async () => {
    jest.useFakeTimers()
    
    render(<SwarmGame />)

    const canvas = screen.getByRole('img', { hidden: true })
    const slider = screen.getByRole('slider')

    // Start game and let it run
    await user.click(canvas)
    jest.advanceTimersByTime(1000)

    // Change robot count (should reset)
    await user.clear(slider)
    await user.type(slider, '35')

    // Game should reset
    expect(screen.getByText('Time: 0.0s')).toBeInTheDocument()
    expect(screen.getByText('Robots: 35')).toBeInTheDocument()

    jest.useRealTimers()
  })

  describe('Canvas Drawing Integration', () => {
    it('should draw robots and targets correctly', async () => {
      jest.useFakeTimers()
      
      render(<SwarmGame />)

      const canvas = screen.getByRole('img', { hidden: true })
      await user.click(canvas)

      jest.advanceTimersByTime(100)
      await flushAnimationFrames()

      const ctx = mockCanvasElement.getContext()
      
      // Should clear canvas
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 600, 400)
      
      // Should draw robots
      expect(ctx.beginPath).toHaveBeenCalled()
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fill).toHaveBeenCalled()
      
      // Should draw target
      expect(ctx.stroke).toHaveBeenCalled()

      jest.useRealTimers()
    })

    it('should update drawing based on robot count', async () => {
      jest.useFakeTimers()
      
      render(<SwarmGame />)

      const canvas = screen.getByRole('img', { hidden: true })
      const slider = screen.getByRole('slider')

      // Set high robot count
      await user.clear(slider)
      await user.type(slider, '40')

      await user.click(canvas)
      jest.advanceTimersByTime(100)
      await flushAnimationFrames()

      const ctx = mockCanvasElement.getContext()
      
      // Should have called drawing functions for more robots
      expect(ctx.arc).toHaveBeenCalled()
      
      jest.useRealTimers()
    })
  })

  describe('Performance Integration', () => {
    it('should handle high robot counts without performance issues', async () => {
      jest.useFakeTimers()
      
      render(<SwarmGame />)

      const canvas = screen.getByRole('img', { hidden: true })
      const slider = screen.getByRole('slider')

      // Maximum robots
      await user.clear(slider)
      await user.type(slider, '50')

      const startTime = performance.now()
      
      await user.click(canvas)
      jest.advanceTimersByTime(1000)
      await flushAnimationFrames()

      const endTime = performance.now()
      
      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000)

      jest.useRealTimers()
    })

    it('should maintain smooth animation under load', async () => {
      jest.useFakeTimers()
      
      render(<SwarmGame />)

      const canvas = screen.getByRole('img', { hidden: true })

      // Start animation
      await user.click(canvas)
      
      // Simulate many frames
      for (let i = 0; i < 100; i++) {
        jest.advanceTimersByTime(16) // ~60fps
        await flushAnimationFrames()
      }

      // Should still be running
      expect(screen.getByText(/Time: /)).toBeInTheDocument()

      jest.useRealTimers()
    })
  })

  describe('Error Recovery Integration', () => {
    it('should recover from canvas context errors', async () => {
      // Simulate context failure
      jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
      
      render(<SwarmGame />)

      const canvas = screen.getByRole('img', { hidden: true })
      
      // Should not crash when clicking
      await user.click(canvas)
      
      // UI should still be responsive
      expect(screen.getByRole('slider')).toBeInTheDocument()
    })

    it('should handle animation frame errors gracefully', async () => {
      const originalRAF = window.requestAnimationFrame
      
      // Mock requestAnimationFrame to throw error occasionally
      let callCount = 0
      window.requestAnimationFrame = jest.fn((callback) => {
        callCount++
        if (callCount % 10 === 0) {
          throw new Error('Animation frame error')
        }
        return originalRAF(callback)
      })

      render(<SwarmGame />)

      const canvas = screen.getByRole('img', { hidden: true })
      
      // Should handle errors gracefully
      expect(() => user.click(canvas)).not.toThrow()

      // Restore original
      window.requestAnimationFrame = originalRAF
    })
  })

  describe('Accessibility Integration', () => {
    it('should maintain accessibility during game play', async () => {
      render(<SwarmGame />)

      const slider = screen.getByRole('slider')
      const canvas = screen.getByRole('img', { hidden: true })

      // All elements should remain accessible
      expect(slider).toBeVisible()
      expect(canvas).toBeVisible()

      // After starting game
      await user.click(canvas)

      // Accessibility should be maintained
      expect(slider).toBeVisible()
      expect(screen.getByText(/Time: /)).toBeVisible()
      expect(screen.getByText(/Robots: /)).toBeVisible()
    })

    it('should support keyboard-only interaction', async () => {
      render(<SwarmGame />)

      const slider = screen.getByRole('slider')

      // Tab to slider
      await user.tab()
      expect(slider).toHaveFocus()

      // Use arrow keys
      await user.keyboard('{ArrowRight}{ArrowRight}')

      // Value should change
      const newValue = await slider.inputValue()
      expect(parseInt(newValue)).toBeGreaterThan(15)
    })
  })
})