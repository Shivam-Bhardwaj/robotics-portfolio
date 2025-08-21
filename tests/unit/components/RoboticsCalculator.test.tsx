import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoboticsCalculator from '@/components/RoboticsCalculator';

describe('RoboticsCalculator', () => {
  it('renders the main title and tab navigation', () => {
    render(<RoboticsCalculator type="kinematics" />);

    expect(screen.getByText('Interactive Robotics Calculators')).toBeInTheDocument();
    expect(screen.getByText('Forward/Inverse Kinematics')).toBeInTheDocument();
    expect(screen.getByText('3D Transformations')).toBeInTheDocument();
    expect(screen.getByText('Trajectory Planning')).toBeInTheDocument();
    expect(screen.getByText('PID Tuning')).toBeInTheDocument();
    expect(screen.getByText('Sensor Fusion')).toBeInTheDocument();
  });

  it('renders the correct calculator based on the type prop', () => {
    render(<RoboticsCalculator type="transforms" />);
    expect(screen.getByText('3D Transformations')).toBeInTheDocument();
  });

  it('switches to the correct calculator when a tab is clicked', () => {
    const { getByText, queryByText } = render(<RoboticsCalculator type="kinematics" />);
    
    expect(queryByText('Forward/Inverse Kinematics')).toBeInTheDocument();
    expect(queryByText('3D Transformations')).not.toBeInTheDocument();

    fireEvent.click(getByText('3D Transformations'));
    
    expect(queryByText('Forward/Inverse Kinematics')).not.toBeInTheDocument();
    expect(queryByText('3D Transformations')).toBeInTheDocument();
  });
});
