import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock console.error to prevent test output noise
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Helper component that throws an error
const ThrowError = ({ message }) => {
  throw new Error(message);
  return null;
};

// Helper component that doesn't throw an error
const NoError = () => <div>No Error</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Clear console.error mock calls between tests
    console.error.mockClear();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('displays default error UI when child throws', () => {
    const errorMessage = 'Test error message';
    
    render(
      <ErrorBoundary>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });

  test('uses custom fallback component when provided', () => {
    const errorMessage = 'Custom fallback error';
    const CustomFallback = ({ error }) => (
      <div>Custom Error: {error.message}</div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    expect(screen.getByText(`Custom Error: ${errorMessage}`)).toBeInTheDocument();
  });

  test('logs error to console.error', () => {
    const errorMessage = 'Console error test';
    
    render(
      <ErrorBoundary>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
    const errorCall = console.error.mock.calls.find(call => 
      call[0] === 'Error caught by ErrorBoundary:'
    );
    expect(errorCall).toBeTruthy();
  });

  test('resets error state when children change', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError message="Initial error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Rerender with a component that doesn't throw
    rerender(
      <ErrorBoundary>
        <NoError />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  test('handles multiple errors in sequence', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError message="First error" />
      </ErrorBoundary>
    );

    expect(screen.getByText(/First error/)).toBeInTheDocument();

    // Trigger another error
    rerender(
      <ErrorBoundary>
        <ThrowError message="Second error" />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Second error/)).toBeInTheDocument();
  });

  test('displays error details in collapsed details element', () => {
    const errorMessage = 'Detailed error message';
    
    render(
      <ErrorBoundary>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    const details = screen.getByRole('group');
    expect(details).toBeInTheDocument();
    expect(details.tagName.toLowerCase()).toBe('details');
  });
});import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock console.error to prevent test output noise
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Helper component that throws an error
const ThrowError = ({ message }) => {
  throw new Error(message);
  return null;
};

// Helper component that doesn't throw an error
const NoError = () => <div>No Error</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Clear console.error mock calls between tests
    console.error.mockClear();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('displays default error UI when child throws', () => {
    const errorMessage = 'Test error message';
    
    render(
      <ErrorBoundary>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });

  test('uses custom fallback component when provided', () => {
    const errorMessage = 'Custom fallback error';
    const CustomFallback = ({ error }) => (
      <div>Custom Error: {error.message}</div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    expect(screen.getByText(`Custom Error: ${errorMessage}`)).toBeInTheDocument();
  });

  test('logs error to console.error', () => {
    const errorMessage = 'Console error test';
    
    render(
      <ErrorBoundary>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
    const errorCall = console.error.mock.calls.find(call => 
      call[0] === 'Error caught by ErrorBoundary:'
    );
    expect(errorCall).toBeTruthy();
  });

  test('resets error state when children change', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError message="Initial error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Rerender with a component that doesn't throw
    rerender(
      <ErrorBoundary>
        <NoError />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  test('handles multiple errors in sequence', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError message="First error" />
      </ErrorBoundary>
    );

    expect(screen.getByText(/First error/)).toBeInTheDocument();

    // Trigger another error
    rerender(
      <ErrorBoundary>
        <ThrowError message="Second error" />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Second error/)).toBeInTheDocument();
  });

  test('displays error details in collapsed details element', () => {
    const errorMessage = 'Detailed error message';
    
    render(
      <ErrorBoundary>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    const details = screen.getByRole('group');
    expect(details).toBeInTheDocument();
    expect(details.tagName.toLowerCase()).toBe('details');
  });
});
