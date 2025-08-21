"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface SwarmRobot {
  x: number;
  y: number;
  reached: boolean;
  color: string;
  trail: { x: number; y: number }[];
}

const ROBOT_COLORS = [
  "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57",
  "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43"
];

export default function SwarmGameUltra() {
  // Multi-canvas setup for layered rendering
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const robotCanvasRef = useRef<HTMLCanvasElement>(null);
  const uiCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Web Worker for physics
  const workerRef = useRef<Worker | null>(null);
  const robotsRef = useRef<SwarmRobot[]>([]);
  
  // State
  const [count, setCount] = useState(30);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [fps, setFps] = useState(60);
  const [showMetrics, setShowMetrics] = useState(false);
  
  // Performance tracking
  const startTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(0);
  const animationIdRef = useRef<number>();
  
  // Initialize Web Worker and robots
  useEffect(() => {
    // Create Web Worker
    workerRef.current = new Worker('/swarm-physics-worker.js');
    
    // Initialize robots client-side for rendering
    const colors = Array.from({ length: count }, (_, i) => ROBOT_COLORS[i % ROBOT_COLORS.length]);
    robotsRef.current = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 600,
      y: Math.random() * 400,
      reached: false,
      color: colors[i],
      trail: []
    }));
    
    // Initialize worker physics
    workerRef.current.postMessage({
      type: 'init',
      data: { count, width: 600, height: 400 }
    });
    
    // Handle worker messages
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'positions') {
        const positions = new Float32Array(e.data.positions);
        
        // Update robot positions from worker
        for (let i = 0; i < robotsRef.current.length; i++) {
          const robot = robotsRef.current[i];
          const newX = positions[i * 3];
          const newY = positions[i * 3 + 1];
          const reached = positions[i * 3 + 2] === 1;
          
          // Update trail efficiently (only if moving)
          if (!reached && Math.abs(robot.x - newX) + Math.abs(robot.y - newY) > 2) {
            robot.trail.push({ x: robot.x, y: robot.y });
            if (robot.trail.length > 5) {
              robot.trail.shift();
            }
          }
          
          robot.x = newX;
          robot.y = newY;
          robot.reached = reached;
        }
        
        // Check if all robots reached target
        if (e.data.allReached && running) {
          const finalTime = (performance.now() - startTimeRef.current) / 1000;
          setTime(finalTime);
          setBestTime(prev => prev === null || finalTime < prev ? finalTime : prev);
          setRunning(false);
        }
      }
    };
    
    return () => {
      workerRef.current?.terminate();
    };
  }, [count]);
  
  // Draw background (static layer - drawn once)
  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    // Clear and draw grid pattern
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 400);
    
    if (showMetrics) {
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      
      // Draw grid
      for (let x = 0; x <= 600; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 400);
        ctx.stroke();
      }
      
      for (let y = 0; y <= 400; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
      }
    }
  }, [showMetrics]);
  
  // Main render loop (uses requestAnimationFrame)
  const render = useCallback(() => {
    const robotCanvas = robotCanvasRef.current;
    const uiCanvas = uiCanvasRef.current;
    if (!robotCanvas || !uiCanvas) return;
    
    const robotCtx = robotCanvas.getContext('2d', { alpha: true });
    const uiCtx = uiCanvas.getContext('2d', { alpha: true });
    if (!robotCtx || !uiCtx) return;
    
    // Clear canvases
    robotCtx.clearRect(0, 0, 600, 400);
    uiCtx.clearRect(0, 0, 600, 400);
    
    // Request physics update from worker
    workerRef.current?.postMessage({ type: 'update' });
    
    const robots = robotsRef.current;
    
    // Batch render trails (single path)
    if (showMetrics) {
      robotCtx.globalAlpha = 0.3;
      robots.forEach(robot => {
        if (robot.trail.length > 1) {
          robotCtx.strokeStyle = robot.color;
          robotCtx.lineWidth = 1;
          robotCtx.beginPath();
          robotCtx.moveTo(robot.trail[0].x, robot.trail[0].y);
          for (let i = 1; i < robot.trail.length; i++) {
            robotCtx.lineTo(robot.trail[i].x, robot.trail[i].y);
          }
          robotCtx.stroke();
        }
      });
      robotCtx.globalAlpha = 1;
    }
    
    // Batch render robots using circles
    robots.forEach(robot => {
      robotCtx.fillStyle = robot.reached ? '#16a34a' : robot.color;
      robotCtx.beginPath();
      robotCtx.arc(robot.x, robot.y, 6, 0, Math.PI * 2);
      robotCtx.fill();
    });
    
    // Draw UI elements (target)
    const target = { x: 300, y: 200 }; // Will be dynamic
    uiCtx.strokeStyle = '#dc2626';
    uiCtx.lineWidth = 2;
    uiCtx.beginPath();
    uiCtx.arc(target.x, target.y, 12, 0, Math.PI * 2);
    uiCtx.stroke();
    
    // Update FPS counter
    frameCountRef.current++;
    const now = performance.now();
    if (now - lastFpsUpdateRef.current > 500) {
      const deltaTime = now - lastFpsUpdateRef.current;
      setFps(Math.round(1000 * frameCountRef.current / deltaTime));
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = now;
    }
    
    // Update timer
    if (running) {
      setTime((now - startTimeRef.current) / 1000);
    }
    
    animationIdRef.current = requestAnimationFrame(render);
  }, [running, showMetrics]);
  
  // Start render loop
  useEffect(() => {
    animationIdRef.current = requestAnimationFrame(render);
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [render]);
  
  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Send new target to worker
    workerRef.current?.postMessage({
      type: 'setTarget',
      data: { x, y }
    });
    
    // Reset timer
    setRunning(true);
    startTimeRef.current = performance.now();
    setTime(0);
    
    // Draw new target immediately
    const uiCanvas = uiCanvasRef.current;
    if (uiCanvas) {
      const ctx = uiCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 600, 400);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }, []);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Layered canvases */}
      <div 
        ref={containerRef}
        className="relative border border-gray-300 shadow-lg cursor-crosshair"
        style={{ width: 600, height: 400 }}
        onClick={handleCanvasClick}
      >
        <canvas
          ref={backgroundCanvasRef}
          width={600}
          height={400}
          className="absolute inset-0"
          style={{ imageRendering: 'pixelated' }}
        />
        <canvas
          ref={robotCanvasRef}
          width={600}
          height={400}
          className="absolute inset-0"
        />
        <canvas
          ref={uiCanvasRef}
          width={600}
          height={400}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
      
      {/* Control Panel */}
      <div className="bg-gray-50 p-4 rounded-lg w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium">Robots: {count}</label>
            <input
              type="range"
              min={10}
              max={100}
              step={10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium">
              <input
                type="checkbox"
                checked={showMetrics}
                onChange={(e) => setShowMetrics(e.target.checked)}
                className="mr-2"
              />
              Show Trails
            </label>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="bg-gray-50 p-4 rounded-lg w-full max-w-2xl">
        <h3 className="text-sm font-bold mb-2">Ultra Performance Metrics</h3>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="font-medium">FPS</div>
            <div className={`${fps >= 55 ? 'text-green-600' : fps >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
              {fps}
            </div>
          </div>
          <div>
            <div className="font-medium">Time</div>
            <div className="text-blue-600">{time.toFixed(2)}s</div>
            {bestTime && <div className="text-green-600">Best: {bestTime.toFixed(2)}s</div>}
          </div>
          <div>
            <div className="font-medium">Active</div>
            <div className="text-purple-600">
              {robotsRef.current.filter(r => !r.reached).length}/{count}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tech Info */}
      <div className="text-center max-w-2xl">
        <h3 className="text-sm font-semibold mb-2">Ultra-Optimized Swarm (Barnes-Hut + Web Workers)</h3>
        <p className="text-xs text-gray-600 mb-2">
          Click to set target. Using O(N log N) Barnes-Hut algorithm with fixed-point physics in Web Worker.
        </p>
        <div className="text-xs text-gray-500">
          <div><strong>Technologies:</strong> Barnes-Hut quadtree, Morton codes, Web Workers, Multi-canvas layering</div>
          <div><strong>Performance:</strong> Handles 100+ robots at 60 FPS using parallel computation</div>
        </div>
      </div>
    </div>
  );
}