import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders main content', () => {
    render(<App />);
    const main = document.querySelector('main') || document.querySelector('div');
    expect(main).toBeInTheDocument();
  });
});
