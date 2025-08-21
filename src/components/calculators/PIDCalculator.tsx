"use client";
import { useState, useEffect } from 'react';

export function PIDCalculator() {
  const [gains, setGains] = useState({ kp: 1.0, ki: 0.1, kd: 0.05 });
  const [setpoint, setSetpoint] = useState(100);
interface SimulationPoint {
  time: number;
  position: number;
  setpoint: number;
  error: number;
  output: number;
}
  const [simulation, setSimulation] = useState<SimulationPoint[]>([]);
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
                <label htmlFor={`gain-${gain}`} className="block text-sm font-medium mb-1 uppercase">{gain}</label>
                <input
                  id={`gain-${gain}`}
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
              <label htmlFor="setpoint" className="block text-sm font-medium mb-1">Setpoint</label>
              <input
                id="setpoint"
                type="number"
                value={setpoint}
                onChange={(e) => setSetpoint(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="inertia" className="block text-sm font-medium mb-1">Inertia</label>
              <input
                id="inertia"
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
              <label htmlFor="damping" className="block text-sm font-medium mb-1">Damping</label>
              <input
                id="damping"
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
