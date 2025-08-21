import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrajectoryCalculator } from '@/components/calculators/TrajectoryCalculator';

describe('TrajectoryCalculator', () => {
  it('renders the start position, end position, and motion constraints sections', () => {
    render(<TrajectoryCalculator />);
    expect(screen.getByText('Start Position (mm)')).toBeInTheDocument();
    expect(screen.getByText('End Position (mm)')).toBeInTheDocument();
    expect(screen.getByText('Motion Constraints')).toBeInTheDocument();
  });

  it('updates start position values on input change', () => {
    render(<TrajectoryCalculator />);
    const xInput = screen.getAllByLabelText(/x:/i)[0] as HTMLInputElement;
    fireEvent.change(xInput, { target: { value: '10' } });
    expect(xInput.value).toBe('10');
  });

  it('updates end position values on input change', () => {
    render(<TrajectoryCalculator />);
    const xInput = screen.getAllByLabelText(/x:/i)[1] as HTMLInputElement;
    fireEvent.change(xInput, { target: { value: '120' } });
    expect(xInput.value).toBe('120');
  });

  it('updates motion constraint values on input change', () => {
    render(<TrajectoryCalculator />);
    const maxVelInput = screen.getByLabelText('Max Velocity (mm/s)') as HTMLInputElement;
    fireEvent.change(maxVelInput, { target: { value: '60' } });
    expect(maxVelInput.value).toBe('60');
  });

  it('generates and displays the trajectory profile', async () => {
    render(<TrajectoryCalculator />);
    // The result is calculated on mount, so it should be present
    await screen.findByText('Trajectory Profile');
    expect(screen.getByText(/Distance:/)).toBeInTheDocument();
    expect(screen.getByText(/Peak Velocity:/)).toBeInTheDocument();
    expect(screen.getByText(/Peak Acceleration:/)).toBeInTheDocument();
  });
});
