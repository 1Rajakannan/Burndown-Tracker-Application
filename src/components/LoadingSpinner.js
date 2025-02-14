import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

// PUBLIC_INTERFACE
const LoadingSpinner = ({ size = 40, color = '#1976d2', text, textColor = '#333' }) => {
  const spinnerStyle = {
    '--spinner-size': `${size}px`,
    '--spinner-color': color,
    '--text-color': textColor,
  };

  return (
    <div className={styles.container} style={spinnerStyle} role="status" aria-busy="true">
      <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className={styles.text} aria-live="polite">{text}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  text: PropTypes.string,
  textColor: PropTypes.string,
};

export default LoadingSpinner;