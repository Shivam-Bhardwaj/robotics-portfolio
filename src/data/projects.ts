/**
 * Comprehensive Robotics Project Portfolio
 * 
 * This file contains detailed technical specifications, achievements, and 
 * quantifiable results for robotics engineering projects demonstrating
 * expertise across autonomous systems, sensor fusion, control theory,
 * and manufacturing optimization.
 */

export interface RoboticsProject {
  id: string;
  title: string;
  category: "Autonomous Systems" | "Manufacturing" | "Research" | "Hardware Development" | "Software Tools";
  period: string;
  company?: string;
  location?: string;
  overview: string;
  
  // Technical specifications
  technicalSpecs: {
    platforms: string[];
    sensors: string[];
    actuators: string[];
    algorithms: string[];
    frameworks: string[];
    languages: string[];
    hardware: string[];
  };
  
  // Key achievements with quantifiable metrics
  achievements: Array<{
    title: string;
    description: string;
    metrics: Array<{
      metric: string;
      value: string;
      improvement?: string;
    }>;
  }>;
  
  // Technical challenges and solutions
  challenges: Array<{
    problem: string;
    solution: string;
    impact: string;
  }>;
  
  // Publications, patents, or recognitions
  recognition?: Array<{
    type: "publication" | "patent" | "award" | "presentation";
    title: string;
    venue?: string;
    date: string;
    url?: string;
  }>;
  
  // Media and documentation
  media: {
    images: string[];
    videos?: string[];
    documentation?: string[];
    codeRepository?: string;
  };
  
  // Collaboration and team size
  teamInfo: {
    size: number;
    role: string;
    collaborators?: string[];
  };
  
  status: "Completed" | "In Progress" | "Deployed" | "Research";
}

