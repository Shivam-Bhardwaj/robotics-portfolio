import { ReactElement } from 'react'
import { render, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Robot simulation test helpers
export const createMockRobot = (overrides: Partial<any> = {}) => ({
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  angle: 0,
  targetAngle: 0,
  path: [],
  scanAngle: 0,
  lastScanTime: Date.now(),
  color: '#00ffff',
  id: 0,
  role: 'leader' as const,
  targetX: 200,
  targetY: 200,
  communicating: new Set([1, 2]),
  particles: [],
  sensors: {
    lidar: new Array(16).fill(100),
    imu: { ax: 0, ay: 0, gz: 0 },
    odometry: { dx: 0, dy: 0, dtheta: 0 },
    gps: { x: 100, y: 100, accuracy: 5 },
  },
  waypoints: [],
  batteryLevel: 85,
  temperature: 42,
  processingLoad: 35,
  networkLatency: 25,
  lastUpdate: Date.now(),
  confidence: 0.8,
  reached: false,
  ...overrides,
})

// Canvas testing utilities
export const mockCanvasContext = () => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  scale: jest.fn(),
  setLineDash: jest.fn(),
  closePath: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
  measureText: jest.fn(() => ({ width: 100 })),
  font: '12px Arial',
  textAlign: 'left' as CanvasTextAlign,
  fillText: jest.fn(),
})

// Mock canvas element
export const mockCanvas = () => ({
  getContext: jest.fn(() => mockCanvasContext()),
  width: 800,
  height: 600,
  getBoundingClientRect: jest.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
    right: 800,
    bottom: 600,
  })),
})

// Animation frame helpers
export const flushAnimationFrames = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

// User interaction helpers
export const setupUser = () => userEvent.setup()

export const simulateCanvasClick = (canvas: HTMLCanvasElement, x: number, y: number) => {
  const event = new MouseEvent('click', {
    clientX: x,
    clientY: y,
    bubbles: true,
  })
  canvas.dispatchEvent(event)
}

export const simulateMouseMove = (element: HTMLElement, x: number, y: number) => {
  const event = new MouseEvent('mousemove', {
    clientX: x,
    clientY: y,
    bubbles: true,
  })
  element.dispatchEvent(event)
}

// Performance testing helpers
export const measureRenderTime = (renderFn: () => RenderResult): Promise<number> => {
  return new Promise((resolve) => {
    const start = performance.now()
    renderFn()
    requestAnimationFrame(() => {
      const end = performance.now()
      resolve(end - start)
    })
  })
}

// Accessibility helpers
export const getAccessibilityViolations = async (container: HTMLElement) => {
  const { axe } = await import('jest-axe')
  return await axe(container)
}

// Local storage helpers
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key])
    }),
  }
}

// Network request helpers
export const mockFetch = (response: any, ok = true, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  ) as jest.Mock
}

// Component testing utilities
export interface ComponentTestSetup {
  component: ReactElement
  props?: Record<string, any>
  user: ReturnType<typeof userEvent.setup>
}

export const setupComponentTest = (
  component: ReactElement,
  props?: Record<string, any>
): ComponentTestSetup => {
  return {
    component,
    props,
    user: userEvent.setup(),
  }
}

// Wait for element helpers
export const waitForElement = (callback: () => HTMLElement | null, timeout = 5000) => {
  return new Promise<HTMLElement>((resolve, reject) => {
    const startTime = Date.now()
    const checkElement = () => {
      const element = callback()
      if (element) {
        resolve(element)
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error('Element not found within timeout'))
      } else {
        setTimeout(checkElement, 10)
      }
    }
    checkElement()
  })
}

// Custom matchers for robotics components
export const roboticsMatchers = {
  toBeValidRobot: (robot: any) => {
    const pass = 
      typeof robot.x === 'number' &&
      typeof robot.y === 'number' &&
      typeof robot.angle === 'number' &&
      typeof robot.id === 'number' &&
      ['leader', 'follower', 'scout'].includes(robot.role)

    return {
      message: () => `expected ${robot} to be a valid robot`,
      pass,
    }
  },
  
  toBeWithinBounds: (position: { x: number; y: number }, bounds: { width: number; height: number }) => {
    const pass = 
      position.x >= 0 &&
      position.x <= bounds.width &&
      position.y >= 0 &&
      position.y <= bounds.height

    return {
      message: () => `expected position (${position.x}, ${position.y}) to be within bounds (${bounds.width}x${bounds.height})`,
      pass,
    }
  },

  toHaveValidSensorData: (sensors: any) => {
    const pass = 
      Array.isArray(sensors.lidar) &&
      sensors.lidar.length > 0 &&
      typeof sensors.imu.ax === 'number' &&
      typeof sensors.gps.x === 'number'

    return {
      message: () => `expected ${JSON.stringify(sensors)} to have valid sensor data`,
      pass,
    }
  },
}

// Add custom matchers to Jest
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidRobot(): R
      toBeWithinBounds(bounds: { width: number; height: number }): R
      toHaveValidSensorData(): R
    }
  }
}