import { render, screen } from '@testing-library/react';
import PostList from './PostList';

describe('PostList', () => {
  it('renders a list of posts', () => {
    const posts = [
      {
        id: 1,
        Slug: 'test-post-1',
        Title: 'Test Post 1',
        publishedAt: new Date().toISOString(),
        Excerpt: 'This is a test post.',
      },
      {
        id: 2,
        Slug: 'test-post-2',
        Title: 'Test Post 2',
        publishedAt: new Date().toISOString(),
        Excerpt: 'This is another test post.',
      },
    ];

    render(<PostList posts={posts} />);

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });
});
