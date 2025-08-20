/**
 * Comprehensive Robotics Math Utilities Library
 * 
 * This library provides fundamental mathematical operations and data structures
 * commonly used in robotics engineering, including:
 * - 3D transformations and coordinate systems
 * - Quaternion operations for rotation
 * - Kinematics calculations
 * - Control theory utilities
 * - Linear algebra operations
 * - Signal processing functions
 */

// ============================================================================
// VECTOR AND MATRIX OPERATIONS
// ============================================================================

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

export interface Matrix3x3 {
  data: number[][];
}

export interface Matrix4x4 {
  data: number[][];
}

export class Vector2 implements Vector2D {
  constructor(public x: number = 0, public y: number = 0) {}

  static zero(): Vector2 { return new Vector2(0, 0); }
  static one(): Vector2 { return new Vector2(1, 1); }
  static unitX(): Vector2 { return new Vector2(1, 0); }
  static unitY(): Vector2 { return new Vector2(0, 1); }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  normalize(): Vector2 {
    const mag = this.magnitude();
    return mag > 0 ? new Vector2(this.x / mag, this.y / mag) : Vector2.zero();
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector2): number {
    return this.x * other.y - this.y * other.x;
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  distanceTo(other: Vector2): number {
    return this.subtract(other).magnitude();
  }

  lerp(other: Vector2, t: number): Vector2 {
    return this.add(other.subtract(this).multiply(t));
  }
}

export class Vector3 implements Vector3D {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  static zero(): Vector3 { return new Vector3(0, 0, 0); }
  static one(): Vector3 { return new Vector3(1, 1, 1); }
  static unitX(): Vector3 { return new Vector3(1, 0, 0); }
  static unitY(): Vector3 { return new Vector3(0, 1, 0); }
  static unitZ(): Vector3 { return new Vector3(0, 0, 1); }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  normalize(): Vector3 {
    const mag = this.magnitude();
    return mag > 0 ? new Vector3(this.x / mag, this.y / mag, this.z / mag) : Vector3.zero();
  }

  dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other: Vector3): Vector3 {
    return new Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  multiply(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  distanceTo(other: Vector3): number {
    return this.subtract(other).magnitude();
  }

  lerp(other: Vector3, t: number): Vector3 {
    return this.add(other.subtract(this).multiply(t));
  }

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }
}

// ============================================================================
// QUATERNION OPERATIONS
// ============================================================================

export class Quat implements Quaternion {
  constructor(public w: number = 1, public x: number = 0, public y: number = 0, public z: number = 0) {}

  static identity(): Quat { return new Quat(1, 0, 0, 0); }

  static fromEuler(roll: number, pitch: number, yaw: number): Quat {
    const cr = Math.cos(roll * 0.5);
    const sr = Math.sin(roll * 0.5);
    const cp = Math.cos(pitch * 0.5);
    const sp = Math.sin(pitch * 0.5);
    const cy = Math.cos(yaw * 0.5);
    const sy = Math.sin(yaw * 0.5);

    return new Quat(
      cr * cp * cy + sr * sp * sy,
      sr * cp * cy - cr * sp * sy,
      cr * sp * cy + sr * cp * sy,
      cr * cp * sy - sr * sp * cy
    );
  }

  static fromAxisAngle(axis: Vector3, angle: number): Quat {
    const halfAngle = angle * 0.5;
    const sin = Math.sin(halfAngle);
    const normalizedAxis = axis.normalize();
    
    return new Quat(
      Math.cos(halfAngle),
      normalizedAxis.x * sin,
      normalizedAxis.y * sin,
      normalizedAxis.z * sin
    );
  }

  magnitude(): number {
    return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Quat {
    const mag = this.magnitude();
    return mag > 0 ? new Quat(this.w / mag, this.x / mag, this.y / mag, this.z / mag) : Quat.identity();
  }

  conjugate(): Quat {
    return new Quat(this.w, -this.x, -this.y, -this.z);
  }

  multiply(other: Quat): Quat {
    return new Quat(
      this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
      this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
      this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
      this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w
    );
  }

  rotateVector(vector: Vector3): Vector3 {
    const qv = new Quat(0, vector.x, vector.y, vector.z);
    const result = this.multiply(qv).multiply(this.conjugate());
    return new Vector3(result.x, result.y, result.z);
  }

  toEuler(): { roll: number; pitch: number; yaw: number } {
    // Roll (x-axis rotation)
    const sinr_cosp = 2 * (this.w * this.x + this.y * this.z);
    const cosr_cosp = 1 - 2 * (this.x * this.x + this.y * this.y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);

    // Pitch (y-axis rotation)
    const sinp = 2 * (this.w * this.y - this.z * this.x);
    const pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp);

    // Yaw (z-axis rotation)
    const siny_cosp = 2 * (this.w * this.z + this.x * this.y);
    const cosy_cosp = 1 - 2 * (this.y * this.y + this.z * this.z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);

    return { roll, pitch, yaw };
  }

