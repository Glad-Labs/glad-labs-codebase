import { render, screen } from '@testing-library/react';
import Layout from './Layout';

describe('Layout', () => {
  it('renders the header, footer, and children', () => {
    render(
      <Layout>
        <div>Test Child</div>
      </Layout>
    );

    expect(screen.getByText('Glad Labs Frontier')).toBeInTheDocument();
    expect(screen.getByText(/Glad Labs, LLC/)).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
