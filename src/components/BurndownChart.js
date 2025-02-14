import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// PUBLIC_INTERFACE
const BurndownChart = ({ data, sprintMetrics }) => {
  /**
   * Renders a burndown chart using Recharts
   * @param {Object} props
   * @param {Array} props.data - Array of daily progress data points
   * @param {Object} props.sprintMetrics - Object containing sprint metrics
   * @returns {React.Component} Burndown chart component
   */
  return (
    <div className="burndown-chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#8884d8"
            name="Ideal Burndown"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#82ca9d"
            name="Actual Progress"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="sprint-metrics">
        <h3>Sprint Metrics</h3>
        <div>Velocity: {sprintMetrics.velocity}</div>
        <div>Completion Rate: {sprintMetrics.completionRate}%</div>
        <div>Remaining Work: {sprintMetrics.remainingWork} points</div>
      </div>
    </div>
  );
};

export default BurndownChart;