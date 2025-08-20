# Component Documentation

This document provides detailed documentation for all React components in the Robotics Portfolio application.

## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
- [Layout Components](#layout-components)
- [Feature Components](#feature-components)
- [Interactive Components](#interactive-components)
- [Utility Components](#utility-components)
- [Component Guidelines](#component-guidelines)

## Overview

The Robotics Portfolio uses a component-based architecture with reusable, modular components. All components are built using TypeScript and functional React patterns with hooks.

### Component Categories

- **Layout Components** - Navigation, footer, and page structure
- **Feature Components** - Domain-specific components for portfolio sections
- **Interactive Components** - Games and simulations
- **Utility Components** - Reusable UI elements and helpers

## Core Components

### App Layout (`src/app/layout.tsx`)

The root layout component that wraps all pages.

```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}
```

**Features:**
- Global HTML structure
- Font loading (Geist font family)
- Meta tags and SEO configuration
- Global styles application

**Usage:**
```tsx
// Automatically applied to all pages in Next.js App Router
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### Homepage (`src/app/page.tsx`)

The main landing page component featuring hero section and navigation links.

**Features:**
- Gradient background effects
- Animated typewriter text
- Call-to-action buttons
- Professional introduction

**Key Elements:**
- Hero section with name and title
- Animated background blobs
- Typewriter component integration
- Navigation buttons to main sections

## Layout Components

### Navbar (`src/components/Navbar.tsx`)

The main navigation component providing site-wide navigation.

```typescript
interface NavItem {
  label: string;
  href: string;
}
```

**Features:**
- Responsive design (mobile and desktop)
- Active page highlighting
- Smooth hover transitions
- Gradient brand styling

**Navigation Items:**
- Home
- Experience
- Projects
- Skills
- Swarm Game
- Contact

**Implementation:**
```tsx
export const Navbar: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      {/* Navigation content */}
    </nav>
  );
};
```

### Footer (`src/components/Footer.tsx`)

Site footer with links and copyright information.

**Features:**
- Social media links
- Professional contact information
- Copyright notice
- Consistent branding

## Feature Components

### ExperienceCard (`src/components/ExperienceCard.tsx`)

Displays professional experience information in a card format.

```typescript
interface ExperienceCardProps {
  experience: Experience;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  imageUrl: string;
  description: string;
}
```

**Features:**
- Company logo display
- Role and duration information
- Location and description
- Responsive card layout
- Hover animations

**Usage:**
```tsx
<ExperienceCard experience={experienceData} />
```

**Styling:**
- Card-based layout with shadow effects
- Responsive image handling
- Consistent spacing and typography

### ProjectCard (`src/components/ProjectCard.tsx`)

Showcases individual projects with details and links.

```typescript
interface ProjectCardProps {
  project: Project;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
}
```

**Features:**
- Project thumbnail/image
- Technology stack badges
- Action buttons (demo, source)
- Detailed description
- Responsive grid layout

### SkillBadge (`src/components/SkillBadge.tsx`)

Displays technical skills with visual proficiency indicators.

```typescript
interface SkillBadgeProps {
  skill: Skill;
  category?: SkillCategory;
}

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon?: string;
  description?: string;
}
```

**Features:**
- Skill level visualization
- Category-based grouping
- Icon support
- Hover effects with descriptions
- Responsive badge grid

## Interactive Components

### SwarmGame (`src/components/SwarmGame.tsx`)

The main interactive swarm robotics simulation game.

```typescript
interface SwarmGameProps {
  width?: number;
  height?: number;
  robotCount?: number;
}

interface Robot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: string;
}
```

**Features:**
- Real-time physics simulation
- Mouse-controlled robot movement
- Coverage tracking and scoring
- Timer and statistics
- Reset functionality
- Canvas-based rendering

**Game Mechanics:**
- Robots follow mouse cursor
- Cohesion and separation behaviors
- Map exploration objectives
- Performance metrics

**Controls:**
- Mouse movement: Guide robot swarm
- 'R' key: Reset game
- Real-time coverage feedback

### RoombaSimulation (`src/components/RoombaSimulation.tsx`)

A smaller Roomba-style robot simulation component.

```typescript
interface RoombaSimulationProps {
  className?: string;
  autoPlay?: boolean;
}
```

**Features:**
- Autonomous robot behavior
- Random movement patterns
- Visual robot representation
- Boundary detection
- Auto-play functionality

## Utility Components

### Typewriter (`src/components/Typewriter.tsx`)

Animated text component that types out phrases with realistic timing.

```typescript
interface TypewriterProps {
  phrases: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}
```

**Features:**
- Multiple phrase rotation
- Customizable typing speed
- Natural typing rhythm
- Configurable pause durations
- Smooth cursor animation

**Implementation:**
```tsx
<Typewriter
  phrases={[
    "The gap between prototype and product? I live there.",
    "From self-driving to med-tech, I ship reliable systems.",
    "I optimize, reduce costs, and deliver hardware at scale."
  ]}
  speed={50}
  deleteSpeed={30}
  pauseDuration={2000}
/>
```

**Animation Details:**
- Character-by-character typing
- Realistic delays and variations
- Smooth cursor blinking
- Phrase cycling with smooth transitions

## Component Guidelines

### Development Standards

#### 1. TypeScript First
All components must be fully typed with interfaces for props and internal state.

```typescript
// Good
interface ComponentProps {
  title: string;
  description?: string;
  onClick: (id: string) => void;
}

export const Component: React.FC<ComponentProps> = ({ title, description, onClick }) => {
  // Component implementation
};

// Avoid
export const Component = ({ title, description, onClick }: any) => {
  // Component implementation
};
```

#### 2. Functional Components with Hooks
Use functional components with React hooks for all new components.

```typescript
// Preferred pattern
export const Component: React.FC<Props> = (props) => {
  const [state, setState] = useState<StateType>(initialState);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>{/* JSX */}</div>;
};
```

#### 3. Props Interface Design
Design props interfaces to be explicit and well-documented.

```typescript
interface ComponentProps {
  /** Primary title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Callback fired when component is clicked */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Child components */
  children?: React.ReactNode;
}
```

#### 4. Event Handler Patterns
Use consistent patterns for event handlers.

```typescript
// Preferred pattern
const handleClick = useCallback((event: React.MouseEvent) => {
  event.preventDefault();
  // Handle click
}, [dependencies]);

const handleSubmit = useCallback((formData: FormData) => {
  // Handle form submission
}, [dependencies]);
```

### Styling Guidelines

#### 1. Tailwind CSS Usage
Use Tailwind utility classes for all styling.

```tsx
// Good
<div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">

// Avoid inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

#### 2. Responsive Design
Always implement mobile-first responsive design.

```tsx
<div className="text-sm md:text-base lg:text-lg">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### 3. Animation Guidelines
Use Framer Motion for complex animations, CSS transitions for simple effects.

```tsx
// Simple transitions
<div className="transition-all duration-300 hover:scale-105">

// Complex animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

### Performance Considerations

#### 1. Memoization
Use React.memo for components that receive stable props.

```typescript
export const Component = React.memo<ComponentProps>(({ prop1, prop2 }) => {
  // Component implementation
});
```

#### 2. Callback Optimization
Use useCallback for event handlers passed to child components.

```typescript
const handleClick = useCallback(() => {
  // Handler implementation
}, [dependencies]);
```

#### 3. Effect Dependencies
Be explicit about useEffect dependencies.

```typescript
useEffect(() => {
  // Effect implementation
}, [dependency1, dependency2]); // Explicit dependencies
```

### Accessibility Guidelines

#### 1. Semantic HTML
Use semantic HTML elements and proper ARIA attributes.

```tsx
<button aria-label="Close dialog" onClick={handleClose}>
  <CloseIcon />
</button>

<nav role="navigation" aria-label="Main navigation">
  {/* Navigation items */}
</nav>
```

#### 2. Keyboard Navigation
Ensure all interactive elements are keyboard accessible.

```tsx
<div
  tabIndex={0}
  role="button"
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  Interactive content
</div>
```

#### 3. Focus Management
Implement proper focus management for dynamic content.

```typescript
const buttonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (isVisible) {
    buttonRef.current?.focus();
  }
}, [isVisible]);
```

### Testing Guidelines

#### 1. Component Testing
Write tests for component behavior and user interactions.

```typescript
// Example test structure
describe('Component', () => {
  it('renders with required props', () => {
    // Test implementation
  });
  
  it('handles user interactions correctly', () => {
    // Test implementation
  });
  
  it('displays data correctly', () => {
    // Test implementation
  });
});
```

#### 2. Accessibility Testing
Include accessibility testing in component tests.

```typescript
it('has proper accessibility attributes', () => {
  // Test ARIA attributes
  // Test keyboard navigation
  // Test screen reader compatibility
});
```

---

This component documentation serves as a comprehensive guide for understanding, using, and contributing to the Robotics Portfolio component library. Each component is designed with reusability, performance, and accessibility in mind.