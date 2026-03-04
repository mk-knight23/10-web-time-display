import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Digital Clock App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check that the app container renders
    expect(screen.getByText(/LOCAL TIMEZONE:/i)).toBeInTheDocument();
  });

  it('has proper ARIA labels for mode buttons', () => {
    render(<App />);

    // Check mode buttons have proper labels
    expect(screen.getByLabelText(/Clock mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stopwatch mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Timer mode/i)).toBeInTheDocument();
  });

  it('can switch to stopwatch mode', () => {
    render(<App />);

    const stopwatchBtn = screen.getByLabelText(/stopwatch mode/i);
    fireEvent.click(stopwatchBtn);

    // After switching to stopwatch, should see start button
    expect(screen.getByLabelText(/Start stopwatch/i)).toBeInTheDocument();
  });

  it('can switch to timer mode', () => {
    render(<App />);

    const timerBtn = screen.getByLabelText(/timer mode/i);
    fireEvent.click(timerBtn);

    // After switching to timer, should see start button
    expect(screen.getByLabelText(/Start timer/i)).toBeInTheDocument();
  });

  it('validates timer input - rejects invalid values', () => {
    render(<App />);

    // Switch to timer mode
    const timerBtn = screen.getByLabelText(/timer mode/i);
    fireEvent.click(timerBtn);

    const input = screen.getByLabelText(/Set timer duration/i);

    // Test invalid input (too large)
    fireEvent.change(input, { target: { value: '999999' } });
    fireEvent.blur(input);

    // Should show error message
    expect(screen.getByText(/Enter a value between 1 and 86400/i)).toBeInTheDocument();
  });

  it('accepts valid timer input', () => {
    render(<App />);

    // Switch to timer mode
    const timerBtn = screen.getByLabelText(/timer mode/i);
    fireEvent.click(timerBtn);

    const input = screen.getByLabelText(/Set timer duration/i);

    // Test valid input
    fireEvent.change(input, { target: { value: '120' } });
    fireEvent.blur(input);

    // Should not show error
    expect(screen.queryByText(/Invalid timer value/i)).not.toBeInTheDocument();
  });

  it('stopwatch start/pause toggles correctly', () => {
    render(<App />);

    // Switch to stopwatch mode
    const stopwatchBtn = screen.getByLabelText(/stopwatch mode/i);
    fireEvent.click(stopwatchBtn);

    const startBtn = screen.getByLabelText(/Start stopwatch/i);
    fireEvent.click(startBtn);

    // Button should now say "Pause"
    expect(screen.getByLabelText(/Pause stopwatch/i)).toBeInTheDocument();
  });
});
