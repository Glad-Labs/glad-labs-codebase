import { render, screen } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  it('does not render when there is only one page', () => {
    const pagination = { page: 1, pageCount: 1 };
    const { container } = render(
      <Pagination pagination={pagination} basePath="/archive" />
    );

    // Should return null for single page
    expect(container.firstChild).toBeNull();
  });

  it('renders pagination links when there are multiple pages', () => {
    const pagination = { page: 1, pageCount: 5 };
    render(<Pagination pagination={pagination} basePath="/archive" />);

    // Should have Next button on first page
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders Previous and Next buttons on middle page', () => {
    const pagination = { page: 2, pageCount: 5 };
    render(<Pagination pagination={pagination} basePath="/archive" />);

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
