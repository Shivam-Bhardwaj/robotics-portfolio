"use client";
import { useState, useEffect } from 'react';
import { Vector3, Quat, Transform3D } from '@/lib/robotics/math';

export function TransformCalculator() {
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
                <label htmlFor={`translation-${axis}`} className="block text-sm font-medium mb-1 capitalize">{axis}</label>
                <input
                  id={`translation-${axis}`}
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
                <label htmlFor={`rotation-${axis}`} className="block text-sm font-medium mb-1 capitalize">{axis}</label>
                <input
                  id={`rotation-${axis}`}
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
              <label htmlFor={`point-${axis}`} className="block text-sm font-medium mb-1 capitalize">{axis}</label>
              <input
                id={`point-${axis}`}
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
