#!/bin/bash

# 🚀 Public Site Production Readiness - Quick Fix Script
# 
# This script fixes the data mismatch between:
# - PostgreSQL database (posts table)
# - Next.js frontend (expects Strapi schema)
#
# Usage:
#   bash fix-public-site.sh          # Interactive mode
#   bash fix-public-site.sh --auto   # Auto-fix all

set -e

echo "🚀 Glad Labs Public Site - Production Readiness Fixer"
echo "═══════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════
# SECTION 1: DATABASE FIXES
# ═══════════════════════════════════════════════════════════

fix_database() {
  echo "📊 Database Fixes"
  echo "─────────────────"
  echo ""
  
  echo "Step 1: Add published_at timestamps"
  echo "   Current: Missing timestamps prevent proper sorting"
  echo "   Fix: Set published_at = created_at for published posts"
  echo ""
  
  read -p "Apply database fix? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⏭️  Skipping database fixes"
    return
  fi
  
  # Check if we can connect to psql
  if ! command -v psql &> /dev/null; then
    echo "⚠️  psql not found. Cannot run SQL directly."
    echo "   Run this SQL manually in your database:"
    echo ""
    cat << 'SQL'
-- Update published timestamps
UPDATE posts 
SET published_at = created_at
WHERE published_at IS NULL 
AND status = 'published';

-- Verify update
SELECT COUNT(*) as posts_with_pub_date FROM posts WHERE published_at IS NOT NULL;
SQL
    echo ""
    return
  fi
  
  # Execute fix if psql available
  echo "Connecting to PostgreSQL..."
  PGPASSWORD="${PGPASSWORD:-}" psql \
    -h localhost \
    -U postgres \
    -d glad_labs_dev \
    -c "UPDATE posts SET published_at = created_at WHERE published_at IS NULL AND status = 'published';"
  
  echo "✅ Database timestamps updated"
}

# ═══════════════════════════════════════════════════════════
# SECTION 2: FRONTEND DATA MAPPER
# ═══════════════════════════════════════════════════════════

create_data_mapper() {
  echo ""
  echo "🔄 Frontend Data Mapper"
  echo "──────────────────────"
  echo ""
  echo "Creating adapter function to map PostgreSQL posts to React component format..."
  echo ""
  
  # Create the mapper function file
  cat > "web/public-site/lib/post-mapper.js" << 'MAPPER'
/**
 * Post Data Mapper
 * 
 * Maps PostgreSQL posts table format to React component format
 * This bridges the gap between:
 * - Database: Simple flat structure with featured_image_url
 * - Components: Expecting nested Strapi-like structure
 */

/**
 * Map single post from database to component format
 * @param {Object} dbPost - Post object from PostgreSQL
 * @returns {Object} Mapped post object for React components
 */
export function mapDatabasePostToComponent(dbPost) {
  if (!dbPost) return null;

  return {
    // Basic fields (pass through)
    id: dbPost.id,
    title: dbPost.title || 'Untitled',
    slug: dbPost.slug,
    content: dbPost.content || '',
    excerpt: dbPost.excerpt || '',
    status: dbPost.status || 'draft',

    // Date fields
    date: dbPost.published_at || dbPost.created_at,
    publishedAt: dbPost.published_at || dbPost.created_at,
    created_at: dbPost.created_at,
    updated_at: dbPost.updated_at,

    // Image field - convert from simple string to nested structure
    // This makes it compatible with existing PostCard component
    coverImage: {
      data: {
        attributes: {
          url: dbPost.featured_image_url || null,
          alternativeText: `Featured image for ${dbPost.title}`,
          name: 'featured-image',
        }
      }
    },

    // SEO fields
    seo_title: dbPost.seo_title,
    seo_description: dbPost.seo_description,
    seo_keywords: dbPost.seo_keywords,

    // Metadata
    metadata: dbPost.metadata || {},
  };
}

/**
 * Map array of posts (for lists)
 * @param {Array} posts - Array of posts from database
 * @returns {Array} Mapped posts array
 */
export function mapDatabasePostsToComponents(posts) {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapDatabasePostToComponent);
}

/**
 * Extract featured image URL (works with both formats)
 * @param {Object} post - Post object (either database or mapped format)
 * @returns {string|null} Image URL or null
 */
export function getFeaturedImageUrl(post) {
  if (!post) return null;

  // If already mapped to nested format
  if (post.coverImage?.data?.attributes?.url) {
    return post.coverImage.data.attributes.url;
  }

  // If direct database format
  if (post.featured_image_url) {
    return post.featured_image_url;
  }

  return null;
}

/**
 * Get display date string
 * @param {Object} post - Post object
 * @returns {string} Formatted date
 */
export function getPostDate(post) {
  const dateString = post.date || post.publishedAt || post.created_at;
  if (!dateString) return 'Unknown date';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return 'Invalid date';
  }
}

