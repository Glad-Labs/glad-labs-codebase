import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

describe('PostCard', () => {
  it('renders post title', () => {
    const post = {
      slug: 'test-post',
      title: 'Test Post Title',
      excerpt: 'Test excerpt',
      publishedAt: '2025-10-25',
    };

    render(<PostCard post={post} />);

    // PostCard might render within a link, so check for text presence
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('renders post excerpt', () => {
    const post = {
      slug: 'test-post',
      title: 'Test Post Title',
      excerpt: 'Test excerpt content',
      publishedAt: '2025-10-25',
    };

    render(<PostCard post={post} />);

    expect(screen.getByText('Test excerpt content')).toBeInTheDocument();
  });
});
