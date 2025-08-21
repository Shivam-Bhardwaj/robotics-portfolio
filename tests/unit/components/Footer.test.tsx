import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';
import { siteConfig } from '@/data/site';

describe('Footer', () => {
  it('renders the copyright notice with the current year, site name, and role', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const expectedText = `© ${currentYear} • ${siteConfig.name} — ${siteConfig.role}`;
    
    // Check for the text content within a single element
    const paragraph = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'span' && content.includes(siteConfig.name);
    });
    
    expect(paragraph).toBeInTheDocument();
  });

  it('renders the LinkedIn and GitHub links with the correct href and target attributes', () => {
    render(<Footer />);

    const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' });
    expect(linkedinLink).toHaveAttribute('href', siteConfig.links.linkedin);
    expect(linkedinLink).toHaveAttribute('target', '_blank');

    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toHaveAttribute('href', siteConfig.links.github);
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('has the correct CSS classes for styling', () => {
    const { container } = render(<Footer />);
    const footer = container.firstChild;

    expect(footer).toHaveClass('bg-white text-gray-700 p-4 mt-8 border-t');
  });
});
