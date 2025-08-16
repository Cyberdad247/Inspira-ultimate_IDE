import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('MuiButton-root');
  });

  it('applies variant prop correctly', () => {
    render(<Button variant="contained">Contained</Button>);
    const button = screen.getByRole('button', { name: /contained/i });
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button', { name: /clickable/i });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});