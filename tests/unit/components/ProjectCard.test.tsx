import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';

const mockProject = {
  name: 'Test Project',
  description: 'A cool project.',
  imageUrl: '/test-project.png',
  link: 'https://example.com',
};

describe('ProjectCard', () => {
  it('renders all the project details correctly', () => {
    render(<ProjectCard {...mockProject} />);

    expect(screen.getByText(mockProject.name)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    expect(screen.getByText('View Project →')).toBeInTheDocument();
  });

  it('renders the project image with correct src and alt text', () => {
    render(<ProjectCard {...mockProject} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(mockProject.imageUrl)));
    expect(image).toHaveAttribute('alt', mockProject.name);
  });

  it('renders as a link with the correct href and target attributes', () => {
    render(<ProjectCard {...mockProject} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockProject.link);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('has the correct CSS classes for styling', () => {
    const { container } = render(<ProjectCard {...mockProject} />);
    const link = container.firstChild;

    expect(link).toHaveClass('group relative block border rounded-xl overflow-hidden shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl');
  });
});
