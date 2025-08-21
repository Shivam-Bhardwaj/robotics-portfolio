"use client";
import { useEffect, useRef, useState } from "react";

const ROBOT_COUNT = 20;
const SPEED = 3;
const TARGET_RADIUS = 15;

export default function SwarmGameSimple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  
  // Simple robot data - just arrays for speed
  const robotsX = useRef<Float32Array>(new Float32Array(ROBOT_COUNT));
  const robotsY = useRef<Float32Array>(new Float32Array(ROBOT_COUNT));
  const robotsReached = useRef<Uint8Array>(new Uint8Array(ROBOT_COUNT));
  const targetX = useRef(300);
  const targetY = useRef(200);
  const running = useRef(false);
  const startTime = useRef(0);

  // Initialize robots once
  useEffect(() => {
    for (let i = 0; i < ROBOT_COUNT; i++) {
      robotsX.current[i] = Math.random() * 600;
      robotsY.current[i] = Math.random() * 400;
      robotsReached.current[i] = 0;
    }
  }, []);

  // Main game loop - super simple
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let frameSkip = 0;
    
    const animate = () => {
      frameSkip++;
      
      // Only update every 2 frames for 30fps physics
      if (frameSkip % 2 === 0) {
        // Clear canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 600, 400);
        
        let allReached = true;
        
        // Update and draw robots in one pass
        ctx.fillStyle = "#4ecdc4";
        for (let i = 0; i < ROBOT_COUNT; i++) {
          if (robotsReached.current[i] === 0) {
            // Simple movement toward target
            const dx = targetX.current - robotsX.current[i];
            const dy = targetY.current - robotsY.current[i];
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < TARGET_RADIUS) {
              robotsReached.current[i] = 1;
            } else {
              allReached = false;
              // Move toward target
              robotsX.current[i] += (dx / dist) * SPEED;
              robotsY.current[i] += (dy / dist) * SPEED;
            }
          }
          
          // Draw robot - simple circle
          ctx.beginPath();
          ctx.arc(robotsX.current[i], robotsY.current[i], 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw target
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetX.current, targetY.current, TARGET_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
        
        // Check completion
        if (running.current) {
          if (allReached) {
            running.current = false;
            const finalTime = (Date.now() - startTime.current) / 1000;
            setTime(finalTime);
            setBestTime(prev => prev === null || finalTime < prev ? finalTime : prev);
          } else {
            setTime((Date.now() - startTime.current) / 1000);
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    targetX.current = e.clientX - rect.left;
    targetY.current = e.clientY - rect.top;
    
    // Reset robots
    for (let i = 0; i < ROBOT_COUNT; i++) {
      robotsReached.current[i] = 0;
    }
    
    running.current = true;
    startTime.current = Date.now();
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onClick={handleClick}
        className="border border-gray-300 bg-white shadow-lg cursor-crosshair"
      />
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold">Time: {time.toFixed(1)}s</div>
          {bestTime && <div className="text-sm text-green-600">Best: {bestTime.toFixed(1)}s</div>}
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        <p>Click to set target - Ultra simplified for maximum performance</p>
        <p className="text-xs mt-1">20 robots, no complex physics, just movement</p>
      </div>
    </div>
  );
}