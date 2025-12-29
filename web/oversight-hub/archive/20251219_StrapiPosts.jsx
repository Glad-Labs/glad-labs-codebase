import React, { useState, useEffect } from 'react';

const StrapiPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_STRAPI_API_URL}/api/posts`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch posts from Strapi.');
        }
        const data = await response.json();
        setPosts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts from Strapi...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Published Posts (from Strapi)</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.attributes.Title}</li>
        ))}
      </ul>
    </div>
  );
};

export default StrapiPosts;
