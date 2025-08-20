export interface TechnicalExperience {
  company: string;
  role: string;
  period: string;
  location: string;
  imageUrl: string;
  description: string;
  detailedDescription?: string;
  technicalAchievements: Array<{
    category: string;
    items: string[];
  }>;
  keyMetrics: Array<{
    metric: string;
    value: string;
    description: string;
  }>;
  technologiesUsed: string[];
  projectHighlights?: string[];
}

export const experiences: TechnicalExperience[] = [
  {
    company: "Design Visionaries",
    role: "Project Manager - Mechatronics",
    period: "Apr 2023 - Present",
    location: "San Jose, CA",
    imageUrl: "/logos/designvisionaries.svg",
    description:
      "Turned napkin sketches into profitable hardware, delivering $300k+ projects for Tesla, Apple, Meta, Applied Materials, and Saildrone. Led embedded systems for 5+ stealth startups.",
    detailedDescription:
      "Lead comprehensive mechatronics development projects from concept to production, specializing in the integration of mechanical, electrical, and software systems. Manage cross-functional teams to deliver complex hardware solutions under tight timelines while maintaining strict quality and cost requirements.",
    technicalAchievements: [
      {
        category: "Hardware Development",
        items: [
          "Designed and implemented embedded control systems for automotive applications meeting ISO 26262 safety standards",
          "Developed custom PCB layouts with mixed-signal designs for high-precision sensor interfaces",
          "Created mechatronic systems integrating brushless motors, precision encoders, and real-time control algorithms",
          "Implemented CAN bus communication protocols for distributed control systems"
        ]
      },
      {
        category: "Software & Algorithms",
        items: [
          "Developed real-time control algorithms using PID and state-space controllers",
          "Implemented sensor fusion algorithms combining IMU, encoder, and vision data",
          "Created embedded firmware using C/C++ for ARM Cortex microcontrollers",
          "Designed communication protocols for multi-device coordination"
        ]
      },
      {
        category: "Project Management",
        items: [
          "Managed concurrent projects worth $300K+ with 95% on-time delivery rate",
          "Led interdisciplinary teams of 8-15 engineers across mechanical, electrical, and software domains",
          "Implemented agile development methodologies adapted for hardware development cycles",
          "Coordinated with supply chain and manufacturing partners for production scaling"
        ]
      }
    ],
    keyMetrics: [
      {
        metric: "Project Value Delivered",
        value: "$300K+",
        description: "Total value of successfully completed mechatronics projects"
      },
      {
        metric: "Development Time Reduction",
        value: "40%",
        description: "Average reduction in development cycles through optimized workflows"
      },
      {
        metric: "Client Satisfaction",
        value: "100%",
        description: "All projects completed to specification with zero critical defects"
      },
      {
        metric: "Team Members Led",
        value: "15+",
        description: "Maximum team size across concurrent projects"
      }
    ],
    technologiesUsed: [
      "ARM Cortex-M", "C/C++", "Python", "MATLAB/Simulink", "Altium Designer", 
      "SolidWorks", "LabVIEW", "CAN Bus", "I2C/SPI", "Bluetooth/WiFi", 
      "Real-Time OS", "Git", "JIRA", "ISO 26262"
    ],
    projectHighlights: [
      "Automotive safety-critical control system achieving ASIL-C certification",
      "Consumer IoT device with 50% cost reduction while improving performance",
      "Medical device mechatronics with FDA compliance considerations",
      "Industrial automation system with 99.8% uptime requirements"
    ]
  },
  {
    company: "Applied Materials",
    role: "Manufacturing Engineer",
    period: "Sep 2024 - Feb 2025",
    location: "Santa Clara County, CA",
    imageUrl: "/logos/appliedmaterials.svg",
    description: "Implemented GD&T for Cold Plasma ALD systems.",
    detailedDescription:
      "Implemented advanced Geometric Dimensioning and Tolerancing (GD&T) standards for semiconductor manufacturing equipment requiring sub-micron precision. Focused on Cold Plasma Atomic Layer Deposition (ALD) systems where atomic-scale accuracy is critical for semiconductor fabrication processes.",
    technicalAchievements: [
      {
        category: "Precision Manufacturing",
        items: [
          "Developed GD&T specifications achieving ±0.5 μm tolerance on critical semiconductor equipment components",
          "Implemented coordinate measuring machine (CMM) protocols for sub-micron metrology",
          "Created statistical process control (SPC) systems for monitoring manufacturing variation",
          "Designed fixturing and tooling for consistent part positioning during precision machining"
        ]
      },
      {
        category: "Quality Systems",
        items: [
          "Established measurement uncertainty budgets for critical dimensional requirements",
          "Developed automated inspection routines reducing measurement time by 40%",
          "Implemented Six Sigma methodologies achieving Cpk > 1.67 for all critical dimensions",
          "Created comprehensive documentation systems ensuring full traceability"
        ]
      },
      {
        category: "Process Optimization",
        items: [
          "Optimized manufacturing processes to achieve 98.5% first-pass yield",
          "Reduced rework rates by 25% through improved process controls",
          "Implemented temperature compensation for thermal expansion effects",
          "Developed process capability studies for new product introduction (NPI)"
        ]
      }
    ],
    keyMetrics: [
      {
        metric: "Dimensional Accuracy",
        value: "±0.5 μm",
        description: "Achieved tolerance on critical semiconductor manufacturing components"
      },
      {
        metric: "Process Capability",
        value: "Cpk > 1.67",
        description: "Six Sigma quality levels for all critical manufacturing processes"
      },
      {
        metric: "First-Pass Yield",
        value: "98.5%",
        description: "Manufacturing yield improvement through enhanced process controls"
      },
      {
        metric: "Measurement Time Reduction",
        value: "40%",
        description: "Efficiency improvement through automated inspection protocols"
      }
    ],
    technologiesUsed: [
      "GD&T (ASME Y14.5)", "CMM Programming", "Zeiss Calypso", "MATLAB", 
      "Python", "Minitab", "SPC", "Six Sigma", "AutoCAD", "SolidWorks", 
      "Precision Metrology", "Statistical Analysis", "ISO 9001"
    ],
    projectHighlights: [
      "Sub-micron precision GD&T implementation for plasma chamber components",
      "Advanced metrology system setup for atomic-scale measurement accuracy",
      "Process capability improvement for high-volume semiconductor manufacturing",
      "Quality system enhancement achieving zero customer complaints"
    ]
  },
  {
    company: "Saildrone",
    role: "Engineering Consultant",
    period: "Apr 2023 - Jan 2024",
    location: "Alameda, CA",
    imageUrl: "/logos/saildrone.svg",
    description:
      "Managed harness production for autonomous sailing drones and streamlined inventory and training.",
    detailedDescription:
      "Led comprehensive optimization of wire harness manufacturing for autonomous maritime drones designed for extended ocean missions. Implemented lean manufacturing principles and advanced quality control systems to ensure reliable operation in harsh marine environments for missions lasting up to 12 months.",
    technicalAchievements: [
      {
        category: "Manufacturing Optimization",
        items: [
          "Redesigned wire harness manufacturing workflow reducing production time by 40%",
          "Implemented automated quality testing protocols achieving <0.5% defect rates",
          "Developed 3D modeling approach for optimized harness routing in confined drone chassis",
          "Created standardized work instructions enabling 3x production capacity increase"
        ]
      },
      {
        category: "Reliability Engineering",
        items: [
          "Implemented rigorous environmental testing protocols including salt-spray and thermal cycling",
          "Achieved 99.2% mission success rate for 12-month ocean deployments",
          "Designed waterproof connection systems maintaining IP68 rating",
          "Developed predictive maintenance schedules based on failure mode analysis"
        ]
      },
      {
        category: "Process Excellence",
        items: [
          "Implemented lean manufacturing principles reducing material waste by 25%",
          "Created comprehensive training programs improving knowledge retention to 95%",
          "Established statistical process control for consistent quality outcomes",
          "Developed supplier qualification programs for marine-grade components"
        ]
      }
    ],
    keyMetrics: [
      {
        metric: "Production Time Reduction",
        value: "40%",
        description: "Manufacturing cycle time improvement from 8 hours to 4.8 hours per unit"
      },
      {
        metric: "Mission Success Rate",
        value: "99.2%",
        description: "Reliability improvement for 12-month autonomous ocean missions"
      },
      {
        metric: "Quality Defect Rate",
        value: "<0.5%",
        description: "95% reduction in manufacturing defects through process optimization"
      },
      {
        metric: "Production Capacity",
        value: "3x Increase",
        description: "Capacity improvement while maintaining quality standards"
      }
    ],
    technologiesUsed: [
      "Lean Manufacturing", "Six Sigma", "Statistical Process Control", 
      "CAD Design", "Environmental Testing", "IP68 Design", "Marine Electronics", 
      "Quality Management Systems", "Failure Mode Analysis", "3D Modeling",
      "Project Management", "Supplier Management"
    ],
    projectHighlights: [
      "Wire harness design for 200+ connection points in autonomous marine vehicle",
      "Environmental reliability validation for extreme ocean conditions",
      "Lean manufacturing implementation enabling rapid production scaling",
      "Cross-functional team training program for manufacturing excellence"
    ]
  },
  {
    company: "Velodyne Lidar",
    role: "Senior Robotics Engineer",
    period: "Jan 2021 - Sep 2022",
    location: "California, USA",
    imageUrl: "/logos/velodyne.svg",
    description:
      "Developed proof-of-concept robotic platforms and sensor rigs, maintaining research fleets and writing sensor fusion APIs.",
    detailedDescription:
      "Led development of cutting-edge robotic platforms for LiDAR sensor validation and research. Created comprehensive sensor fusion APIs and managed research fleet operations supporting next-generation autonomous vehicle and robotics applications. Focused on multi-LiDAR integration and real-time perception algorithms.",
    technicalAchievements: [
      {
        category: "Sensor Fusion & Algorithms",
        items: [
          "Developed multi-LiDAR sensor fusion API achieving <50ms latency for real-time applications",
          "Implemented SLAM algorithms for 360° environment mapping with 4+ LiDAR sensors",
          "Created GPU-accelerated point cloud processing pipeline handling 300K+ points/second",
          "Designed calibration algorithms for multi-sensor arrays eliminating interference"
        ]
      },
      {
        category: "Robotic Platform Development",
        items: [
          "Built 6 proof-of-concept autonomous platforms for automotive and robotics demonstrations",
          "Implemented real-time control systems for mobile robotic platforms",
          "Developed ROS-based software architecture for modular sensor integration",
          "Created environmental testing protocols validating operation from -40°C to +85°C"
        ]
      },
      {
        category: "Research Fleet Management",
        items: [
          "Maintained 15+ robotic research platforms achieving 96% fleet uptime",
          "Implemented predictive maintenance systems reducing costs by 30%",
          "Developed standardized testing procedures for sensor validation",
          "Created documentation and training systems for research team onboarding"
        ]
      }
    ],
    keyMetrics: [
      {
        metric: "API Latency",
        value: "<50ms",
        description: "Real-time sensor fusion performance for automotive applications"
      },
      {
        metric: "Point Cloud Processing",
        value: "300K pts/sec",
        description: "High-throughput LiDAR data processing with GPU acceleration"
      },
      {
        metric: "Fleet Uptime",
        value: "96%",
        description: "Research platform availability through proactive maintenance"
      },
      {
        metric: "Detection Range",
        value: "200m",
        description: "Long-range object detection capability with high-resolution LiDAR"
      }
    ],
    technologiesUsed: [
      "ROS", "C++", "Python", "CUDA", "PCL", "OpenCV", "Eigen", "SLAM", 
      "Kalman Filtering", "GPU Programming", "Real-Time Systems", "CAN Bus",
      "Embedded Linux", "Git", "Docker", "Point Cloud Processing", "Computer Vision"
    ],
    projectHighlights: [
      "Multi-LiDAR interference elimination for dense sensor arrays",
      "Real-time SLAM implementation for 128-channel LiDAR systems",
      "Automotive-grade environmental validation testing protocols",
      "Sensor fusion API supporting 8+ different sensor modalities"
    ]
  }
] as const;

export type Experience = typeof experiences[number];
