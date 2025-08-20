/**
 * Advanced Robotics Sensor Simulation Library
 * 
 * This library provides realistic sensor simulations commonly used in robotics:
 * - LiDAR (2D and 3D scanning)
 * - IMU (Inertial Measurement Unit)
 * - GPS (Global Positioning System)
 * - Camera (computer vision)
 * - Ultrasonic sensors
 * - Encoders and odometry
 * - Force/torque sensors
 */

import { Vector2, Vector3, Quat, RoboticsUtils } from './math';

// ============================================================================
// SENSOR INTERFACES AND TYPES
// ============================================================================

export interface SensorReading {
  timestamp: number;
  sensorId: string;
  confidence: number;
  noise: number;
}

export interface LidarPoint {
  x: number;
  y: number;
  z: number;
  intensity: number;
  distance: number;
  angle: number;
}

export interface IMUReading extends SensorReading {
  acceleration: Vector3;
  angularVelocity: Vector3;
  magneticField: Vector3;
  temperature: number;
}

export interface GPSReading extends SensorReading {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  numSatellites: number;
  hdop: number; // Horizontal dilution of precision
}

export interface CameraFeature {
  id: number;
  x: number;
  y: number;
  descriptor: number[];
  confidence: number;
}

export interface UltrasonicReading extends SensorReading {
  distance: number;
  angle: number;
  maxRange: number;
}

export interface EncoderReading extends SensorReading {
  position: number;
  velocity: number;
  acceleration: number;
}

// ============================================================================
// LIDAR SENSOR SIMULATION
// ============================================================================

export class LidarSensor {
  private scanData: LidarPoint[] = [];
  private lastScanTime = 0;

  constructor(
    private range: number = 30, // meters
    private angularResolution: number = 0.25, // degrees
    private scanRate: number = 10, // Hz
    private noiseStdDev: number = 0.02, // meters
    private minRange: number = 0.1,
    private fieldOfView: number = 360 // degrees
  ) {}

  simulate(
    robotPosition: Vector2,
    robotAngle: number,
    obstacles: Array<{ x: number; y: number; width: number; height: number }>,
    walls: Array<{ start: Vector2; end: Vector2 }> = []
  ): LidarPoint[] {
    const currentTime = Date.now();
    
    // Check if it's time for a new scan
    if (currentTime - this.lastScanTime < 1000 / this.scanRate) {
      return this.scanData;
    }

    this.lastScanTime = currentTime;
    this.scanData = [];

    const startAngle = robotAngle - (this.fieldOfView * Math.PI / 180) / 2;
    const endAngle = robotAngle + (this.fieldOfView * Math.PI / 180) / 2;
    const angleIncrement = (this.angularResolution * Math.PI / 180);

    for (let angle = startAngle; angle <= endAngle; angle += angleIncrement) {
      const rayDirection = new Vector2(Math.cos(angle), Math.sin(angle));
      const hit = this.castRay(robotPosition, rayDirection, obstacles, walls);
      
      if (hit) {
        const distance = robotPosition.distanceTo(hit.position);
        if (distance >= this.minRange && distance <= this.range) {
          // Add noise to the measurement
          const noisyDistance = distance + this.generateGaussianNoise(0, this.noiseStdDev);
          const noisyPosition = robotPosition.add(rayDirection.multiply(noisyDistance));
          
          this.scanData.push({
            x: noisyPosition.x,
            y: noisyPosition.y,
            z: 0, // 2D LiDAR
            intensity: hit.intensity,
            distance: noisyDistance,
            angle: angle
          });
        }
      }
    }

    return this.scanData;
  }

  private castRay(
    origin: Vector2,
    direction: Vector2,
    obstacles: Array<{ x: number; y: number; width: number; height: number }>,
    walls: Array<{ start: Vector2; end: Vector2 }>
  ): { position: Vector2; intensity: number } | null {
    let closestHit: { position: Vector2; intensity: number } | null = null;
    let closestDistance = this.range;

    // Check obstacle intersections
    for (const obstacle of obstacles) {
      const hit = this.rayBoxIntersection(origin, direction, obstacle);
      if (hit) {
        const distance = origin.distanceTo(hit);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestHit = { position: hit, intensity: 0.8 };
        }
      }
    }

