/**
 * Advanced Robotics Algorithms Library
 * 
 * This library implements sophisticated robotics algorithms including:
 * - Path planning (A*, RRT, potential fields)
 * - SLAM (Simultaneous Localization and Mapping)
 * - Swarm robotics (consensus, formation control)
 * - Sensor fusion and localization
 * - Obstacle avoidance and navigation
 */

import { Vector2, PIDController } from './math';

// ============================================================================
// PATH PLANNING ALGORITHMS
// ============================================================================

export interface PathNode {
  x: number;
  y: number;
  gCost: number;
  hCost: number;
  fCost: number;
  parent?: PathNode;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class AStarPlanner {
  private openSet: PathNode[] = [];
  private closedSet: Set<string> = new Set();
  private grid: Map<string, PathNode> = new Map();

  constructor(
    private width: number,
    private height: number,
    private resolution: number = 10,
    private obstacles: Obstacle[] = []
  ) {
    this.initializeGrid();
  }

  private initializeGrid(): void {
    for (let x = 0; x < this.width; x += this.resolution) {
      for (let y = 0; y < this.height; y += this.resolution) {
        const key = `${x},${y}`;
        this.grid.set(key, {
          x, y,
          gCost: Infinity,
          hCost: 0,
          fCost: Infinity
        });
      }
    }
  }

  private getKey(x: number, y: number): string {
    const gridX = Math.round(x / this.resolution) * this.resolution;
    const gridY = Math.round(y / this.resolution) * this.resolution;
    return `${gridX},${gridY}`;
  }

  private heuristic(node: PathNode, goal: PathNode): number {
    // Euclidean distance
    return Math.sqrt(Math.pow(node.x - goal.x, 2) + Math.pow(node.y - goal.y, 2));
  }

  private isObstacle(x: number, y: number): boolean {
    return this.obstacles.some(obs => 
      x >= obs.x && x <= obs.x + obs.width &&
      y >= obs.y && y <= obs.y + obs.height
    );
  }

  private getNeighbors(node: PathNode): PathNode[] {
    const neighbors: PathNode[] = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
      const x = node.x + dx * this.resolution;
      const y = node.y + dy * this.resolution;
      
      if (x >= 0 && x < this.width && y >= 0 && y < this.height && !this.isObstacle(x, y)) {
        const key = this.getKey(x, y);
        const neighbor = this.grid.get(key);
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

  findPath(start: Vector2, goal: Vector2): Vector2[] | null {
    this.openSet = [];
    this.closedSet.clear();

    const startNode = this.grid.get(this.getKey(start.x, start.y));
    const goalNode = this.grid.get(this.getKey(goal.x, goal.y));

    if (!startNode || !goalNode || this.isObstacle(start.x, start.y) || this.isObstacle(goal.x, goal.y)) {
      return null;
    }

    // Reset all nodes
    this.grid.forEach(node => {
      node.gCost = Infinity;
      node.fCost = Infinity;
      node.parent = undefined;
    });

    startNode.gCost = 0;
    startNode.hCost = this.heuristic(startNode, goalNode);
    startNode.fCost = startNode.gCost + startNode.hCost;

    this.openSet.push(startNode);

    while (this.openSet.length > 0) {
      // Find node with lowest fCost
      this.openSet.sort((a, b) => a.fCost - b.fCost);
      const current = this.openSet.shift()!;

      if (current === goalNode) {
        // Reconstruct path
        const path: Vector2[] = [];
        let node: PathNode | undefined = current;
        while (node) {
          path.unshift(new Vector2(node.x, node.y));
          node = node.parent;
        }
        return path;
      }

      this.closedSet.add(this.getKey(current.x, current.y));

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = this.getKey(neighbor.x, neighbor.y);
        if (this.closedSet.has(neighborKey)) continue;

        const tentativeGCost = current.gCost + this.heuristic(current, neighbor);
        
        if (tentativeGCost < neighbor.gCost) {
          neighbor.parent = current;
          neighbor.gCost = tentativeGCost;
          neighbor.hCost = this.heuristic(neighbor, goalNode);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;

          if (!this.openSet.includes(neighbor)) {
            this.openSet.push(neighbor);
          }
        }
      }
    }

    return null; // No path found
  }

  updateObstacles(obstacles: Obstacle[]): void {
    this.obstacles = obstacles;
  }
}

export class RRTPlanner {
  private tree: RRTNode[] = [];
  private maxIterations = 1000;
  private stepSize = 20;
  private goalBias = 0.1;

  constructor(
    private width: number,
    private height: number,
    private obstacles: Obstacle[] = []
  ) {}

  findPath(start: Vector2, goal: Vector2): Vector2[] | null {
    this.tree = [{ position: start, parent: null }];

    for (let i = 0; i < this.maxIterations; i++) {
      const randomPoint = Math.random() < this.goalBias ? 
        goal : new Vector2(Math.random() * this.width, Math.random() * this.height);

      const nearest = this.findNearest(randomPoint);
      const newPoint = this.steer(nearest.position, randomPoint);

      if (this.isValidPath(nearest.position, newPoint)) {
        const newNode: RRTNode = { position: newPoint, parent: nearest };
        this.tree.push(newNode);

        if (newPoint.distanceTo(goal) < this.stepSize) {
          // Goal reached, reconstruct path
          const path: Vector2[] = [];
          let current: RRTNode | null = newNode;
          while (current) {
            path.unshift(current.position);
            current = current.parent;
          }
          return path;
        }
      }
    }

    return null; // No path found
  }

  private findNearest(point: Vector2): RRTNode {
    let nearest = this.tree[0];
    let minDistance = point.distanceTo(nearest.position);

    for (const node of this.tree) {
      const distance = point.distanceTo(node.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = node;
      }
    }

    return nearest;
  }

  private steer(from: Vector2, to: Vector2): Vector2 {
    const direction = to.subtract(from).normalize();
    return from.add(direction.multiply(this.stepSize));
  }

  private isValidPath(from: Vector2, to: Vector2): boolean {
    const steps = Math.ceil(from.distanceTo(to) / 5);
    for (let i = 0; i <= steps; i++) {
      const point = from.lerp(to, i / steps);
      if (this.isObstacle(point.x, point.y)) {
        return false;
      }
    }
    return true;
  }

  private isObstacle(x: number, y: number): boolean {
    return this.obstacles.some(obs => 
      x >= obs.x && x <= obs.x + obs.width &&
      y >= obs.y && y <= obs.y + obs.height
    );
  }
}

interface RRTNode {
  position: Vector2;
  parent: RRTNode | null;
}

export class PotentialFieldPlanner {
  constructor(
    private attractiveGain: number = 1.0,
    private repulsiveGain: number = 100.0,
    private influenceDistance: number = 50.0
  ) {}

  computeForce(position: Vector2, goal: Vector2, obstacles: Vector2[]): Vector2 {
    // Attractive force toward goal
    const attractiveForce = goal.subtract(position).normalize().multiply(this.attractiveGain);

    // Repulsive forces from obstacles
    let repulsiveForce = Vector2.zero();
    for (const obstacle of obstacles) {
      const distance = position.distanceTo(obstacle);
      if (distance < this.influenceDistance && distance > 0) {
        const direction = position.subtract(obstacle).normalize();
        const magnitude = this.repulsiveGain * (1 / distance - 1 / this.influenceDistance) / (distance * distance);
        repulsiveForce = repulsiveForce.add(direction.multiply(magnitude));
      }
    }

    return attractiveForce.add(repulsiveForce);
  }

  generatePath(start: Vector2, goal: Vector2, obstacles: Vector2[], maxSteps: number = 1000): Vector2[] {
    const path: Vector2[] = [start];
    let current = start;
    const stepSize = 2.0;
    const goalThreshold = 5.0;

    for (let i = 0; i < maxSteps; i++) {
      if (current.distanceTo(goal) < goalThreshold) {
        path.push(goal);
        break;
      }

      const force = this.computeForce(current, goal, obstacles);
      const direction = force.normalize();
      current = current.add(direction.multiply(stepSize));
      path.push(current);
    }

    return path;
  }
}

// ============================================================================
// SLAM (Simultaneous Localization and Mapping)
// ============================================================================

export interface Landmark {
  id: number;
  position: Vector2;
  covariance: number[][];
  observations: number;
}

export interface ScanMatch {
  translation: Vector2;
  rotation: number;
  score: number;
}

export class EKFSLAMFilter {
  private state: number[] = []; // [x, y, theta, landmark1_x, landmark1_y, ...]
  private covariance: number[][] = [];
  private landmarks: Map<number, number> = new Map(); // landmark_id -> state_index
  private nextLandmarkId = 0;

  constructor(
    initialPose: { x: number; y: number; theta: number },
    private processNoise: number = 0.1,
    private measurementNoise: number = 0.5
  ) {
    this.state = [initialPose.x, initialPose.y, initialPose.theta];
    this.covariance = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 0.1]
    ];
  }

