"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Vector2, Vector3, Quat, Transform3D, DHParameter, ForwardKinematics, InverseKinematics } from '@/lib/robotics/math';

interface CalculatorProps {
  type: 'kinematics' | 'transforms' | 'trajectories' | 'pid' | 'sensors';
}

export default function RoboticsCalculator({ type }: CalculatorProps) {
  const [activeTab, setActiveTab] = useState(0);
  
  const calculators = [
    { id: 'kinematics', name: 'Forward/Inverse Kinematics', component: KinematicsCalculator },
    { id: 'transforms', name: '3D Transformations', component: TransformCalculator },
    { id: 'trajectories', name: 'Trajectory Planning', component: TrajectoryCalculator },
    { id: 'pid', name: 'PID Tuning', component: PIDCalculator },
    { id: 'sensors', name: 'Sensor Fusion', component: SensorCalculator }
  ];

  const ActiveCalculator = calculators[activeTab].component;

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Robotics Calculators</h2>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {calculators.map((calc, index) => (
          <button
            key={calc.id}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
              activeTab === index
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground hover:border-gray-300'
            }`}
          >
            {calc.name}
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ActiveCalculator />
      </motion.div>
    </div>
  );
}

// Forward/Inverse Kinematics Calculator
function KinematicsCalculator() {
  const [mode, setMode] = useState<'forward' | 'inverse'>('forward');
  const [dhParams, setDhParams] = useState<DHParameter[]>([
    { a: 0, alpha: 0, d: 400, theta: 0 },
    { a: 350, alpha: 0, d: 0, theta: 0 },
    { a: 50, alpha: Math.PI/2, d: 0, theta: 0 },
  ]);
  const [result, setResult] = useState<Transform3D | null>(null);
  const [targetPose, setTargetPose] = useState({ x: 300, y: 0, z: 200 });

  const calculateForwardKinematics = () => {
    const endEffector = ForwardKinematics.calculateEndEffector(dhParams);
    setResult(endEffector);
  };

  const calculateInverseKinematics = () => {
    const target = new Transform3D(
      new Vector3(targetPose.x, targetPose.y, targetPose.z),
      Quat.identity()
    );
    
    const currentJoints = dhParams.map(dh => dh.theta);
    const ikResult = InverseKinematics.iterativeIK(target, currentJoints, dhParams);
    
    if (ikResult.converged) {
      const updatedDH = dhParams.map((dh, i) => ({ ...dh, theta: ikResult.joints[i] }));
      setDhParams(updatedDH);
      setResult(ForwardKinematics.calculateEndEffector(updatedDH));
    }
  };

  useEffect(() => {
    if (mode === 'forward') {
      calculateForwardKinematics();
    }
  }, [dhParams, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setMode('forward')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            mode === 'forward' ? 'bg-brand-primary text-white' : 'bg-background text-foreground border'
          }`}
        >
          Forward Kinematics
        </button>
        <button
          onClick={() => setMode('inverse')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            mode === 'inverse' ? 'bg-brand-primary text-white' : 'bg-background text-foreground border'
          }`}
        >
          Inverse Kinematics
        </button>
      </div>

      {/* DH Parameters Input */}
      <div>
        <h3 className="text-lg font-semibold mb-3">DH Parameters</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Joint</th>
                <th className="text-left p-2">a (mm)</th>
                <th className="text-left p-2">α (deg)</th>
                <th className="text-left p-2">d (mm)</th>
                <th className="text-left p-2">θ (deg)</th>
              </tr>
            </thead>
            <tbody>
              {dhParams.map((dh, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={dh.a}
                      onChange={(e) => {
                        const newParams = [...dhParams];
                        newParams[i].a = parseFloat(e.target.value) || 0;
                        setDhParams(newParams);
                      }}
                      className="w-20 px-2 py-1 border rounded text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={(dh.alpha * 180 / Math.PI).toFixed(1)}
                      onChange={(e) => {
                        const newParams = [...dhParams];
                        newParams[i].alpha = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                        setDhParams(newParams);
                      }}
                      className="w-20 px-2 py-1 border rounded text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={dh.d}
                      onChange={(e) => {
                        const newParams = [...dhParams];
                        newParams[i].d = parseFloat(e.target.value) || 0;
                        setDhParams(newParams);
                      }}
                      className="w-20 px-2 py-1 border rounded text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={(dh.theta * 180 / Math.PI).toFixed(1)}
                      onChange={(e) => {
                        const newParams = [...dhParams];
                        newParams[i].theta = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                        setDhParams(newParams);
                      }}
                      className="w-20 px-2 py-1 border rounded text-xs"
                      disabled={mode === 'inverse'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inverse Kinematics Target */}
      {mode === 'inverse' && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Target Position</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">X (mm)</label>
              <input
                type="number"
                value={targetPose.x}
                onChange={(e) => setTargetPose({...targetPose, x: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y (mm)</label>
              <input
                type="number"
                value={targetPose.y}
                onChange={(e) => setTargetPose({...targetPose, y: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Z (mm)</label>
              <input
                type="number"
                value={targetPose.z}
                onChange={(e) => setTargetPose({...targetPose, z: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <button
            onClick={calculateInverseKinematics}
            className="mt-4 px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-primary/90"
          >
            Calculate IK
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-background rounded p-4">
          <h3 className="text-lg font-semibold mb-3">End Effector Position</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">X:</span> {result.position.x.toFixed(2)} mm
            </div>
            <div>
              <span className="font-medium">Y:</span> {result.position.y.toFixed(2)} mm
            </div>
            <div>
              <span className="font-medium">Z:</span> {result.position.z.toFixed(2)} mm
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Reach:</span> {result.position.magnitude().toFixed(2)} mm
          </div>
        </div>
      )}
    </div>
  );
}

// 3D Transformation Calculator
function TransformCalculator() {
  const [translation, setTranslation] = useState({ x: 100, y: 50, z: 25 });
  const [rotation, setRotation] = useState({ roll: 0, pitch: 0, yaw: 45 });
  const [point, setPoint] = useState({ x: 10, y: 20, z: 30 });
  const [result, setResult] = useState<Vector3 | null>(null);

  const calculateTransform = () => {
    const quat = Quat.fromEuler(
      rotation.roll * Math.PI / 180,
      rotation.pitch * Math.PI / 180,
      rotation.yaw * Math.PI / 180
    );
    
    const transform = new Transform3D(
      new Vector3(translation.x, translation.y, translation.z),
      quat
    );
    
    const inputPoint = new Vector3(point.x, point.y, point.z);
    const transformedPoint = transform.transformPoint(inputPoint);
    setResult(transformedPoint);
  };

  useEffect(() => {
    calculateTransform();
  }, [translation, rotation, point]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Translation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Translation (mm)</h3>
          <div className="space-y-3">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={axis}>
                <label className="block text-sm font-medium mb-1 capitalize">{axis}</label>
                <input
                  type="number"
                  value={translation[axis]}
                  onChange={(e) => setTranslation({
                    ...translation,
                    [axis]: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Rotation (degrees)</h3>
          <div className="space-y-3">
            {(['roll', 'pitch', 'yaw'] as const).map((axis) => (
              <div key={axis}>
                <label className="block text-sm font-medium mb-1 capitalize">{axis}</label>
                <input
                  type="number"
                  value={rotation[axis]}
                  onChange={(e) => setRotation({
                    ...rotation,
                    [axis]: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Point */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Input Point (mm)</h3>
        <div className="grid grid-cols-3 gap-4">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis}>
              <label className="block text-sm font-medium mb-1 capitalize">{axis}</label>
              <input
                type="number"
                value={point[axis]}
                onChange={(e) => setPoint({
                  ...point,
                  [axis]: parseFloat(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-background rounded p-4">
          <h3 className="text-lg font-semibold mb-3">Transformed Point</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="font-medium">X:</span> {result.x.toFixed(3)} mm</div>
            <div><span className="font-medium">Y:</span> {result.y.toFixed(3)} mm</div>
            <div><span className="font-medium">Z:</span> {result.z.toFixed(3)} mm</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Trajectory Planning Calculator
function TrajectoryCalculator() {
  const [start, setStart] = useState({ x: 0, y: 0, z: 0 });
  const [end, setEnd] = useState({ x: 100, y: 100, z: 50 });
  const [constraints, setConstraints] = useState({ 
    maxVel: 50, 
    maxAccel: 20, 
    duration: 3.0 
  });
  const [trajectory, setTrajectory] = useState<any[]>([]);

  const generateTrajectory = () => {
    const startVec = new Vector3(start.x, start.y, start.z);
    const endVec = new Vector3(end.x, end.y, end.z);
    
    // Generate quintic polynomial trajectory
    const points = [];
    const steps = 50;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const s = 10 * t**3 - 15 * t**4 + 6 * t**5; // Quintic polynomial
      const position = startVec.lerp(endVec, s);
      
      // Calculate velocity and acceleration profiles
      const ds_dt = (30 * t**2 - 60 * t**3 + 30 * t**4) / constraints.duration;
      const d2s_dt2 = (60 * t - 180 * t**2 + 120 * t**3) / (constraints.duration**2);
      
      const direction = endVec.subtract(startVec).normalize();
      const distance = startVec.distanceTo(endVec);
      
      points.push({
        time: t * constraints.duration,
        position,
        velocity: direction.multiply(ds_dt * distance),
        acceleration: direction.multiply(d2s_dt2 * distance)
      });
    }
    
    setTrajectory(points);
  };

  useEffect(() => {
    generateTrajectory();
  }, [start, end, constraints]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Position */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Start Position (mm)</h3>
          <div className="space-y-2">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={axis} className="flex items-center space-x-2">
                <label className="w-4 text-sm font-medium capitalize">{axis}:</label>
                <input
                  type="number"
                  value={start[axis]}
                  onChange={(e) => setStart({
                    ...start,
                    [axis]: parseFloat(e.target.value) || 0
                  })}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* End Position */}
        <div>
          <h3 className="text-lg font-semibold mb-3">End Position (mm)</h3>
          <div className="space-y-2">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={axis} className="flex items-center space-x-2">
                <label className="w-4 text-sm font-medium capitalize">{axis}:</label>
                <input
                  type="number"
                  value={end[axis]}
                  onChange={(e) => setEnd({
                    ...end,
                    [axis]: parseFloat(e.target.value) || 0
                  })}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Constraints */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Motion Constraints</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Max Velocity (mm/s)</label>
            <input
              type="number"
              value={constraints.maxVel}
              onChange={(e) => setConstraints({
                ...constraints,
                maxVel: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Acceleration (mm/s²)</label>
            <input
              type="number"
              value={constraints.maxAccel}
              onChange={(e) => setConstraints({
                ...constraints,
                maxAccel: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (s)</label>
            <input
              type="number"
              step="0.1"
              value={constraints.duration}
              onChange={(e) => setConstraints({
                ...constraints,
                duration: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Trajectory Visualization */}
      {trajectory.length > 0 && (
        <div className="bg-background rounded p-4">
          <h3 className="text-lg font-semibold mb-3">Trajectory Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Distance: {
                new Vector3(start.x, start.y, start.z)
                  .distanceTo(new Vector3(end.x, end.y, end.z))
                  .toFixed(2)
              } mm</div>
              <div className="text-sm">Peak Velocity: {
                Math.max(...trajectory.map(p => p.velocity.magnitude())).toFixed(2)
              } mm/s</div>
            </div>
            <div>
              <div className="text-sm">Peak Acceleration: {
                Math.max(...trajectory.map(p => p.acceleration.magnitude())).toFixed(2)
              } mm/s²</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PID Tuning Calculator
function PIDCalculator() {
  const [gains, setGains] = useState({ kp: 1.0, ki: 0.1, kd: 0.05 });
  const [setpoint, setSetpoint] = useState(100);
  const [simulation, setSimulation] = useState<any[]>([]);
  const [systemParams, setSystemParams] = useState({ 
    inertia: 1.0, 
    damping: 0.1, 
    disturbance: 0 
  });

  const runSimulation = () => {
    const dt = 0.01;
    const duration = 5.0;
    const steps = Math.floor(duration / dt);
    
    let position = 0;
    let velocity = 0;
    let error = 0;
    let integral = 0;
    let previousError = 0;
    
    const data = [];
    
    for (let i = 0; i < steps; i++) {
      const time = i * dt;
      error = setpoint - position;
      integral += error * dt;
      const derivative = (error - previousError) / dt;
      
      const pidOutput = gains.kp * error + gains.ki * integral + gains.kd * derivative;
      
      // Simple second-order system simulation
      const force = pidOutput + systemParams.disturbance * Math.sin(time * 2);
      const acceleration = (force - systemParams.damping * velocity) / systemParams.inertia;
      
      velocity += acceleration * dt;
      position += velocity * dt;
      
      previousError = error;
      
      if (i % 10 === 0) { // Sample every 10 steps for visualization
        data.push({
          time,
          position,
          setpoint,
          error: Math.abs(error),
          output: pidOutput
        });
      }
    }
    
    setSimulation(data);
  };

  useEffect(() => {
    runSimulation();
  }, [gains, setpoint, systemParams]);

  const settlingTime = simulation.find(point => 
    point.time > 0.5 && Math.abs(point.error) < setpoint * 0.02
  )?.time || '> 5.0';

  const overshoot = Math.max(...simulation.map(p => p.position)) - setpoint;
  const overshootPercent = setpoint > 0 ? (overshoot / setpoint) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PID Gains */}
        <div>
          <h3 className="text-lg font-semibold mb-3">PID Gains</h3>
          <div className="space-y-3">
            {(['kp', 'ki', 'kd'] as const).map((gain) => (
              <div key={gain}>
                <label className="block text-sm font-medium mb-1 uppercase">{gain}</label>
                <input
                  type="number"
                  step="0.01"
                  value={gains[gain]}
                  onChange={(e) => setGains({
                    ...gains,
                    [gain]: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* System Parameters */}
        <div>
          <h3 className="text-lg font-semibold mb-3">System Parameters</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Setpoint</label>
              <input
                type="number"
                value={setpoint}
                onChange={(e) => setSetpoint(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Inertia</label>
              <input
                type="number"
                step="0.1"
                value={systemParams.inertia}
                onChange={(e) => setSystemParams({
                  ...systemParams,
                  inertia: parseFloat(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Damping</label>
              <input
                type="number"
                step="0.01"
                value={systemParams.damping}
                onChange={(e) => setSystemParams({
                  ...systemParams,
                  damping: parseFloat(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-background rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Settling Time:</span>
            <div className="text-brand-primary">{
              typeof settlingTime === 'number' ? settlingTime.toFixed(2) : settlingTime
            } s</div>
          </div>
          <div>
            <span className="font-medium">Overshoot:</span>
            <div className="text-brand-primary">{overshootPercent.toFixed(1)}%</div>
          </div>
          <div>
            <span className="font-medium">Steady State Error:</span>
            <div className="text-brand-primary">{
              simulation.length > 0 ? simulation[simulation.length - 1].error.toFixed(2) : 0
            }</div>
          </div>
          <div>
            <span className="font-medium">Rise Time:</span>
            <div className="text-brand-primary">{
              simulation.find(p => p.position >= setpoint * 0.9)?.time.toFixed(2) || 'N/A'
            } s</div>
          </div>
        </div>
      </div>

      {/* Tuning Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">PID Tuning Guidelines</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <div><strong>Kp:</strong> Reduces rise time but increases overshoot and settling time</div>
          <div><strong>Ki:</strong> Eliminates steady-state error but can cause instability</div>
          <div><strong>Kd:</strong> Reduces overshoot and settling time but sensitive to noise</div>
        </div>
      </div>
    </div>
  );
}

// Sensor Fusion Calculator
function SensorCalculator() {
  const [sensorData, setSensorData] = useState({
    gps: { x: 100.5, y: 200.3, accuracy: 3.0 },
    imu: { vx: 1.2, vy: 0.8, bias: 0.05 },
    encoder: { distance: 150.2, resolution: 1024 }
  });
  
  const [fusionResult, setFusionResult] = useState({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    confidence: 0
  });

  const calculateFusion = () => {
    // Simplified sensor fusion using weighted average
    const gpsWeight = 1.0 / (sensorData.gps.accuracy * sensorData.gps.accuracy);
    const imuWeight = 1.0 / (sensorData.imu.bias * sensorData.imu.bias);
    const encoderWeight = 0.5; // Fixed weight for encoder
    
    const totalWeight = gpsWeight + encoderWeight;
    
    // Fuse position estimates
    const fusedX = (sensorData.gps.x * gpsWeight + sensorData.encoder.distance * encoderWeight) / totalWeight;
    const fusedY = (sensorData.gps.y * gpsWeight) / gpsWeight; // GPS only for Y
    
    // Use IMU for velocity
    const fusedVx = sensorData.imu.vx;
    const fusedVy = sensorData.imu.vy;
    
    // Calculate confidence based on sensor agreement
    const confidence = Math.min(1.0, gpsWeight / (gpsWeight + 1.0));
    
    setFusionResult({
      position: { x: fusedX, y: fusedY },
      velocity: { x: fusedVx, y: fusedVy },
      confidence
    });
  };

  useEffect(() => {
    calculateFusion();
  }, [sensorData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GPS Data */}
        <div>
          <h3 className="text-lg font-semibold mb-3">GPS Sensor</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">X Position (m)</label>
              <input
                type="number"
                step="0.1"
                value={sensorData.gps.x}
                onChange={(e) => setSensorData({
                  ...sensorData,
                  gps: { ...sensorData.gps, x: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y Position (m)</label>
              <input
                type="number"
                step="0.1"
                value={sensorData.gps.y}
                onChange={(e) => setSensorData({
                  ...sensorData,
                  gps: { ...sensorData.gps, y: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Accuracy (m)</label>
              <input
                type="number"
                step="0.1"
                value={sensorData.gps.accuracy}
                onChange={(e) => setSensorData({
                  ...sensorData,
                  gps: { ...sensorData.gps, accuracy: parseFloat(e.target.value) || 0.1 }
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* IMU Data */}
        <div>
          <h3 className="text-lg font-semibold mb-3">IMU Sensor</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">X Velocity (m/s)</label>
              <input
                type="number"
                step="0.1"
                value={sensorData.imu.vx}
                onChange={(e) => setSensorData({
                  ...sensorData,
                  imu: { ...sensorData.imu, vx: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y Velocity (m/s)</label>
              <input
                type="number"
                step="0.1"
                value={sensorData.imu.vy}
                onChange={(e) => setSensorData({
                  ...sensorData,
                  imu: { ...sensorData.imu, vy: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bias (m/s²)</label>
              <input
                type="number"
                step="0.01"
                value={sensorData.imu.bias}
                onChange={(e) => setSensorData({
                  ...sensorData,
                  imu: { ...sensorData.imu, bias: parseFloat(e.target.value) || 0.01 }
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Encoder Data */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Wheel Encoder</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Distance (m)</label>
              <input
                type="number"
                step="0.1"
                value={sensorData.encoder.distance}
                onChange={(e) => setSensorData({
                  ...sensorData,
                  encoder: { ...sensorData.encoder, distance: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Resolution (counts/rev)</label>
              <input
                type="number"
                value={sensorData.encoder.resolution}
                onChange={(e) => setSensorData({
                  ...sensorData,
                  encoder: { ...sensorData.encoder, resolution: parseInt(e.target.value) || 1024 }
                })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fusion Results */}
      <div className="bg-background rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Fused Estimate</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-medium">Position</div>
            <div className="text-brand-primary">
              ({fusionResult.position.x.toFixed(2)}, {fusionResult.position.y.toFixed(2)}) m
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Velocity</div>
            <div className="text-brand-primary">
              ({fusionResult.velocity.x.toFixed(2)}, {fusionResult.velocity.y.toFixed(2)}) m/s
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Confidence</div>
            <div className="text-brand-primary">{(fusionResult.confidence * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Sensor Weights */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">Sensor Fusion Notes</h3>
        <div className="text-xs text-yellow-700 space-y-1">
          <div>• GPS weight is inversely proportional to accuracy²</div>
          <div>• IMU provides velocity estimates with bias compensation</div>
          <div>• Encoder provides relative position measurements</div>
          <div>• Kalman filtering would provide optimal sensor fusion</div>
        </div>
      </div>
    </div>
  );
}