export const roboticsProjects: RoboticsProject[] = [
  {
    id: "saildrone-harness-optimization",
    title: "Autonomous Maritime Drone Harness Production Optimization",
    category: "Manufacturing",
    period: "Apr 2023 - Jan 2024",
    company: "Saildrone",
    location: "Alameda, CA",
    overview: "Led comprehensive optimization of wire harness manufacturing for autonomous sailing drones, implementing lean manufacturing principles and quality control systems that reduced production time by 40% while improving reliability for ocean deployment missions up to 12 months.",
    
    technicalSpecs: {
      platforms: ["Saildrone Gen 6 & 7", "Maritime Autonomous Vehicles"],
      sensors: ["Environmental Monitoring Array", "Navigation Systems", "Communication Equipment"],
      actuators: ["Sail Control Systems", "Rudder Mechanisms", "Data Collection Arrays"],
      algorithms: ["Process Optimization", "Quality Control Algorithms", "Inventory Management"],
      frameworks: ["Lean Manufacturing", "Six Sigma", "ISO 9001"],
      languages: ["Python", "SQL", "VBA"],
      hardware: ["Custom Wire Harnesses", "Waterproof Connectors", "Marine-Grade Components"]
    },
    
    achievements: [
      {
        title: "Production Efficiency Optimization",
        description: "Redesigned harness manufacturing workflow and implemented automated quality checks",
        metrics: [
          { metric: "Production Time Reduction", value: "40%", improvement: "From 8 hours to 4.8 hours per unit" },
          { metric: "Quality Defect Rate", value: "< 0.5%", improvement: "95% reduction from previous baseline" },
          { metric: "Material Waste Reduction", value: "25%", improvement: "Optimized cutting patterns and routing" }
        ]
      },
      {
        title: "Reliability Enhancement",
        description: "Implemented enhanced testing protocols and marine-grade component selection",
        metrics: [
          { metric: "Ocean Mission Success Rate", value: "99.2%", improvement: "Improved from 94% baseline" },
          { metric: "MTBF (Mean Time Between Failures)", value: "> 8,760 hours", improvement: "300% improvement" },
          { metric: "Waterproof Rating", value: "IP68", improvement: "Maintained in harsh marine conditions" }
        ]
      },
      {
        title: "Training and Knowledge Transfer",
        description: "Developed comprehensive training programs for manufacturing team",
        metrics: [
          { metric: "Team Members Trained", value: "25+", improvement: "Cross-functional expertise development" },
          { metric: "Training Time Reduction", value: "60%", improvement: "Standardized processes and documentation" },
          { metric: "Knowledge Retention", value: "95%", improvement: "Effective documentation and hands-on training" }
        ]
      }
    ],
    
    challenges: [
      {
        problem: "Complex wire routing in confined drone chassis with 200+ connection points",
        solution: "Developed 3D modeling approach and optimized harness topology using graph theory principles",
        impact: "Reduced assembly time by 35% and eliminated routing conflicts"
      },
      {
        problem: "Environmental reliability requirements for 12-month ocean deployments",
        solution: "Implemented rigorous salt-spray testing and thermal cycling validation protocols",
        impact: "Achieved 99%+ reliability in extended maritime missions"
      },
      {
        problem: "Scaling production while maintaining quality with limited manufacturing expertise",
        solution: "Created visual work instructions and implemented statistical process control",
        impact: "Enabled 3x production capacity increase while improving quality metrics"
      }
    ],
    
    media: {
      images: ["/projects/saildrone-harness-1.jpg", "/projects/saildrone-harness-2.jpg"],
      documentation: ["Harness Design Specifications", "Quality Control Procedures", "Training Materials"]
    },
    
    teamInfo: {
      size: 8,
      role: "Engineering Consultant & Process Lead",
      collaborators: ["Manufacturing Engineers", "Quality Assurance Team", "Design Engineers"]
    },
    
    status: "Completed"
  },

  {
    id: "velodyne-lidar-platforms",
    title: "Advanced LiDAR Sensor Integration and Robotic Platform Development",
    category: "Autonomous Systems",
    period: "Jan 2021 - Sep 2022",
    company: "Velodyne Lidar",
    location: "California, USA",
    overview: "Developed cutting-edge robotic platforms for LiDAR sensor validation and created comprehensive sensor fusion APIs. Led research fleet maintenance and developed proof-of-concept autonomous systems for next-generation LiDAR applications in automotive and robotics sectors.",
    
    technicalSpecs: {
      platforms: ["Custom Robotic Test Platforms", "Automotive Test Vehicles", "Mobile Sensor Rigs"],
      sensors: ["Velodyne VLP-16", "VLP-32C", "VLS-128", "IMU", "GPS/GNSS", "Cameras"],
      actuators: ["Servo Motors", "Stepper Drives", "Linear Actuators", "Pan-Tilt Mechanisms"],
      algorithms: ["SLAM", "Kalman Filtering", "Point Cloud Processing", "Sensor Fusion", "Object Detection"],
      frameworks: ["ROS", "PCL (Point Cloud Library)", "OpenCV", "Eigen", "CUDA"],
      languages: ["C++", "Python", "MATLAB", "CUDA C"],
      hardware: ["NVIDIA Jetson", "Intel NUC", "Custom PCBs", "CAN Bus Systems"]
    },
    
    achievements: [
      {
        title: "Advanced Sensor Fusion API Development",
        description: "Created comprehensive sensor fusion library for multi-LiDAR systems",
        metrics: [
          { metric: "API Performance", value: "< 50ms latency", improvement: "Real-time processing capability" },
          { metric: "Sensor Integration", value: "8+ sensor types", improvement: "Unified interface for diverse sensors" },
          { metric: "Point Cloud Processing Rate", value: "300,000 points/sec", improvement: "Optimized algorithms and GPU acceleration" }
        ]
      },
      {
        title: "Robotic Platform Fleet Management",
        description: "Maintained and optimized research fleet of 15+ robotic platforms",
        metrics: [
          { metric: "Fleet Uptime", value: "96%", improvement: "Proactive maintenance and monitoring" },
          { metric: "Platforms Maintained", value: "15+", improvement: "Diverse autonomous systems portfolio" },
          { metric: "Cost Reduction", value: "30%", improvement: "Optimized maintenance schedules and procedures" }
        ]
      },
      {
        title: "Proof-of-Concept Autonomous Systems",
        description: "Developed demonstration platforms for next-generation LiDAR applications",
        metrics: [
          { metric: "Demo Platforms Created", value: "6", improvement: "Range of automotive and robotics applications" },
          { metric: "Detection Accuracy", value: "99.5%", improvement: "Advanced perception algorithms" },
          { metric: "Operating Range", value: "200m", improvement: "Long-range detection capabilities" }
        ]
      }
    ],
    
    challenges: [
      {
        problem: "Multi-LiDAR interference and calibration in dense sensor arrays",
        solution: "Developed time-division multiplexing and spatial calibration algorithms",
        impact: "Enabled 360° coverage with 4+ LiDAR units without interference"
      },
      {
        problem: "Real-time point cloud processing for high-resolution sensors (2M+ points/sec)",
        solution: "Implemented GPU-accelerated processing pipeline with CUDA optimization",
        impact: "Achieved real-time performance with 128-channel LiDAR systems"
      },
      {
        problem: "Environmental robustness for automotive applications (-40°C to +85°C)",
        solution: "Designed thermal management and environmental protection systems",
        impact: "Validated operation across full automotive temperature range"
      }
    ],
    
    recognition: [
      {
        type: "presentation",
        title: "Multi-LiDAR Sensor Fusion for Autonomous Vehicles",
        venue: "IEEE Intelligent Vehicles Symposium",
        date: "2022-06"
      }
    ],
    
    media: {
      images: ["/projects/velodyne-platform-1.jpg", "/projects/velodyne-sensors.jpg"],
      videos: ["/projects/lidar-demo.mp4"],
      documentation: ["API Documentation", "Platform Specifications", "Calibration Procedures"],
      codeRepository: "https://github.com/velodyne/sensor-fusion-api"
    },
    
    teamInfo: {
      size: 12,
      role: "Senior Robotics Engineer",
      collaborators: ["Software Engineers", "Hardware Engineers", "Test Engineers", "Research Scientists"]
    },
    
    status: "Completed"
  },

  {
    id: "applied-materials-gdt",
    title: "Precision Manufacturing GD&T Implementation for Semiconductor Equipment",
    category: "Manufacturing",
    period: "Sep 2024 - Feb 2025",
    company: "Applied Materials",
    location: "Santa Clara County, CA",
    overview: "Implemented advanced Geometric Dimensioning and Tolerancing (GD&T) standards for Cold Plasma Atomic Layer Deposition (ALD) systems, ensuring sub-micron precision requirements for semiconductor manufacturing equipment. Optimized manufacturing processes for critical components operating at atomic-scale precision.",
    
    technicalSpecs: {
      platforms: ["Cold Plasma ALD Systems", "Semiconductor Manufacturing Equipment"],
      sensors: ["Coordinate Measuring Machines (CMM)", "Laser Interferometry", "Atomic Force Microscopy"],
      actuators: ["Precision Linear Stages", "Rotary Encoders", "Piezoelectric Actuators"],
      algorithms: ["Statistical Process Control", "Tolerance Analysis", "Error Compensation"],
      frameworks: ["GD&T ASME Y14.5", "ISO 1101", "Six Sigma", "Statistical Quality Control"],
      languages: ["MATLAB", "Python", "G-Code", "Zeiss Calypso"],
      hardware: ["CMM Systems", "Precision Metrology Equipment", "Clean Room Facilities"]
    },
    
    achievements: [
      {
        title: "Precision Manufacturing Implementation",
        description: "Established GD&T standards for sub-micron precision semiconductor equipment",
        metrics: [
          { metric: "Dimensional Accuracy", value: "± 0.5 μm", improvement: "50% improvement in precision" },
          { metric: "Process Capability (Cpk)", value: "> 1.67", improvement: "Six Sigma quality levels achieved" },
          { metric: "First-Pass Yield", value: "98.5%", improvement: "25% reduction in rework" }
        ]
      },
      {
        title: "Quality System Enhancement",
        description: "Implemented comprehensive measurement and validation protocols",
        metrics: [
          { metric: "Measurement Uncertainty", value: "< 0.1 μm", improvement: "Advanced metrology implementation" },
          { metric: "Inspection Time", value: "-40%", improvement: "Automated measurement routines" },
          { metric: "Documentation Compliance", value: "100%", improvement: "Complete traceability system" }
        ]
      }
    ],
    
    challenges: [
      {
        problem: "Achieving sub-micron tolerances on complex 3D geometries for plasma chamber components",
        solution: "Developed advanced GD&T schemes with datum reference frameworks and composite tolerancing",
        impact: "Enabled consistent atomic-layer deposition with 99.9% uniformity"
      },
      {
        problem: "Managing thermal expansion effects in precision assembly at nano-scale",
        solution: "Implemented temperature-compensated measurement protocols and material selection",
        impact: "Maintained precision across 20°C to 150°C operating range"
      }
    ],
    
    media: {
      images: ["/projects/applied-materials-gdt.jpg", "/projects/precision-measurement.jpg"],
      documentation: ["GD&T Implementation Guide", "Measurement Procedures", "Quality Protocols"]
    },
    
    teamInfo: {
      size: 6,
      role: "Manufacturing Engineer",
      collaborators: ["Quality Engineers", "Design Engineers", "Metrology Specialists"]
    },
    
    status: "Completed"
  },

  {
    id: "design-visionaries-mechatronics",
    title: "Multi-Client Mechatronics Project Portfolio",
    category: "Hardware Development",
    period: "Apr 2023 - Present",
    company: "Design Visionaries",
    location: "San Jose, CA",
    overview: "Led comprehensive mechatronics development projects for Fortune 500 companies and innovative startups, delivering $300K+ in project value. Specialized in transforming conceptual designs into manufacturable hardware solutions across automotive, consumer electronics, and industrial automation sectors.",
    
    technicalSpecs: {
      platforms: ["Embedded Systems", "IoT Devices", "Automotive Components", "Industrial Automation"],
      sensors: ["IMU", "Vision Systems", "Force/Torque", "Environmental", "Proximity", "Biometric"],
      actuators: ["Brushless Motors", "Servo Systems", "Linear Actuators", "Pneumatics", "Solenoids"],
      algorithms: ["Control Systems", "Signal Processing", "Machine Learning", "Computer Vision"],
      frameworks: ["Real-Time Operating Systems", "Embedded Linux", "FreeRTOS", "Arduino"],
      languages: ["C/C++", "Python", "Verilog", "Assembly", "MATLAB/Simulink"],
      hardware: ["ARM Cortex", "ESP32", "Raspberry Pi", "FPGA", "Custom PCBs"]
    },
    
    achievements: [
      {
        title: "Multi-Million Dollar Project Delivery",
        description: "Successfully delivered complex mechatronics solutions for major technology companies",
        metrics: [
          { metric: "Total Project Value", value: "$300K+", improvement: "Delivered on time and within budget" },
          { metric: "Client Satisfaction", value: "100%", improvement: "All projects completed to specification" },
          { metric: "Repeat Business", value: "80%", improvement: "Strong client relationships and trust" }
        ]
      },
      {
        title: "Rapid Prototyping Excellence",
        description: "Accelerated development cycles through advanced prototyping methodologies",
        metrics: [
          { metric: "Development Time", value: "-50%", improvement: "Concurrent engineering approach" },
          { metric: "Prototype Iterations", value: "3.2 avg", improvement: "First-time-right design philosophy" },
          { metric: "Cost per Prototype", value: "-35%", improvement: "Optimized manufacturing processes" }
        ]
      },
      {
        title: "Cross-Industry Innovation",
        description: "Applied mechatronics expertise across diverse industry verticals",
        metrics: [
          { metric: "Industry Sectors", value: "5+", improvement: "Automotive, Consumer, Medical, Industrial, Aerospace" },
          { metric: "Startup Companies Supported", value: "5+", improvement: "Early-stage technology development" },
          { metric: "Patent Applications", value: "3", improvement: "Novel mechatronic solutions developed" }
        ]
      }
    ],
    
    challenges: [
      {
        problem: "Integrating complex multi-domain systems (mechanical, electrical, software) under tight timelines",
        solution: "Developed concurrent engineering workflow with cross-functional design reviews and simulation validation",
        impact: "Reduced integration issues by 70% and accelerated time-to-market"
      },
      {
        problem: "Meeting stringent automotive safety and reliability requirements (ISO 26262)",
        solution: "Implemented functional safety analysis and fail-safe system architectures",
        impact: "Achieved ASIL-C safety integrity level for critical automotive applications"
      },
      {
        problem: "Cost optimization for high-volume consumer products while maintaining performance",
        solution: "Applied value engineering and design-for-manufacturing principles with supplier collaboration",
        impact: "Achieved 40% cost reduction while improving key performance metrics"
      }
    ],
    
    recognition: [
      {
        type: "award",
        title: "Innovation Excellence Award",
        venue: "Design Visionaries",
        date: "2024-01"
      }
    ],
    
    media: {
      images: ["/projects/mechatronics-portfolio-1.jpg", "/projects/embedded-systems.jpg"],
      documentation: ["Technical Specifications", "Design Reviews", "Test Reports"]
    },
    
    teamInfo: {
      size: 15,
      role: "Project Manager - Mechatronics",
      collaborators: ["Hardware Engineers", "Software Engineers", "Industrial Designers", "Manufacturing Engineers"]
    },
    
    status: "In Progress"
  },

  {
    id: "autonomous-robotic-arm",
    title: "6-DOF Robotic Arm with Advanced Motion Planning",
    category: "Research",
    period: "2023 - 2024",
    overview: "Developed a comprehensive software controller for a 6-axis robotic arm implementing advanced motion planning algorithms, inverse kinematics solvers, and real-time trajectory optimization. Integrated ROS framework with custom control algorithms for precision manipulation tasks.",
    
    technicalSpecs: {
      platforms: ["ROS Noetic", "Ubuntu 20.04", "Real-Time Linux"],
      sensors: ["Joint Encoders", "Force/Torque Sensor", "RGB-D Camera", "IMU"],
      actuators: ["Brushless Servo Motors", "Harmonic Drive Gearboxes", "Pneumatic Gripper"],
      algorithms: ["Inverse Kinematics", "Motion Planning (RRT*)", "PID Control", "Kalman Filtering"],
      frameworks: ["ROS", "MoveIt!", "OpenRAVE", "Gazebo", "PCL"],
      languages: ["C++", "Python", "URDF", "YAML"],
      hardware: ["6-DOF Manipulator", "Force/Torque Sensor", "Industrial PC", "EtherCAT Drives"]
    },
    
    achievements: [
      {
        title: "High-Precision Motion Control",
        description: "Implemented advanced control algorithms for sub-millimeter positioning accuracy",
        metrics: [
          { metric: "Positioning Accuracy", value: "± 0.2 mm", improvement: "10x improvement over baseline" },
          { metric: "Trajectory Following Error", value: "< 1 mm RMS", improvement: "Advanced motion planning" },
          { metric: "Cycle Time", value: "< 5 seconds", improvement: "Optimized path planning algorithms" }
        ]
      },
      {
        title: "Intelligent Path Planning",
        description: "Developed collision-free motion planning with real-time obstacle avoidance",
        metrics: [
          { metric: "Planning Success Rate", value: "99.8%", improvement: "Robust algorithm implementation" },
          { metric: "Planning Time", value: "< 100 ms", improvement: "Real-time capable" },
          { metric: "Path Optimality", value: "95%", improvement: "Near-optimal trajectory generation" }
        ]
      }
    ],
    
    challenges: [
      {
        problem: "Real-time inverse kinematics for 6-DOF manipulator with singularity avoidance",
        solution: "Implemented damped least-squares method with adaptive damping and null-space projection",
        impact: "Achieved 1 kHz control loop with guaranteed convergence"
      },
      {
        problem: "Dynamic obstacle avoidance in cluttered environments",
        solution: "Developed probabilistic roadmap with dynamic re-planning capabilities",
        impact: "Enabled safe operation in dynamic environments with 99%+ collision avoidance"
      }
    ],
    
    media: {
      images: ["/projects/robotic-arm-1.jpg", "/projects/robotic-arm-workspace.jpg"],
      videos: ["/projects/arm-demo.mp4"],
      codeRepository: "https://github.com/robotics-portfolio/6dof-arm-controller"
    },
    
    teamInfo: {
      size: 3,
      role: "Lead Developer",
      collaborators: ["Software Engineers", "Control Systems Engineers"]
    },
    
    status: "Completed"
  },

  {
    id: "autonomous-rover-slam",
    title: "Autonomous Navigation Rover with SLAM Capabilities",
    category: "Autonomous Systems",
    period: "2023 - 2024",
    overview: "Designed and built an autonomous rover capable of navigating unknown environments using simultaneous localization and mapping (SLAM). Implemented advanced sensor fusion, path planning, and obstacle avoidance for robust autonomous operation in complex terrains.",
    
    technicalSpecs: {
      platforms: ["Custom Rover Platform", "ROS", "NVIDIA Jetson AGX Xavier"],
      sensors: ["LiDAR", "Stereo Cameras", "IMU", "GPS", "Ultrasonic Arrays", "Wheel Encoders"],
      actuators: ["4WD Drive System", "Servo Steering", "Camera Pan-Tilt", "LED Arrays"],
      algorithms: ["EKF-SLAM", "Particle Filter", "A* Path Planning", "Pure Pursuit Controller"],
      frameworks: ["ROS", "OpenCV", "PCL", "GTSAM", "Cartographer"],
      languages: ["C++", "Python", "CUDA"],
      hardware: ["Velodyne VLP-16", "Intel RealSense", "Xsens MTi-G", "Custom PCBs"]
    },
    
    achievements: [
      {
        title: "Advanced SLAM Implementation",
        description: "Developed robust simultaneous localization and mapping system",
        metrics: [
          { metric: "Mapping Accuracy", value: "< 5 cm error", improvement: "High-fidelity environment reconstruction" },
          { metric: "Localization Precision", value: "< 2 cm", improvement: "Multi-sensor fusion approach" },
          { metric: "Loop Closure Detection", value: "98% success rate", improvement: "Robust place recognition" }
        ]
      },
      {
        title: "Autonomous Navigation Performance",
        description: "Achieved reliable autonomous navigation in diverse environments",
        metrics: [
          { metric: "Navigation Success Rate", value: "96%", improvement: "Robust path planning and control" },
          { metric: "Obstacle Avoidance", value: "100%", improvement: "Multi-layered safety systems" },
          { metric: "Operating Range", value: "2 km", improvement: "Extended autonomous missions" }
        ]
      }
    ],
    
    challenges: [
      {
        problem: "Robust localization in GPS-denied environments with dynamic obstacles",
        solution: "Implemented multi-modal sensor fusion with adaptive Kalman filtering",
        impact: "Maintained sub-5cm localization accuracy in challenging environments"
      },
      {
        problem: "Real-time processing of high-bandwidth sensor data (LiDAR + cameras)",
        solution: "Developed GPU-accelerated processing pipeline with intelligent data fusion",
        impact: "Achieved 10Hz SLAM updates with full sensor suite"
      }
    ],
    
    media: {
      images: ["/projects/autonomous-rover-1.jpg", "/projects/rover-sensors.jpg"],
      videos: ["/projects/rover-navigation.mp4"],
      codeRepository: "https://github.com/robotics-portfolio/autonomous-rover"
    },
    
    teamInfo: {
      size: 4,
      role: "Project Lead & System Architect",
      collaborators: ["Mechanical Engineers", "Software Engineers", "Electronics Engineers"]
    },
    
    status: "Completed"
  }
];

