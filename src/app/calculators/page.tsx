"use client";
import { motion } from 'framer-motion';
import RoboticsCalculator from '@/components/RoboticsCalculator';

export default function CalculatorsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <motion.section 
      className="section-padding"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
          Interactive Robotics Calculators
        </h1>
        <p className="text-lg text-foreground-secondary max-w-3xl mx-auto mb-8">
          Explore fundamental robotics concepts through interactive calculations and simulations.
          These tools demonstrate core algorithms used in modern robotics engineering.
        </p>
      </motion.div>

      {/* Calculator Component */}
      <motion.div variants={itemVariants}>
        <RoboticsCalculator type="kinematics" />
      </motion.div>

      {/* Educational Content */}
      <motion.div variants={itemVariants} className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Kinematics Card */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Forward & Inverse Kinematics</h3>
            </div>
            <p className="text-foreground-secondary text-sm mb-4">
              Calculate end-effector positions from joint angles (forward) or determine 
              required joint angles for desired positions (inverse).
            </p>
            <div className="text-xs text-foreground-muted">
              <strong>Applications:</strong> Robotic arms, manipulators, CNC machines
            </div>
          </div>

          {/* Transformations Card */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">3D Transformations</h3>
            </div>
            <p className="text-foreground-secondary text-sm mb-4">
              Transform points between coordinate frames using translation and rotation matrices.
              Essential for multi-robot coordination and sensor fusion.
            </p>
            <div className="text-xs text-foreground-muted">
              <strong>Applications:</strong> SLAM, sensor fusion, multi-robot systems
            </div>
          </div>

          {/* Trajectory Planning Card */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Trajectory Planning</h3>
            </div>
            <p className="text-foreground-secondary text-sm mb-4">
              Generate smooth motion profiles with velocity and acceleration constraints.
              Critical for precise robotic movements and path following.
            </p>
            <div className="text-xs text-foreground-muted">
              <strong>Applications:</strong> Path planning, motion control, autonomous navigation
            </div>
          </div>

          {/* PID Control Card */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">PID Controller Tuning</h3>
            </div>
            <p className="text-foreground-secondary text-sm mb-4">
              Simulate and tune PID controllers for optimal system response.
              Understand the effects of proportional, integral, and derivative gains.
            </p>
            <div className="text-xs text-foreground-muted">
              <strong>Applications:</strong> Motor control, position control, temperature regulation
            </div>
          </div>

          {/* Sensor Fusion Card */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Sensor Fusion</h3>
            </div>
            <p className="text-foreground-secondary text-sm mb-4">
              Combine multiple sensor readings for improved accuracy and reliability.
              Demonstrates weighted averaging and uncertainty propagation.
            </p>
            <div className="text-xs text-foreground-muted">
              <strong>Applications:</strong> Localization, state estimation, autonomous navigation
            </div>
          </div>

          {/* Mathematical Foundations Card */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Mathematical Foundations</h3>
            </div>
            <p className="text-foreground-secondary text-sm mb-4">
              These calculators implement core mathematical concepts including linear algebra,
              differential equations, and optimization algorithms used throughout robotics.
            </p>
            <div className="text-xs text-foreground-muted">
              <strong>Concepts:</strong> Matrix operations, coordinate transformations, control theory
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technical Notes */}
      <motion.div variants={itemVariants} className="mt-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Technical Implementation Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-700">
            <div>
              <h3 className="font-semibold mb-2">Algorithms Implemented</h3>
              <ul className="space-y-1 text-xs">
                <li>• Denavit-Hartenberg (DH) parameter conventions</li>
                <li>• Damped least-squares inverse kinematics</li>
                <li>• Quintic polynomial trajectory generation</li>
                <li>• Classical PID control with anti-windup</li>
                <li>• Weighted sensor fusion algorithms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Real-World Applications</h3>
              <ul className="space-y-1 text-xs">
                <li>• Industrial robotic arms and manipulators</li>
                <li>• Autonomous vehicle navigation systems</li>
                <li>• CNC machine tool path planning</li>
                <li>• Drone flight control and stabilization</li>
                <li>• Multi-sensor localization systems</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded border border-blue-200">
            <p className="text-xs text-blue-600">
              <strong>Note:</strong> These calculators provide simplified implementations for educational purposes. 
              Production robotics systems require additional considerations including safety constraints, 
              real-time performance optimization, and robust error handling.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={itemVariants} className="text-center mt-16">
        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need Custom Robotics Software Development?
          </h2>
          <p className="text-foreground-secondary mb-6 max-w-2xl mx-auto">
            From algorithm implementation to complete control systems, I develop 
            production-ready robotics software tailored to your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-brand-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors"
            >
              Discuss Your Project
            </a>
            <a 
              href="/projects" 
              className="bg-card text-foreground px-6 py-3 rounded-lg font-medium border hover:bg-background transition-colors"
            >
              View Previous Work
            </a>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}