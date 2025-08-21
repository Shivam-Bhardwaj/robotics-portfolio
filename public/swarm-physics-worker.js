// Web Worker for Ultra-Optimized Swarm Physics
// Uses Barnes-Hut algorithm and fixed-point arithmetic

const FIXED_POINT_SHIFT = 10; // 2^10 = 1024 units per pixel
const FIXED_ONE = 1 << FIXED_POINT_SHIFT;
const MAX_SPEED_FIXED = 5 * FIXED_ONE;
const ACCEL_FIXED = Math.floor(0.2 * FIXED_ONE);
const TARGET_RADIUS_FIXED = 12 * FIXED_ONE;
const COMMUNICATION_RADIUS_FIXED = 80 * FIXED_ONE;
const THETA = 0.5; // Barnes-Hut accuracy parameter

// Morton code (Z-order) for spatial indexing
function mortonEncode(x, y) {
  x = (x | (x << 16)) & 0x030000FF;
  x = (x | (x << 8)) & 0x0300F00F;
  x = (x | (x << 4)) & 0x030C30C3;
  x = (x | (x << 2)) & 0x09249249;
  
  y = (y | (y << 16)) & 0x030000FF;
  y = (y | (y << 8)) & 0x0300F00F;
  y = (y | (y << 4)) & 0x030C30C3;
  y = (y | (y << 2)) & 0x09249249;
  
  return x | (y << 1);
}

// Barnes-Hut Quadtree Node
class QuadNode {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.robots = [];
    this.children = null;
    this.centerX = 0;
    this.centerY = 0;
    this.totalMass = 0;
  }

  insert(robot) {
    if (this.children) {
      const idx = this.getChildIndex(robot.x, robot.y);
      this.children[idx].insert(robot);
      return;
    }

    this.robots.push(robot);
    
    if (this.robots.length > 4 && this.width > 1) {
      this.subdivide();
    }
  }

  subdivide() {
    const hw = this.width >> 1;
    const hh = this.height >> 1;
    
    this.children = [
      new QuadNode(this.x, this.y, hw, hh),
      new QuadNode(this.x + hw, this.y, hw, hh),
      new QuadNode(this.x, this.y + hh, hw, hh),
      new QuadNode(this.x + hw, this.y + hh, hw, hh)
    ];
    
    for (const robot of this.robots) {
      const idx = this.getChildIndex(robot.x, robot.y);
      this.children[idx].insert(robot);
    }
    
    this.robots = [];
  }

  getChildIndex(x, y) {
    const midX = this.x + (this.width >> 1);
    const midY = this.y + (this.height >> 1);
    return (x >= midX ? 1 : 0) + (y >= midY ? 2 : 0);
  }

  computeMassCenter() {
    if (this.children) {
      let totalX = 0, totalY = 0, totalMass = 0;
      for (const child of this.children) {
        child.computeMassCenter();
        totalX += child.centerX * child.totalMass;
        totalY += child.centerY * child.totalMass;
        totalMass += child.totalMass;
      }
      if (totalMass > 0) {
        this.centerX = totalX / totalMass;
        this.centerY = totalY / totalMass;
        this.totalMass = totalMass;
      }
    } else if (this.robots.length > 0) {
      let totalX = 0, totalY = 0;
      for (const robot of this.robots) {
        totalX += robot.x;
        totalY += robot.y;
      }
      this.centerX = totalX / this.robots.length;
      this.centerY = totalY / this.robots.length;
      this.totalMass = this.robots.length;
    }
  }

  getForce(robot, targetX, targetY) {
    let fx = 0, fy = 0;
    
    if (this.totalMass === 0) return { fx, fy };
    
    const dx = this.centerX - robot.x;
    const dy = this.centerY - robot.y;
    const distSq = dx * dx + dy * dy;
    
    if (distSq < 1) return { fx, fy };
    
    // Barnes-Hut criterion
    const s = this.width;
    const d = Math.sqrt(distSq);
    
    if (this.children === null || (s / d) < THETA) {
      // Treat as single mass
      if (this.totalMass > 0) {
        // Simplified force calculation
        const force = Math.min(100 / distSq, 1);
        fx = force * dx / d;
        fy = force * dy / d;
      }
    } else if (this.children) {
      // Recurse into children
      for (const child of this.children) {
        const childForce = child.getForce(robot, targetX, targetY);
        fx += childForce.fx;
        fy += childForce.fy;
      }
    }
    
    return { fx, fy };
  }
}

// Fixed-point physics state
let robots = [];
let quadtree = null;
let targetX = 300 * FIXED_ONE;
let targetY = 200 * FIXED_ONE;
let frameCache = new Map();

