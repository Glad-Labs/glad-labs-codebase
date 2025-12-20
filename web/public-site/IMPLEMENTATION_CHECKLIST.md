# ✅ SEO & AdSense Implementation Checklist

**Status:** Phase 1-4 Complete | Ready for Configuration  
**Date:** December 19, 2025

---

## 🎯 IMMEDIATE ACTIONS (Today)

### 1. Configure Environment Variables

- [ ] Copy `.env.example` to `.env.local`
- [ ] Get FastAPI URL: `NEXT_PUBLIC_FASTAPI_URL`
- [ ] Set site domain: `NEXT_PUBLIC_SITE_URL`
- [ ] Get Google Analytics ID: `NEXT_PUBLIC_GA_ID` (if using analytics)
- [ ] **NOT YET:** AdSense ID (wait until approved)

### 2. Test Locally

```bash
cd web/public-site
npm install  # If needed
npm run dev  # Start development server
```

### 3. Verify Implementation

- [ ] Visit `http://localhost:3000`
- [ ] Cookie banner appears at bottom
- [ ] No console errors
- [ ] Links to legal pages work (`/legal/privacy`, `/legal/terms`, `/legal/cookie-policy`)

### 4. Check Sitemap

- [ ] Visit `http://localhost:3000/sitemap.xml`
- [ ] Should see XML with all posts, categories, tags

### 5. View Page Metadata

- [ ] Visit a blog post
- [ ] Right-click → "View Page Source"
- [ ] Search for `<meta property="og:title"`
- [ ] Should see post title and description

---

## 🌐 GOOGLE REGISTRATION (Next 24-48 Hours)

### A. Google Search Console Setup

1. Go to https://search.google.com/search-console
2. Click "Add property"
3. Enter your domain: `https://yourdomain.com`
4. Verify domain ownership (DNS or file upload)
5. Go to Sitemaps → Submit `https://yourdomain.com/sitemap.xml`
6. Wait 24-48 hours for initial indexing

### B. Google Analytics Setup (Optional)

1. Go to https://analytics.google.com
2. Create new property for your domain
3. Copy the Tracking ID (G-XXXXXXXXXX)
4. Add to `.env.local`: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
5. Wait 24 hours for data to appear

### C. Google AdSense Setup

1. Go to https://adsense.google.com
2. Click "Sign up"
3. Add your domain
4. **Google will review for 7-10 days**
5. Once approved:
   - Go to AdSense → Settings
   - Find "Ad Client ID" (ca-pub-XXXXXXX)
   - Copy to `.env.local`: `NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXX`
6. Get Ad Slot IDs for each ad placement
   - AdSense → Ad Units → Create new
   - Choose format (Rectangle, Horizontal, Vertical)
   - Get the Slot ID
   - Add to your blog posts: `<InArticleAd slot="1234567890" />`

---

## 📝 UPDATE LEGAL DOCUMENTS

### Privacy Policy

- [ ] Edit `app/legal/privacy/page.tsx`
- [ ] Update contact email: `hello@gladlabs.io` → your email
- [ ] Update domain: `yourdomain.com` → your domain
- [ ] Update company name: `Glad Labs, LLC` → your company

### Terms of Service

- [ ] Edit `app/legal/terms/page.tsx`
- [ ] Update company details
- [ ] Update contact info

### Cookie Policy

- [ ] Edit `app/legal/cookie-policy/page.tsx`
- [ ] Ensure accurate for your cookie usage

### robots.txt

- [ ] Edit `public/robots.txt`
- [ ] Update sitemap URL: `https://yourdomain.com/sitemap.xml`

---

## 🏗️ CONTENT PREPARATION

### Blog Posts

- [ ] All posts in Postgres have:
  - [ ] `title` (50-60 characters for Google)
  - [ ] `excerpt` (130-160 characters)
  - [ ] `coverImage` (URL or Cloudinary path)
  - [ ] `content` (Markdown format)
  - [ ] `publishedAt` (publication date)
  - [ ] `published` flag set to `true`

