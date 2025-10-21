# Vercel Deployment Guide - Public Site

This guide covers deploying the GLAD Labs public site to Vercel.

## Prerequisites

- Vercel account (free or pro)
- Git repository access
- Strapi instance running on Railway (production)
- API token from Strapi admin

## Step 1: Prepare Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New..." → "Project"
3. Select your GitHub repository (`glad-labs-website`)
4. Framework Preset: **Next.js** (should auto-detect)
5. Root Directory: **web/public-site**

## Step 2: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### Required Variables

**NEXT_PUBLIC_STRAPI_API_URL** (Production)

```
https://glad-labs-strapi-main-production.up.railway.app
```

**STRAPI_API_TOKEN** (Production)

- Generate this from your Strapi admin panel:
  1. Go to **Settings** → **API Tokens** → **Create new API Token**
  2. Name: `Vercel Public Site`
  3. Type: **Full access**
  4. Copy the generated token
  5. **DO NOT commit this to Git!**
  6. Paste it into Vercel's environment variables

### Optional Variables

**NEXT_PUBLIC_SITE_URL** (for SEO)

```
https://gladlabs.io
```

**NEXT_PUBLIC_GA_ID** (for Google Analytics - add if available)

```
G-XXXXXXXXXX
```

## Step 3: Deploy

### Automatic Deployment (Recommended)

1. Set up the environment variables in Vercel (see Step 2)
2. Push to your main branch in GitHub
3. Vercel will automatically build and deploy

### Manual Deployment

1. Configure environment variables in Vercel dashboard
2. Click the **Deploy** button in Vercel
3. Monitor the build logs for any errors

## Step 4: Verify Deployment

After deployment completes:

1. Visit the Vercel deployment URL (e.g., `https://glad-labs-website.vercel.app`)
2. Check the home page loads correctly
3. Verify navigation to posts, categories, and tags
4. Test pagination and filtering

## Troubleshooting

### Build Fails with "Not Found" Error

**Cause:** Strapi API is unreachable or the `/categories` or `/tags` endpoints don't exist

**Solution:**

1. Verify `STRAPI_API_TOKEN` is correct and copied fully
2. Verify `NEXT_PUBLIC_STRAPI_API_URL` is correct (no trailing slash)
3. Check that Strapi instance is running on Railway
4. Check Strapi has categories and tags data

### Build Fails During Static Generation

**Cause:** Strapi API timeouts during build

**Solution:**

1. Check Railway Strapi instance status
2. Verify network connectivity from Vercel to Railway
3. The fallback configuration will generate pages on-demand

### Environment Variables Not Loading

**Cause:** Variables not prefixed with `NEXT_PUBLIC_` won't be available in browser

**Solution:**

- Frontend-only variables must start with `NEXT_PUBLIC_`
- Backend-only variables (like `STRAPI_API_TOKEN`) don't need the prefix
- Redeploy after updating environment variables

### API Token Not Working

**Cause:** Token is incorrect or expired

**Solution:**

1. Generate a new token in Strapi Admin:
   - Settings → API Tokens → Create new
   - Type: **Full access**
   - Copy entire token string
2. Update in Vercel environment variables
3. Redeploy

## Best Practices

### Security

✅ **DO:**

- Store `STRAPI_API_TOKEN` in Vercel secrets only
- Never commit `.env.local` to Git
- Use environment variables for all sensitive data
- Rotate API tokens regularly

❌ **DON'T:**

- Commit API tokens to your repository
- Share tokens publicly
- Use weak API tokens
- Store secrets in code

### Performance

- Enable ISR (Incremental Static Regeneration) in Next.js
- Set `revalidate: 60` for pages that update frequently
- Use the `fallback: 'blocking'` strategy for dynamic routes
- Monitor build times and optimize if needed

### Monitoring

- Set up Vercel Analytics
- Configure error alerts
- Monitor Strapi API availability
- Track build performance

## Deployment Checklist

- [ ] Vercel project created
- [ ] Root directory set to `web/public-site`
- [ ] `NEXT_PUBLIC_STRAPI_API_URL` configured
- [ ] `STRAPI_API_TOKEN` configured
- [ ] `NEXT_PUBLIC_SITE_URL` configured (optional)
- [ ] Environment variables verified
- [ ] Initial deployment successful
- [ ] All pages rendering correctly
- [ ] API connectivity verified
- [ ] SEO metadata correct

## Rollback

If deployment has issues:

1. Go to Vercel Deployments tab
2. Find the previous working deployment
3. Click the three dots menu
4. Select "Redeploy"

## Next Steps

1. Set up a staging environment on Vercel (optional)
2. Configure custom domain
3. Set up analytics
4. Configure production error tracking (Sentry, etc.)
5. Set up automatic backups of Strapi data

## Support

For issues with:

- **Vercel**: See [Vercel Docs](https://vercel.com/docs)
- **Next.js**: See [Next.js Docs](https://nextjs.org/docs)
- **Strapi**: See [Strapi Docs](https://docs.strapi.io)
