import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the copyright notice and privacy policy link', () => {
    render(<Footer />);

    expect(screen.getByText(/Glad Labs, LLC/)).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });
});