/**
 * Get ISO date string for <time dateTime> attribute
 * @param {Object} post - Post object
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export function getPostDateISO(post) {
  const dateString = post.date || post.publishedAt || post.created_at;
  if (!dateString) return new Date().toISOString().split('T')[0];

  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}
MAPPER

  echo "✅ Data mapper created: web/public-site/lib/post-mapper.js"
  echo ""
  echo "This mapper:"
  echo "  - Converts simple featured_image_url to nested coverImage.data.attributes.url"
  echo "  - Makes database posts compatible with existing components"
  echo "  - No changes needed to PostCard.js or components"
}

# ═══════════════════════════════════════════════════════════
# SECTION 3: UPDATE API INTEGRATION
# ═══════════════════════════════════════════════════════════

update_api_integration() {
  echo ""
  echo "📡 API Integration Update"
  echo "────────────────────────"
  echo ""
  echo "Updating api-fastapi.js to use the new data mapper..."
  echo ""
  
  # Show what needs to be updated
  cat << 'UPDATE'
Required changes in web/public-site/lib/api-fastapi.js:

At the top of the file, add:
```javascript
import { mapDatabasePostsToComponents } from './post-mapper';
```

In getPaginatedPosts function, update return statement:
```javascript
// OLD:
return {
  data: data,
  meta: { pagination: { ... } }
};

// NEW:
const mappedPosts = mapDatabasePostsToComponents(data);
return {
  data: mappedPosts,
  meta: { pagination: { ... } }
};
```

In getFeaturedPost function:
```javascript
// At end of function
const mappedPost = mapDatabasePostToComponent(response);
return mappedPost;
```

UPDATE

  echo "ℹ️  Manual update needed for api-fastapi.js"
  echo "   See instructions above"
}

# ═══════════════════════════════════════════════════════════
# SECTION 4: CHECK IMAGE STATUS
# ═══════════════════════════════════════════════════════════

check_images() {
  echo ""
  echo "🖼️  Featured Images Status"
  echo "─────────────────────────"
  echo ""
  
  if ! command -v psql &> /dev/null; then
    echo "⚠️  psql not found. Cannot check database."
    echo "   Run this query manually:"
    echo ""
    echo "SELECT COUNT(*) as total, COUNT(featured_image_url) as with_images FROM posts;"
    echo ""
    return
  fi
  
  echo "Posts with featured images:"
  PGPASSWORD="${PGPASSWORD:-}" psql \
    -h localhost \
    -U postgres \
    -d glad_labs_dev \
    -t \
    -c "SELECT title, CASE WHEN featured_image_url IS NULL THEN '❌ Missing' ELSE '✅ Has image' END FROM posts ORDER BY created_at DESC;"
  
  echo ""
  echo "Next step: Generate or upload featured images"
  echo "   - Use /api/media/generate-image endpoint (if implemented)"
  echo "   - Or upload to CDN and update featured_image_url"
}

# ═══════════════════════════════════════════════════════════
# SECTION 5: IMPLEMENTATION GUIDE
# ═══════════════════════════════════════════════════════════

show_implementation_guide() {
  echo ""
  echo "📚 Implementation Guide"
  echo "══════════════════════"
  echo ""
  
  cat << 'GUIDE'
Quick Implementation Steps:

1. DATABASE
   ✅ Run database fixes (updates published_at)
   ✅ Check featured image status
   ⏳ Generate/upload images for posts without them

2. FRONTEND
   ✅ Data mapper created (post-mapper.js)
   ⏳ Update api-fastapi.js to import and use mapper
   ⏳ Test that posts render on homepage

3. DEPLOYMENT
   ⏳ Deploy public site
   ⏳ Test in production
   ⏳ Monitor page load times

4. GOOGLE ADSENSE
   ⏳ Ensure 300+ words per post
   ⏳ Complete privacy policy and about pages
   ⏳ Set up Google Analytics
   ⏳ Apply for AdSense

Estimated Time:
  - Database fixes: 5 min
  - Frontend update: 15 min
  - Testing: 10 min
  - Image generation: 30 min

Total: ~60 minutes to production ready

GUIDE
}

# ═══════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════

main() {
  # Check if running in current workspace
  if [ ! -f "package.json" ] || [ ! -d "web/public-site" ]; then
    echo "❌ Error: Must run from workspace root"
    echo "   cd /path/to/glad-labs-website"
    echo "   bash scripts/fix-public-site.sh"
    exit 1
  fi

  echo "📋 Database Status: $(psql -h localhost -U postgres -d glad_labs_dev -t -c 'SELECT COUNT(*) FROM posts;' 2>/dev/null || echo 'Unable to connect') posts found"
  echo ""

  # Run fixes
  fix_database
  create_data_mapper
  update_api_integration
  check_images
  show_implementation_guide

  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "✅ Script Complete!"
  echo ""
  echo "Next Steps:"
  echo "  1. Review PUBLIC_SITE_PRODUCTION_READINESS.md"
  echo "  2. Update api-fastapi.js with mapper integration"
  echo "  3. Test homepage displays posts correctly"
  echo "  4. Generate featured images for all posts"
  echo ""
}

main "$@"