  slerp(other: Quat, t: number): Quat {
    let dot = this.w * other.w + this.x * other.x + this.y * other.y + this.z * other.z;
    
    // If the dot product is negative, slerp won't take the shorter path
    let q2 = other;
    if (dot < 0) {
      q2 = new Quat(-other.w, -other.x, -other.y, -other.z);
      dot = -dot;
    }

    if (dot > 0.9995) {
      // Linear interpolation for very close quaternions
      const result = new Quat(
        this.w + t * (q2.w - this.w),
        this.x + t * (q2.x - this.x),
        this.y + t * (q2.y - this.y),
        this.z + t * (q2.z - this.z)
      );
      return result.normalize();
    }

    const theta0 = Math.acos(Math.abs(dot));
    const theta = theta0 * t;
    const sinTheta = Math.sin(theta);
    const sinTheta0 = Math.sin(theta0);

    const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
    const s1 = sinTheta / sinTheta0;

    return new Quat(
      s0 * this.w + s1 * q2.w,
      s0 * this.x + s1 * q2.x,
      s0 * this.y + s1 * q2.y,
      s0 * this.z + s1 * q2.z
    );
  }
}

// ============================================================================
// TRANSFORMATION MATRICES
// ============================================================================

export class Transform3D {
  constructor(public position: Vector3 = Vector3.zero(), public rotation: Quat = Quat.identity()) {}

  static identity(): Transform3D {
    return new Transform3D(Vector3.zero(), Quat.identity());
  }

  static fromMatrix(matrix: Matrix4x4): Transform3D {
    const position = new Vector3(matrix.data[0][3], matrix.data[1][3], matrix.data[2][3]);
    
    // Extract rotation matrix
    const m11 = matrix.data[0][0]; const m12 = matrix.data[0][1]; const m13 = matrix.data[0][2];
    const m21 = matrix.data[1][0]; const m22 = matrix.data[1][1]; const m23 = matrix.data[1][2];
    const m31 = matrix.data[2][0]; const m32 = matrix.data[2][1]; const m33 = matrix.data[2][2];

    // Convert rotation matrix to quaternion
    const trace = m11 + m22 + m33;
    let w, x, y, z;

    if (trace > 0) {
      const s = Math.sqrt(trace + 1.0) * 2;
      w = 0.25 * s;
      x = (m32 - m23) / s;
      y = (m13 - m31) / s;
      z = (m21 - m12) / s;
    } else if (m11 > m22 && m11 > m33) {
      const s = Math.sqrt(1.0 + m11 - m22 - m33) * 2;
      w = (m32 - m23) / s;
      x = 0.25 * s;
      y = (m12 + m21) / s;
      z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = Math.sqrt(1.0 + m22 - m11 - m33) * 2;
      w = (m13 - m31) / s;
      x = (m12 + m21) / s;
      y = 0.25 * s;
      z = (m23 + m32) / s;
    } else {
      const s = Math.sqrt(1.0 + m33 - m11 - m22) * 2;
      w = (m21 - m12) / s;
      x = (m13 + m31) / s;
      y = (m23 + m32) / s;
      z = 0.25 * s;
    }

    const rotation = new Quat(w, x, y, z);
    return new Transform3D(position, rotation);
  }

  toMatrix(): Matrix4x4 {
    const q = this.rotation.normalize();
    const x2 = q.x + q.x; const y2 = q.y + q.y; const z2 = q.z + q.z;
    const xx = q.x * x2; const xy = q.x * y2; const xz = q.x * z2;
    const yy = q.y * y2; const yz = q.y * z2; const zz = q.z * z2;
    const wx = q.w * x2; const wy = q.w * y2; const wz = q.w * z2;

    return {
      data: [
        [1 - (yy + zz), xy - wz, xz + wy, this.position.x],
        [xy + wz, 1 - (xx + zz), yz - wx, this.position.y],
        [xz - wy, yz + wx, 1 - (xx + yy), this.position.z],
        [0, 0, 0, 1]
      ]
    };
  }

  transformPoint(point: Vector3): Vector3 {
    const rotated = this.rotation.rotateVector(point);
    return rotated.add(this.position);
  }

