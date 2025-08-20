# Contributing to Robotics Portfolio

Thank you for your interest in contributing to the Robotics Portfolio project! We welcome contributions from the community and are grateful for any improvements you can provide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

This project adheres to a code of conduct adapted from the Contributor Covenant. By participating, you are expected to uphold this code. Please report unacceptable behavior to contact@shivambhardwaj.com.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository**
   ```bash
   # Click the Fork button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/robotics-portfolio.git
   cd robotics-portfolio
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Shivam-Bhardwaj/robotics-portfolio.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with the following format:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `style/description` - UI/UX improvements

Examples:
```bash
git checkout -b feature/add-dark-mode
git checkout -b fix/navbar-mobile-responsiveness
git checkout -b docs/update-api-documentation
```

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

3. **Make your changes**
   - Follow the coding standards outlined below
   - Test your changes thoroughly
   - Update documentation if necessary

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

### Commit Message Guidelines

Follow the conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add dark mode toggle to navigation
fix: resolve mobile menu overflow issue
docs: update installation instructions
style: improve button hover animations
refactor: extract reusable hook for API calls
```

## Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type - use proper typing
- Use meaningful variable and function names

```typescript
// Good
interface ProjectData {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
}

// Avoid
const data: any = { /* ... */ };
```

### React Component Guidelines

- Use functional components with hooks
- Keep components small and focused (single responsibility)
- Use proper prop typing with interfaces
- Extract custom hooks for reusable logic

```typescript
// Good component structure
interface ProjectCardProps {
  project: ProjectData;
  onSelect: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const handleClick = () => onSelect(project.id);
  
  return (
    <div onClick={handleClick}>
      {/* Component content */}
    </div>
  );
};
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent spacing and color schemes
- Implement smooth animations with Framer Motion

```typescript
// Good Tailwind usage
<div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
```

### File Organization

- Keep related files together
- Use descriptive file names
- Export components from index files where appropriate
- Separate business logic from UI components

## Pull Request Process

### Before Submitting

1. **Ensure your code follows the coding standards**
2. **Run the linter and fix any issues**
   ```bash
   npm run lint:fix
   ```

3. **Run type checking**
   ```bash
   npm run type-check
   ```

4. **Test your changes thoroughly**
   - Test on different screen sizes
   - Check browser compatibility
   - Verify animations work smoothly

5. **Update documentation if needed**
   - Update README.md if adding new features
   - Add JSDoc comments for complex functions
   - Update component documentation

### Submitting the Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use a descriptive title
   - Fill out the PR template completely
   - Link related issues using keywords like "Closes #123"
   - Add screenshots for UI changes
   - Tag relevant reviewers

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested this change locally
- [ ] I have tested on multiple screen sizes
- [ ] I have tested browser compatibility

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:
- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots or screen recordings if applicable
- Browser and device information
- Console error messages if any

### Feature Requests

For feature requests, please provide:
- Clear description of the proposed feature
- Use case and motivation for the feature
- Possible implementation approach
- Any relevant mockups or examples

### Issue Labels

We use the following labels to organize issues:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## Project Structure

Understanding the project structure will help you contribute more effectively:

```
src/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Page components
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Basic UI components
│   └── features/         # Feature-specific components
├── data/                 # Static data and configurations
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── styles/               # Global styles and Tailwind config
└── types/                # TypeScript type definitions
```

## Testing Guidelines

### Manual Testing

Before submitting your PR, please test:
- **Responsive design**: Test on mobile, tablet, and desktop
- **Cross-browser compatibility**: Chrome, Firefox, Safari, Edge
- **Performance**: Check for smooth animations and fast loading
- **Accessibility**: Test with keyboard navigation and screen readers

### Automated Testing

We encourage adding tests for new features:
- Unit tests for utility functions
- Component tests for React components
- Integration tests for complex features

## Getting Help

If you need help or have questions:
- Check existing issues and discussions
- Join our community discussions
- Reach out via email: contact@shivambhardwaj.com
- Create an issue with the `question` label

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project documentation
- Release notes for significant contributions

Thank you for contributing to the Robotics Portfolio project! Your efforts help make this project better for everyone.