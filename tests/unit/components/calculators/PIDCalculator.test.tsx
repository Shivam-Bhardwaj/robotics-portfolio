import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PIDCalculator } from '@/components/calculators/PIDCalculator';

describe('PIDCalculator', () => {
  it('renders the PID gains, system parameters, and performance metrics sections', () => {
    render(<PIDCalculator />);
    expect(screen.getByText('PID Gains')).toBeInTheDocument();
    expect(screen.getByText('System Parameters')).toBeInTheDocument();
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
  });

  it('updates PID gain values on input change', () => {
    render(<PIDCalculator />);
    const kpInput = screen.getByLabelText('KP') as HTMLInputElement;
    fireEvent.change(kpInput, { target: { value: '1.5' } });
    expect(kpInput.value).toBe('1.5');
  });

  it('updates system parameter values on input change', () => {
    render(<PIDCalculator />);
    const setpointInput = screen.getByLabelText('Setpoint') as HTMLInputElement;
    fireEvent.change(setpointInput, { target: { value: '120' } });
    expect(setpointInput.value).toBe('120');
  });

  it('runs the simulation and displays the performance metrics', async () => {
    render(<PIDCalculator />);
    // The result is calculated on mount, so it should be present
    await screen.findByText('Performance Metrics');
    expect(screen.getByText(/Settling Time:/)).toBeInTheDocument();
    expect(screen.getByText(/Overshoot:/)).toBeInTheDocument();
    expect(screen.getByText(/Steady State Error:/)).toBeInTheDocument();
    expect(screen.getByText(/Rise Time:/)).toBeInTheDocument();
  });
});