  transformDirection(direction: Vector3): Vector3 {
    return this.rotation.rotateVector(direction);
  }

  inverse(): Transform3D {
    const invRotation = this.rotation.conjugate();
    const invPosition = invRotation.rotateVector(this.position.multiply(-1));
    return new Transform3D(invPosition, invRotation);
  }

  multiply(other: Transform3D): Transform3D {
    const newRotation = this.rotation.multiply(other.rotation);
    const newPosition = this.transformPoint(other.position);
    return new Transform3D(newPosition, newRotation);
  }

  interpolate(other: Transform3D, t: number): Transform3D {
    const newPosition = this.position.lerp(other.position, t);
    const newRotation = this.rotation.slerp(other.rotation, t);
    return new Transform3D(newPosition, newRotation);
  }
}

// ============================================================================
// ROBOTICS KINEMATICS
// ============================================================================

export interface DHParameter {
  a: number;      // Link length
  alpha: number;  // Link twist
  d: number;      // Link offset
  theta: number;  // Joint angle
}

export interface JointLimits {
  min: number;
  max: number;
  velocity: number;
  acceleration: number;
}

export class ForwardKinematics {
  static dhTransform(dh: DHParameter): Matrix4x4 {
    const cosTheta = Math.cos(dh.theta);
    const sinTheta = Math.sin(dh.theta);
    const cosAlpha = Math.cos(dh.alpha);
    const sinAlpha = Math.sin(dh.alpha);

    return {
      data: [
        [cosTheta, -sinTheta * cosAlpha, sinTheta * sinAlpha, dh.a * cosTheta],
        [sinTheta, cosTheta * cosAlpha, -cosTheta * sinAlpha, dh.a * sinTheta],
        [0, sinAlpha, cosAlpha, dh.d],
        [0, 0, 0, 1]
      ]
    };
  }

  static calculateEndEffector(dhParams: DHParameter[]): Transform3D {
    let result: Matrix4x4 = {
      data: [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]
    };

    for (const dh of dhParams) {
      const transform = this.dhTransform(dh);
      result = this.multiplyMatrices(result, transform);
    }

    return Transform3D.fromMatrix(result);
  }

  private static multiplyMatrices(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
    const result: Matrix4x4 = { data: Array(4).fill(0).map(() => Array(4).fill(0)) };
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          result.data[i][j] += a.data[i][k] * b.data[k][j];
        }
      }
    }
    
    return result;
  }
}

export class InverseKinematics {
  static iterativeIK(
    target: Transform3D,
    currentJoints: number[],
    dhParams: DHParameter[],
    tolerance: number = 0.001,
    maxIterations: number = 100
  ): { joints: number[]; converged: boolean; error: number } {
    const joints = [...currentJoints];
    let iteration = 0;
    let error = Infinity;

    while (iteration < maxIterations && error > tolerance) {
      // Update DH parameters with current joint angles
      const currentDH = dhParams.map((dh, i) => ({ ...dh, theta: joints[i] }));
      
      // Calculate current end effector pose
      const currentPose = ForwardKinematics.calculateEndEffector(currentDH);
      
      // Calculate position error
      const positionError = target.position.subtract(currentPose.position);
      error = positionError.magnitude();

      if (error <= tolerance) break;

      // Calculate Jacobian numerically
      const jacobian = this.calculateJacobian(currentDH, dhParams);
      
      // Pseudo-inverse method for joint updates
      const deltaJoints = this.pseudoInverse(jacobian, positionError);
      
      // Update joints with damping
      const damping = 0.1;
      for (let i = 0; i < joints.length; i++) {
        joints[i] += deltaJoints[i] * damping;
      }

      iteration++;
    }

    return {
      joints,
      converged: error <= tolerance,
      error
    };
  }

  private static calculateJacobian(currentDH: DHParameter[], originalDH: DHParameter[]): number[][] {
    const epsilon = 0.001;
    const jacobian: number[][] = [];
    
    // Get current end effector position
    const currentPose = ForwardKinematics.calculateEndEffector(currentDH);
    
    for (let i = 0; i < currentDH.length; i++) {
      // Perturb joint i
      const perturbedDH = currentDH.map((dh, j) => 
        j === i ? { ...dh, theta: dh.theta + epsilon } : dh
      );
      
      const perturbedPose = ForwardKinematics.calculateEndEffector(perturbedDH);
      
      // Calculate partial derivatives
      const dx = (perturbedPose.position.x - currentPose.position.x) / epsilon;
      const dy = (perturbedPose.position.y - currentPose.position.y) / epsilon;
      const dz = (perturbedPose.position.z - currentPose.position.z) / epsilon;
      
      jacobian.push([dx, dy, dz]);
    }
    
    return jacobian;
  }

