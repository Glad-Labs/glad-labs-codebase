import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

test('renders header and handles button clicks', () => {
  const handleNewTask = jest.fn();
  const handleIntervene = jest.fn();

  render(<Header onNewTask={handleNewTask} onIntervene={handleIntervene} />);

  // Check that the title is rendered
  expect(screen.getByText(/Content Agent Oversight Hub/i)).toBeInTheDocument();

  // Simulate a click on the "Create New Task" button
  fireEvent.click(screen.getByText(/Create New Task/i));
  expect(handleNewTask).toHaveBeenCalledTimes(1);

  // Simulate a click on the "Intervene" button
  fireEvent.click(screen.getByText(/Intervene/i));
  expect(handleIntervene).toHaveBeenCalledTimes(1);
});