    // Check wall intersections
    for (const wall of walls) {
      const hit = this.rayLineIntersection(origin, direction, wall.start, wall.end);
      if (hit) {
        const distance = origin.distanceTo(hit);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestHit = { position: hit, intensity: 0.9 };
        }
      }
    }

    return closestHit;
  }

  private rayBoxIntersection(
    origin: Vector2,
    direction: Vector2,
    box: { x: number; y: number; width: number; height: number }
  ): Vector2 | null {
    const invDir = new Vector2(
      direction.x !== 0 ? 1 / direction.x : Infinity,
      direction.y !== 0 ? 1 / direction.y : Infinity
    );

    const t1 = (box.x - origin.x) * invDir.x;
    const t2 = (box.x + box.width - origin.x) * invDir.x;
    const t3 = (box.y - origin.y) * invDir.y;
    const t4 = (box.y + box.height - origin.y) * invDir.y;

    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    if (tmax < 0 || tmin > tmax || tmin < 0) {
      return null;
    }

    const t = tmin > 0 ? tmin : tmax;
    return origin.add(direction.multiply(t));
  }

  private rayLineIntersection(
    origin: Vector2,
    direction: Vector2,
    lineStart: Vector2,
    lineEnd: Vector2
  ): Vector2 | null {
    const lineDir = lineEnd.subtract(lineStart);
    const cross = direction.cross(lineDir);
    
    if (Math.abs(cross) < 1e-8) {
      return null; // Parallel lines
    }

    const t1 = lineStart.subtract(origin).cross(lineDir) / cross;
    const t2 = lineStart.subtract(origin).cross(direction) / cross;

    if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
      return origin.add(direction.multiply(t1));
    }

    return null;
  }

  private generateGaussianNoise(mean: number, stdDev: number): number {
    // Box-Muller transform for Gaussian noise
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  getLatestScan(): LidarPoint[] {
    return [...this.scanData];
  }

  getMaxRange(): number {
    return this.range;
  }

  getAngularResolution(): number {
    return this.angularResolution;
  }
}

// ============================================================================
// IMU SENSOR SIMULATION
// ============================================================================

export class IMUSensor {
  private lastReading: IMUReading | null = null;
  private biasAccel = new Vector3(0.02, 0.01, -0.05); // m/s² bias
  private biasGyro = new Vector3(0.001, -0.002, 0.0015); // rad/s bias
  private temperature = 25; // °C

  constructor(
    private accelNoise: number = 0.1, // m/s² std dev
    private gyroNoise: number = 0.01, // rad/s std dev
    private magNoise: number = 0.5, // µT std dev
    private sampleRate: number = 100 // Hz
  ) {}

  simulate(
    trueAcceleration: Vector3,
    trueAngularVelocity: Vector3,
    robotOrientation: Quat,
    magneticDeclination: number = 0
  ): IMUReading {
    const timestamp = Date.now();

    // Simulate temperature drift
    this.temperature += (Math.random() - 0.5) * 0.1;
    const tempFactor = 1 + (this.temperature - 25) * 0.001;

    // Add bias and noise to accelerometer
    const noisyAccel = new Vector3(
      trueAcceleration.x + this.biasAccel.x * tempFactor + this.generateGaussianNoise(0, this.accelNoise),
      trueAcceleration.y + this.biasAccel.y * tempFactor + this.generateGaussianNoise(0, this.accelNoise),
      trueAcceleration.z + this.biasAccel.z * tempFactor + this.generateGaussianNoise(0, this.accelNoise)
    );

    // Add bias and noise to gyroscope
    const noisyGyro = new Vector3(
      trueAngularVelocity.x + this.biasGyro.x * tempFactor + this.generateGaussianNoise(0, this.gyroNoise),
      trueAngularVelocity.y + this.biasGyro.y * tempFactor + this.generateGaussianNoise(0, this.gyroNoise),
      trueAngularVelocity.z + this.biasGyro.z * tempFactor + this.generateGaussianNoise(0, this.gyroNoise)
    );

    // Simulate magnetometer (simplified Earth's magnetic field)
    const earthMagField = new Vector3(21.0, 0, 42.0); // µT in NED frame
    const rotatedMagField = robotOrientation.rotateVector(earthMagField);
    const noisyMag = new Vector3(
      rotatedMagField.x + this.generateGaussianNoise(0, this.magNoise),
      rotatedMagField.y + this.generateGaussianNoise(0, this.magNoise),
      rotatedMagField.z + this.generateGaussianNoise(0, this.magNoise)
    );

    // Calculate confidence based on noise levels
    const confidence = Math.max(0, 1 - (Math.abs(this.temperature - 25) / 50));

    this.lastReading = {
      timestamp,
      sensorId: 'imu_01',
      confidence,
      noise: (this.accelNoise + this.gyroNoise + this.magNoise) / 3,
      acceleration: noisyAccel,
      angularVelocity: noisyGyro,
      magneticField: noisyMag,
      temperature: this.temperature
    };

    return this.lastReading;
  }