  private static pseudoInverse(jacobian: number[][], error: Vector3): number[] {
    // Simplified pseudo-inverse calculation
    const jT = this.transpose(jacobian);
    const jTj = this.multiplyMatrixVector(jT, jacobian);
    
    // Simple damped least squares
    const damping = 0.01;
    for (let i = 0; i < jTj.length; i++) {
      jTj[i][i] += damping;
    }
    
    const inv = this.invertMatrix(jTj);
    const jTe = this.multiplyMatrixVector(jT, [error.x, error.y, error.z]);
    
    return this.multiplyMatrixVector(inv, jTe);
  }

  private static transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  }

  private static multiplyMatrixVector(matrix: number[][], vector: number[] | number[][]): number[] {
    if (Array.isArray(vector[0])) {
      // Matrix multiplication
      const b = vector as number[][];
      const result: number[][] = Array(matrix.length).fill(0).map(() => Array(b[0].length).fill(0));
      
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < b[0].length; j++) {
          for (let k = 0; k < b.length; k++) {
            result[i][j] += matrix[i][k] * b[k][j];
          }
        }
      }
      
      return result.flat();
    } else {
      // Matrix-vector multiplication
      const v = vector as number[];
      return matrix.map(row => row.reduce((sum, val, i) => sum + val * v[i], 0));
    }
  }

  private static invertMatrix(matrix: number[][]): number[][] {
    const n = matrix.length;
    const identity = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));
    const augmented = matrix.map((row, i) => [...row, ...identity[i]]);

    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }

    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i - 1; k >= 0; k--) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= augmented[i][i];
      }
    }

    return augmented.map(row => row.slice(n));
  }
}

// ============================================================================
// CONTROL THEORY
// ============================================================================

export class PIDController {
  private integralError = 0;
  private previousError = 0;
  private lastTime = 0;

  constructor(
    private kp: number,
    private ki: number,
    private kd: number,
    private maxIntegral: number = Infinity,
    private maxOutput: number = Infinity
  ) {}

  update(setpoint: number, processVariable: number, deltaTime?: number): number {
    const currentTime = deltaTime ? deltaTime : Date.now() / 1000;
    const dt = this.lastTime === 0 ? 0.001 : currentTime - this.lastTime;
    
    const error = setpoint - processVariable;
    
    // Proportional term
    const proportional = this.kp * error;
    
    // Integral term with windup protection
    this.integralError += error * dt;
    this.integralError = Math.max(-this.maxIntegral, Math.min(this.maxIntegral, this.integralError));
    const integral = this.ki * this.integralError;
    
    // Derivative term
    const derivative = dt > 0 ? this.kd * (error - this.previousError) / dt : 0;
    
    // Total output
    let output = proportional + integral + derivative;
    output = Math.max(-this.maxOutput, Math.min(this.maxOutput, output));
    
    // Store values for next iteration
    this.previousError = error;
    this.lastTime = currentTime;
    
    return output;
  }

  reset(): void {
    this.integralError = 0;
    this.previousError = 0;
    this.lastTime = 0;
  }

  setGains(kp: number, ki: number, kd: number): void {
    this.kp = kp;
    this.ki = ki;
    this.kd = kd;
  }
}

export class StateSpaceController {
  constructor(
    private A: number[][],  // State matrix
    private B: number[][],  // Input matrix
    private C: number[][],  // Output matrix
    private K: number[][]   // Feedback gain matrix
  ) {}

  update(state: number[], reference: number[]): number[] {
    const error = reference.map((ref, i) => ref - state[i]);
    return this.multiplyMatrixVector(this.K, error);
  }

  private multiplyMatrixVector(matrix: number[][], vector: number[]): number[] {
    return matrix.map(row => row.reduce((sum, val, i) => sum + val * vector[i], 0));
  }
}

// ============================================================================
// SIGNAL PROCESSING
// ============================================================================

export class KalmanFilter {
  constructor(
    private x: number[],      // Initial state
    private P: number[][],    // Initial covariance
    private F: number[][],    // State transition matrix
    private H: number[][],    // Observation matrix
    private Q: number[][],    // Process noise covariance
    private R: number[][]     // Measurement noise covariance
  ) {}