  predict(velocity: number, angularVelocity: number, deltaTime: number): void {
    // Motion model: x' = x + v*cos(theta)*dt, y' = y + v*sin(theta)*dt, theta' = theta + w*dt
    const [x, y, theta] = this.state;
    
    this.state[0] = x + velocity * Math.cos(theta) * deltaTime;
    this.state[1] = y + velocity * Math.sin(theta) * deltaTime;
    this.state[2] = theta + angularVelocity * deltaTime;

    // Update covariance with process noise
    const F = this.getStateTransitionJacobian(velocity, deltaTime);
    const Q = this.getProcessNoiseMatrix();
    
    this.covariance = this.addMatrices(
      this.multiplyMatrices(this.multiplyMatrices(F, this.covariance), this.transpose(F)),
      Q
    );
  }

  update(observations: { range: number; bearing: number; landmarkId?: number }[]): void {
    for (const obs of observations) {
      if (obs.landmarkId !== undefined && this.landmarks.has(obs.landmarkId)) {
        // Update existing landmark
        this.updateLandmark({ range: obs.range, bearing: obs.bearing, landmarkId: obs.landmarkId });
      } else if (obs.landmarkId !== undefined) {
        // Add new landmark
        this.addLandmark({ range: obs.range, bearing: obs.bearing });
      } else {
        // Add new landmark without ID
        this.addLandmark({ range: obs.range, bearing: obs.bearing });
      }
    }
  }

