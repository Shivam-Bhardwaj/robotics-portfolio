import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SensorCalculator } from '@/components/calculators/SensorCalculator';

describe('SensorCalculator', () => {
  it('renders the GPS, IMU, and Wheel Encoder sections', () => {
    render(<SensorCalculator />);
    expect(screen.getByText('GPS Sensor')).toBeInTheDocument();
    expect(screen.getByText('IMU Sensor')).toBeInTheDocument();
    expect(screen.getByText('Wheel Encoder')).toBeInTheDocument();
  });

  it('updates GPS data on input change', () => {
    render(<SensorCalculator />);
    const xInput = screen.getByLabelText('X Position (m)') as HTMLInputElement;
    fireEvent.change(xInput, { target: { value: '110.5' } });
    expect(xInput.value).toBe('110.5');
  });

  it('updates IMU data on input change', () => {
    render(<SensorCalculator />);
    const vxInput = screen.getByLabelText('X Velocity (m/s)') as HTMLInputElement;
    fireEvent.change(vxInput, { target: { value: '1.5' } });
    expect(vxInput.value).toBe('1.5');
  });

  it('updates encoder data on input change', () => {
    render(<SensorCalculator />);
    const distanceInput = screen.getByLabelText('Distance (m)') as HTMLInputElement;
    fireEvent.change(distanceInput, { target: { value: '160.2' } });
    expect(distanceInput.value).toBe('160.2');
  });

  it('calculates and displays the fused estimate', async () => {
    render(<SensorCalculator />);
    // The result is calculated on mount, so it should be present
    await screen.findByText('Fused Estimate');
    expect(screen.getByText(/Position/)).toBeInTheDocument();
    expect(screen.getByText(/Velocity/)).toBeInTheDocument();
    expect(screen.getByText(/Confidence/)).toBeInTheDocument();
  });
});
