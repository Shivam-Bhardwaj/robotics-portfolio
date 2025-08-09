export const siteConfig = {
  name: "Shivam Bhardwaj",
  role: "Project Manager & Robotics Engineer",
  email: "contact@shivambhardwaj.com",
  location: "San Jose, CA",
  currentCompany: "Design Visionaries",
  links: {
    github: "https://github.com/Shivam-Bhardwaj",
    linkedin: "https://www.linkedin.com/in/shivambdj/",
    website: "https://shivambhardwaj.com/",
    resume: "/resume.pdf",
  },
} as const;

export type SiteConfig = typeof siteConfig;