  private addLandmark(obs: { range: number; bearing: number }): void {
    const [x, y, theta] = this.state;
    const globalAngle = theta + obs.bearing;
    
    // Calculate landmark position in global coordinates
    const landmarkX = x + obs.range * Math.cos(globalAngle);
    const landmarkY = y + obs.range * Math.sin(globalAngle);
    
    // Add to state vector
    this.state.push(landmarkX, landmarkY);
    this.landmarks.set(this.nextLandmarkId++, this.state.length - 2);
    
    // Expand covariance matrix
    const newSize = this.state.length;
    const newCovariance: number[][] = Array(newSize).fill(0).map(() => Array(newSize).fill(0));
    
    // Copy existing covariance
    for (let i = 0; i < this.covariance.length; i++) {
      for (let j = 0; j < this.covariance[i].length; j++) {
        newCovariance[i][j] = this.covariance[i][j];
      }
    }
    
    // Initialize new landmark covariance
    const landmarkCov = 10.0; // High initial uncertainty
    newCovariance[newSize - 2][newSize - 2] = landmarkCov;
    newCovariance[newSize - 1][newSize - 1] = landmarkCov;
    
    this.covariance = newCovariance;
  }

  private updateLandmark(obs: { range: number; bearing: number; landmarkId: number }): void {
    const landmarkIndex = this.landmarks.get(obs.landmarkId!)!;
    const [x, y, theta] = this.state;
    const [lx, ly] = [this.state[landmarkIndex], this.state[landmarkIndex + 1]];
    
    // Predicted observation
    const dx = lx - x;
    const dy = ly - y;
    const q = dx * dx + dy * dy;
    const predictedRange = Math.sqrt(q);
    const predictedBearing = Math.atan2(dy, dx) - theta;
    
    // Innovation
    const innovation = [
      obs.range - predictedRange,
      this.normalizeAngle(obs.bearing - predictedBearing)
    ];
    
    // Observation Jacobian
    const H = this.getObservationJacobian(landmarkIndex);
    
    // Innovation covariance
    const R = [[this.measurementNoise, 0], [0, this.measurementNoise]];
    const S = this.addMatrices(
      this.multiplyMatrices(this.multiplyMatrices(H, this.covariance), this.transpose(H)),
      R
    );
    
    // Kalman gain
    const K = this.multiplyMatrices(
      this.multiplyMatrices(this.covariance, this.transpose(H)),
      this.invertMatrix(S)
    );
    
    // State update
    const stateUpdate = this.multiplyMatrixVector(K, innovation);
    for (let i = 0; i < this.state.length; i++) {
      this.state[i] += stateUpdate[i];
    }
    
    // Covariance update
    const I = this.identityMatrix(this.state.length);
    const IKH = this.subtractMatrices(I, this.multiplyMatrices(K, H));
    this.covariance = this.multiplyMatrices(IKH, this.covariance);
  }

