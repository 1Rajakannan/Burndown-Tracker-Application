import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '../components/ErrorMessage';
import { APIError } from '../services/apiErrors';

describe('ErrorMessage Component', () => {
  // Test basic rendering with error message
  test('renders error message correctly', () => {
    const errorMessage = 'Test error message';
    render(<ErrorMessage error={errorMessage} />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // Test different error types display
  test('renders API error with status code', () => {
    const apiError = new APIError('API failure', 404);
    render(<ErrorMessage error={apiError} />);
    
    expect(screen.getByText('Error 404: API failure')).toBeInTheDocument();
  });

  test('renders Error object message', () => {
    const error = new Error('System error');
    render(<ErrorMessage error={error} />);
    
    expect(screen.getByText('System error')).toBeInTheDocument();
  });

  test('handles undefined error message gracefully', () => {
    const error = new Error();
    render(<ErrorMessage error={error} />);
    
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  // Test retry button functionality
  test('renders retry button when onRetry prop is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage error="Error" onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage error="Error" />);
    
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  // Test error message styling and layout
  test('applies custom className correctly', () => {
    const customClass = 'custom-error';
    render(<ErrorMessage error="Error" className={customClass} />);
    
    const errorDiv = screen.getByRole('alert');
    expect(errorDiv).toHaveClass('error-message', customClass);
  });

  // Test component does not render without error
  test('does not render when error is null or undefined', () => {
    const { container } = render(<ErrorMessage error={null} />);
    expect(container).toBeEmptyDOMElement();
    
    const { container: container2 } = render(<ErrorMessage error={undefined} />);
    expect(container2).toBeEmptyDOMElement();
  });

  // Test accessibility requirements
  test('meets accessibility requirements', () => {
    render(<ErrorMessage error="Error message" onRetry={() => {}} />);
    
    // Verify alert role for screen readers
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Verify button is keyboard accessible
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toHaveAttribute('type', 'button');
    
    // Focus and press Enter to verify keyboard interaction
    retryButton.focus();
    expect(document.activeElement).toBe(retryButton);
  });
});