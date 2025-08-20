"use client";
import { useEffect, useRef, useState } from "react";
import { Vector2, PIDController, KalmanFilter } from "@/lib/robotics/math";
import { AStarPlanner, EKFSLAMFilter, ParticleFilter, FlockingBehavior } from "@/lib/robotics/algorithms";
import { LidarSensor, IMUSensor, GPSSensor, SensorFusion } from "@/lib/robotics/sensors";

const NUM_ROBOTS = 12;
const ROBOT_SPEED = 1.8;
const GRID_SIZE = 50;
const SCAN_RADIUS = 120;
const PATH_HISTORY_LENGTH = 30;
const COMMUNICATION_RADIUS = 150;
const FORMATION_RADIUS = 80;
const PARTICLE_COUNT = 50;
const LIDAR_RAYS = 16;

// Advanced robotics parameters
const SLAM_UPDATE_RATE = 5; // Hz
const PATHPLAN_UPDATE_RATE = 2; // Hz
const SENSOR_FUSION_RATE = 20; // Hz

// Major cities for initial robot distribution
const MAJOR_CITIES = [
  { x: 0.28, y: 0.32, name: "New York" },
  { x: 0.18, y: 0.38, name: "Los Angeles" },
  { x: 0.51, y: 0.28, name: "London" },
  { x: 0.53, y: 0.31, name: "Paris" },
  { x: 0.78, y: 0.35, name: "Tokyo" },
  { x: 0.73, y: 0.42, name: "Beijing" },
  { x: 0.26, y: 0.68, name: "São Paulo" },
  { x: 0.78, y: 0.68, name: "Sydney" },
  { x: 0.47, y: 0.58, name: "Cape Town" },
  { x: 0.65, y: 0.45, name: "Mumbai" },
];

interface Particle {
  x: number;
  y: number;
  angle: number;
  weight: number;
}

interface SensorData {
  lidar: number[];
  imu: { ax: number; ay: number; gz: number };
  odometry: { dx: number; dy: number; dtheta: number };
  gps: { x: number; y: number; accuracy: number };
}

interface Waypoint {
  x: number;
  y: number;
  type: "target" | "checkpoint" | "obstacle_avoidance";
  timestamp: number;
}

interface AdvancedRobot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  targetAngle: number;
  path: { x: number; y: number }[];
  scanAngle: number;
  lastScanTime: number;
  color: string;
  id: number;
  role: "leader" | "follower" | "scout";
  targetX: number;
  targetY: number;
  communicating: Set<number>;
  particles: Particle[];
  sensors: SensorData;
  waypoints: Waypoint[];
  batteryLevel: number;
  temperature: number;
  processingLoad: number;
  networkLatency: number;
  lastUpdate: number;
  confidence: number;
  
  // Advanced robotics components
  lidarSensor: LidarSensor;
  imuSensor: IMUSensor;
  gpsSensor: GPSSensor;
  sensorFusion: SensorFusion;
  slamFilter: EKFSLAMFilter;
  particleFilter: ParticleFilter;
  pathPlanner: AStarPlanner;
  pidController: {
    x: PIDController;
    y: PIDController;
    heading: PIDController;
  };
  flockingBehavior: FlockingBehavior;
  
  // SLAM and localization
  mapData: Map<string, { explored: boolean; obstacle: boolean; probability: number }>;
  landmarks: Array<{ id: number; position: Vector2; confidence: number }>;
  pose: { x: number; y: number; theta: number; covariance: number[][] };
  
  // Path planning
  plannedPath: Vector2[];
  currentWaypoint: number;
  pathPlanningMode: "astar" | "rrt" | "potential_field";
  
  // Control system
  controlMode: "manual" | "autonomous" | "formation";
  targetPose: { x: number; y: number; theta: number };
  
  // Performance metrics
  distanceTraveled: number;
  explorationEfficiency: number;
  energyConsumption: number;
  missionTime: number;
  collisionCount: number;
}

interface GridCell {
  explored: number;
  obstacle: boolean;
  heat: number;
}

