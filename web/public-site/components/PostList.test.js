import { render, screen } from '@testing-library/react';
import PostList from './PostList';

describe('PostList', () => {
  it('renders a list of posts', () => {
    const posts = [
      {
        id: 1,
        slug: 'test-post-1',
        title: 'Test Post 1',
        publishedAt: new Date().toISOString(),
        excerpt: 'This is a test post.',
      },
      {
        id: 2,
        slug: 'test-post-2',
        title: 'Test Post 2',
        publishedAt: new Date().toISOString(),
        excerpt: 'This is another test post.',
      },
    ];

    render(<PostList posts={posts} />);

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('This is a test post.')).toBeInTheDocument();
    expect(screen.getByText('This is another test post.')).toBeInTheDocument();
  });

  it('renders "no posts" message when posts array is empty', () => {
    render(<PostList posts={[]} />);
    expect(screen.getByText(/No posts found/i)).toBeInTheDocument();
  });
});