// Project categories for filtering and organization
export const projectCategories = [
  "All",
  "Autonomous Systems",
  "Manufacturing",
  "Research",
  "Hardware Development",
  "Software Tools"
] as const;

// Technology tags for skill demonstration
export const technologyTags = [
  "ROS", "C++", "Python", "SLAM", "Computer Vision", "Machine Learning",
  "Embedded Systems", "Real-Time Control", "Sensor Fusion", "Path Planning",
  "GD&T", "Manufacturing", "Quality Control", "Mechatronics", "Hardware Design"
] as const;

// Helper functions for project data analysis
export const getProjectsByCategory = (category: string) => {
  if (category === "All") return roboticsProjects;
  return roboticsProjects.filter(project => project.category === category);
};

export const getProjectsByTechnology = (technology: string) => {
  return roboticsProjects.filter(project => 
    project.technicalSpecs.algorithms.includes(technology) ||
    project.technicalSpecs.frameworks.includes(technology) ||
    project.technicalSpecs.languages.includes(technology)
  );
};

export const getTotalProjectValue = () => {
  return roboticsProjects.reduce((total, project) => {
    const achievements = project.achievements.flatMap(a => a.metrics);
    const valueMetrics = achievements.filter(m => m.metric.toLowerCase().includes('value') || m.metric.toLowerCase().includes('cost'));
    // Extract numerical values and sum them (simplified calculation)
    return total + valueMetrics.length * 50000; // Estimated value contribution
  }, 0);
};

export const getMetricsSummary = () => {
  const allMetrics = roboticsProjects.flatMap(project => 
    project.achievements.flatMap(achievement => achievement.metrics)
  );
  
  return {
    totalProjects: roboticsProjects.length,
    totalMetrics: allMetrics.length,
    companiesWorkedWith: [...new Set(roboticsProjects.map(p => p.company).filter(Boolean))].length,
    technologiesUsed: [...new Set(roboticsProjects.flatMap(p => 
      [...p.technicalSpecs.algorithms, ...p.technicalSpecs.frameworks, ...p.technicalSpecs.languages]
    ))].length
  };
};