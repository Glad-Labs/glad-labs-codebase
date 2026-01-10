import { getPostsByCategory, getPostsByTag } from './search';

/**
 * Get related posts based on category and tags
 * Uses a scoring system to rank relevance
 */
export async function getRelatedPosts(currentPost, limit = 3) {
  if (!currentPost) {
    return [];
  }

  try {
    // Gather posts from category and tags
    const relatedPostsMap = new Map();

    // 1. Get posts from same category (higher weight)
    if (currentPost.category?.slug) {
      const categoryPosts = await getPostsByCategory(
        currentPost.category.slug,
        '',
        20
      );
      categoryPosts.forEach((post) => {
        if (post.id !== currentPost.id) {
          relatedPostsMap.set(post.id, {
            ...post,
            relevanceScore: 3, // Category match = 3 points
          });
        }
      });
    }

    // 2. Get posts with matching tags (medium weight)
    if (currentPost.tags && Array.isArray(currentPost.tags)) {
      for (const tag of currentPost.tags) {
        const tagPosts = await getPostsByTag(tag.slug, '', 15);
        tagPosts.forEach((post) => {
          if (post.id !== currentPost.id) {
            const existing = relatedPostsMap.get(post.id);
            const score = existing ? existing.relevanceScore + 2 : 2; // Tag match = 2 points
            relatedPostsMap.set(post.id, {
              ...post,
              relevanceScore: score,
            });
          }
        });
      }
    }

    // 3. Sort by relevance score and return top N
    const relatedPosts = Array.from(relatedPostsMap.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      // eslint-disable-next-line no-unused-vars
      .map(({ relevanceScore, ...post }) => post); // Extract and remove score from output

    return relatedPosts;
  } catch (_error) {
    console.error('Error getting related posts:', _error);
    return [];
  }
}

/**
 * Get posts by multiple criteria
 * Useful for homepage "featured" or "trending" sections
 */
export async function getPostsByMultipleCriteria(
  categories = [],
  tags = [],
  _limit = 5
) {
  try {
    const postsMap = new Map();

    // Collect posts from specified categories
    if (Array.isArray(categories) && categories.length > 0) {
      for (const categorySlug of categories) {
        const posts = await getPostsByCategory(categorySlug, '', 20);
        posts.forEach((post) => {
          postsMap.set(post.id, post);
        });
      }
    }

    // Collect posts from specified tags
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tagSlug of tags) {
        const posts = await getPostsByTag(tagSlug, '', 20);
        posts.forEach((post) => {
          postsMap.set(post.id, post);
        });
      }
    }

    // Remove duplicates and return top N
    return Array.from(postsMap.values())
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, _limit);
  } catch (error) {
    console.error('Error getting posts by multiple criteria:', error);
    return [];
  }
}

/**
 * Get posts grouped by category
 * Useful for sidebar widgets or category collections
 */
export async function getPostsGroupedByCategory(_limit = 3) {
  // TODO: Implement category grouping
  // Would require fetching all categories first, then posts per category
  // Current limitation: Strapi doesn't have categories endpoint

  return {};
}

/**
 * Calculate post relevance score for ranking
 * Higher scores = more relevant
 */
export function calculateRelevanceScore(post, query) {
  if (!post || !query) {
    return 0;
  }

  const queryLower = query.toLowerCase();
  let score = 0;

  // Title match = 5 points
  if (post.title?.toLowerCase().includes(queryLower)) {
    score += 5;
  }

  // Excerpt match = 3 points
  if (post.excerpt?.toLowerCase().includes(queryLower)) {
    score += 3;
  }

  // Content match = 1 point
  if (post.content?.toLowerCase().includes(queryLower)) {
    score += 1;
  }

  return score;
}

/**
 * Get "More from Author" posts
 * (Requires author field in Strapi)
 */
export async function getMoreFromAuthor(authorId, _limit = 3) {
  // TODO: Implement author-based recommendations
  // Requires author field in backend posts
  // Current limitation: authorId not tracked in Strapi

  return [];
}

/**
 * Get posts published around the same time
 * Useful for "you might have missed" sections
 */
export async function getPostsAroundDate(date, daysRange = 30, _limit = 5) {
  if (!date) {
    return [];
  }

  try {
    const targetDate = new Date(date);
    const startDate = new Date(targetDate);
    const endDate = new Date(targetDate);

    startDate.setDate(startDate.getDate() - daysRange);
    endDate.setDate(endDate.getDate() + daysRange);

    // This would require date range filtering in Strapi
    // Placeholder for future implementation
    return [];
  } catch (error) {
    console.error('Error getting posts around date:', error);
    return [];
  }
}

/**
 * Get recommended posts for user based on reading history
 * (Would require tracking and user data)
 */
export async function getRecommendedPosts(userReadingHistory = [], _limit = 5) {
  try {
    if (!Array.isArray(userReadingHistory) || userReadingHistory.length === 0) {
      return [];
    }

    const recommendedMap = new Map();

    // For each post read, find related posts
    // Placeholder for future implementation
    // TODO: Implement post retrieval and recommendation logic

    return Array.from(recommendedMap.values()).slice(0, _limit);
  } catch (error) {
    console.error('Error getting recommended posts:', error);
    return [];
  }
}

/**
 * Simple recommendation based on tag similarity
 */
export async function getSimpleRecommendations(post, limit = 3) {
  // For simple implementation, just use getRelatedPosts
  return getRelatedPosts(post, limit);
}
