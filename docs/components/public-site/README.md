# 🌐 Public Site (Next.js)

> Frontend application for public-facing content delivery

## 📍 Location

- **Source**: `web/public-site/`
- **Main Entry**: `web/public-site/README.md` (component-level)
- **Component Docs**: This folder (`docs/components/public-site/`)

---

## 📚 Documentation

### Quick Links

- **Deployment**: See [03-DEPLOYMENT_AND_INFRASTRUCTURE.md](../../03-DEPLOYMENT_AND_INFRASTRUCTURE.md) for deployment process
- **Architecture**: See [02-ARCHITECTURE_AND_DESIGN.md](../../02-ARCHITECTURE_AND_DESIGN.md) for system design
- **Troubleshooting**: See [troubleshooting/](./troubleshooting/) for common issues
- **Source Code**: See `web/public-site/README.md` for detailed implementation

### Configuration

- **`.env.example`** - Environment variables template
- **`vercel.json`** - Vercel deployment configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`jest.config.js`** - Testing configuration

---

## 🎯 Key Features

- **Next.js 15** - React framework with server-side rendering and API routes
- **Markdown-based Content** - Static markdown files stored in git for versioning and offline availability
- **PostgreSQL Fallback** - Dynamic content via FastAPI endpoints when needed (posts, metadata, analytics)
- **ISR Support** - Incremental Static Regeneration for fresh content without full rebuilds
- **Blog System** - Posts, categories, tags with full-text search via PostgreSQL backend
- **Responsive Design** - Mobile-first TailwindCSS styling for all screen sizes
- **SEO Optimized** - Meta tags, structured data, sitemap generation for search engines

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific tests
npm test -- components/__tests__/PostCard.test.js

# Run with coverage
npm test -- --coverage
```

**Test Files:**

- `components/__tests__/PostCard.test.js` - 39 tests
- `components/__tests__/Pagination.test.js` - 31 tests
- `lib/__tests__/api.test.js` - 25 tests
- `components/Header.test.js` - ✅ Passing
- `components/Footer.test.js` - ✅ Passing
- `components/Layout.test.js` - ✅ Passing
- `components/PostList.test.js` - ✅ Passing

**Total**: 100+ tests passing ✅

---

## 📂 Folder Structure

```
web/public-site/
├── README.md                    ← Component README
├── pages/                       ← Next.js pages
│   ├── index.js               ← Homepage
│   ├── about.js               ← About page (Strapi)
│   ├── privacy-policy.js      ← Privacy (Strapi)
│   ├── terms-of-service.js    ← Terms (Strapi)
│   ├── posts/[slug].js        ← Post detail page
│   ├── category/[slug].js     ← Category archive
│   └── tag/[slug].js          ← Tag archive
├── components/                ← React components
│   ├── __tests__/             ← Component tests
│   ├── PostCard.js            ← Blog post card
│   ├── Pagination.js          ← Pagination component
│   ├── Header.js              ← Header navigation
│   ├── Footer.js              ← Footer
│   └── Layout.js              ← Layout wrapper
├── lib/                       ← Utilities
│   ├── api.js                 ← Strapi API client (10s timeout!)
│   └── __tests__/
│       └── api.test.js        ← API tests
└── public/                    ← Static assets
```

---

## 🔗 Integration Points

### Strapi CMS Integration

**API Client**: `lib/api.js`

Key functions:

- `fetchAPI()` - Base API call with **10-second timeout** ⚠️
- `getPaginatedPosts()` - Fetch blog posts with pagination
- `getFeaturedPost()` - Get featured blog post
- `getPostBySlug()` - Get single post by slug
- `getCategories()` - Fetch all categories
- `getTags()` - Fetch all tags

**Critical Pattern**: All API calls include markdown fallback content for Strapi downtime.

### Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=<token>
```

---

## 🚀 Development Workflow

### Local Development

```bash
# Start Next.js dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Deployment to Vercel

```bash
# Environment variables set in Vercel dashboard
# NEXT_PUBLIC_STRAPI_API_URL
# NEXT_PUBLIC_STRAPI_API_TOKEN

git push origin main  # Auto-deploys to Vercel
```

---

## 📋 Related Documentation

**In this component docs:**

- Setup: See `README.md` in `web/public-site/`
- Deployment: See `DEPLOYMENT_READINESS.md` (this folder)
- Vercel config: See `VERCEL_DEPLOYMENT.md` (this folder)

**In main docs hub:**

- Frontend Architecture: `docs/02-ARCHITECTURE_AND_DESIGN.md#frontend-layer`
- Strapi Integration: `docs/guides/STRAPI_BACKED_PAGES_GUIDE.md`
- Testing Guide: `docs/guides/TESTING_SUMMARY.md`
- Deployment: `docs/03-DEPLOYMENT_AND_INFRASTRUCTURE.md`

---

## ✅ Quick Links

- **Development**: Local setup in `web/public-site/README.md`
- **Deployment**: `VERCEL_DEPLOYMENT.md`
- **Readiness**: `DEPLOYMENT_READINESS.md`
- **Testing**: `docs/guides/TESTING_SUMMARY.md`
- **Architecture**: `docs/02-ARCHITECTURE_AND_DESIGN.md`
