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


