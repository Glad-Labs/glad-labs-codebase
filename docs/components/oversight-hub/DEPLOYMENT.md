# 🚀 Oversight Hub - Deployment Guide

> **Complete guide to deploying the Oversight Hub admin dashboard to production**

## Overview

The Oversight Hub is a React-based admin dashboard providing oversight and control of the GLAD Labs platform.

**Key Details:**
- **Type:** React frontend application
- **Port (Local):** 3001
- **Location:** `web/oversight-hub/`
- **Deploy To:** Vercel
- **Hosting:** Vercel edge CDN
- **Database:** None (reads from Strapi API)
- **Dependencies:** Strapi CMS must be running

---

## 📋 Prerequisites

Before deploying Oversight Hub, ensure you have:

- [ ] Node.js 18+ installed locally
- [ ] Strapi CMS deployed and running
- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Environment variables configured

---

## 🌐 Deployment to Vercel

### Step 1: Connect Repository to Vercel

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"

### Step 2: Configure Project Settings

**In Vercel:**

1. **Root Directory:** Select `web/oversight-hub`
2. **Framework Preset:** React (auto-detected)
3. **Build Command:** `npm run build` (default OK)
4. **Output Directory:** `build` (default OK)

### Step 3: Set Environment Variables

**Critical:** Add these before deploying

Go to **Settings** → **Environment Variables**:

| Variable | Value | Notes |
|----------|-------|-------|
| `REACT_APP_STRAPI_API_URL` | `https://your-strapi-domain.com` | Your production Strapi URL |
| `REACT_APP_STRAPI_API_TOKEN` | Your token from Strapi | Admin/API token for authentication |

**Example:**
```
REACT_APP_STRAPI_API_URL=https://strapi.railway.app
REACT_APP_STRAPI_API_TOKEN=e1234567890abcdef...
```

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for build to complete (3-5 minutes)
3. Once successful, you'll get a production URL

### Step 5: Verify Deployment

After deployment:

1. Visit your Vercel production URL
2. Verify the dashboard loads
3. Check that data loads from Strapi
4. Test admin functions work correctly

---

## 🔍 Troubleshooting Deployment

### Build Fails

**Error:** `Build failed in Vercel`

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Ensure `REACT_APP_STRAPI_API_URL` is correct
4. Try rebuilding with "Redeploy" button

---

### 404 Errors

**Error:** `Cannot GET /` or pages not found

**Solution:**
1. Vercel needs a rewrite rule for client-side routing
2. Create `vercel.json` in `web/oversight-hub/`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

4. Redeploy

---

### API Connection Errors

**Error:** `Cannot connect to Strapi API` or `401 Unauthorized`

**Solution:**
1. Verify `REACT_APP_STRAPI_API_URL` is the **production** URL (not localhost)
2. Check `REACT_APP_STRAPI_API_TOKEN` is correct and valid
3. Test the API manually: `curl https://your-strapi-url/api/...`
4. Verify Strapi is running and accessible
5. Check CORS settings if using different domain

---

### Slow Performance

**Symptom:** Dashboard loads slowly or API requests timeout

**Solution:**
1. Check Strapi API response times
2. Enable Vercel Analytics to identify bottlenecks
3. Consider Strapi optimization if API is slow
4. Check network tab in browser DevTools

---

## 📊 Monitoring Production

### Vercel Analytics

1. Go to **Analytics** tab in Vercel dashboard
2. Monitor page load times and errors
3. Set up alerts for high error rates

### Vercel Logs

1. Go to **Logs** section
2. Check for runtime errors or deployment issues
3. Filter by timestamp to debug specific issues

---

## 🔄 Updates & Redeployment

### Automatic Deployments (Recommended)

Vercel automatically deploys when you push to your main branch:

```bash
git push origin main
# Vercel automatically builds and deploys
```

### Manual Redeployment

In Vercel dashboard → Click "Redeploy"

### Rolling Back

1. Go to **Deployments** tab
2. Find the previous working deployment
3. Click "Promote to Production"

---

## 🌍 Custom Domain

To use a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for DNS to propagate (up to 48 hours)

---

## 📈 Scaling & Performance

### Caching

Vercel automatically caches:
- Static files (CSS, JS, images)
- API responses (configurable)

### CDN

All content served through Vercel's global CDN for fast delivery worldwide.

### Optimization

For faster builds:
1. Enable `nextImageConfig` if images are slow
2. Compress large assets before deployment
3. Split large bundles with code splitting

---

## 🔒 Security Checklist

Before production launch:

- [ ] Environment variables not in code
- [ ] API token restricted to required endpoints
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS properly configured
- [ ] Authentication tokens rotated regularly
- [ ] No sensitive data in localStorage

---

## 📝 Environment Variables Reference

### Development (.env.local)
```
REACT_APP_STRAPI_API_URL=http://localhost:1337
REACT_APP_STRAPI_API_TOKEN=your-dev-token
```

### Production (Vercel dashboard)
```
REACT_APP_STRAPI_API_URL=https://strapi.production.com
REACT_APP_STRAPI_API_TOKEN=your-production-token
```

---

## 🔗 Related Documentation

- **[Oversight Hub Setup Guide](./SETUP.md)** - Local development setup
- **[General Deployment Guide](../../03-DEPLOYMENT_AND_INFRASTRUCTURE.md)** - Complete deployment reference
- **[Architecture & Design](../../02-ARCHITECTURE_AND_DESIGN.md)** - System design including dashboard
- **[Main Documentation Hub](../../00-README.md)** - All GLAD Labs documentation

---

**Last Updated:** October 21, 2025  
**Version:** 1.0  
**Status:** Production-Ready
