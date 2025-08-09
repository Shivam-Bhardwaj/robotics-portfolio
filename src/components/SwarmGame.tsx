"use client";
import { useEffect, useRef, useState } from "react";

interface Robot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  reached: boolean;
}

const MAX_SPEED = 2;
const ACCEL = 0.05;
const TARGET_RADIUS = 12;

export default function SwarmGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robotsRef = useRef<Robot[]>([]);
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const runningRef = useRef(false);
  const startRef = useRef(0);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [count, setCount] = useState(15);

  // initialize robots when count changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    robotsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      reached: false,
    }));
    targetRef.current = { x: width / 2, y: height / 2 };
    runningRef.current = false;
    setTime(0);
  }, [count]);

  // animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const step = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // update robots
      let allReached = true;
      robotsRef.current.forEach((r) => {
        if (!r.reached) {
          const dx = targetRef.current.x - r.x;
          const dy = targetRef.current.y - r.y;
          const dist = Math.hypot(dx, dy);
          if (dist < TARGET_RADIUS) {
            r.reached = true;
            r.vx = r.vy = 0;
          } else {
            allReached = false;
            r.vx += (dx / dist) * ACCEL + (Math.random() - 0.5) * ACCEL;
            r.vy += (dy / dist) * ACCEL + (Math.random() - 0.5) * ACCEL;
            const speed = Math.hypot(r.vx, r.vy);
            if (speed > MAX_SPEED) {
              r.vx = (r.vx / speed) * MAX_SPEED;
              r.vy = (r.vy / speed) * MAX_SPEED;
            }
            r.x += r.vx;
            r.y += r.vy;
          }
        }
        // draw robot
        ctx.fillStyle = r.reached ? "#16a34a" : "#0ea5e9";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // draw target
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetRef.current.x, targetRef.current.y, TARGET_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      if (runningRef.current && !allReached) {
        setTime((timestamp - startRef.current) / 1000);
      }

      if (runningRef.current && allReached) {
        runningRef.current = false;
        const final = (timestamp - startRef.current) / 1000;
        setTime(final);
        setBestTime((prev) => (prev === null || final < prev ? final : prev));
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    robotsRef.current.forEach((r) => (r.reached = false));
    runningRef.current = true;
    startRef.current = performance.now();
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onClick={handleClick}
        className="border border-gray-300 bg-white"
      />
      <div className="mt-4 flex items-center space-x-3">
        <label className="text-sm">Robots: {count}</label>
        <input
          type="range"
          min={5}
          max={50}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
        />
      </div>
      <div className="mt-2 text-sm">
        Time: {time.toFixed(1)}s{bestTime !== null && ` (Best: ${bestTime.toFixed(1)}s)`}
      </div>
      <p className="mt-2 text-xs text-gray-500">Click canvas to set target and gather the swarm.</p>
    </div>
  );
}

