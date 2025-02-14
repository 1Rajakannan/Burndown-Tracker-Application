import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('displays correct header text', () => {
    render(<App />);
    const headerElement = screen.getByText(/Burndown Tracker/i);
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.tagName).toBe('H1');
  });

  test('has correct structure with header and main elements', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toHaveClass('App-header');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toHaveClass('App');
    expect(screen.getByRole('banner')).toHaveClass('App-header');
  });
});
