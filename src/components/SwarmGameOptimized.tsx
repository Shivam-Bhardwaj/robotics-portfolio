"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
  gridCell?: { x: number; y: number };
}

// Performance constants
const MAX_SPEED = 5;
const ACCEL = 0.2;
const TARGET_RADIUS = 12;
const COMMUNICATION_RADIUS = 80;
const FORMATION_SPACING = 40;
const TRAIL_LENGTH = 10;
const GRID_CELL_SIZE = 100; // Spatial grid cell size
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;
const PHYSICS_UPDATE_RATE = 30; // Physics updates per second
const PHYSICS_INTERVAL = 1000 / PHYSICS_UPDATE_RATE;

// Spatial grid for efficient neighbor queries
class SpatialGrid {
  private grid: Map<string, Set<number>> = new Map();
  private cellSize: number;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  clear(): void {
    this.grid.clear();
  }

  getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  addRobot(robot: SwarmRobot): void {
    const key = this.getCellKey(robot.x, robot.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, new Set());
    }
    this.grid.get(key)!.add(robot.id);
    robot.gridCell = {
      x: Math.floor(robot.x / this.cellSize),
      y: Math.floor(robot.y / this.cellSize)
    };
  }

  getNearbyCells(x: number, y: number, radius: number): Set<number> {
    const result = new Set<number>();
    const cellRadius = Math.ceil(radius / this.cellSize);
    const centerCellX = Math.floor(x / this.cellSize);
    const centerCellY = Math.floor(y / this.cellSize);

    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = `${centerCellX + dx},${centerCellY + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          cell.forEach(id => result.add(id));
        }
      }
    }

    return result;
  }

  updateRobot(robot: SwarmRobot): void {
    const newCellX = Math.floor(robot.x / this.cellSize);
    const newCellY = Math.floor(robot.y / this.cellSize);

    if (!robot.gridCell || 
        robot.gridCell.x !== newCellX || 
        robot.gridCell.y !== newCellY) {
      // Remove from old cell
      if (robot.gridCell) {
        const oldKey = `${robot.gridCell.x},${robot.gridCell.y}`;
        const oldCell = this.grid.get(oldKey);
        if (oldCell) {
          oldCell.delete(robot.id);
          if (oldCell.size === 0) {
            this.grid.delete(oldKey);
          }
        }
      }

      // Add to new cell
      this.addRobot(robot);
    }
  }
}

export default function SwarmGameOptimized() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robotsRef = useRef<SwarmRobot[]>([]);
  const spatialGrid = useRef(new SpatialGrid(GRID_CELL_SIZE));
  
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const physicsIntervalRef = useRef<NodeJS.Timeout>();
  const runningRef = useRef(false);
  const startRef = useRef(0);
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);
  
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [count, setCount] = useState(15);
  const [swarmMode, setSwarmMode] = useState<"gather" | "formation" | "explore" | "consensus">("gather");
  const [showMetrics, setShowMetrics] = useState(true);
  const [fps, setFps] = useState(0);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  // Advanced swarm algorithms - memoized
  const flockingBehavior = useMemo(() => new FlockingBehavior(30, 60, 80, 2.0, 1.0, 1.0), []);
  const consensusAlgorithm = useMemo(() => new ConsensusAlgorithm(COMMUNICATION_RADIUS), []);
  const formationController = useMemo(() => new FormationController(1.5, 0.1, 0.3), []);
  
  const formations = useRef(new Map<number, Vector2>());
  const [currentFormation, setCurrentFormation] = useState<"circle" | "line" | "grid" | "v">("circle");

  // Memoized formation generation
  const generateFormation = useCallback((pattern: string, robotCount: number) => {
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
  }, []);

  // Initialize robots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      role: i === 0 ? "leader" : (i < 3 ? "explorer" : "follower"),
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
    
    // Initialize spatial grid
    spatialGrid.current.clear();
    robotsRef.current.forEach(robot => spatialGrid.current.addRobot(robot));
    
    formations.current = generateFormation(currentFormation, count);
    targetRef.current = { x: width / 2, y: height / 2 };
    runningRef.current = false;
    setTime(0);
  }, [count, currentFormation, generateFormation]);

  // Optimized neighbor update using spatial grid
  const updateNeighbors = useCallback(() => {
    const robots = robotsRef.current;
    
    robots.forEach(robot => {
      robot.neighbors.clear();
      
      // Get potential neighbors from spatial grid
      const nearbyIds = spatialGrid.current.getNearbyCells(robot.x, robot.y, COMMUNICATION_RADIUS);
      
      nearbyIds.forEach(otherId => {
        if (otherId !== robot.id) {
          const other = robots[otherId];
          if (other) {
            const dx = robot.x - other.x;
            const dy = robot.y - other.y;
            const distSq = dx * dx + dy * dy;
            
            if (distSq <= COMMUNICATION_RADIUS * COMMUNICATION_RADIUS) {
              robot.neighbors.add(otherId);
            }
          }
        }
      });
    });
  }, []);

  // Physics update (runs at fixed rate)
  const updatePhysics = useCallback(() => {
    const robots = robotsRef.current;
    
    // Update neighbors less frequently
    if (frameCount.current % 3 === 0) {
      updateNeighbors();
    }

    // Apply swarm behaviors
    if (frameCount.current % 2 === 0) {
      switch (swarmMode) {
        case "consensus": {
          const consensusUpdates = consensusAlgorithm.updateConsensus(
            robots.map(r => ({
              id: r.id,
              position: new Vector2(r.x, r.y),
              velocity: new Vector2(r.vx, r.vy),
              neighbors: r.neighbors,
              state: r.state
            })),
            [0.5, 0.5, 0.5]
          );
          
          consensusUpdates.forEach((value, robotId) => {
            const robot = robots.find(r => r.id === robotId);
            if (robot) {
              robot.state.consensusValue = value;
            }
          });
          break;
        }
        case "formation": {
          const leaderPosition = new Vector2(targetRef.current.x, targetRef.current.y);
          formationController.updateFormation(
            robots.map(r => ({
              id: r.id,
              position: new Vector2(r.x, r.y),
              velocity: new Vector2(r.vx, r.vy),
              neighbors: r.neighbors,
              state: r.state
            })),
            formations.current,
            leaderPosition,
            PHYSICS_INTERVAL / 1000
          );
          break;
        }
        case "explore": {
          robots.forEach(robot => {
            const neighbors = Array.from(robot.neighbors)
              .map(id => robots[id])
              .filter(Boolean);
            
            if (neighbors.length > 0) {
              const swarmAgents = neighbors.map(r => ({
                id: r.id,
                position: new Vector2(r.x, r.y),
                velocity: new Vector2(r.vx, r.vy),
                neighbors: r.neighbors,
                state: r.state
              }));
              
              const flockingForce = flockingBehavior.computeFlockingForce(
                {
                  id: robot.id,
                  position: new Vector2(robot.x, robot.y),
                  velocity: new Vector2(robot.vx, robot.vy),
                  neighbors: robot.neighbors,
                  state: robot.state
                },
                swarmAgents
              );
              
              robot.vx += flockingForce.x * 0.3;
              robot.vy += flockingForce.y * 0.3;
            }
          });
          break;
        }
      }
    }

    // Update robot positions
    let allReached = true;
    robots.forEach(robot => {
      // Update trail periodically
      if (frameCount.current % 4 === 0 && !robot.reached) {
        robot.trail.push(new Vector2(robot.x, robot.y));
        if (robot.trail.length > TRAIL_LENGTH) {
          robot.trail.shift();
        }
      }

      if (!robot.reached) {
        let targetX = targetRef.current.x;
        let targetY = targetRef.current.y;

        if (swarmMode === "formation" && formations.current.has(robot.id)) {
          const formationPos = formations.current.get(robot.id)!;
          targetX += formationPos.x;
          targetY += formationPos.y;
        }

        const dx = targetX - robot.x;
        const dy = targetY - robot.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < TARGET_RADIUS) {
          robot.reached = true;
          robot.vx *= 0.9;
          robot.vy *= 0.9;
        } else {
          allReached = false;
          
          robot.vx += (dx / dist) * ACCEL;
          robot.vy += (dy / dist) * ACCEL;
          
          // Reduced noise for performance
          if (frameCount.current % 3 === 0) {
            robot.vx += (Math.random() - 0.5) * ACCEL * 0.1;
            robot.vy += (Math.random() - 0.5) * ACCEL * 0.1;
          }
          
          const speed = Math.hypot(robot.vx, robot.vy);
          if (speed > MAX_SPEED) {
            robot.vx = (robot.vx / speed) * MAX_SPEED;
            robot.vy = (robot.vy / speed) * MAX_SPEED;
          }
          
          robot.x += robot.vx;
          robot.y += robot.vy;
          
          // Update spatial grid
          spatialGrid.current.updateRobot(robot);
          
          robot.state.energy = Math.max(0, robot.state.energy - 0.1);
          if (robot.state.energy <= 0) {
            robot.state.energy = 100;
          }
        }
      }
    });

    if (runningRef.current) {
      if (allReached) {
        runningRef.current = false;
        const final = (performance.now() - startRef.current) / 1000;
        setTime(final);
        setBestTime(prev => (prev === null || final < prev ? final : prev));
      } else {
        setTime((performance.now() - startRef.current) / 1000);
      }
    }

    frameCount.current++;
  }, [swarmMode, updateNeighbors, consensusAlgorithm, formationController, flockingBehavior]);

  // Render loop (runs at display refresh rate)
  const render = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Frame rate limiting
    if (timestamp - lastFrameTime.current < FRAME_TIME) {
      animationRef.current = requestAnimationFrame(render);
      return;
    }

    // Calculate FPS
    if (frameCount.current % 30 === 0) {
      const deltaTime = timestamp - lastFrameTime.current;
      setFps(Math.round(1000 / deltaTime));
    }
    lastFrameTime.current = timestamp;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const robots = robotsRef.current;

    // Batch similar drawing operations
    if (showMetrics) {
      // Draw all communication links in one batch
      ctx.strokeStyle = "rgba(100, 200, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      robots.forEach(robot => {
        robot.neighbors.forEach(neighborId => {
          if (robot.id < neighborId) {
            const neighbor = robots[neighborId];
            if (neighbor) {
              ctx.moveTo(robot.x, robot.y);
              ctx.lineTo(neighbor.x, neighbor.y);
            }
          }
        });
      });
      ctx.stroke();

      // Draw all trails in one batch
      robots.forEach(robot => {
        if (robot.trail.length > 1) {
          ctx.strokeStyle = robot.color + "20";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(robot.trail[0].x, robot.trail[0].y);
          for (let i = 1; i < robot.trail.length; i++) {
            ctx.lineTo(robot.trail[i].x, robot.trail[i].y);
          }
          ctx.stroke();
        }
      });
    }

    // Draw robots
    robots.forEach(robot => {
      // Robot body
      ctx.fillStyle = robot.reached ? "#16a34a" : robot.color;
      ctx.beginPath();
      ctx.arc(robot.x, robot.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Role indicator
      ctx.fillStyle = "#ffffff";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      const roleSymbol = robot.role === "leader" ? "L" : robot.role === "explorer" ? "E" : "F";
      ctx.fillText(roleSymbol, robot.x, robot.y + 3);

      // Energy bar (only if metrics shown)
      if (showMetrics && showAdvancedMetrics) {
        const energyWidth = 16;
        const energyHeight = 3;
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(robot.x - energyWidth/2, robot.y - 15, energyWidth, energyHeight);
        ctx.fillStyle = robot.state.energy > 30 ? "#4ade80" : "#ef4444";
        ctx.fillRect(robot.x - energyWidth/2, robot.y - 15, (robot.state.energy / 100) * energyWidth, energyHeight);
      }
    });

    // Draw target
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(targetRef.current.x, targetRef.current.y, TARGET_RADIUS, 0, Math.PI * 2);
    ctx.stroke();

    animationRef.current = requestAnimationFrame(render);
  }, [showMetrics, showAdvancedMetrics]);

  // Start physics and rendering loops
  useEffect(() => {
    // Physics update loop
    physicsIntervalRef.current = setInterval(updatePhysics, PHYSICS_INTERVAL);

    // Rendering loop
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (physicsIntervalRef.current) clearInterval(physicsIntervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [updatePhysics, render]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    robotsRef.current.forEach(r => (r.reached = false));
    runningRef.current = true;
    startRef.current = performance.now();
    setTime(0);
  }, []);

  const networkConnectivity = useMemo(() => {
    const robots = robotsRef.current;
    return robots.length > 0 ? 
      robots.reduce((sum, r) => sum + r.neighbors.size, 0) / robots.length : 0;
  }, [frameCount.current]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const avgConsensus = useMemo(() => {
    const robots = robotsRef.current;
    return robots.length > 0 ?
      robots.reduce((sum, r) => sum + r.state.consensusValue[0], 0) / robots.length : 0;
  }, [frameCount.current]); // eslint-disable-line react-hooks/exhaustive-deps

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
              max={50}
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
              onChange={(e) => setSwarmMode(e.target.value as "gather" | "formation" | "explore" | "consensus")}
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
                onChange={(e) => setCurrentFormation(e.target.value as "circle" | "line" | "grid" | "v")}
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
            {showMetrics && (
              <label className="text-sm font-medium">
                <input
                  type="checkbox"
                  checked={showAdvancedMetrics}
                  onChange={(e) => setShowAdvancedMetrics(e.target.checked)}
                  className="mr-2"
                />
                Advanced
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {showMetrics && (
        <div className="bg-gray-50 p-4 rounded-lg w-full max-w-2xl">
          <h3 className="text-sm font-bold mb-2">Swarm Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div>
              <div className="font-medium">FPS</div>
              <div className="text-red-600">{fps}</div>
            </div>
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
        <h3 className="text-sm font-semibold mb-2">Optimized Swarm Robotics Demo</h3>
        <p className="text-xs text-gray-600 mb-2">
          Click canvas to set target. Performance optimized with spatial indexing and fixed timestep physics.
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