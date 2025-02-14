import React from 'react';
import styles from './BurndownChart.module.css';
import LoadingSpinner from './LoadingSpinner';
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
const BurndownChart = ({ data, sprintMetrics, isLoading }) => {
  /**
   * Renders a burndown chart using Recharts
   * @param {Object} props
   * @param {Array} props.data - Array of daily progress data points
   * @param {Object} props.sprintMetrics - Object containing sprint metrics
   * @returns {React.Component} Burndown chart component
   */
  if (isLoading) {
    return (
      <div className={styles['burndown-chart-container']}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles['burndown-chart-container']}>
      <div className={styles['chart-wrapper']}>
        <ResponsiveContainer width="100%" height="100%">
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
      </div>
      <div className={styles['sprint-metrics']}>
        <h3>Sprint Metrics</h3>
        <div className={styles['metric-item']}>
          <span className={styles['metric-label']}>Velocity:</span>
          <span className={styles['metric-value']}>{sprintMetrics.velocity}</span>
        </div>
        <div className={styles['metric-item']}>
          <span className={styles['metric-label']}>Completion Rate:</span>
          <span className={styles['metric-value']}>{sprintMetrics.completionRate}%</span>
        </div>
        <div className={styles['metric-item']}>
          <span className={styles['metric-label']}>Remaining Work:</span>
          <span className={styles['metric-value']}>{sprintMetrics.remainingWork} points</span>
        </div>
      </div>
    </div>
  );
};

export default BurndownChart;
