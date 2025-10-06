import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';

test('renders dashboard header', () => {
  render(<Dashboard />);
  const headerElement = screen.getByText(/Dashboard/i);
  expect(headerElement).toBeInTheDocument();
});
