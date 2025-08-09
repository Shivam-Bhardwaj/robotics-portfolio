"use client";
import { useEffect, useRef, useState } from "react";

interface Robot {
  x: number;
  y: number;
  angle: number;
}

interface Target {
  x: number;
  y: number;
}

const NUM_ROBOTS = 20;
const ROBOT_SPEED = 1.5;
const ROBOT_RADIUS = 5;
const TARGET_RADIUS = 10;

export default function SwarmGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robotsRef = useRef<Robot[]>([]);
  const targetsRef = useRef<Target[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 500;

    robotsRef.current = Array.from({ length: NUM_ROBOTS }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      angle: Math.random() * Math.PI * 2,
    }));

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetsRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    canvas.addEventListener("click", handleClick);

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "gold";
      targetsRef.current.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, TARGET_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      });

      robotsRef.current.forEach((r) => {
        if (targetsRef.current.length > 0) {
          const target = targetsRef.current.reduce((prev, cur) => {
            const prevDist = Math.hypot(prev.x - r.x, prev.y - r.y);
            const curDist = Math.hypot(cur.x - r.x, cur.y - r.y);
            return curDist < prevDist ? cur : prev;
          }, targetsRef.current[0]);
          const angle = Math.atan2(target.y - r.y, target.x - r.x);
          r.x += Math.cos(angle) * ROBOT_SPEED;
          r.y += Math.sin(angle) * ROBOT_SPEED;
          if (Math.hypot(target.x - r.x, target.y - r.y) < TARGET_RADIUS) {
            targetsRef.current = targetsRef.current.filter((t) => t !== target);
            setScore((s) => s + 1);
          }
        } else {
          r.x += Math.cos(r.angle) * ROBOT_SPEED;
          r.y += Math.sin(r.angle) * ROBOT_SPEED;
        }
        if (r.x < 0 || r.x > canvas.width) r.angle = Math.PI - r.angle;
        if (r.y < 0 || r.y > canvas.height) r.angle = -r.angle;

        ctx.fillStyle = "teal";
        ctx.beginPath();
        ctx.arc(r.x, r.y, ROBOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(update);
    };

    const animationRef = { current: 0 };
    update();

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          cancelAnimationFrame(animationRef.current);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationRef.current);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full border border-gray-300" />
      <div className="absolute top-2 left-2 rounded bg-white/80 px-2 py-1 text-sm">
        Score: {score} • Time: {timeLeft}
      </div>
      <p className="mt-2 text-sm text-gray-700">
        Click inside the arena to drop targets for the robots to collect.
      </p>
    </div>
  );
}

