# Robotics Portfolio - Shivam Bhardwaj

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.12-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> A modern, interactive portfolio showcasing robotics engineering expertise, project management experience, and technical skills in autonomous systems and hardware development.

## 🤖 About

This portfolio website represents the professional work of **Shivam Bhardwaj**, a Project Manager & Robotics Engineer based in San Jose, CA. The site features an interactive swarm robotics simulation, detailed project showcases, and comprehensive experience documentation from companies including Tesla, Meta, Applied Materials, Google, GoPro, Saildrone, and Velodyne Lidar.

### ✨ Key Features

- **Interactive Swarm Robotics Game** - Guide a fleet of robots to explore maps efficiently
- **Dynamic Project Showcase** - Detailed case studies of robotics and automation projects
- **Professional Experience Timeline** - Comprehensive work history with major tech companies
- **Skills & Technologies Matrix** - Visual representation of technical competencies
- **Responsive Design** - Optimized for desktop, tablet, and mobile viewing
- **Modern Animations** - Smooth transitions and micro-interactions using Framer Motion

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript 5.0** - Type-safe JavaScript development

### Styling & Animation
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Production-ready motion library
- **CSS Grid & Flexbox** - Modern layout techniques

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Hot Reload** - Instant development feedback

### Deployment
- **Firebase Hosting** - Static site hosting with CDN
- **Vercel Platform** - Alternative deployment option

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Shivam-Bhardwaj/robotics-portfolio.git
cd robotics-portfolio
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
robotics-portfolio/
├── public/                  # Static assets
│   ├── logos/              # Company and technology logos
│   ├── *.svg               # Icon files
│   └── *.json              # Data files
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── contact/        # Contact page
│   │   ├── experience/     # Professional experience
│   │   ├── projects/       # Project portfolio
│   │   ├── skills/         # Technical skills
│   │   ├── swarm/          # Interactive swarm game
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout component
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable React components
│   │   ├── ExperienceCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── RoombaSimulation.tsx
│   │   ├── SkillBadge.tsx
│   │   ├── SwarmGame.tsx
│   │   └── Typewriter.tsx
│   └── data/               # Application data
│       ├── experience.ts   # Professional experience data
│       └── site.ts         # Site configuration
├── docs/                   # Documentation
├── package.json            # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # Project documentation
```

## 🎮 Interactive Features

### Swarm Robotics Simulation
- **Objective**: Guide a fleet of robots to explore the entire map efficiently
- **Controls**: Mouse cursor controls the swarm direction
- **Features**: Real-time coverage tracking, timer, and reset functionality
- **Technology**: Custom physics simulation with Canvas API

### Skills Visualization
- Interactive skill badges with proficiency levels
- Technology categorization (Languages, Frameworks, Tools, Hardware)
- Hover effects and detailed descriptions

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Deployment
npm run export       # Export static files for hosting
```

## 🌐 Deployment

### Firebase Hosting (Primary)
1. Build the project: `npm run build`
2. Deploy using Firebase CLI: `firebase deploy`

### Vercel (Alternative)
1. Connect your GitHub repository to Vercel
2. Automatic deployments on every push to main branch

### Static Export
```bash
npm run build
npm run export
```
Deploy the `out/` directory to any static hosting service.

## 🤝 Contributing

We welcome contributions to improve the portfolio website! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) file for detailed guidelines.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Contact

**Shivam Bhardwaj**
- Email: contact@shivambhardwaj.com
- LinkedIn: [linkedin.com/in/shivambdj](https://www.linkedin.com/in/shivambdj/)
- GitHub: [github.com/Shivam-Bhardwaj](https://github.com/Shivam-Bhardwaj)
- Website: [shivambhardwaj.com](https://shivambhardwaj.com/)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Deployed on [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

**Made with ❤️ for the robotics and engineering community**
