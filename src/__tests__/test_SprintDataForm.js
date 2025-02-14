import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SprintDataForm from '../components/SprintDataForm';

describe('SprintDataForm Loading State Tests', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('submit button shows loading state when isLoading is true', () => {
    render(<SprintDataForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const submitButton = screen.getByRole('button');
    expect(submitButton).toHaveTextContent('Submitting...');
    expect(submitButton).toBeDisabled();
  });

  test('submit button shows normal state when isLoading is false', () => {
    render(<SprintDataForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    const submitButton = screen.getByRole('button');
    expect(submitButton).toHaveTextContent('Submit Sprint Data');
    expect(submitButton).not.toBeDisabled();
  });

  test('form submission is prevented when in loading state', () => {
    render(<SprintDataForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/Total Story Points/i), {
      target: { value: '10' }
    });
    fireEvent.change(screen.getByLabelText(/Sprint Duration/i), {
      target: { value: '5' }
    });
    
    // Try to submit form
    fireEvent.submit(screen.getByRole('form'));
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('form submission works when not in loading state', () => {
    render(<SprintDataForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/Total Story Points/i), {
      target: { value: '10' }
    });
    fireEvent.change(screen.getByLabelText(/Sprint Duration/i), {
      target: { value: '5' }
    });
    
    // Submit form
    fireEvent.submit(screen.getByRole('form'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      totalPoints: 10,
      sprintDuration: 5,
      dailyProgress: []
    });
  });
});