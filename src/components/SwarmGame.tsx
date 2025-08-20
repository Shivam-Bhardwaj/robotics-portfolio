"use client";
import { useEffect, useRef, useState } from "react";
import { Vector2 } from "@/lib/robotics/math";
import { FlockingBehavior, ConsensusAlgorithm, FormationController } from "@/lib/robotics/algorithms";

interface SwarmRobot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  reached: boolean;
  id: number;
  role: "leader" | "follower" | "explorer";
  neighbors: Set<number>;
  state: {
    consensusValue: number[];
    formationPosition: Vector2;
    energy: number;
    communication: boolean;
  };
  color: string;
  trail: Vector2[];
}

const MAX_SPEED = 2;
const ACCEL = 0.05;
const TARGET_RADIUS = 12;
const COMMUNICATION_RADIUS = 80;
const FORMATION_SPACING = 40;
const TRAIL_LENGTH = 20;


export default function SwarmGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robotsRef = useRef<SwarmRobot[]>([]);

  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const runningRef = useRef(false);
  const startRef = useRef(0);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [count, setCount] = useState(15);
  const [swarmMode, setSwarmMode] = useState<"gather" | "formation" | "explore" | "consensus">("gather");
  const [showMetrics, setShowMetrics] = useState(true);

  // Advanced swarm algorithms
  const flockingBehavior = useRef(new FlockingBehavior(30, 60, 80, 2.0, 1.0, 1.0));
  const consensusAlgorithm = useRef(new ConsensusAlgorithm(COMMUNICATION_RADIUS));
  const formationController = useRef(new FormationController(1.5, 0.1, 0.3));
  
  // Formation patterns
  const formations = useRef(new Map<number, Vector2>());
  const [currentFormation, setCurrentFormation] = useState<"circle" | "line" | "grid" | "v">("circle");

  // Generate formation patterns
  const generateFormation = (pattern: string, robotCount: number, centerX: number, centerY: number) => {
    const formation = new Map<number, Vector2>();
    
    switch (pattern) {
      case "circle":
        for (let i = 0; i < robotCount; i++) {
          const angle = (i / robotCount) * Math.PI * 2;
          const radius = FORMATION_SPACING;
          formation.set(i, new Vector2(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
          ));
        }
        break;
      case "line":
        for (let i = 0; i < robotCount; i++) {
          formation.set(i, new Vector2(
            (i - robotCount / 2) * FORMATION_SPACING,
            0
          ));
        }
        break;
      case "grid":
        const gridSize = Math.ceil(Math.sqrt(robotCount));
        for (let i = 0; i < robotCount; i++) {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          formation.set(i, new Vector2(
            (col - gridSize / 2) * FORMATION_SPACING,
            (row - gridSize / 2) * FORMATION_SPACING
          ));
        }
        break;
      case "v":
        for (let i = 0; i < robotCount; i++) {
          const side = i % 2 === 0 ? 1 : -1;
          const row = Math.floor(i / 2);
          formation.set(i, new Vector2(
            side * row * FORMATION_SPACING * 0.5,
            -row * FORMATION_SPACING
          ));
        }
        break;
    }
    
    return formation;
  };

  // initialize robots when count changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    
    const colors = [
      "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57",
      "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43",
      "#c7ecee", "#dda0dd", "#98d8c8", "#f7dc6f", "#bb8fce"
    ];
    
    robotsRef.current = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      reached: false,
      id: i,
      role: i === 0 ? "leader" : (i < 3 ? "explorer" : "follower") as const,
      neighbors: new Set<number>(),
      state: {
        consensusValue: [Math.random(), Math.random(), Math.random()],
        formationPosition: Vector2.zero(),
        energy: 100,
        communication: true
      },
      color: colors[i % colors.length],
      trail: []
    }));
    
    // Generate initial formation
    formations.current = generateFormation(currentFormation, count, width / 2, height / 2);
    
    targetRef.current = { x: width / 2, y: height / 2 };
    runningRef.current = false;
    setTime(0);
  }, [count, currentFormation]);

  // animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateNeighbors = () => {
      robotsRef.current.forEach(robot => {
        robot.neighbors.clear();
        robotsRef.current.forEach(other => {
          if (robot.id !== other.id) {
            const distance = Math.hypot(robot.x - other.x, robot.y - other.y);
            if (distance <= COMMUNICATION_RADIUS) {
              robot.neighbors.add(other.id);
            }
          }
        });
      });
    };

    const updateConsensus = () => {
      const consensusUpdates = consensusAlgorithm.current.updateConsensus(
        robotsRef.current.map(r => ({
          id: r.id,
          position: new Vector2(r.x, r.y),
          velocity: new Vector2(r.vx, r.vy),
          neighbors: r.neighbors,
          state: r.state
        })),
        [0.5, 0.5, 0.5] // Target consensus value
      );
      
      consensusUpdates.forEach((value, robotId) => {
        const robot = robotsRef.current.find(r => r.id === robotId);
        if (robot) {
          robot.state.consensusValue = value;
        }
      });
    };

    const updateFormationControl = () => {
      const leaderPosition = new Vector2(targetRef.current.x, targetRef.current.y);
      
      formationController.current.updateFormation(
        robotsRef.current.map(r => ({
          id: r.id,
          position: new Vector2(r.x, r.y),
          velocity: new Vector2(r.vx, r.vy),
          neighbors: r.neighbors,
          state: r.state
        })),
        formations.current,
        leaderPosition,
        0.1 // deltaTime
      );
    };

    const updateFlocking = () => {
      robotsRef.current.forEach(robot => {
        const neighbors = robotsRef.current.filter(r => robot.neighbors.has(r.id));
        const swarmAgents = neighbors.map(r => ({
          id: r.id,
          position: new Vector2(r.x, r.y),
          velocity: new Vector2(r.vx, r.vy),
          neighbors: r.neighbors,
          state: r.state
        }));
        
        if (swarmAgents.length > 0) {
          const flockingForce = flockingBehavior.current.computeFlockingForce(
            {
              id: robot.id,
              position: new Vector2(robot.x, robot.y),
              velocity: new Vector2(robot.vx, robot.vy),
              neighbors: robot.neighbors,
              state: robot.state
            },
            swarmAgents
          );
          
          robot.vx += flockingForce.x * 0.1;
          robot.vy += flockingForce.y * 0.1;
        }
      });
    };

    const step = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update neighbor relationships
      updateNeighbors();

      // Apply swarm behaviors based on mode
      switch (swarmMode) {
        case "consensus":
          updateConsensus();
          break;
        case "formation":
          updateFormationControl();
          break;
        case "explore":
          updateFlocking();
          break;
      }

      // update robots
      let allReached = true;
      robotsRef.current.forEach((r) => {
        // Update trail
        r.trail.push(new Vector2(r.x, r.y));
        if (r.trail.length > TRAIL_LENGTH) {
          r.trail.shift();
        }

        if (!r.reached) {
          let targetX = targetRef.current.x;
          let targetY = targetRef.current.y;

          // Modify target based on swarm mode
          if (swarmMode === "formation" && formations.current.has(r.id)) {
            const formationPos = formations.current.get(r.id)!;
            targetX += formationPos.x;
            targetY += formationPos.y;
          }

          const dx = targetX - r.x;
          const dy = targetY - r.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < TARGET_RADIUS) {
            r.reached = true;
            r.vx *= 0.9; // Gradual stop
            r.vy *= 0.9;
          } else {
            allReached = false;
            
            // Base movement towards target
            r.vx += (dx / dist) * ACCEL;
            r.vy += (dy / dist) * ACCEL;
            
            // Add some noise for realistic movement
            r.vx += (Math.random() - 0.5) * ACCEL * 0.2;
            r.vy += (Math.random() - 0.5) * ACCEL * 0.2;
            
            // Limit speed
            const speed = Math.hypot(r.vx, r.vy);
            if (speed > MAX_SPEED) {
              r.vx = (r.vx / speed) * MAX_SPEED;
              r.vy = (r.vy / speed) * MAX_SPEED;
            }
            
            r.x += r.vx;
            r.y += r.vy;
            
            // Update energy based on movement
            r.state.energy -= 0.1;
            if (r.state.energy <= 0) {
              r.state.energy = 100; // Recharge
            }
          }
        }

        // Draw robot trail
        if (r.trail.length > 1) {
          ctx.strokeStyle = r.color + "40";
          ctx.lineWidth = 2;
          ctx.beginPath();
          r.trail.forEach((point, i) => {
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }

        // Draw communication links
        r.neighbors.forEach(neighborId => {
          const neighbor = robotsRef.current.find(robot => robot.id === neighborId);
          if (neighbor && r.id < neighborId) { // Draw each link only once
            ctx.strokeStyle = "rgba(100, 200, 255, 0.3)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.stroke();
          }
        });

        // Draw robot
        ctx.fillStyle = r.reached ? "#16a34a" : r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw role indicator
        ctx.fillStyle = "#ffffff";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        const roleSymbol = r.role === "leader" ? "L" : r.role === "explorer" ? "E" : "F";
        ctx.fillText(roleSymbol, r.x, r.y + 3);

        // Draw energy bar
        if (showMetrics) {
          const energyWidth = 16;
          const energyHeight = 3;
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(r.x - energyWidth/2, r.y - 15, energyWidth, energyHeight);
          ctx.fillStyle = r.state.energy > 30 ? "#4ade80" : "#ef4444";
          ctx.fillRect(r.x - energyWidth/2, r.y - 15, (r.state.energy / 100) * energyWidth, energyHeight);
        }
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

  const networkConnectivity = robotsRef.current.length > 0 ? 
    robotsRef.current.reduce((sum, r) => sum + r.neighbors.size, 0) / robotsRef.current.length : 0;
  
  const avgConsensus = robotsRef.current.length > 0 ?
    robotsRef.current.reduce((sum, r) => sum + r.state.consensusValue[0], 0) / robotsRef.current.length : 0;

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onClick={handleClick}
        className="border border-gray-300 bg-white shadow-lg"
      />
      
      {/* Control Panel */}
      <div className="bg-gray-50 p-4 rounded-lg w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Robot Count */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium">Robots: {count}</label>
            <input
              type="range"
              min={5}
              max={30}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="flex-1"
            />
          </div>

          {/* Swarm Mode */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium">Mode:</label>
            <select
              value={swarmMode}
              onChange={(e) => setSwarmMode(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="gather">Gather</option>
              <option value="formation">Formation</option>
              <option value="explore">Flocking</option>
              <option value="consensus">Consensus</option>
            </select>
          </div>

          {/* Formation Type */}
          {swarmMode === "formation" && (
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium">Formation:</label>
              <select
                value={currentFormation}
                onChange={(e) => setCurrentFormation(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="circle">Circle</option>
                <option value="line">Line</option>
                <option value="grid">Grid</option>
                <option value="v">V-Formation</option>
              </select>
            </div>
          )}

          {/* Show Metrics */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium">
              <input
                type="checkbox"
                checked={showMetrics}
                onChange={(e) => setShowMetrics(e.target.checked)}
                className="mr-2"
              />
              Show Metrics
            </label>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {showMetrics && (
        <div className="bg-gray-50 p-4 rounded-lg w-full max-w-2xl">
          <h3 className="text-sm font-bold mb-2">Swarm Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="font-medium">Completion Time</div>
              <div className="text-blue-600">{time.toFixed(1)}s</div>
              {bestTime && <div className="text-green-600">Best: {bestTime.toFixed(1)}s</div>}
            </div>
            <div>
              <div className="font-medium">Network Connectivity</div>
              <div className="text-purple-600">{networkConnectivity.toFixed(1)} avg links</div>
            </div>
            <div>
              <div className="font-medium">Consensus Progress</div>
              <div className="text-orange-600">{(avgConsensus * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="font-medium">Active Robots</div>
              <div className="text-green-600">{robotsRef.current.filter(r => !r.reached).length}/{robotsRef.current.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center max-w-2xl">
        <h3 className="text-sm font-semibold mb-2">Advanced Swarm Robotics Demo</h3>
        <p className="text-xs text-gray-600 mb-2">
          Click canvas to set target. Watch different swarm behaviors in action:
        </p>
        <div className="text-xs text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><strong>Gather:</strong> Simple target following with basic coordination</div>
          <div><strong>Formation:</strong> Maintains geometric patterns while moving</div>
          <div><strong>Flocking:</strong> Emergent behavior with separation, alignment, cohesion</div>
          <div><strong>Consensus:</strong> Distributed agreement algorithm demonstration</div>
        </div>
      </div>
    </div>
  );
}