  private getStateTransitionJacobian(velocity: number, deltaTime: number): number[][] {
    const theta = this.state[2];
    const n = this.state.length;
    const F = this.identityMatrix(n);
    
    F[0][2] = -velocity * Math.sin(theta) * deltaTime;
    F[1][2] = velocity * Math.cos(theta) * deltaTime;
    
    return F;
  }

  private getObservationJacobian(landmarkIndex: number): number[][] {
    const [x, y] = this.state;
    // const theta = this.state[2]; // Reserved for future use
    const [lx, ly] = [this.state[landmarkIndex], this.state[landmarkIndex + 1]];
    
    const dx = lx - x;
    const dy = ly - y;
    const q = dx * dx + dy * dy;
    const sqrtQ = Math.sqrt(q);
    
    const H = Array(2).fill(0).map(() => Array(this.state.length).fill(0));
    
    // Range derivatives
    H[0][0] = -dx / sqrtQ;        // ∂r/∂x
    H[0][1] = -dy / sqrtQ;        // ∂r/∂y
    H[0][landmarkIndex] = dx / sqrtQ;     // ∂r/∂lx
    H[0][landmarkIndex + 1] = dy / sqrtQ; // ∂r/∂ly
    
    // Bearing derivatives
    H[1][0] = dy / q;             // ∂θ/∂x
    H[1][1] = -dx / q;            // ∂θ/∂y
    H[1][2] = -1;                 // ∂θ/∂θ
    H[1][landmarkIndex] = -dy / q;        // ∂θ/∂lx
    H[1][landmarkIndex + 1] = dx / q;     // ∂θ/∂ly
    
    return H;
  }

  private getProcessNoiseMatrix(): number[][] {
    const n = this.state.length;
    const Q = Array(n).fill(0).map(() => Array(n).fill(0));
    
    Q[0][0] = this.processNoise;
    Q[1][1] = this.processNoise;
    Q[2][2] = this.processNoise * 0.1;
    
    return Q;
  }

