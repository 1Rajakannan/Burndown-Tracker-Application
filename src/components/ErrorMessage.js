import React from 'react';
import PropTypes from 'prop-types';
import { formatErrorMessage } from '../services/apiErrors';

/**
 * Component for displaying error messages
 */
const ErrorMessage = ({ error, className = '', onRetry = null }) => {
  if (!error) return null;

  return (
    <div className={`error-message ${className}`} role="alert">
      <p>{formatErrorMessage(error)}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="retry-button"
          type="button"
        >
          Retry
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Error)
  ]),
  className: PropTypes.string,
  onRetry: PropTypes.func
};

export default ErrorMessage;