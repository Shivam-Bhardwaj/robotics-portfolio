export const siteConfig = {
  name: "Shivam Bhardwaj",
  role: "Robotics Engineer",
  email: "your.email@example.com",
  location: "California",
  currentCompany: "AntiMony Group",
  links: {
    github: "https://github.com/Shivam-Bhardwaj",
    linkedin: "https://www.linkedin.com/in/shivambdj/",
    website: "https://shivambhardwaj.com/",
    resume: "/resume.pdf",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const projects = [
  {
    name: 'Robotic Arm Controller',
    description: 'A software controller for a 6-axis robotic arm, implemented in ROS.',
    imageUrl: '/project1.svg',
    link: '#',
  },
  {
    name: 'Autonomous Rover',
    description: 'A small autonomous rover for navigating and mapping unknown environments.',
    imageUrl: '/project2.svg',
    link: '#',
  },
];