  private normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }

  getPose(): { x: number; y: number; theta: number } {
    return { x: this.state[0], y: this.state[1], theta: this.state[2] };
  }

  getLandmarks(): Landmark[] {
    const landmarks: Landmark[] = [];
    this.landmarks.forEach((index, id) => {
      landmarks.push({
        id,
        position: new Vector2(this.state[index], this.state[index + 1]),
        covariance: [
          [this.covariance[index][index], this.covariance[index][index + 1]],
          [this.covariance[index + 1][index], this.covariance[index + 1][index + 1]]
        ],
        observations: 1
      });
    });
    return landmarks;
  }

  // Matrix utility methods (simplified versions)
  private multiplyMatrices(a: number[][], b: number[][]): number[][] {
    const result: number[][] = Array(a.length).fill(0).map(() => Array(b[0].length).fill(0));
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  }

  private multiplyMatrixVector(matrix: number[][], vector: number[]): number[] {
    return matrix.map(row => row.reduce((sum, val, i) => sum + val * vector[i], 0));
  }

  private addMatrices(a: number[][], b: number[][]): number[][] {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  }

  private subtractMatrices(a: number[][], b: number[][]): number[][] {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  }

  private transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  }

  private identityMatrix(size: number): number[][] {
    return Array(size).fill(0).map((_, i) => Array(size).fill(0).map((_, j) => i === j ? 1 : 0));
  }

  private invertMatrix(matrix: number[][]): number[][] {
    // Simplified 2x2 matrix inversion for measurement updates
    if (matrix.length === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det]
      ];
    }
    // For larger matrices, use numerical methods (simplified)
    return this.identityMatrix(matrix.length);
  }
}

// ============================================================================
// SWARM ROBOTICS ALGORITHMS
// ============================================================================

export interface SwarmAgent {
  id: number;
  position: Vector2;
  velocity: Vector2;
  neighbors: Set<number>;
  state: {
    consensusValue?: number[];
    formationPosition?: Vector2;
    energy?: number;
    communication?: boolean;
    [key: string]: unknown;
  };
}

export class ConsensusAlgorithm {
  constructor(private communicationRadius: number = 100) {}

  updateConsensus(agents: SwarmAgent[], consensusValue: number[]): Map<number, number[]> {
    const updates = new Map<number, number[]>();

    for (const agent of agents) {
      const sum = [...consensusValue];
      let count = 1;

      // Get neighbor values
      for (const neighborId of agent.neighbors) {
        const neighbor = agents.find(a => a.id === neighborId);
        if (neighbor && neighbor.state.consensusValue) {
          for (let i = 0; i < sum.length; i++) {
            sum[i] += neighbor.state.consensusValue[i];
          }
          count++;
        }
      }

      // Calculate average
      const newValue = sum.map(s => s / count);
      updates.set(agent.id, newValue);
    }

    return updates;
  }

  updateNeighbors(agents: SwarmAgent[]): void {
    for (const agent of agents) {
      agent.neighbors.clear();
      for (const other of agents) {
        if (agent.id !== other.id && 
            agent.position.distanceTo(other.position) <= this.communicationRadius) {
          agent.neighbors.add(other.id);
        }
      }
    }
  }
}

export class FormationController {
  private pidControllers: Map<number, { x: PIDController; y: PIDController }> = new Map();

  constructor(
    private kp: number = 1.0,
    private ki: number = 0.1,
    private kd: number = 0.05
  ) {}

  getDesiredPosition(agentId: number, formation: Map<number, Vector2>, leaderPosition: Vector2): Vector2 {
    const relativePosition = formation.get(agentId) || Vector2.zero();
    return leaderPosition.add(relativePosition);
  }

