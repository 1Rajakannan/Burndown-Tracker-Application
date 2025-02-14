import React from 'react';
import { render, screen } from '@testing-library/react';
import BurndownChart from '../components/BurndownChart';

// Mock the recharts components to avoid rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => children,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null
}));

describe('BurndownChart Loading State Tests', () => {
  const mockData = [
    { day: 1, ideal: 10, actual: 8 },
    { day: 2, ideal: 8, actual: 7 }
  ];

  const mockSprintMetrics = {
    velocity: 3,
    completionRate: 75,
    remainingWork: 2
  };

  test('displays loading spinner when isLoading is true', () => {
    render(
      <BurndownChart
        data={mockData}
        sprintMetrics={mockSprintMetrics}
        isLoading={true}
      />
    );

    // Check if loading spinner is present
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  test('does not display loading spinner when isLoading is false', () => {
    render(
      <BurndownChart
        data={mockData}
        sprintMetrics={mockSprintMetrics}
        isLoading={false}
      />
    );

    // Check if chart content is present instead of loading spinner
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  test('displays sprint metrics when not loading', () => {
    render(
      <BurndownChart
        data={mockData}
        sprintMetrics={mockSprintMetrics}
        isLoading={false}
      />
    );

    // Check if sprint metrics are displayed
    expect(screen.getByText('Sprint Metrics')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('2 points')).toBeInTheDocument();
  });

  test('does not display sprint metrics when loading', () => {
    render(
      <BurndownChart
        data={mockData}
        sprintMetrics={mockSprintMetrics}
        isLoading={true}
      />
    );

    // Check that sprint metrics are not displayed
    expect(screen.queryByText('Sprint Metrics')).not.toBeInTheDocument();
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });
});