// Initialize robots
function initRobots(count, width, height) {
  robots = [];
  for (let i = 0; i < count; i++) {
    robots.push({
      id: i,
      x: Math.floor(Math.random() * width * FIXED_ONE),
      y: Math.floor(Math.random() * height * FIXED_ONE),
      vx: 0,
      vy: 0,
      reached: false,
      neighbors: [],
      morton: 0
    });
  }
}

// Fast integer square root approximation
function isqrt(n) {
  if (n < 2) return n;
  let x = n;
  let y = (x + 1) >> 1;
  while (y < x) {
    x = y;
    y = (x + Math.floor(n / x)) >> 1;
  }
  return x;
}

// Ultra-fast physics update
function updatePhysics() {
  // Build quadtree
  quadtree = new QuadNode(0, 0, 600 * FIXED_ONE, 400 * FIXED_ONE);
  
  // Update Morton codes and insert into quadtree
  for (const robot of robots) {
    robot.morton = mortonEncode(robot.x >> FIXED_POINT_SHIFT, robot.y >> FIXED_POINT_SHIFT);
    quadtree.insert(robot);
  }
  
  // Compute mass centers for Barnes-Hut
  quadtree.computeMassCenter();
  
  // Sort by Morton code for cache coherence
  robots.sort((a, b) => a.morton - b.morton);
  
  // Update each robot
  for (const robot of robots) {
    if (robot.reached) continue;
    
    // Calculate distance to target using integer math
    const dx = targetX - robot.x;
    const dy = targetY - robot.y;
    const distSq = (dx * dx + dy * dy) >> FIXED_POINT_SHIFT;
    
    if (distSq < TARGET_RADIUS_FIXED * TARGET_RADIUS_FIXED) {
      robot.reached = true;
      robot.vx = (robot.vx * 9) >> 4; // 0.9 damping
      robot.vy = (robot.vy * 9) >> 4;
      continue;
    }
    
    // Get forces from quadtree (Barnes-Hut)
    const force = quadtree.getForce(robot, targetX >> FIXED_POINT_SHIFT, targetY >> FIXED_POINT_SHIFT);
    
    // Fast approximation of normalized direction
    const dist = isqrt(distSq) << (FIXED_POINT_SHIFT >> 1);
    if (dist > 0) {
      // Apply acceleration toward target
      robot.vx += (dx * ACCEL_FIXED) / dist;
      robot.vy += (dy * ACCEL_FIXED) / dist;
      
      // Apply swarm forces
      robot.vx += Math.floor(force.fx * FIXED_ONE * 0.3);
      robot.vy += Math.floor(force.fy * FIXED_ONE * 0.3);
    }
    
    // Limit speed using integer math
    const speedSq = (robot.vx * robot.vx + robot.vy * robot.vy) >> FIXED_POINT_SHIFT;
    if (speedSq > MAX_SPEED_FIXED * MAX_SPEED_FIXED) {
      const speed = isqrt(speedSq) << (FIXED_POINT_SHIFT >> 1);
      robot.vx = (robot.vx * MAX_SPEED_FIXED) / speed;
      robot.vy = (robot.vy * MAX_SPEED_FIXED) / speed;
    }
    
    // Update position
    robot.x += robot.vx;
    robot.y += robot.vy;
    
    // Boundary check
    robot.x = Math.max(0, Math.min(600 * FIXED_ONE, robot.x));
    robot.y = Math.max(0, Math.min(400 * FIXED_ONE, robot.y));
  }
}

// Message handler
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'init':
      initRobots(data.count, data.width, data.height);
      break;
      
    case 'setTarget':
      targetX = Math.floor(data.x * FIXED_ONE);
      targetY = Math.floor(data.y * FIXED_ONE);
      for (const robot of robots) {
        robot.reached = false;
      }
      break;
      
    case 'update':
      updatePhysics();
      
      // Convert back to floating point for rendering
      const positions = new Float32Array(robots.length * 3);
      for (let i = 0; i < robots.length; i++) {
        positions[i * 3] = robots[i].x / FIXED_ONE;
        positions[i * 3 + 1] = robots[i].y / FIXED_ONE;
        positions[i * 3 + 2] = robots[i].reached ? 1 : 0;
      }
      
      // Transfer as ArrayBuffer for zero-copy performance
      self.postMessage({ 
        type: 'positions', 
        positions: positions.buffer,
        allReached: robots.every(r => r.reached)
      }, [positions.buffer]);
      break;
  }
};