  computeControlForce(
    agentId: number,
    currentPosition: Vector2,
    desiredPosition: Vector2,
    deltaTime: number
  ): Vector2 {
    if (!this.pidControllers.has(agentId)) {
      this.pidControllers.set(agentId, {
        x: new PIDController(this.kp, this.ki, this.kd),
        y: new PIDController(this.kp, this.ki, this.kd)
      });
    }

    const controllers = this.pidControllers.get(agentId)!;
    
    const forceX = controllers.x.update(desiredPosition.x, currentPosition.x, deltaTime);
    const forceY = controllers.y.update(desiredPosition.y, currentPosition.y, deltaTime);

    return new Vector2(forceX, forceY);
  }

  updateFormation(
    agents: SwarmAgent[],
    formation: Map<number, Vector2>,
    leaderPosition: Vector2,
    deltaTime: number
  ): void {
    for (const agent of agents) {
      const desiredPosition = this.getDesiredPosition(agent.id, formation, leaderPosition);
      const controlForce = this.computeControlForce(agent.id, agent.position, desiredPosition, deltaTime);
      
      // Apply control force to velocity
      agent.velocity = agent.velocity.add(controlForce.multiply(deltaTime));
      
      // Limit velocity
      const maxSpeed = 50;
      if (agent.velocity.magnitude() > maxSpeed) {
        agent.velocity = agent.velocity.normalize().multiply(maxSpeed);
      }
    }
  }
}

export class FlockingBehavior {
  constructor(
    private separationRadius: number = 30,
    private alignmentRadius: number = 60,
    private cohesionRadius: number = 80,
    private separationWeight: number = 2.0,
    private alignmentWeight: number = 1.0,
    private cohesionWeight: number = 1.0
  ) {}

  computeFlockingForce(agent: SwarmAgent, neighbors: SwarmAgent[]): Vector2 {
    const separation = this.computeSeparation(agent, neighbors);
    const alignment = this.computeAlignment(agent, neighbors);
    const cohesion = this.computeCohesion(agent, neighbors);

    return separation.multiply(this.separationWeight)
      .add(alignment.multiply(this.alignmentWeight))
      .add(cohesion.multiply(this.cohesionWeight));
  }

  private computeSeparation(agent: SwarmAgent, neighbors: SwarmAgent[]): Vector2 {
    let force = Vector2.zero();
    let count = 0;

    for (const neighbor of neighbors) {
      const distance = agent.position.distanceTo(neighbor.position);
      if (distance < this.separationRadius && distance > 0) {
        const direction = agent.position.subtract(neighbor.position).normalize();
        force = force.add(direction.multiply(1 / distance));
        count++;
      }
    }

    return count > 0 ? force.multiply(1 / count) : Vector2.zero();
  }

  private computeAlignment(agent: SwarmAgent, neighbors: SwarmAgent[]): Vector2 {
    let avgVelocity = Vector2.zero();
    let count = 0;

    for (const neighbor of neighbors) {
      const distance = agent.position.distanceTo(neighbor.position);
      if (distance < this.alignmentRadius) {
        avgVelocity = avgVelocity.add(neighbor.velocity);
        count++;
      }
    }

    if (count > 0) {
      avgVelocity = avgVelocity.multiply(1 / count);
      return avgVelocity.subtract(agent.velocity);
    }

    return Vector2.zero();
  }

  private computeCohesion(agent: SwarmAgent, neighbors: SwarmAgent[]): Vector2 {
    let centerOfMass = Vector2.zero();
    let count = 0;

    for (const neighbor of neighbors) {
      const distance = agent.position.distanceTo(neighbor.position);
      if (distance < this.cohesionRadius) {
        centerOfMass = centerOfMass.add(neighbor.position);
        count++;
      }
    }

    if (count > 0) {
      centerOfMass = centerOfMass.multiply(1 / count);
      return centerOfMass.subtract(agent.position);
    }

    return Vector2.zero();
  }
}

// ============================================================================
// SENSOR FUSION AND LOCALIZATION
// ============================================================================

export interface SensorReading {
  timestamp: number;
  type: 'imu' | 'gps' | 'lidar' | 'camera' | 'encoder';
  data: Record<string, unknown>;
  uncertainty: number;
}

