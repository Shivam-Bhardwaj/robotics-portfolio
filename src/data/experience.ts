export const experiences = [
  {
    company: "Design Visionaries",
    role: "Project Manager - Mechatronics",
    period: "Apr 2023 - Present",
    location: "San Jose, CA",
    imageUrl: "/logos/designvisionaries.svg",
    description:
      "Turned napkin sketches into profitable hardware, delivering $300k+ projects for Tesla, Apple, Meta, Applied Materials, and Saildrone. Led embedded systems for 5+ stealth startups.",
  },
  {
    company: "Applied Materials",
    role: "Manufacturing Engineer",
    period: "Sep 2024 - Feb 2025",
    location: "Santa Clara County, CA",
    imageUrl: "/logos/appliedmaterials.svg",
    description: "Implemented GD&T for Cold Plasma ALD systems.",
  },
  {
    company: "Saildrone",
    role: "Engineering Consultant",
    period: "Apr 2023 - Jan 2024",
    location: "Alameda, CA",
    imageUrl: "/logos/saildrone.svg",
    description:
      "Managed harness production for autonomous sailing drones and streamlined inventory and training.",
  },
  {
    company: "Velodyne Lidar",
    role: "Senior Robotics Engineer",
    period: "Jan 2021 - Sep 2022",
    location: "California, USA",
    imageUrl: "/logos/velodyne.svg",
    description:
      "Developed proof-of-concept robotic platforms and sensor rigs, maintaining research fleets and writing sensor fusion APIs.",
  },
] as const;

export type Experience = typeof experiences[number];