export default function RoombaSimulation() {
  const [isClient, setIsClient] = useState(false);
  const [robotsInitialized, setRobotsInitialized] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const robotsRef = useRef<AdvancedRobot[]>([]);
  const gridRef = useRef<Map<string, GridCell>>(new Map());
  const worldDataRef = useRef<[number, number][][]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const obstaclesRef = useRef<DOMRect[]>([]);
  const initializedRef = useRef(false);
  const selectedRobotRef = useRef<number>(0);
  const telemetryRef = useRef<HTMLDivElement>(null);

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [highScore, setHighScore] = useState(0);
  const highScoreRef = useRef(0);
  const [gameStats, setGameStats] = useState({
    coverage: 0,
    time: 0,
    best: null as number | null
  });
  const totalCellsRef = useRef(0);

  // Set client flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = Number(localStorage.getItem("roombaHighScore") || 0);
    highScoreRef.current = stored;
    setHighScore(stored);
  }, []);


  // Initialize robots only once
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    if (initializedRef.current) return;
    
    try {
      initializedRef.current = true;

    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
    totalCellsRef.current =
      Math.ceil(width / GRID_SIZE) * Math.ceil(height / GRID_SIZE);

    const colors = [
      "#00ffff", "#ff00ff", "#ffff00", "#00ff00",
      "#ff6600", "#6600ff", "#ff0066", "#66ff00",
      "#00ffaa", "#ffaa00", "#aa00ff", "#aaff00"
    ];

    // Load world map data
    type GeoFeature = {
      geometry: {
        type: string;
        coordinates: number[][] | number[][][] | number[][][][];
      };
    };
    fetch("/countries.geo.json")
      .then((res) => res.json())
      .then((data: { features: GeoFeature[] }) => {
        const polygons: [number, number][][] = [];
        data.features.forEach((feature) => {
          const { type, coordinates } = feature.geometry;
          if (type === "Polygon") {
            (coordinates as [number, number][][]).forEach((ring) => polygons.push(ring));
          } else if (type === "MultiPolygon") {
            (coordinates as [number, number][][][]).forEach((poly) => {
              poly.forEach((ring) => polygons.push(ring));
            });
          }
        });
        worldDataRef.current = polygons;
      });
    
    const initializeParticles = (): Particle[] => {
      return Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        angle: Math.random() * Math.PI * 2,
        weight: 1 / PARTICLE_COUNT,
      }));
    };

    const initializeSensors = (): SensorData => ({
      lidar: new Array(LIDAR_RAYS).fill(0),
      imu: { ax: 0, ay: 0, gz: 0 },
      odometry: { dx: 0, dy: 0, dtheta: 0 },
      gps: { x: 0, y: 0, accuracy: Math.random() * 10 + 2 },
    });

    robotsRef.current = Array.from({ length: NUM_ROBOTS }, (_, i) => {
      // Distribute robots across major cities
      const cityIndex = i % MAJOR_CITIES.length;
      const city = MAJOR_CITIES[cityIndex];
      const x = city.x * width + (Math.random() - 0.5) * 50;
      const y = city.y * height + (Math.random() - 0.5) * 50;
      
      // Initialize advanced robotics components
      const lidarSensor = new LidarSensor(SCAN_RADIUS, 1.0, 10, 0.05);
      const imuSensor = new IMUSensor(0.1, 0.01, 0.5, 100);
      const gpsSensor = new GPSSensor(3.0, 1.0, 1);
      const sensorFusion = new SensorFusion();
      const slamFilter = new EKFSLAMFilter({ x, y, theta: 0 });
      const particleFilter = new ParticleFilter(PARTICLE_COUNT, { 
        minX: 0, maxX: width, minY: 0, maxY: height 
      });
      const pathPlanner = new AStarPlanner(width, height, 20);
      const flockingBehavior = new FlockingBehavior(30, 60, 80, 2.0, 1.0, 1.0);
      
      // Initialize PID controllers
      const pidController = {
        x: new PIDController(2.0, 0.1, 0.5),
        y: new PIDController(2.0, 0.1, 0.5),
        heading: new PIDController(3.0, 0.2, 0.8)
      };
      
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        angle: Math.random() * Math.PI * 2,
        targetAngle: 0,
        path: [],
        scanAngle: 0,
        lastScanTime: Date.now(),
        color: colors[i % colors.length],
        id: i,
        role: i === 0 ? "leader" : (i < 4 ? "scout" : "follower"),
        targetX: width / 2,
        targetY: height / 2,
        communicating: new Set(),
        particles: initializeParticles(),
        sensors: initializeSensors(),
        waypoints: [],
        batteryLevel: Math.random() * 20 + 80, // 80-100%
        temperature: Math.random() * 15 + 35, // 35-50°C
        processingLoad: Math.random() * 30 + 20, // 20-50%
        networkLatency: Math.random() * 50 + 10, // 10-60ms
        lastUpdate: Date.now(),
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        
        // Advanced robotics components
        lidarSensor,
        imuSensor,
        gpsSensor,
        sensorFusion,
        slamFilter,
        particleFilter,
        pathPlanner,
        pidController,
        flockingBehavior,
        
        // SLAM and localization
        mapData: new Map(),
        landmarks: [],
        pose: { 
          x, y, theta: 0, 
          covariance: [[1, 0, 0], [0, 1, 0], [0, 0, 0.1]] 
        },
        
        // Path planning
        plannedPath: [],
        currentWaypoint: 0,
        pathPlanningMode: "astar" as const,
        
        // Control system
        controlMode: "autonomous" as const,
        targetPose: { x: width / 2, y: height / 2, theta: 0 },
        
        // Performance metrics
        distanceTraveled: 0,
        explorationEfficiency: 0,
        energyConsumption: 0,
        missionTime: 0,
        collisionCount: 0
      };
    });

    // Set initial mouse position
    mouseRef.current = { x: width / 2, y: height / 2 };
    prevMouseRef.current = { x: width / 2, y: height / 2 };
    
    // Signal that robots are initialized
    setRobotsInitialized(true);
    } catch (error) {
      console.error('RoombaSimulation initialization error:', error);
    }
  }, []);

  // Handle mouse movement and clicks separately
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      // Find closest robot to click
      let closestRobot = 0;
      let closestDistance = Infinity;
      
      robotsRef.current.forEach((robot, index) => {
        const distance = Math.sqrt(
          Math.pow(robot.x - clickX, 2) + Math.pow(robot.y - clickY, 2)
        );
        if (distance < closestDistance && distance < 50) {
          closestDistance = distance;
          closestRobot = index;
        }
      });
      
      selectedRobotRef.current = closestRobot;
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", handleClick);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("click", handleClick);
      }
    };
  }, []);

  // Main animation loop
  useEffect(() => {
    // Only run on client side and after robots are initialized
    if (typeof window === 'undefined') return;
    if (!isClient || !robotsInitialized) return;
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

    canvas.width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    canvas.height = typeof window !== 'undefined' ? window.innerHeight : 1080;
    totalCellsRef.current =
      Math.ceil(canvas.width / GRID_SIZE) * Math.ceil(canvas.height / GRID_SIZE);
    startTimeRef.current = Date.now();

    const getGridKey = (x: number, y: number) => {
      const gx = Math.floor(x / GRID_SIZE);
      const gy = Math.floor(y / GRID_SIZE);
      return `${gx},${gy}`;
    };

    const updateGrid = (x: number, y: number, explored: boolean = true) => {
      const key = getGridKey(x, y);
      const cell = gridRef.current.get(key) || { explored: 0, obstacle: false, heat: 0 };
      const wasUnexplored = cell.explored === 0;
      if (explored) {
        if (cell.explored === 0) {
          exploredCellsRef.current += 1;
        }
        cell.explored = Math.min(cell.explored + 0.01, 1);
        cell.heat = 1;
        if (wasUnexplored) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          if (scoreRef.current > highScoreRef.current) {
            highScoreRef.current = scoreRef.current;
            setHighScore(highScoreRef.current);
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                "roombaHighScore",
                String(highScoreRef.current)
              );
            }
          }
        }
      }
      gridRef.current.set(key, cell);
    };

    const checkObstacleCollision = (x: number, y: number, radius: number = 15) => {
      for (const obs of obstaclesRef.current) {
        if (
          x + radius > obs.left &&
          x - radius < obs.right &&
          y + radius > obs.top &&
          y - radius < obs.bottom
        ) {
          return true;
        }
      }
      return false;
    };

    const calculateEigenvalues = (a: number, b: number, c: number) => {
      // Calculate eigenvalues of 2x2 covariance matrix [[a, b], [b, c]]
      const trace = a + c;
      const det = a * c - b * b;
      const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));
      return {
        max: (trace + discriminant) / 2,
        min: (trace - discriminant) / 2
      };
    };

    const updateObstacles = () => {
      if (!canvasRef.current) return;
      const canvasEl = canvasRef.current;
      const elements = typeof document !== 'undefined' 
        ? Array.from(document.body.querySelectorAll("*")) as HTMLElement[]
        : [];
      obstaclesRef.current = elements
        .filter((el) => {
          if (el === canvasEl) return false;
          const rect = el.getBoundingClientRect();
          const style = typeof window !== 'undefined' ? window.getComputedStyle(el) : { fontSize: '16px' };
          const fontSize = parseFloat(style.fontSize);
          return rect.width > 40 || rect.height > 40 || fontSize > 16;
        })
        .map((el) => el.getBoundingClientRect());
    };
    updateObstacles();

    const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const updateAdvancedSensorData = (robot: AdvancedRobot) => {
      // Simulate realistic LiDAR scanning
      const obstacles = obstaclesRef.current.map(rect => ({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      }));
      
      const lidarPoints = robot.lidarSensor.simulate(
        new Vector2(robot.x, robot.y),
        robot.angle,
        obstacles
      );
      
      // Update legacy sensor data for compatibility
      robot.sensors.lidar = lidarPoints.map(p => p.distance).slice(0, LIDAR_RAYS);
      
      // Simulate IMU with realistic physics
      const acceleration = new Vector3(
        (robot.vx - robot.sensors.odometry.dx) * 10,
        (robot.vy - robot.sensors.odometry.dy) * 10,
        0
      );
      const angularVelocity = new Vector3(0, 0, robot.angle - robot.sensors.odometry.dtheta);
      
      const imuReading = robot.imuSensor.simulate(
        acceleration,
        angularVelocity,
        { w: 1, x: 0, y: 0, z: 0 } // Simplified quaternion
      );
      
      // Simulate GPS with realistic noise and accuracy
      const gpsReading = robot.gpsSensor.simulate(
        new Vector2(robot.x, robot.y),
        Math.floor(Math.random() * 4) + 6, // 6-10 satellites
        1.0 + Math.random() * 0.5 // atmospheric conditions
      );
      
      // Update sensor fusion
      const sensorReadings = new Map();
      sensorReadings.set('imu', imuReading);
      sensorReadings.set('gps', gpsReading);
      
      const fusedState = robot.sensorFusion.fuseReadings(sensorReadings);
      
      // Update pose estimate
      robot.pose.x = fusedState.position.x;
      robot.pose.y = fusedState.position.y;
      robot.confidence = fusedState.confidence;
      
      // Update legacy sensor data
      robot.sensors.imu.ax = imuReading.acceleration.x;
      robot.sensors.imu.ay = imuReading.acceleration.y;
      robot.sensors.imu.gz = imuReading.angularVelocity.z;
      robot.sensors.odometry.dx = robot.vx;
      robot.sensors.odometry.dy = robot.vy;
      robot.sensors.odometry.dtheta = robot.angle;
      robot.sensors.gps.x = gpsReading.latitude;
      robot.sensors.gps.y = gpsReading.longitude;
      robot.sensors.gps.accuracy = gpsReading.accuracy;
    };

    const updateAdvancedParticleFilter = (robot: AdvancedRobot) => {
      // Advanced particle filter with realistic sensor fusion
      robot.particleFilter.predict(
        Math.sqrt(robot.vx * robot.vx + robot.vy * robot.vy),
        robot.angle - robot.sensors.odometry.dtheta,
        0.1 // delta time
      );
      
      // Update with GPS measurement
      if (robot.sensors.gps.accuracy < 10) {
        robot.particleFilter.update({
          x: robot.sensors.gps.x,
          y: robot.sensors.gps.y,
          uncertainty: robot.sensors.gps.accuracy
        });
      }
      
      const estimate = robot.particleFilter.getEstimate();
      robot.pose.x = estimate.x;
      robot.pose.y = estimate.y;
      robot.pose.theta = estimate.theta;
      robot.confidence = estimate.confidence;
      
      // Update legacy particles for visualization
      const newParticles = robot.particleFilter.getParticles();
      robot.particles = newParticles.map(p => ({
        x: p.x,
        y: p.y,
        angle: p.theta,
        weight: p.weight
      }));
    };

    const updateSLAM = (robot: AdvancedRobot) => {
      // Predict SLAM state
      robot.slamFilter.predict(
        Math.sqrt(robot.vx * robot.vx + robot.vy * robot.vy),
        (robot.angle - robot.sensors.odometry.dtheta) / 0.1,
        0.1
      );
      
      // Create observations from LiDAR data
      const observations: Array<{range: number; bearing: number; landmarkId?: number}> = [];
      robot.sensors.lidar.forEach((distance, i) => {
        if (distance < SCAN_RADIUS * 0.8) {
          const bearing = (i / LIDAR_RAYS) * Math.PI * 2 - Math.PI;
          observations.push({ range: distance, bearing });
        }
      });
      
      // Update SLAM with observations
      if (observations.length > 0) {
        robot.slamFilter.update(observations);
      }
      
      // Update robot pose from SLAM
      const slamPose = robot.slamFilter.getPose();
      robot.pose.x = slamPose.x;
      robot.pose.y = slamPose.y;
      robot.pose.theta = slamPose.theta;
      
      // Update landmarks
      robot.landmarks = robot.slamFilter.getLandmarks().map(landmark => ({
        id: landmark.id,
        position: landmark.position,
        confidence: 1 / Math.sqrt(landmark.covariance[0][0] + landmark.covariance[1][1])
      }));
    };

    const updatePathPlanning = (robot: AdvancedRobot) => {
      // Update obstacles for path planner
      const obstacles = obstaclesRef.current.map(rect => ({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      }));
      
      robot.pathPlanner.updateObstacles(obstacles);
      
      // Plan path to target if needed
      if (robot.plannedPath.length === 0 || robot.currentWaypoint >= robot.plannedPath.length) {
        const start = new Vector2(robot.x, robot.y);
        const goal = new Vector2(robot.targetPose.x, robot.targetPose.y);
        
        switch (robot.pathPlanningMode) {
          case "astar":
            const path = robot.pathPlanner.findPath(start, goal);
            if (path) {
              robot.plannedPath = path;
              robot.currentWaypoint = 0;
            }
            break;
        }
      }
      
      // Update current waypoint
      if (robot.plannedPath.length > 0 && robot.currentWaypoint < robot.plannedPath.length) {
        const currentTarget = robot.plannedPath[robot.currentWaypoint];
        const distance = new Vector2(robot.x, robot.y).distanceTo(currentTarget);
        
        if (distance < 20) {
          robot.currentWaypoint++;
        }
      }
    };

    const updatePIDControl = (robot: AdvancedRobot, deltaTime: number) => {
      // Determine target position
      let targetX = robot.targetPose.x;
      let targetY = robot.targetPose.y;
      
      // Use planned path if available
      if (robot.plannedPath.length > 0 && robot.currentWaypoint < robot.plannedPath.length) {
        const waypoint = robot.plannedPath[robot.currentWaypoint];
        targetX = waypoint.x;
        targetY = waypoint.y;
      }
      
      // PID control for position
      const forceX = robot.pidController.x.update(targetX, robot.x, deltaTime);
      const forceY = robot.pidController.y.update(targetY, robot.y, deltaTime);
      
      // Calculate desired heading
      const dx = targetX - robot.x;
      const dy = targetY - robot.y;
      const desiredHeading = Math.atan2(dy, dx);
      
      // PID control for heading
      let headingError = desiredHeading - robot.angle;
      while (headingError > Math.PI) headingError -= 2 * Math.PI;
      while (headingError < -Math.PI) headingError += 2 * Math.PI;
      
      const headingControl = robot.pidController.heading.update(0, headingError, deltaTime);
      
      // Apply control forces
      robot.vx += forceX * deltaTime * 0.01;
      robot.vy += forceY * deltaTime * 0.01;
      robot.angle += headingControl * deltaTime * 0.1;
      
      // Limit velocity
      const maxSpeed = ROBOT_SPEED;
      const speed = Math.sqrt(robot.vx * robot.vx + robot.vy * robot.vy);
      if (speed > maxSpeed) {
        robot.vx = (robot.vx / speed) * maxSpeed;
        robot.vy = (robot.vy / speed) * maxSpeed;
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw world map only in explored areas to simulate discovery
      ctx.save();
      ctx.beginPath();
      gridRef.current.forEach((cell, key) => {
        if (cell.explored > 0) {
          const [gx, gy] = key.split(",").map(Number);
          ctx.rect(gx * GRID_SIZE, gy * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
      });
      ctx.clip();

      ctx.strokeStyle = "rgba(0, 150, 150, 0.3)";
      ctx.lineWidth = 0.5;
      ctx.fillStyle = "rgba(0, 100, 100, 0.1)";

      worldDataRef.current.forEach((polygon) => {
        ctx.beginPath();
        polygon.forEach((point, i) => {
          const x = ((point[0] + 180) / 360) * canvas.width;
          const y = ((90 - point[1]) / 180) * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
      
      // Draw major cities as points
      MAJOR_CITIES.forEach(city => {
        const x = city.x * canvas.width;
        const y = city.y * canvas.height;
        
        // City dot
        ctx.fillStyle = "rgba(255, 100, 100, 0.6)";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // City label
        ctx.fillStyle = "rgba(255, 150, 150, 0.4)";
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillText(city.name, x + 5, y + 3);
      });
      
      // Draw connection lines between cities based on robot communications
      ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
      ctx.lineWidth = 0.5;
      robotsRef.current.forEach((robot, i) => {
        if (i < MAJOR_CITIES.length - 1) {
          const city1 = MAJOR_CITIES[i];
          const city2 = MAJOR_CITIES[i + 1];
          if (robot.communicating.size > 0) {
            ctx.beginPath();
            ctx.moveTo(city1.x * canvas.width, city1.y * canvas.height);
            ctx.lineTo(city2.x * canvas.width, city2.y * canvas.height);
            ctx.stroke();
          }
        }
      });
      
      // Apply faded overlay so map starts desaturated
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Reveal explored areas by clearing overlay
      gridRef.current.forEach((cell, key) => {
        const [gx, gy] = key.split(",").map(Number);
        const x = gx * GRID_SIZE;
        const y = gy * GRID_SIZE;

        if (cell.explored > 0) {
          const alpha = (1 - cell.explored) * 0.6;
          ctx.clearRect(x, y, GRID_SIZE, GRID_SIZE);
          if (alpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
          }
        }

        if (cell.heat > 0) {
          const alpha = cell.heat * 0.15;
          ctx.fillStyle = `rgba(255, 100, 200, ${alpha})`;
          ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
          cell.heat *= 0.97;
        }
      });

      // Get current mouse position
      const mouse = mouseRef.current;
      const prevMouse = prevMouseRef.current;

      // Calculate mouse velocity for prediction
      const mouseVx = (mouse.x - prevMouse.x) * 0.5;
      const mouseVy = (mouse.y - prevMouse.y) * 0.5;
      const predictedMouseX = mouse.x + mouseVx * 10;
      const predictedMouseY = mouse.y + mouseVy * 10;

      // Update robot communications
      robotsRef.current.forEach((robot) => {
        robot.communicating.clear();
        robotsRef.current.forEach((other) => {
          if (robot.id !== other.id) {
            const dist = getDistance(robot.x, robot.y, other.x, other.y);
            if (dist < COMMUNICATION_RADIUS) {
              robot.communicating.add(other.id);
            }
          }
        });
      });

      // Update robots with advanced swarm behavior
      robotsRef.current.forEach((robot) => {
        const deltaTime = 0.1; // 10Hz update rate
        
        // Update advanced sensor systems
        updateAdvancedSensorData(robot);
        updateAdvancedParticleFilter(robot);
        updateSLAM(robot);
        updatePathPlanning(robot);
        
        // Update control system based on mode
        if (robot.controlMode === "autonomous") {
          updatePIDControl(robot, deltaTime);
        }
        
        // Update telemetry
        robot.batteryLevel -= 0.01;
        if (robot.batteryLevel < 0) robot.batteryLevel = 100;
        robot.temperature = 35 + robot.processingLoad * 0.3 + Math.random() * 5;
        robot.processingLoad = 20 + Math.abs(robot.vx) * 10 + Math.abs(robot.vy) * 10 + Math.random() * 20;
        robot.networkLatency = 10 + robot.communicating.size * 5 + Math.random() * 30;
        robot.confidence = Math.min(1, 0.5 + robot.communicating.size * 0.1 + Math.random() * 0.2);
        robot.lastUpdate = Date.now();
        
        // Add waypoints for path planning
        if (Math.random() < 0.02) {
          const waypoint: Waypoint = {
            x: robot.x,
            y: robot.y,
            type: robot.role === "scout" ? "checkpoint" : "target",
            timestamp: Date.now()
          };
          robot.waypoints.push(waypoint);
          if (robot.waypoints.length > 10) {
            robot.waypoints.shift();
          }
        }
        let forceX = 0;
        let forceY = 0;
        let neighborCount = 0;
        let avgVx = 0;
        let avgVy = 0;

        // Swarm behavior: cohesion, alignment, separation
        robotsRef.current.forEach((other) => {
          if (robot.id === other.id) return;
          
          const dx = other.x - robot.x;
          const dy = other.y - robot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < COMMUNICATION_RADIUS && dist > 0) {
            neighborCount++;
            
            // Cohesion: move toward center of nearby robots
            if (dist > FORMATION_RADIUS) {
              forceX += dx * 0.001;
              forceY += dy * 0.001;
            }
            
            // Separation: avoid getting too close
            if (dist < FORMATION_RADIUS * 0.6) {
              forceX -= (dx / dist) * 2;
              forceY -= (dy / dist) * 2;
            }
            
            // Alignment: match velocity of neighbors
            avgVx += other.vx;
            avgVy += other.vy;
          }
        });

        if (neighborCount > 0) {
          avgVx /= neighborCount;
          avgVy /= neighborCount;
          forceX += (avgVx - robot.vx) * 0.1;
          forceY += (avgVy - robot.vy) * 0.1;
        }

        // Role-based behavior
        let targetX = predictedMouseX;
        let targetY = predictedMouseY;
        
        if (robot.role === "leader") {
          // Leader goes directly to mouse
          targetX = predictedMouseX;
          targetY = predictedMouseY;
        } else if (robot.role === "scout") {
          // Scouts form a wider perimeter
          const angle = (robot.id / 4) * Math.PI * 2;
          targetX = predictedMouseX + Math.cos(angle) * FORMATION_RADIUS;
          targetY = predictedMouseY + Math.sin(angle) * FORMATION_RADIUS;
        } else {
          // Followers maintain formation
          const leader = robotsRef.current[0];
          const angle = ((robot.id - 4) / (NUM_ROBOTS - 4)) * Math.PI * 2;
          const radius = FORMATION_RADIUS * 0.7;
          targetX = leader.x + Math.cos(angle) * radius;
          targetY = leader.y + Math.sin(angle) * radius;
        }

        // Calculate smooth approach to target
        const dx = targetX - robot.x;
        const dy = targetY - robot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 10) {
          // Add swarm forces to target direction
          const targetForceX = (dx / dist) * ROBOT_SPEED + forceX;
          const targetForceY = (dy / dist) * ROBOT_SPEED + forceY;
          
          robot.targetAngle = Math.atan2(targetForceY, targetForceX);
          
          // Smooth angle rotation
          let angleDiff = robot.targetAngle - robot.angle;
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
          robot.angle += angleDiff * 0.08;

          // Check for obstacles
          const nextX = robot.x + Math.cos(robot.angle) * ROBOT_SPEED * 2;
          const nextY = robot.y + Math.sin(robot.angle) * ROBOT_SPEED * 2;
          
          if (!checkObstacleCollision(nextX, nextY)) {
            robot.vx = Math.cos(robot.angle) * ROBOT_SPEED;
            robot.vy = Math.sin(robot.angle) * ROBOT_SPEED;
          } else {
            // Smooth obstacle avoidance
            const avoidanceAngle = robot.angle + (Math.random() > 0.5 ? Math.PI/4 : -Math.PI/4);
            robot.vx = Math.cos(avoidanceAngle) * ROBOT_SPEED * 0.5;
            robot.vy = Math.sin(avoidanceAngle) * ROBOT_SPEED * 0.5;
          }
        } else {
          // Slow down when near target
          robot.vx *= 0.9;
          robot.vy *= 0.9;
        }

        // Apply velocity with stronger damping for smoother movement
        robot.x += robot.vx;
        robot.y += robot.vy;
        robot.vx *= 0.92;
        robot.vy *= 0.92;

        // Boundary constraints
        robot.x = Math.max(15, Math.min(canvas.width - 15, robot.x));
        robot.y = Math.max(15, Math.min(canvas.height - 15, robot.y));

        // Update path history
        if (Math.random() < 0.3) { // Reduce path update frequency for cleaner trails
          robot.path.push({ x: robot.x, y: robot.y });
          if (robot.path.length > PATH_HISTORY_LENGTH) {
            robot.path.shift();
          }
        }

        // Update grid map
        updateGrid(robot.x, robot.y);

        // Slower, smoother scanning
        robot.scanAngle += 0.05;
      });

      // Draw communication links
      robotsRef.current.forEach((robot) => {
        robot.communicating.forEach((otherId) => {
          const other = robotsRef.current[otherId];
          if (other && robot.id < otherId) { // Draw each link only once
            ctx.strokeStyle = "rgba(100, 200, 255, 0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(robot.x, robot.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Draw selected robot's particle filter
      const selectedRobot = robotsRef.current[selectedRobotRef.current];
      if (selectedRobot) {
        // Draw particles
        selectedRobot.particles.forEach(particle => {
          const alpha = particle.weight * 2;
          ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw LIDAR rays for selected robot
        ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        for (let i = 0; i < LIDAR_RAYS; i++) {
          const rayAngle = selectedRobot.angle + (i / LIDAR_RAYS) * Math.PI * 2 - Math.PI;
          const distance = selectedRobot.sensors.lidar[i];
          ctx.beginPath();
          ctx.moveTo(selectedRobot.x, selectedRobot.y);
          ctx.lineTo(
            selectedRobot.x + Math.cos(rayAngle) * distance,
            selectedRobot.y + Math.sin(rayAngle) * distance
          );
          ctx.stroke();
        }
        
        // Draw planned path for selected robot
        if (selectedRobot.plannedPath.length > 1) {
          ctx.strokeStyle = "rgba(100, 255, 100, 0.7)";
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 5]);
          ctx.beginPath();
          selectedRobot.plannedPath.forEach((waypoint, i) => {
            if (i === 0) {
              ctx.moveTo(waypoint.x, waypoint.y);
            } else {
              ctx.lineTo(waypoint.x, waypoint.y);
            }
          });
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Highlight current waypoint
          if (selectedRobot.currentWaypoint < selectedRobot.plannedPath.length) {
            const currentWP = selectedRobot.plannedPath[selectedRobot.currentWaypoint];
            ctx.fillStyle = "rgba(255, 255, 100, 0.8)";
            ctx.beginPath();
            ctx.arc(currentWP.x, currentWP.y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = "rgba(255, 255, 0, 1)";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
        
        // Draw SLAM landmarks for selected robot
        selectedRobot.landmarks.forEach(landmark => {
          const alpha = Math.min(1, landmark.confidence);
          ctx.fillStyle = `rgba(255, 150, 50, ${alpha})`;
          ctx.beginPath();
          ctx.arc(landmark.position.x, landmark.position.y, 6, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw landmark ID
          ctx.fillStyle = "rgba(255, 200, 100, 0.8)";
          ctx.font = "10px monospace";
          ctx.fillText(`L${landmark.id}`, landmark.position.x + 8, landmark.position.y - 8);
        });
        
        // Draw pose uncertainty ellipse
        const poseCovariance = selectedRobot.pose.covariance;
        if (poseCovariance && poseCovariance.length >= 2) {
          const eigenvals = calculateEigenvalues(poseCovariance[0][0], poseCovariance[0][1], poseCovariance[1][1]);
          const angle = 0.5 * Math.atan2(2 * poseCovariance[0][1], poseCovariance[0][0] - poseCovariance[1][1]);
          
          ctx.save();
          ctx.translate(selectedRobot.pose.x, selectedRobot.pose.y);
          ctx.rotate(angle);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.ellipse(0, 0, Math.sqrt(eigenvals.max) * 3, Math.sqrt(eigenvals.min) * 3, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
        
        // Draw waypoints for selected robot
        if (selectedRobot.waypoints.length > 1) {
          ctx.strokeStyle = "rgba(255, 100, 255, 0.5)";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 3]);
          ctx.beginPath();
          selectedRobot.waypoints.forEach((waypoint, i) => {
            if (i === 0) {
              ctx.moveTo(waypoint.x, waypoint.y);
            } else {
              ctx.lineTo(waypoint.x, waypoint.y);
            }
            
            // Draw waypoint markers
            ctx.save();
            ctx.fillStyle = waypoint.type === "checkpoint" ? "rgba(100, 255, 100, 0.6)" : "rgba(255, 100, 100, 0.6)";
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw robots
      robotsRef.current.forEach((robot) => {
        ctx.save();
        ctx.translate(robot.x, robot.y);
        
        // Highlight selected robot
        if (robot.id === selectedRobotRef.current) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.stroke();

          // Draw selection indicator
          const pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
          ctx.save();
          ctx.scale(pulseScale, pulseScale);
          ctx.strokeStyle = robot.color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(0, 0, 25, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // Draw scanning effect (less aggressive)
        if (robot.role === "scout") {
          // Scouts have active scanning
          ctx.strokeStyle = `${robot.color}15`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, SCAN_RADIUS, robot.scanAngle, robot.scanAngle + Math.PI/3);
          ctx.stroke();
        }

        // Draw role indicator
        if (robot.role === "leader") {
          ctx.strokeStyle = robot.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 15, 0, Math.PI * 2);
          ctx.stroke();
        } else if (robot.role === "scout") {
          ctx.strokeStyle = `${robot.color}66`;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw robot body
        ctx.rotate(robot.angle);
        
        // Shadow effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.moveTo(8, 1);
        ctx.lineTo(-5, -4);
        ctx.lineTo(-5, 6);
        ctx.closePath();
        ctx.fill();
        
        // Main body
        ctx.fillStyle = robot.color;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-5, -4);
        ctx.lineTo(-5, 4);
        ctx.closePath();
        ctx.fill();

        // Direction indicator
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(2, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Draw path trail (thinner and more subtle)
        if (robot.path.length > 1) {
          ctx.strokeStyle = `${robot.color}22`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          robot.path.forEach((point, i) => {
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }
      });

      // Draw target at mouse (more subtle)
      ctx.strokeStyle = "rgba(255, 0, 100, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Crosshair
      ctx.strokeStyle = "rgba(255, 0, 100, 0.8)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mouse.x - 8, mouse.y);
      ctx.lineTo(mouse.x + 8, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - 8);
      ctx.lineTo(mouse.x, mouse.y + 8);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      totalCellsRef.current =
        Math.ceil(canvas.width / GRID_SIZE) * Math.ceil(canvas.height / GRID_SIZE);
      updateObstacles();
      totalCellsRef.current =
        Math.ceil(canvas.width / GRID_SIZE) * Math.ceil(canvas.height / GRID_SIZE);
    };
    window.addEventListener("resize", handleResize);

    const obstacleInterval = setInterval(updateObstacles, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(obstacleInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    } catch (error) {
      console.error('RoombaSimulation animation error:', error);
    }
  }, [isClient, robotsInitialized]); // Depend on client state and robot initialization

  // Game stats update and best time tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem("swarmBestTime");
    if (stored) {
      bestTimeRef.current = parseFloat(stored);
      setGameStats((s) => ({ ...s, best: bestTimeRef.current }));
    }
    const interval = setInterval(() => {
      const coverage = totalCellsRef.current
        ? (exploredCellsRef.current / totalCellsRef.current) * 100
        : 0;
      const time = (Date.now() - startTimeRef.current) / 1000;
      if (coverage >= 100 && (!bestTimeRef.current || time < bestTimeRef.current)) {
        bestTimeRef.current = time;
        if (typeof window !== 'undefined') {
          localStorage.setItem("swarmBestTime", bestTimeRef.current.toString());
        }
      }
      setGameStats({ coverage, time, best: bestTimeRef.current });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Reset simulation with 'R'
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        gridRef.current.clear();
        exploredCellsRef.current = 0;
        startTimeRef.current = Date.now();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Telemetry display update
  useEffect(() => {
    const updateTelemetry = () => {
      if (!telemetryRef.current) return;
      const robot = robotsRef.current[selectedRobotRef.current];
      if (!robot) return;
      
      telemetryRef.current.innerHTML = `
        <div class="font-mono text-xs text-cyan-400">
          <div class="mb-2 text-sm font-bold text-white">ROBOT ${robot.id} [${robot.role.toUpperCase()}]</div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>POS: (${robot.pose.x.toFixed(0)}, ${robot.pose.y.toFixed(0)})</div>
            <div>VEL: ${Math.sqrt(robot.vx**2 + robot.vy**2).toFixed(2)} m/s</div>
            <div>HDG: ${((robot.pose.theta * 180 / Math.PI) % 360).toFixed(0)}°</div>
            <div>CONF: ${(robot.confidence * 100).toFixed(0)}%</div>
            <div>BAT: ${robot.batteryLevel.toFixed(0)}%</div>
            <div>TEMP: ${robot.temperature.toFixed(1)}°C</div>
            <div>CPU: ${robot.processingLoad.toFixed(0)}%</div>
            <div>LAT: ${robot.networkLatency.toFixed(0)}ms</div>
            <div>COMM: ${robot.communicating.size} nodes</div>
            <div>GPS: ±${robot.sensors.gps.accuracy.toFixed(1)}m</div>
          </div>
          <div class="mt-2 text-xs opacity-70">
            IMU: [${robot.sensors.imu.ax.toFixed(1)}, ${robot.sensors.imu.ay.toFixed(1)}, ${robot.sensors.imu.gz.toFixed(1)}]
          </div>
          <div class="text-xs opacity-70">
            SLAM: ${robot.landmarks.length} landmarks | Mode: ${robot.controlMode.toUpperCase()}
          </div>
          <div class="text-xs opacity-70">
            Path: ${robot.plannedPath.length} waypoints | Alg: ${robot.pathPlanningMode.toUpperCase()}
          </div>
          <div class="text-xs opacity-70">
            Distance: ${robot.distanceTraveled.toFixed(1)}m | Efficiency: ${(robot.explorationEfficiency * 100).toFixed(1)}%
          </div>
          <div class="text-xs opacity-70">
            Energy: ${robot.energyConsumption.toFixed(1)}J | Collisions: ${robot.collisionCount}
          </div>
        </div>
      `;
    };
    
    const interval = setInterval(updateTelemetry, 100);
    return () => clearInterval(interval);
  }, []);

  // Don't render on server side to avoid hydration mismatches
  if (!isClient) {
    return null;
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10"
        style={{ background: "linear-gradient(135deg, #ffffff, #e3f2fd)" }}
      />
      <div
        ref={telemetryRef}
        className="fixed bottom-4 right-4 bg-white/80 text-gray-800 backdrop-blur-sm border border-cyan-600/30 rounded-lg p-4 pointer-events-none z-50"
        style={{ minWidth: "320px" }}
      />
      <div className="fixed top-4 left-4 font-mono text-xs text-cyan-700/70 pointer-events-none z-50">
        <div>Coverage: {gameStats.coverage.toFixed(1)}%</div>
        <div>Time: {gameStats.time.toFixed(1)}s</div>
        {gameStats.best !== null && (
          <div>Best: {gameStats.best.toFixed(1)}s</div>
        )}
        <div>Press &apos;R&apos; to reset</div>
      </div>
      <div className="fixed bottom-4 left-4 font-mono text-xs text-cyan-700/70 pointer-events-none z-50">
        <div>GLOBAL ROBOTICS NETWORK v2.0</div>
        <div>Click robot for telemetry</div>
        <div>{NUM_ROBOTS} agents | {MAJOR_CITIES.length} nodes</div>
        <div>
          Coverage: {((score / (totalCellsRef.current || 1)) * 100).toFixed(1)}%
          {" "}| High: {((highScore / (totalCellsRef.current || 1)) * 100).toFixed(1)}%
        </div>
        <div>Real-time worldwide coordination</div>
      </div>
    </>
  );
}