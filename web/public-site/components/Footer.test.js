import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the copyright notice and privacy policy link', () => {
    render(<Footer />);

    // Check for copyright text (allowing for different formatting)
    expect(screen.getByText(/GLAD Labs, LLC/)).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });
});
