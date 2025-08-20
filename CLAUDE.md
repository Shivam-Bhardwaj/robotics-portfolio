# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Create production build with static export (outputs to /out)
- `npm run start` - Start production server
- `npm run clean` - Remove .next and out directories

### Code Quality
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run type-check` - TypeScript type checking without emit

### Testing
- `npm run test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report (threshold: 70%)
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:e2e:ui` - Open Playwright UI for debugging
- `npm run test:a11y` - Run accessibility tests
- `npm run test:security` - Run security audit and tests
- `npm run test:performance` - Run performance tests
- `npm run test:all` - Run all test suites
- `npm run test:ci` - CI pipeline test suite

### Security
- `npm run security:audit` - Run npm audit for high severity issues
- `npm run security:scan` - Run custom security scanning script

## Architecture

### Tech Stack
- **Next.js 15.4.5** with App Router - Static export configured for Firebase hosting
- **React 18.3.1** with TypeScript 5 (strict mode)
- **Tailwind CSS v4** with PostCSS processing
- **Framer Motion 12.23.12** for animations
- **Testing**: Jest (unit/integration), Playwright (E2E), jest-axe (a11y)

### Project Structure
```
robotics-portfolio/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (pages)/      # Individual page routes
│   │   ├── layout.tsx    # Root layout with RoombaSimulation background
│   │   └── globals.css   # Global styles and Tailwind directives
│   ├── components/       # Reusable React components
│   │   └── ui/          # Base UI components (Button, Card, etc.)
│   ├── data/            # Centralized data (site.ts, experience.ts, projects.ts)
│   └── lib/             # Utility functions and robotics algorithms
│       └── robotics/    # SLAM, pathfinding, sensor fusion algorithms
├── tests/               # Comprehensive test suite
│   ├── unit/           # Component and function tests
│   ├── integration/    # User flow tests
│   ├── e2e/           # Playwright end-to-end tests
│   ├── accessibility/  # WCAG compliance tests
│   ├── performance/   # Lighthouse and Core Web Vitals
│   └── security/      # Security vulnerability tests
├── public/             # Static assets and logos
└── out/               # Static export build output
```

### Key Patterns
- **Path aliases**: Use `@/` for imports from src directory
- **Data centralization**: All site config in `src/data/site.ts`
- **Component composition**: RootLayout wraps all pages with shared UI
- **Static export**: No server-side features, pure static HTML/CSS/JS
- **Testing coverage**: Minimum 70% coverage threshold enforced

### Styling Conventions
- Tailwind utility classes with consistent design tokens
- Color scheme: Fuchsia-600 and cyan-600 gradients
- Responsive breakpoints: Mobile-first with `md:` modifiers
- Backdrop blur effects for depth
- Fonts: Inter (primary), Orbitron (accent)

### Testing Strategy
- **Unit tests**: Jest with React Testing Library for components
- **E2E tests**: Playwright across Chrome, Firefox, Safari, and mobile
- **Accessibility**: jest-axe for WCAG compliance
- **Performance**: Lighthouse audits via Playwright
- **Security**: npm audit + custom security scanning
- **Coverage**: 70% minimum for branches, functions, lines, statements

### Deployment
- **Primary**: Firebase Hosting (firebase.json configured)
- **Build**: `npm run build` creates static export in /out
- **Domain**: shivambhardwaj.com (pending setup)
- **Alternative**: Vercel platform supported

### Critical Notes
- Always use absolute paths starting with `/` for file operations
- Preserve exact indentation when editing files
- No server-side features allowed (static export only)
- Test commands available for comprehensive validation
- Firebase hosting configured to serve from /out directory