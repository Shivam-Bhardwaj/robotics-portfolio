# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based robotics portfolio website for Shivam Bhardwaj, showcasing robotics projects, skills, and contact information. The site features modern React components with Framer Motion animations and a distinctive Roomba simulation background.

## Development Commands

- **Development server**: `npm run dev` (opens at http://localhost:3000)
- **Production build**: `npm run build`
- **Production server**: `npm run start` 
- **Linting**: `npm run lint`

## Architecture

### Directory Structure
- `src/app/` - Next.js 15 App Router pages (contact, projects, skills)
- `src/components/` - Reusable React components
- `src/data/site.ts` - Site configuration and personal information

### Key Technologies
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS v4** for styling with PostCSS
- **Framer Motion** for animations
- **Google Fonts**: Inter (primary) and Orbitron (accent, available as CSS variable `--font-orbitron`)

### Component Architecture
- `RootLayout` includes global `RoombaSimulation` background component
- Standard layout: `Navbar` → `main` content → `Footer`
- Path aliases use `@/` for `src/` directory
- Personal data centralized in `src/data/site.ts` as `siteConfig`

### Styling Approach
- Tailwind utility classes with gradient backgrounds (`from-fuchsia-600 to-cyan-600`)
- Responsive design with `md:` breakpoints
- Blur effects and backdrop styling for visual depth
- Color scheme: fuchsia and cyan accents

### TypeScript Configuration
- Strict mode enabled
- Path mapping: `@/*` → `./src/*`
- Next.js plugin integration