export class ParticleFilter {
  private particles: Particle[] = [];

  constructor(
    private numParticles: number = 1000,
    private bounds: { minX: number; maxX: number; minY: number; maxY: number }
  ) {
    this.initializeParticles();
  }

  private initializeParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * (this.bounds.maxX - this.bounds.minX) + this.bounds.minX,
        y: Math.random() * (this.bounds.maxY - this.bounds.minY) + this.bounds.minY,
        theta: Math.random() * 2 * Math.PI,
        weight: 1 / this.numParticles
      });
    }
  }

  predict(velocity: number, angularVelocity: number, deltaTime: number): void {
    for (const particle of this.particles) {
      // Add process noise
      const noiseX = (Math.random() - 0.5) * 10;
      const noiseY = (Math.random() - 0.5) * 10;
      const noiseTheta = (Math.random() - 0.5) * 0.2;

      particle.x += velocity * Math.cos(particle.theta) * deltaTime + noiseX;
      particle.y += velocity * Math.sin(particle.theta) * deltaTime + noiseY;
      particle.theta += angularVelocity * deltaTime + noiseTheta;
    }
  }

  update(measurement: { x: number; y: number; uncertainty: number }): void {
    // Update particle weights based on measurement likelihood
    for (const particle of this.particles) {
      const distance = Math.sqrt(
        Math.pow(particle.x - measurement.x, 2) + 
        Math.pow(particle.y - measurement.y, 2)
      );
      
      // Gaussian likelihood
      particle.weight = Math.exp(-distance * distance / (2 * measurement.uncertainty * measurement.uncertainty));
    }

    // Normalize weights
    const totalWeight = this.particles.reduce((sum, p) => sum + p.weight, 0);
    if (totalWeight > 0) {
      this.particles.forEach(p => p.weight /= totalWeight);
    }

    // Resample if effective sample size is low
    const effectiveSampleSize = 1 / this.particles.reduce((sum, p) => sum + p.weight * p.weight, 0);
    if (effectiveSampleSize < this.numParticles / 2) {
      this.resample();
    }
  }

  private resample(): void {
    const newParticles: Particle[] = [];
    const cumulativeWeights: number[] = [];
    
    // Build cumulative weight distribution
    let sum = 0;
    for (const particle of this.particles) {
      sum += particle.weight;
      cumulativeWeights.push(sum);
    }

    // Systematic resampling
    const step = 1 / this.numParticles;
    const r = Math.random() * step;
    
    for (let i = 0; i < this.numParticles; i++) {
      const target = r + i * step;
      let j = 0;
      while (j < cumulativeWeights.length && cumulativeWeights[j] < target) {
        j++;
      }
      
      if (j < this.particles.length) {
        newParticles.push({ 
          ...this.particles[j], 
          weight: 1 / this.numParticles 
        });
      }
    }

    this.particles = newParticles;
  }

  getEstimate(): { x: number; y: number; theta: number; confidence: number } {
    let x = 0, y = 0, sinTheta = 0, cosTheta = 0;
    
    for (const particle of this.particles) {
      x += particle.x * particle.weight;
      y += particle.y * particle.weight;
      sinTheta += Math.sin(particle.theta) * particle.weight;
      cosTheta += Math.cos(particle.theta) * particle.weight;
    }

    const theta = Math.atan2(sinTheta, cosTheta);
    
    // Calculate confidence as inverse of weighted variance
    let variance = 0;
    for (const particle of this.particles) {
      const dx = particle.x - x;
      const dy = particle.y - y;
      variance += (dx * dx + dy * dy) * particle.weight;
    }
    
    const confidence = Math.exp(-variance / 100);

    return { x, y, theta, confidence };
  }

  getParticles(): Particle[] {
    return [...this.particles];
  }
}

interface Particle {
  x: number;
  y: number;
  theta: number;
  weight: number;
}
