"use client";
import { useState, useEffect } from 'react';
import { Vector3, Quat, Transform3D, DHParameter, ForwardKinematics, InverseKinematics } from '@/lib/robotics/math';

export function KinematicsCalculator() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            className="mt-4 px-4 py-2 bg-brand-primary text-white rounded hover:bg-opacity-90"
          >
            Calculate IK
          </button>
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
          <h3 className="text-lg font-semibold mb-2">End Effector Pose</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Position X: {result.position.x.toFixed(2)} mm</div>
            <div>Position Y: {result.position.y.toFixed(2)} mm</div>
            <div>Position Z: {result.position.z.toFixed(2)} mm</div>
          </div>
        </div>
      )}
    </div>
  );
}