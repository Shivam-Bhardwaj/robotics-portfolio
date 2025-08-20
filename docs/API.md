# API Documentation

This document provides detailed information about the data structures, interfaces, and internal APIs used in the Robotics Portfolio application.

## Table of Contents

- [Overview](#overview)
- [Site Configuration API](#site-configuration-api)
- [Experience Data API](#experience-data-api)
- [Project Data API](#project-data-api)
- [Skills Data API](#skills-data-api)
- [Component Props APIs](#component-props-apis)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)

## Overview

The Robotics Portfolio uses a data-driven architecture with TypeScript interfaces defining the shape of all data structures. This document outlines the APIs for data consumption, component interfaces, and utility functions.

### Data Sources

All data is statically imported from TypeScript modules in the `src/data/` directory:
- `site.ts` - Site-wide configuration
- `experience.ts` - Professional experience data
- Additional data files can be added following the same pattern

## Site Configuration API

### `siteConfig`

Central configuration object for site-wide settings.

**Source:** `src/data/site.ts`

```typescript
interface SiteConfig {
  name: string;
  role: string;
  email: string;
  location: string;
  currentCompany: string;
  links: {
    github: string;
    linkedin: string;
    website: string;
    resume: string;
  };
}

export const siteConfig: SiteConfig = {
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
};
```

**Usage:**
```typescript
import { siteConfig } from '@/data/site';

// Access site information
const siteName = siteConfig.name;
const contactEmail = siteConfig.email;
const githubUrl = siteConfig.links.github;
```

**Properties:**
- `name` - Full name displayed on the site
- `role` - Professional title/role
- `email` - Contact email address
- `location` - Current location (city, state)
- `currentCompany` - Current employer
- `links` - Object containing social media and professional links

## Experience Data API

### `experiences`

Array of professional experience entries.

**Source:** `src/data/experience.ts`

```typescript
interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  imageUrl: string;
  description: string;
}

export const experiences: readonly Experience[] = [
  {
    company: "Design Visionaries",
    role: "Project Manager - Mechatronics",
    period: "Apr 2023 - Present",
    location: "San Jose, CA",
    imageUrl: "/logos/designvisionaries.svg",
    description: "Turned napkin sketches into profitable hardware, delivering $300k+ projects for Tesla, Apple, Meta, Applied Materials, and Saildrone. Led embedded systems for 5+ stealth startups.",
  },
  // Additional experiences...
];

export type Experience = typeof experiences[number];
```

**Usage:**
```typescript
import { experiences, type Experience } from '@/data/experience';

// Get all experiences
const allExperiences = experiences;

// Get current experience (first in array)
const currentExperience = experiences[0];

// Filter experiences by company
const designVisionariesExperience = experiences.find(
  exp => exp.company === "Design Visionaries"
);
```

**Properties:**
- `company` - Company name
- `role` - Job title/position
- `period` - Employment duration (e.g., "Apr 2023 - Present")
- `location` - Work location
- `imageUrl` - Path to company logo (relative to public/)
- `description` - Brief description of role and achievements

**Methods:**

```typescript
// Get experiences by date range
export const getExperiencesByYear = (year: number): Experience[] => {
  return experiences.filter(exp => exp.period.includes(year.toString()));
};

// Get current experience
export const getCurrentExperience = (): Experience | null => {
  return experiences.find(exp => exp.period.includes('Present')) || null;
};

// Get experience duration in months
export const getExperienceDuration = (experience: Experience): number => {
  // Implementation for calculating duration
};
```

## Project Data API

### `projects` (Planned)

Array of project entries for the portfolio showcase.

**Proposed Structure:**

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: ProjectCategory;
  imageUrl?: string;
  galleryImages?: string[];
  demoUrl?: string;
  sourceUrl?: string;
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  startDate: string;
  endDate?: string;
  client?: string;
  teamSize?: number;
  role: string;
  achievements: string[];
  challenges: string[];
  metrics?: {
    [key: string]: string | number;
  };
}

enum ProjectCategory {
  ROBOTICS = 'robotics',
  AUTONOMOUS_SYSTEMS = 'autonomous-systems',
  HARDWARE = 'hardware',
  SOFTWARE = 'software',
  RESEARCH = 'research',
  CONSULTING = 'consulting',
}

export const projects: readonly Project[] = [
  {
    id: 'tesla-autopilot-testing',
    title: 'Tesla Autopilot Testing Framework',
    description: 'Developed comprehensive testing framework for autonomous vehicle systems',
    longDescription: 'Created and implemented a robust testing framework for Tesla\'s Autopilot system...',
    technologies: ['Python', 'ROS', 'OpenCV', 'TensorFlow', 'C++'],
    category: ProjectCategory.AUTONOMOUS_SYSTEMS,
    imageUrl: '/projects/tesla-autopilot.jpg',
    status: 'completed',
    featured: true,
    startDate: '2023-01',
    endDate: '2023-06',
    client: 'Tesla',
    role: 'Lead Test Engineer',
    achievements: [
      'Reduced testing time by 40%',
      'Improved accuracy of edge case detection by 25%',
      'Integrated with existing CI/CD pipeline'
    ],
    challenges: [
      'Real-time processing constraints',
      'Integration with legacy systems',
      'Safety-critical requirements'
    ],
    metrics: {
      'Test Coverage': '95%',
      'Performance Improvement': '40%',
      'Bug Detection Rate': '+25%'
    }
  },
  // Additional projects...
];
```

**Usage:**
```typescript
import { projects, ProjectCategory } from '@/data/projects';

// Get all projects
const allProjects = projects;

// Get featured projects
const featuredProjects = projects.filter(project => project.featured);

// Get projects by category
const roboticsProjects = projects.filter(
  project => project.category === ProjectCategory.ROBOTICS
);

// Get completed projects
const completedProjects = projects.filter(
  project => project.status === 'completed'
);
```

## Skills Data API

### `skills` (Planned)

Categorized technical skills with proficiency levels.

**Proposed Structure:**

```typescript
interface Skill {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  lastUsed?: string;
  certifications?: string[];
  projects?: string[]; // Project IDs that used this skill
}

enum SkillLevel {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
}

enum SkillCategory {
  PROGRAMMING_LANGUAGES = 'programming-languages',
  FRAMEWORKS = 'frameworks',
  TOOLS = 'tools',
  HARDWARE = 'hardware',
  ROBOTICS = 'robotics',
  AI_ML = 'ai-ml',
  MANAGEMENT = 'management',
}

export const skills: readonly Skill[] = [
  {
    name: 'Python',
    level: SkillLevel.EXPERT,
    category: SkillCategory.PROGRAMMING_LANGUAGES,
    icon: '/icons/python.svg',
    description: 'Advanced Python development for robotics and automation',
    yearsOfExperience: 8,
    lastUsed: '2024-01',
    projects: ['tesla-autopilot-testing', 'saildrone-automation']
  },
  {
    name: 'ROS/ROS2',
    level: SkillLevel.EXPERT,
    category: SkillCategory.ROBOTICS,
    icon: '/icons/ros.svg',
    description: 'Robot Operating System for distributed robotics applications',
    yearsOfExperience: 6,
    lastUsed: '2024-01',
    certifications: ['ROS Industrial Developer']
  },
  // Additional skills...
];
```

**Usage:**
```typescript
import { skills, SkillCategory, SkillLevel } from '@/data/skills';

// Get skills by category
const programmingSkills = skills.filter(
  skill => skill.category === SkillCategory.PROGRAMMING_LANGUAGES
);

// Get expert-level skills
const expertSkills = skills.filter(
  skill => skill.level === SkillLevel.EXPERT
);

// Get skills used in specific project
const getSkillsForProject = (projectId: string) => {
  return skills.filter(skill => 
    skill.projects?.includes(projectId)
  );
};
```

## Component Props APIs

### ExperienceCard Props

```typescript
interface ExperienceCardProps {
  experience: Experience;
  className?: string;
  onClick?: (experience: Experience) => void;
  showFullDescription?: boolean;
}
```

### ProjectCard Props

```typescript
interface ProjectCardProps {
  project: Project;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  onViewDetails?: (projectId: string) => void;
  showTechnologies?: boolean;
  showMetrics?: boolean;
}
```

### SkillBadge Props

```typescript
interface SkillBadgeProps {
  skill: Skill;
  showLevel?: boolean;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outline' | 'solid';
  onClick?: (skill: Skill) => void;
}
```

### SwarmGame Props

```typescript
interface SwarmGameProps {
  width?: number;
  height?: number;
  robotCount?: number;
  speed?: number;
  onScoreUpdate?: (score: number) => void;
  onGameComplete?: (finalScore: number, time: number) => void;
  className?: string;
}
```

### Typewriter Props

```typescript
interface TypewriterProps {
  phrases: string[];
  speed?: number;        // Typing speed in milliseconds
  deleteSpeed?: number;  // Deletion speed in milliseconds
  pauseDuration?: number; // Pause between phrases in milliseconds
  loop?: boolean;        // Whether to loop through phrases
  cursor?: boolean;      // Whether to show cursor
  cursorChar?: string;   // Cursor character
  onComplete?: () => void; // Callback when all phrases are typed
  className?: string;
}
```

## Utility Functions

### Date Utilities

```typescript
// src/lib/date-utils.ts

/**
 * Parse experience period string into start and end dates
 */
export const parseExperiencePeriod = (period: string): {
  startDate: Date;
  endDate: Date | null;
  isPresent: boolean;
} => {
  // Implementation
};

/**
 * Calculate duration between two dates in months
 */
export const calculateDurationInMonths = (
  startDate: Date, 
  endDate: Date | null
): number => {
  // Implementation
};

/**
 * Format date for display
 */
export const formatDate = (
  date: Date, 
  format: 'short' | 'long' | 'month-year'
): string => {
  // Implementation
};
```

### Animation Utilities

```typescript
// src/lib/animation-utils.ts

/**
 * Generate staggered animation delays for lists
 */
export const generateStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return index * baseDelay;
};

/**
 * Easing functions for custom animations
 */
export const easingFunctions = {
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number): number => t * (2 - t),
  easeIn: (t: number): number => t * t,
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
```

### Responsive Utilities

```typescript
// src/lib/responsive-utils.ts

/**
 * Get current breakpoint based on window width
 */
export const getCurrentBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
  // Implementation
};

/**
 * Check if current device is mobile
 */
export const isMobile = (): boolean => {
  return getCurrentBreakpoint() === 'mobile';
};

/**
 * Get viewport dimensions
 */
export const getViewportDimensions = (): { width: number; height: number } => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
```

## Type Definitions

### Global Types

```typescript
// src/types/global.d.ts

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
```

### Component Types

```typescript
// src/types/components.d.ts

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface ClickableComponentProps extends BaseComponentProps {
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export interface FormComponentProps extends BaseComponentProps {
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-describedby'?: string;
}

export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ComponentSize = 'small' | 'medium' | 'large';
export type ComponentState = 'idle' | 'loading' | 'success' | 'error';
```

## API Usage Examples

### Fetching and Displaying Experience Data

```typescript
import { experiences, type Experience } from '@/data/experience';
import { ExperienceCard } from '@/components/ExperienceCard';

export const ExperiencePage: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  
  const handleExperienceClick = (experience: Experience) => {
    setSelectedExperience(experience);
  };
  
  return (
    <div className="grid gap-6">
      {experiences.map((experience, index) => (
        <ExperienceCard
          key={`${experience.company}-${index}`}
          experience={experience}
          onClick={handleExperienceClick}
          showFullDescription={false}
        />
      ))}
    </div>
  );
};
```

### Creating a Skills Filter

```typescript
import { skills, SkillCategory } from '@/data/skills';
import { SkillBadge } from '@/components/SkillBadge';

export const SkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') return skills;
    return skills.filter(skill => skill.category === selectedCategory);
  }, [selectedCategory]);
  
  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setSelectedCategory('all')}>All</button>
        {Object.values(SkillCategory).map(category => (
          <button 
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Skills grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredSkills.map(skill => (
          <SkillBadge
            key={skill.name}
            skill={skill}
            showLevel={true}
            showDescription={true}
          />
        ))}
      </div>
    </div>
  );
};
```

---

This API documentation provides a comprehensive reference for all data structures and interfaces used in the Robotics Portfolio application. It serves as a guide for developers working with the codebase and extends the application with new features.