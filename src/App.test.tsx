import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Todo', () => {
  render(<App />);
  const headerElement = screen.getByText(/Todo/i);
  expect(headerElement).toBeInTheDocument();
});
