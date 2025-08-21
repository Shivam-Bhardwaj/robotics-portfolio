import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KinematicsCalculator } from '@/components/calculators/KinematicsCalculator';

describe('KinematicsCalculator', () => {
  it('renders the forward and inverse kinematics buttons', () => {
    render(<KinematicsCalculator />);
    expect(screen.getByText('Forward Kinematics')).toBeInTheDocument();
    expect(screen.getByText('Inverse Kinematics')).toBeInTheDocument();
  });

  it('switches between forward and inverse kinematics modes', () => {
    render(<KinematicsCalculator />);
    const forwardButton = screen.getByText('Forward Kinematics');
    const inverseButton = screen.getByText('Inverse Kinematics');

    // Initial mode is forward
    expect(forwardButton).toHaveClass('bg-brand-primary');
    expect(inverseButton).not.toHaveClass('bg-brand-primary');

    // Switch to inverse
    fireEvent.click(inverseButton);
    expect(inverseButton).toHaveClass('bg-brand-primary');
    expect(forwardButton).not.toHaveClass('bg-brand-primary');
  });

  it('updates DH parameters on input change', () => {
    render(<KinematicsCalculator />);
    const input = screen.getAllByRole('spinbutton')[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10' } });
    expect(input.value).toBe('10');
  });

  it('disables theta input in inverse kinematics mode', () => {
    render(<KinematicsCalculator />);
    const inverseButton = screen.getByText('Inverse Kinematics');
    fireEvent.click(inverseButton);

    const thetaInputs = screen.getAllByRole('spinbutton').slice(15, 20);
    thetaInputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  it('shows the target position inputs in inverse kinematics mode', () => {
    render(<KinematicsCalculator />);
    const inverseButton = screen.getByText('Inverse Kinematics');
    fireEvent.click(inverseButton);

    expect(screen.getByText('Target Position')).toBeInTheDocument();
    expect(screen.getByLabelText('X (mm)')).toBeInTheDocument();
    expect(screen.getByLabelText('Y (mm)')).toBeInTheDocument();
    expect(screen.getByLabelText('Z (mm)')).toBeInTheDocument();
  });

  it('calculates forward kinematics and displays the result', async () => {
    render(<KinematicsCalculator />);
    // The result is calculated on mount, so it should be present
    await screen.findByText('End Effector Position');
    expect(screen.getByText(/X:/)).toBeInTheDocument();
    expect(screen.getByText(/Y:/)).toBeInTheDocument();
    expect(screen.getByText(/Z:/)).toBeInTheDocument();
  });
});
