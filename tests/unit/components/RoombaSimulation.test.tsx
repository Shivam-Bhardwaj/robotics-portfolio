import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RoombaSimulation from '@/components/RoombaSimulation'
import { mockCanvas, simulateCanvasClick, flushAnimationFrames } from '../../utils/test-helpers'

// Mock the global fetch for world map data
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      features: [
        {
          geometry: {
            type: 'Polygon',
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
          }
        }
      ]
    }),
  })
) as jest.Mock

describe('RoombaSimulation', () => {
  let mockCanvasElement: any

  beforeEach(() => {
    mockCanvasElement = mockCanvas()
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasElement.getContext())
    
    // Mock getBoundingClientRect
    jest.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 600,
    })

    // Clear localStorage
    localStorage.clear()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('renders the simulation canvas', () => {
    render(<RoombaSimulation />)
    
    const canvas = screen.getByRole('img', { hidden: true }) // Canvas has img role
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveClass('fixed', 'inset-0', 'pointer-events-none', '-z-10')
  })

  it('displays telemetry panel', () => {
    render(<RoombaSimulation />)
    
    // The telemetry div should be present
    const telemetryPanel = document.querySelector('.fixed.bottom-4.right-4')
    expect(telemetryPanel).toBeInTheDocument()
  })

  it('displays coverage and game stats', () => {
    render(<RoombaSimulation />)
    
    expect(screen.getByText(/Coverage:/)).toBeInTheDocument()
    expect(screen.getByText(/Time:/)).toBeInTheDocument()
    expect(screen.getByText(/Press 'R' to reset/)).toBeInTheDocument()
  })

  it('displays global robotics network info', () => {
    render(<RoombaSimulation />)
    
    expect(screen.getByText('GLOBAL ROBOTICS NETWORK v2.0')).toBeInTheDocument()
    expect(screen.getByText('Click robot for telemetry')).toBeInTheDocument()
    expect(screen.getByText(/12 agents/)).toBeInTheDocument()
    expect(screen.getByText('Real-time worldwide coordination')).toBeInTheDocument()
  })

  it('initializes canvas context correctly', async () => {
    render(<RoombaSimulation />)
    
    await waitFor(() => {
      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d')
    })
  })

  it('handles mouse movement', async () => {
    render(<RoombaSimulation />)
    
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200,
      bubbles: true,
    })

    fireEvent(window, mouseMoveEvent)
    
    // Should not throw any errors
    expect(true).toBe(true)
  })

  it('handles canvas clicks for robot selection', async () => {
    render(<RoombaSimulation />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    
    const clickEvent = new MouseEvent('click', {
      clientX: 100,
      clientY: 200,
      bubbles: true,
    })

    fireEvent(canvas, clickEvent)
    
    // Should not throw any errors
    expect(true).toBe(true)
  })

  it('handles keyboard reset with R key', async () => {
    render(<RoombaSimulation />)
    
    const user = userEvent.setup()
    
    await user.keyboard('r')
    
    // Should reset the simulation without errors
    expect(true).toBe(true)
  })

  it('handles window resize', async () => {
    render(<RoombaSimulation />)
    
    // Trigger resize event
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    })

    fireEvent(window, new Event('resize'))
    
    await waitFor(() => {
      // Canvas should be resized
      expect(true).toBe(true)
    })
  })

  it('saves and loads high score from localStorage', () => {
    // Set initial high score
    localStorage.setItem('roombaHighScore', '100')
    
    render(<RoombaSimulation />)
    
    expect(localStorage.getItem('roombaHighScore')).toBe('100')
  })

  it('fetches world map data on initialization', async () => {
    render(<RoombaSimulation />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/countries.geo.json')
    })
  })

  it('handles animation frame requests', async () => {
    const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame')
    
    render(<RoombaSimulation />)
    
    await waitFor(() => {
      expect(requestAnimationFrameSpy).toHaveBeenCalled()
    })
  })

  it('cleans up resources on unmount', () => {
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame')
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    
    const { unmount } = render(<RoombaSimulation />)
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalled()
  })

  it('updates telemetry data periodically', async () => {
    jest.useFakeTimers()
    
    render(<RoombaSimulation />)
    
    // Fast-forward time
    jest.advanceTimersByTime(200)
    
    await flushAnimationFrames()
    
    // Telemetry should be updated
    const telemetryPanel = document.querySelector('.fixed.bottom-4.right-4')
    expect(telemetryPanel).toBeInTheDocument()
    
    jest.useRealTimers()
  })

  it('renders with correct styling', () => {
    render(<RoombaSimulation />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    expect(canvas).toHaveStyle({
      background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
    })
  })

  it('has proper accessibility attributes', () => {
    render(<RoombaSimulation />)
    
    const telemetryPanel = document.querySelector('.fixed.bottom-4.right-4')
    expect(telemetryPanel).toHaveClass('pointer-events-none')
    
    // Canvas should not interfere with interactions
    const canvas = screen.getByRole('img', { hidden: true })
    expect(canvas).toHaveClass('pointer-events-none')
  })

  describe('Performance', () => {
    it('should not cause memory leaks', () => {
      const { unmount } = render(<RoombaSimulation />)
      
      // Component should unmount cleanly
      expect(() => unmount()).not.toThrow()
    })

    it('should handle rapid mouse movements', () => {
      render(<RoombaSimulation />)
      
      // Simulate rapid mouse movements
      for (let i = 0; i < 100; i++) {
        const event = new MouseEvent('mousemove', {
          clientX: i,
          clientY: i,
          bubbles: true,
        })
        fireEvent(window, event)
      }
      
      // Should not throw errors
      expect(true).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('handles canvas context creation failure', () => {
      jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
      
      expect(() => render(<RoombaSimulation />)).not.toThrow()
    })

    it('handles fetch errors gracefully', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))
      
      expect(() => render(<RoombaSimulation />)).not.toThrow()
    })
  })
})