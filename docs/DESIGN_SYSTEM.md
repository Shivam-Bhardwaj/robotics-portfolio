# Design System Documentation
## Robotics Portfolio - Shivam Bhardwaj

### Table of Contents
- [Overview](#overview)
- [Color System](#color-system)
- [Typography](#typography)
- [Components](#components)
- [Spacing & Layout](#spacing--layout)
- [Animation Guidelines](#animation-guidelines)
- [Accessibility](#accessibility)
- [Implementation Guide](#implementation-guide)

---

## Overview

This design system establishes a comprehensive visual language for Shivam Bhardwaj's robotics portfolio website. It combines modern web design principles with a futuristic robotics aesthetic, emphasizing technical expertise while maintaining excellent usability.

### Design Principles
- **Technical Excellence**: Visual design reflects engineering precision
- **Future-Forward**: Modern aesthetics with robotics-inspired elements
- **Accessibility First**: WCAG 2.1 AA compliance
- **Performance Optimized**: Lightweight and fast interactions
- **Mobile First**: Responsive design for all devices

---

## Color System

### Primary Brand Colors
```css
--brand-primary: #E11D48    /* Rose-600 - Primary brand color */
--brand-secondary: #0EA5E9  /* Sky-500 - Secondary brand color */
--brand-accent: #8B5CF6     /* Violet-500 - Accent color */
```

### Robotics Theme Colors
```css
--electric: #06B6D4         /* Cyan-500 - Electric blue */
--neon: #10B981             /* Emerald-500 - Neon green */
--circuit: #F59E0B          /* Amber-500 - Circuit yellow */
--plasma: #EC4899           /* Pink-500 - Plasma pink */
--laser: #EF4444            /* Red-500 - Laser red */
```

### Gradient System
```css
--gradient-from: #E879F9    /* Fuchsia-400 */
--gradient-via: #A78BFA     /* Violet-400 */
--gradient-to: #22D3EE      /* Cyan-400 */
```

### Neutral Colors
```css
--neutral-50: #FAFAFA
--neutral-100: #F5F5F5
--neutral-200: #E5E5E5
--neutral-300: #D4D4D4
--neutral-400: #A3A3A3
--neutral-500: #737373
--neutral-600: #525252
--neutral-700: #404040
--neutral-800: #262626
--neutral-900: #171717
--neutral-950: #0A0A0A
```

### Status Colors
```css
--success: #10B981          /* Success green */
--warning: #F59E0B          /* Warning amber */
--error: #EF4444            /* Error red */
--info: #3B82F6             /* Info blue */
```

### Usage Guidelines
- **Primary**: Use for CTAs, links, and key interactive elements
- **Robotics Colors**: Use for technical highlights, code blocks, and special features
- **Gradients**: Use sparingly for hero sections and premium features
- **Neutrals**: Use for text, backgrounds, and subtle UI elements
- **Status**: Use for feedback, alerts, and system messages

---

## Typography

### Font Stack
```css
--font-sans: 'Inter', system-ui, sans-serif          /* Primary text */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace /* Code text */
--font-display: 'Orbitron', 'Inter', system-ui        /* Headings */
```

### Type Scale
```css
/* Display Sizes */
--text-display-xl: 4.5rem (72px)
--text-display-lg: 3.75rem (60px)
--text-display-md: 2.875rem (46px)
--text-display-sm: 2.25rem (36px)

/* Heading Sizes */
--text-6xl: 3.75rem (60px)
--text-5xl: 3rem (48px)
--text-4xl: 2.25rem (36px)
--text-3xl: 1.875rem (30px)
--text-2xl: 1.5rem (24px)
--text-xl: 1.25rem (20px)

/* Body Sizes */
--text-lg: 1.125rem (18px)
--text-base: 1rem (16px)
--text-sm: 0.875rem (14px)
--text-xs: 0.75rem (12px)
```

### Font Weights
- **Light**: 300 - Secondary text, captions
- **Regular**: 400 - Body text, descriptions
- **Medium**: 500 - Emphasized text, buttons
- **Semibold**: 600 - Subheadings, labels
- **Bold**: 700 - Headings, important text
- **Extrabold**: 800 - Display text, hero titles

### Usage Guidelines
- Use **Orbitron** for main headings and robotics-themed elements
- Use **Inter** for body text and navigation
- Use **JetBrains Mono** for code snippets and technical data
- Maintain consistent line heights (1.5 for body, 1.2 for headings)
- Use font weights to establish clear hierarchy

---

## Components

### Button Variants

#### Primary Button
```tsx
<Button variant="primary" size="lg">
  Primary Action
</Button>
```
- Use for main CTAs and primary actions
- Gradient background with hover effects
- High contrast for accessibility

#### Secondary Button
```tsx
<Button variant="secondary" size="md">
  Secondary Action
</Button>
```
- Use for secondary actions and alternatives
- Outlined style with hover fill
- Maintains brand consistency

#### Robotics Button
```tsx
<Button variant="robotics" size="lg">
  Technical Feature
</Button>
```
- Use for technical features and robotics-specific actions
- Electric gradient with glow effects
- Orbitron font for futuristic feel

### Card Components

#### Default Card
```tsx
<Card variant="default" hover={true}>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

#### Glow Card
```tsx
<Card variant="glow">
  <!-- Enhanced with subtle glow effects -->
</Card>
```

#### Glass Card
```tsx
<Card variant="glass">
  <!-- Glassmorphism effect with backdrop blur -->
</Card>
```

#### Robotics Card
```tsx
<Card variant="robotics">
  <!-- Dark theme with electric accents -->
</Card>
```

### Badge Components
```tsx
<Badge variant="robotics" animate={true}>
  Technology
</Badge>
```

### Input Components
```tsx
<Input 
  variant="robotics"
  label="Email Address"
  icon={<MailIcon />}
  error="Invalid email format"
/>
```

---

## Spacing & Layout

### Spacing Scale
```css
--spacing-px: 1px
--spacing-0: 0px
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
--spacing-5: 1.25rem (20px)
--spacing-6: 1.5rem (24px)
--spacing-8: 2rem (32px)
--spacing-10: 2.5rem (40px)
--spacing-12: 3rem (48px)
--spacing-16: 4rem (64px)
--spacing-20: 5rem (80px)
--spacing-24: 6rem (96px)
```

### Layout Classes
```css
.container          /* Max-width container with responsive padding */
.section-padding    /* Consistent section spacing */
.mobile-stack       /* Stack elements vertically on mobile */
.mobile-center      /* Center content on mobile */
.mobile-full        /* Full width on mobile */
```

### Grid System
- Use CSS Grid for complex layouts
- Use Flexbox for simple alignments
- 12-column grid system available via Tailwind
- Responsive breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)

---

## Animation Guidelines

### Animation Principles
1. **Purposeful**: Every animation serves a functional purpose
2. **Performant**: Use CSS transforms and opacity for best performance
3. **Accessible**: Respect `prefers-reduced-motion`
4. **Consistent**: Use standardized easing and timing

### Standard Durations
```css
--transition-fast: 150ms      /* Micro-interactions */
--transition-normal: 300ms    /* Standard interactions */
--transition-slow: 500ms      /* Page transitions */
```

### Easing Functions
```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1)     /* Default easing */
--ease-in: cubic-bezier(0.4, 0, 1, 1)        /* Entry animations */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)  /* Symmetrical */
```

### Animation Classes
```css
.animate-fade-in        /* Fade in effect */
.animate-slide-up       /* Slide up from bottom */
.animate-float          /* Subtle floating animation */
.animate-pulse-glow     /* Robotics-themed pulsing glow */
.animate-bounce-gentle  /* Gentle bounce effect */
```

### Framer Motion Variants
```tsx
// Import from animation library
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';

<motion.div variants={staggerContainer}>
  <motion.h1 variants={fadeIn}>Title</motion.h1>
  <motion.p variants={slideUp}>Description</motion.p>
</motion.div>
```

---

## Accessibility

### Color Contrast
- All text meets WCAG 2.1 AA standards (4.5:1 ratio)
- Interactive elements meet enhanced contrast (7:1 ratio)
- Status colors are distinguishable by color-blind users

### Focus Management
```css
.focus-visible:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Screen Reader Support
```tsx
<span className="sr-only">Hidden screen reader text</span>
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Interactive States
- Clear hover states for all interactive elements
- Keyboard navigation support
- Touch-friendly target sizes (44px minimum)
- Loading states for async actions

---

## Implementation Guide

### Getting Started
1. Import design system utilities in your component:
```tsx
import { Button, Card, Badge } from '@/components/ui';
import { fadeIn, slideUp } from '@/lib/animations';
```

2. Use Tailwind classes with design system tokens:
```tsx
<div className="bg-background text-foreground p-section">
  <h1 className="text-display-lg text-gradient font-robotics">
    Hello World
  </h1>
</div>
```

3. Apply consistent spacing and layout:
```tsx
<section className="section-padding">
  <div className="container">
    <div className="grid grid-cols-auto-fit gap-6">
      {/* Content */}
    </div>
  </div>
</section>
```

### Best Practices
1. **Consistency**: Use design tokens instead of arbitrary values
2. **Performance**: Leverage CSS variables for theme switching
3. **Maintainability**: Keep component API simple and predictable
4. **Scalability**: Follow atomic design principles
5. **Testing**: Test components in all states and variants

### Design Tokens Reference
All design tokens are defined in:
- `tailwind.config.ts` - Tailwind configuration
- `globals.css` - CSS custom properties
- `@/lib/animations.ts` - Motion variants

### Component Guidelines
- Keep components focused and single-purpose
- Use TypeScript for prop validation
- Include hover and focus states
- Support both light and dark themes
- Provide loading and error states

---

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Graceful degradation for unsupported features
- CSS Grid fallbacks where needed

## Performance Considerations
- CSS-in-JS optimizations
- Lazy loading for heavy components
- Optimized font loading with font-display: swap
- Efficient animation techniques
- Bundle size optimization

---

*This design system is a living document that evolves with the product. Always refer to the latest version in the repository.*