  predict(): void {
    // State prediction: x = F * x
    this.x = this.multiplyMatrixVector(this.F, this.x);
    
    // Covariance prediction: P = F * P * F^T + Q
    const FP = this.multiplyMatrices(this.F, this.P);
    const FPFt = this.multiplyMatrices(FP, this.transpose(this.F));
    this.P = this.addMatrices(FPFt, this.Q);
  }

  update(measurement: number[]): void {
    // Innovation: y = z - H * x
    const Hx = this.multiplyMatrixVector(this.H, this.x);
    const y = measurement.map((z, i) => z - Hx[i]);
    
    // Innovation covariance: S = H * P * H^T + R
    const HP = this.multiplyMatrices(this.H, this.P);
    const HPHt = this.multiplyMatrices(HP, this.transpose(this.H));
    const S = this.addMatrices(HPHt, this.R);
    
    // Kalman gain: K = P * H^T * S^-1
    const PHt = this.multiplyMatrices(this.P, this.transpose(this.H));
    const Sinv = this.invertMatrix(S);
    const K = this.multiplyMatrices(PHt, Sinv);
    
    // State update: x = x + K * y
    const Ky = this.multiplyMatrixVector(K, y);
    this.x = this.x.map((xi, i) => xi + Ky[i]);
    
    // Covariance update: P = (I - K * H) * P
    const KH = this.multiplyMatrices(K, this.H);
    const I_KH = this.subtractMatrices(this.identityMatrix(this.x.length), KH);
    this.P = this.multiplyMatrices(I_KH, this.P);
  }

  getState(): number[] {
    return [...this.x];
  }

  getCovariance(): number[][] {
    return this.P.map(row => [...row]);
  }

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
    // Simple 2x2 matrix inversion for basic usage
    if (matrix.length === 2 && matrix[0].length === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det]
      ];
    }
    
    // For larger matrices, use numerical methods (simplified version)
    const n = matrix.length;
    const identity = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));
    const augmented = matrix.map((row, i) => [...row, ...identity[i]]);

    // Gaussian elimination with partial pivoting
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      const pivot = augmented[i][i];
      if (Math.abs(pivot) < 1e-10) continue; // Skip if matrix is singular

      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    return augmented.map(row => row.slice(n));
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export class RoboticsUtils {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  static mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  static wrapAngle(angle: number): number {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }

  static shortestAngularDistance(from: number, to: number): number {
    const diff = this.wrapAngle(to - from);
    return diff;
  }

  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  static smoothStep(t: number): number {
    return t * t * (3 - 2 * t);
  }

  static smootherStep(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  static deadzone(value: number, threshold: number): number {
    return Math.abs(value) < threshold ? 0 : value;
  }

  static exponentialMovingAverage(current: number, previous: number, alpha: number): number {
    return alpha * current + (1 - alpha) * previous;
  }

  static generateTrajectory(
    start: Vector3,
    end: Vector3,
    duration: number,
    maxVelocity: number,
    maxAcceleration: number
  ): { position: Vector3; velocity: Vector3; acceleration: Vector3 }[] {
    const trajectory: { position: Vector3; velocity: Vector3; acceleration: Vector3 }[] = [];
    const steps = Math.ceil(duration * 60); // 60 Hz
    const dt = duration / steps;
    
    const distance = start.distanceTo(end);
    const direction = end.subtract(start).normalize();
    
    // Trapezoidal velocity profile
    const accelTime = Math.min(duration / 3, maxVelocity / maxAcceleration);
    const decelTime = accelTime;
    const constTime = duration - accelTime - decelTime;
    
    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      let s = 0; // Position along trajectory
      let v = 0; // Velocity along trajectory
      let a = 0; // Acceleration along trajectory
      
      if (t <= accelTime) {
        // Acceleration phase
        a = maxAcceleration;
        v = a * t;
        s = 0.5 * a * t * t;
      } else if (t <= accelTime + constTime) {
        // Constant velocity phase
        a = 0;
        v = maxVelocity;
        s = 0.5 * maxAcceleration * accelTime * accelTime + v * (t - accelTime);
      } else {
        // Deceleration phase
        const tDecel = t - accelTime - constTime;
        a = -maxAcceleration;
        v = maxVelocity + a * tDecel;
        s = 0.5 * maxAcceleration * accelTime * accelTime + 
            maxVelocity * constTime + 
            maxVelocity * tDecel + 0.5 * a * tDecel * tDecel;
      }
      
      // Scale to actual distance
      const sNormalized = (s / (distance || 1)) * distance;
      
      trajectory.push({
        position: start.add(direction.multiply(sNormalized)),
        velocity: direction.multiply(v),
        acceleration: direction.multiply(a)
      });
    }
    
    return trajectory;
  }
}

