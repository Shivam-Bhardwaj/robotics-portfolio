"use client";
import { useState, useEffect } from 'react';
import { Vector3 } from '@/lib/robotics/math';

export function TrajectoryCalculator() {
  const [start, setStart] = useState({ x: 0, y: 0, z: 0 });
  const [end, setEnd] = useState({ x: 100, y: 100, z: 50 });
  const [constraints, setConstraints] = useState({ 
    maxVel: 50, 
    maxAccel: 20, 
    duration: 3.0 
  });
interface TrajectoryPoint {
  time: number;
  position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;
}
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);

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
                <label htmlFor={`start-${axis}`} className="w-4 text-sm font-medium capitalize">{axis}:</label>
                <input
                  id={`start-${axis}`}
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
                <label htmlFor={`end-${axis}`} className="w-4 text-sm font-medium capitalize">{axis}:</label>
                <input
                  id={`end-${axis}`}
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
            <label htmlFor="max-vel" className="block text-sm font-medium mb-1">Max Velocity (mm/s)</label>
            <input
              id="max-vel"
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
            <label htmlFor="max-accel" className="block text-sm font-medium mb-1">Max Acceleration (mm/s²)</label>
            <input
              id="max-accel"
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
            <label htmlFor="duration" className="block text-sm font-medium mb-1">Duration (s)</label>
            <input
              id="duration"
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