  private generateGaussianNoise(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  calibrate(): void {
    // Reset biases (simplified calibration)
    this.biasAccel = new Vector3(
      this.generateGaussianNoise(0, 0.01),
      this.generateGaussianNoise(0, 0.01),
      this.generateGaussianNoise(0, 0.01)
    );
    this.biasGyro = new Vector3(
      this.generateGaussianNoise(0, 0.001),
      this.generateGaussianNoise(0, 0.001),
      this.generateGaussianNoise(0, 0.001)
    );
  }

  getLastReading(): IMUReading | null {
    return this.lastReading;
  }
}

// ============================================================================
// GPS SENSOR SIMULATION
// ============================================================================

export class GPSSensor {
  private lastReading: GPSReading | null = null;

  constructor(
    private accuracyMean: number = 3.0, // meters
    private accuracyStdDev: number = 1.0, // meters
    private updateRate: number = 1, // Hz
    private baseLatitude: number = 37.7749, // San Francisco
    private baseLongitude: number = -122.4194
  ) {}

  simulate(
    truePosition: Vector2, // in local coordinates (meters)
    satelliteCount: number = 8,
    atmosphericConditions: number = 1.0 // 1.0 = ideal, >1.0 = poor
  ): GPSReading {
    const timestamp = Date.now();

    // Convert local position to lat/lon (simplified)
    const metersPerDegree = 111320; // approximate at equator
    const latitude = this.baseLatitude + (truePosition.y / metersPerDegree);
    const longitude = this.baseLongitude + (truePosition.x / (metersPerDegree * Math.cos(this.baseLatitude * Math.PI / 180)));

    // Calculate accuracy based on satellite count and conditions
    const accuracy = this.accuracyMean * atmosphericConditions * Math.exp(-satelliteCount / 4);
    
    // Add GPS noise
    const noisyLatitude = latitude + this.generateGaussianNoise(0, accuracy / metersPerDegree);
    const noisyLongitude = longitude + this.generateGaussianNoise(0, accuracy / (metersPerDegree * Math.cos(latitude * Math.PI / 180)));

    // Calculate HDOP (Horizontal Dilution of Precision)
    const hdop = Math.max(0.5, Math.min(20, 50 / satelliteCount * atmosphericConditions));

    // Confidence based on satellite count and HDOP
    const confidence = Math.min(1, satelliteCount / 12) * Math.max(0.1, 1 / hdop);

    this.lastReading = {
      timestamp,
      sensorId: 'gps_01',
      confidence,
      noise: accuracy,
      latitude: noisyLatitude,
      longitude: noisyLongitude,
      altitude: 50 + this.generateGaussianNoise(0, accuracy), // meters
      accuracy,
      numSatellites: satelliteCount,
      hdop
    };

    return this.lastReading;
  }

  private generateGaussianNoise(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  toLocalCoordinates(gpsReading: GPSReading): Vector2 {
    const metersPerDegree = 111320;
    const x = (gpsReading.longitude - this.baseLongitude) * metersPerDegree * Math.cos(this.baseLatitude * Math.PI / 180);
    const y = (gpsReading.latitude - this.baseLatitude) * metersPerDegree;
    return new Vector2(x, y);
  }

  getLastReading(): GPSReading | null {
    return this.lastReading;
  }
}

// ============================================================================
// CAMERA SENSOR SIMULATION
// ============================================================================

export class CameraSensor {
  private features: Map<number, CameraFeature> = new Map();
  private nextFeatureId = 0;

  constructor(
    private width: number = 640,
    private height: number = 480,
    private focalLength: number = 500, // pixels
    private featureDetectionRate: number = 0.1, // probability per frame
    private featureNoise: number = 2.0 // pixels
  ) {}

