import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the site title and navigation links', () => {
    render(<Header />);

    expect(screen.getByText('Glad Labs')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
