import React from 'react';
import { render, screen } from '@testing-library/react';
import ExperienceCard from '@/components/ExperienceCard';

const mockExperience = {
  company: 'Test Company',
  role: 'Software Engineer',
  period: '2022 - Present',
  location: 'San Francisco, CA',
  description: 'Working on cool stuff.',
  imageUrl: '/test-image.png',
};

describe('ExperienceCard', () => {
  it('renders all the experience details correctly', () => {
    render(<ExperienceCard {...mockExperience} />);

    expect(screen.getByText(mockExperience.role)).toBeInTheDocument();
    expect(screen.getByText(`${mockExperience.company} • ${mockExperience.period}`)).toBeInTheDocument();
    expect(screen.getByText(mockExperience.location)).toBeInTheDocument();
    expect(screen.getByText(mockExperience.description)).toBeInTheDocument();
  });

  it('renders the company logo with correct src and alt text', () => {
    render(<ExperienceCard {...mockExperience} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(mockExperience.imageUrl)));
    expect(image).toHaveAttribute('alt', mockExperience.company);
  });

  it('has the correct CSS classes for styling', () => {
    const { container } = render(<ExperienceCard {...mockExperience} />);
    const div = container.firstChild;

    expect(div).toHaveClass('flex gap-4 p-4 border rounded-md bg-white shadow-sm');
  });
});
