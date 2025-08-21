import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransformCalculator } from '@/components/calculators/TransformCalculator';

describe('TransformCalculator', () => {
  it('renders the translation, rotation, and input point sections', () => {
    render(<TransformCalculator />);
    expect(screen.getByText('Translation (mm)')).toBeInTheDocument();
    expect(screen.getByText('Rotation (degrees)')).toBeInTheDocument();
    expect(screen.getByText('Input Point (mm)')).toBeInTheDocument();
  });

  it('updates translation values on input change', () => {
    render(<TransformCalculator />);
    const xInput = screen.getByLabelText('X') as HTMLInputElement;
    fireEvent.change(xInput, { target: { value: '150' } });
    expect(xInput.value).toBe('150');
  });

  it('updates rotation values on input change', () => {
    render(<TransformCalculator />);
    const rollInput = screen.getByLabelText('Roll') as HTMLInputElement;
    fireEvent.change(rollInput, { target: { value: '30' } });
    expect(rollInput.value).toBe('30');
  });

  it('updates input point values on input change', () => {
    render(<TransformCalculator />);
    const xPointInput = screen.getAllByLabelText('X')[1] as HTMLInputElement;
    fireEvent.change(xPointInput, { target: { value: '25' } });
    expect(xPointInput.value).toBe('25');
  });

  it('calculates and displays the transformed point', async () => {
    render(<TransformCalculator />);
    // The result is calculated on mount, so it should be present
    await screen.findByText('Transformed Point');
    expect(screen.getByText(/X:/)).toBeInTheDocument();
    expect(screen.getByText(/Y:/)).toBeInTheDocument();
    expect(screen.getByText(/Z:/)).toBeInTheDocument();
  });
});