  simulate(
    robotPosition: Vector2,
    robotAngle: number,
    landmarks: Array<{ position: Vector2; type: string; size: number }>
  ): CameraFeature[] {
    const detectedFeatures: CameraFeature[] = [];

    for (const landmark of landmarks) {
      // Transform landmark to camera frame
      const relativePos = landmark.position.subtract(robotPosition);
      const robotDirection = new Vector2(Math.cos(robotAngle), Math.sin(robotAngle));
      const robotRight = new Vector2(-Math.sin(robotAngle), Math.cos(robotAngle));

      const forward = relativePos.dot(robotDirection);
      const right = relativePos.dot(robotRight);

      // Check if landmark is in front of camera
      if (forward > 0 && Math.abs(right) < forward * Math.tan(Math.PI / 3)) {
        // Project to image plane
        const x = this.width / 2 + (right / forward) * this.focalLength;
        const y = this.height / 2; // Assuming camera is level

        // Check if projection is within image bounds
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          // Add detection noise
          const noisyX = x + this.generateGaussianNoise(0, this.featureNoise);
          const noisyY = y + this.generateGaussianNoise(0, this.featureNoise);

          // Calculate confidence based on distance and size
          const distance = relativePos.magnitude();
          const apparentSize = landmark.size / distance;
          const confidence = Math.min(1, apparentSize * 10) * Math.exp(-distance / 100);

          if (Math.random() < this.featureDetectionRate * confidence) {
            detectedFeatures.push({
              id: this.nextFeatureId++,
              x: noisyX,
              y: noisyY,
              descriptor: this.generateDescriptor(),
              confidence
            });
          }
        }
      }
    }

    return detectedFeatures;
  }

  private generateDescriptor(): number[] {
    // Generate a simple 64-dimensional feature descriptor
    return Array.from({ length: 64 }, () => Math.random() * 255);
  }

  private generateGaussianNoise(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  projectPoint(worldPoint: Vector3, cameraTransform: Transform3D): Vector2 | null {
    // Transform point to camera frame
    const localPoint = cameraTransform.inverse().transformPoint(worldPoint);

    // Check if point is in front of camera
    if (localPoint.z <= 0) return null;

    // Project to image plane
    const x = this.width / 2 + (localPoint.x / localPoint.z) * this.focalLength;
    const y = this.height / 2 - (localPoint.y / localPoint.z) * this.focalLength;

    // Check if projection is within image bounds
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return new Vector2(x, y);
    }

    return null;
  }
}

// ============================================================================
// ULTRASONIC SENSOR SIMULATION
// ============================================================================

export class UltrasonicSensor {
  constructor(
    private maxRange: number = 4.0, // meters
    private beamAngle: number = 15 * Math.PI / 180, // radians
    private resolution: number = 0.01, // meters
    private noiseStdDev: number = 0.02 // meters
  ) {}

  simulate(
    robotPosition: Vector2,
    sensorAngle: number,
    obstacles: Array<{ x: number; y: number; width: number; height: number }>
  ): UltrasonicReading {
    const timestamp = Date.now();
    let closestDistance = this.maxRange;

    // Cast multiple rays within the beam angle
    const numRays = 5;
    const angleStep = this.beamAngle / (numRays - 1);

    for (let i = 0; i < numRays; i++) {
      const rayAngle = sensorAngle - this.beamAngle / 2 + i * angleStep;
      const rayDirection = new Vector2(Math.cos(rayAngle), Math.sin(rayAngle));

      for (const obstacle of obstacles) {
        const hit = this.rayBoxIntersection(robotPosition, rayDirection, obstacle);
        if (hit) {
          const distance = robotPosition.distanceTo(hit);
          if (distance < closestDistance) {
            closestDistance = distance;
          }
        }
      }
    }

    // Add noise
    const noisyDistance = Math.max(0, closestDistance + this.generateGaussianNoise(0, this.noiseStdDev));

    // Calculate confidence based on distance and beam angle
    const confidence = Math.max(0.5, 1 - (closestDistance / this.maxRange));

    return {
      timestamp,
      sensorId: 'ultrasonic_01',
      confidence,
      noise: this.noiseStdDev,
      distance: noisyDistance,
      angle: sensorAngle,
      maxRange: this.maxRange
    };
  }