### Images

- [ ] All images hosted on Cloudinary
- [ ] Images optimized (<100KB for web)
- [ ] Alt text provided for all images

### Internal Links

- [ ] Posts link to related posts
- [ ] Navigation menu has clear structure

---

## 🧪 TESTING BEFORE LAUNCH

### Desktop Testing

- [ ] Chrome DevTools → Mobile view
- [ ] Run Google PageSpeed Insights
  - Target: **Lighthouse score >85**
  - Check: CLS, LCP, FID metrics
- [ ] View page source → check metadata
- [ ] Test all ad placements load

### Mobile Testing

- [ ] Test on actual mobile device
- [ ] Cookie banner displays correctly
- [ ] Links are clickable
- [ ] Images load properly
- [ ] No layout shift

### SEO Testing

```bash
# Check for common issues
npm run build  # Should complete without errors
npm start      # Start production server
```

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Images have alt text
- [ ] Links have descriptive text

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Sitemap working locally
- [ ] No console errors
- [ ] Legal pages complete
- [ ] Lighthouse score >85

### Deploy to Vercel

```bash
git add .
git commit -m "SEO & AdSense: Phase 1-4 implementation"
git push origin main

# In Vercel Dashboard:
# - Add environment variables
# - Wait for deployment to complete
```

### Post-Deployment

- [ ] Visit production site
- [ ] Test cookie banner
- [ ] Verify sitemap at `yourdomain.com/sitemap.xml`
- [ ] Check Google Search Console sees sitemap
- [ ] Monitor analytics for first 24 hours

---

## 📊 TRACKING PROGRESS

### Week 1

- [ ] Domain registered with Google Search Console
- [ ] Sitemap submitted
- [ ] Initial crawl completed
- [ ] First posts indexed

### Week 2-3

- [ ] AdSense application submitted
- [ ] ~50% of posts indexed
- [ ] Analytics showing traffic

### Week 4+

- [ ] AdSense approval (if qualified)
- [ ] 80%+ posts indexed
- [ ] First revenue (if AdSense approved)
- [ ] Regular traffic analysis

---

## ⚠️ COMMON ISSUES

### Sitemap not loading

- **Issue:** 404 on `/sitemap.xml`
- **Fix:** Rebuild with `npm run build` and check `next.config.js`

### Metadata not appearing

- **Issue:** og:image not in page source
- **Fix:** Ensure FastAPI returns `coverImage` in post data

### Cookie banner not showing

- **Issue:** No consent banner visible
- **Fix:** Check `CookieConsentBanner.jsx` is included in `app/layout.js`

### Low PageSpeed score

- **Issue:** Lighthouse score <80
- **Fix:**
  - Compress images
  - Use WebP format
  - Lazy load ads
  - Check `strategy="afterInteractive"` in AdSenseScript

### AdSense not approved

- **Issue:** Application pending or rejected
- **Fix:**
  - Ensure original content (no AI-generated)
  - Include privacy policy and cookie banner
  - Wait for Google review (7-10 days)
  - No click fraud or suspicious activity

---

## 📞 SUPPORT RESOURCES

- **Next.js Docs:** https://nextjs.org/docs
- **Google Search Console Help:** https://support.google.com/webmasters
- **Google AdSense Policies:** https://support.google.com/adsense/answer/1307808
- **GDPR Compliance:** https://gdpr-info.eu/

---

## 🎯 SUCCESS METRICS

**30 Days:**

- ✅ 50%+ posts indexed in Google
- ✅ 100+ monthly visits
- ✅ Lighthouse score >85

**90 Days:**

- ✅ 80%+ posts indexed
- ✅ 1,000+ monthly visits
- ✅ AdSense approval + first earnings
- ✅ Regular organic traffic growth

**6 Months:**

- ✅ All posts indexed
- ✅ Top posts ranking on page 1-2 of Google
- ✅ Consistent organic traffic
- ✅ $100+ monthly AdSense revenue

---

**Last Updated:** December 19, 2025  
**Next Review:** After AdSense approval
