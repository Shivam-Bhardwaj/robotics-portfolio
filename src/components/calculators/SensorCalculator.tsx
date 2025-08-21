"use client";
import { useState, useEffect } from 'react';

export function SensorCalculator() {
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
    // const imuWeight = 1.0 / (sensorData.imu.bias * sensorData.imu.bias); // Reserved for future IMU fusion
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
              <label htmlFor="gps-x" className="block text-sm font-medium mb-1">X Position (m)</label>
              <input
                id="gps-x"
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
              <label htmlFor="gps-y" className="block text-sm font-medium mb-1">Y Position (m)</label>
              <input
                id="gps-y"
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
              <label htmlFor="gps-accuracy" className="block text-sm font-medium mb-1">Accuracy (m)</label>
              <input
                id="gps-accuracy"
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
              <label htmlFor="imu-vx" className="block text-sm font-medium mb-1">X Velocity (m/s)</label>
              <input
                id="imu-vx"
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
              <label htmlFor="imu-vy" className="block text-sm font-medium mb-1">Y Velocity (m/s)</label>
              <input
                id="imu-vy"
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
              <label htmlFor="imu-bias" className="block text-sm font-medium mb-1">Bias (m/s²)</label>
              <input
                id="imu-bias"
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
              <label htmlFor="encoder-distance" className="block text-sm font-medium mb-1">Distance (m)</label>
              <input
                id="encoder-distance"
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
              <label htmlFor="encoder-resolution" className="block text-sm font-medium mb-1">Resolution (counts/rev)</label>
              <input
                id="encoder-resolution"
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