  private rayBoxIntersection(
    origin: Vector2,
    direction: Vector2,
    box: { x: number; y: number; width: number; height: number }
  ): Vector2 | null {
    const invDir = new Vector2(
      direction.x !== 0 ? 1 / direction.x : Infinity,
      direction.y !== 0 ? 1 / direction.y : Infinity
    );

    const t1 = (box.x - origin.x) * invDir.x;
    const t2 = (box.x + box.width - origin.x) * invDir.x;
    const t3 = (box.y - origin.y) * invDir.y;
    const t4 = (box.y + box.height - origin.y) * invDir.y;

    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    if (tmax < 0 || tmin > tmax || tmin < 0) {
      return null;
    }

    const t = tmin > 0 ? tmin : tmax;
    return origin.add(direction.multiply(t));
  }

  private generateGaussianNoise(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }
}

// ============================================================================
// ENCODER AND ODOMETRY SIMULATION
// ============================================================================

export class EncoderSensor {
  private position = 0;
  private lastPosition = 0;
  private lastTime = Date.now();

  constructor(
    private resolution: number = 1024, // counts per revolution
    private wheelRadius: number = 0.05, // meters
    private noiseStdDev: number = 0.001 // radians
  ) {}

  simulate(trueAngularVelocity: number): EncoderReading {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;

    // Add noise to angular velocity
    const noisyAngularVelocity = trueAngularVelocity + this.generateGaussianNoise(0, this.noiseStdDev);

    // Update position
    this.lastPosition = this.position;
    this.position += noisyAngularVelocity * deltaTime;

    // Calculate velocity and acceleration
    const velocity = (this.position - this.lastPosition) / deltaTime;
    const acceleration = 0; // Simplified

    this.lastTime = currentTime;

    return {
      timestamp: currentTime,
      sensorId: 'encoder_01',
      confidence: 0.95,
      noise: this.noiseStdDev,
      position: this.position,
      velocity,
      acceleration
    };
  }

  private generateGaussianNoise(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  getLinearDistance(): number {
    return this.position * this.wheelRadius;
  }

  reset(): void {
    this.position = 0;
    this.lastPosition = 0;
    this.lastTime = Date.now();
  }
}

// ============================================================================
// MULTI-SENSOR FUSION
// ============================================================================

export class SensorFusion {
  private sensors: Map<string, any> = new Map();
  private fusedState = {
    position: Vector2.zero(),
    velocity: Vector2.zero(),
    orientation: 0,
    confidence: 0
  };

  constructor() {}

  addSensor(sensorId: string, sensor: any): void {
    this.sensors.set(sensorId, sensor);
  }

  fuseReadings(readings: Map<string, SensorReading>): typeof this.fusedState {
    let totalWeight = 0;
    let weightedPosition = Vector2.zero();
    let weightedVelocity = Vector2.zero();
    const weightedOrientation = 0;

    readings.forEach((reading, sensorId) => {
      const weight = reading.confidence / (1 + reading.noise);
      
      // Extract position information based on sensor type
      if (reading.sensorId.includes('gps') && 'latitude' in reading) {
        const gpsReading = reading as GPSReading;
        const localPos = this.gpsToLocal(gpsReading);
        weightedPosition = weightedPosition.add(localPos.multiply(weight));
        totalWeight += weight;
      }
      
      if (reading.sensorId.includes('imu') && 'acceleration' in reading) {
        const imuReading = reading as IMUReading;
        // Integrate acceleration for velocity (simplified)
        const deltaV = imuReading.acceleration.multiply(0.01); // assume 10ms
        weightedVelocity = weightedVelocity.add(new Vector2(deltaV.x, deltaV.y).multiply(weight));
      }
    });

    if (totalWeight > 0) {
      this.fusedState.position = weightedPosition.multiply(1 / totalWeight);
      this.fusedState.confidence = Math.min(1, totalWeight / 3);
    }

    return { ...this.fusedState };
  }

  private gpsToLocal(gpsReading: GPSReading): Vector2 {
    // Simplified GPS to local coordinate conversion
    const metersPerDegree = 111320;
    const x = (gpsReading.longitude + 122.4194) * metersPerDegree * Math.cos(37.7749 * Math.PI / 180);
    const y = (gpsReading.latitude - 37.7749) * metersPerDegree;
    return new Vector2(x, y);
  }

  getFusedState(): typeof this.fusedState {
    return { ...this.fusedState };
  }
}

