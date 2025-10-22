# 🛠️ Oversight Hub - Setup Guide

> **Local development setup for the Oversight Hub admin dashboard**

## Overview

The Oversight Hub is a React-based admin dashboard for monitoring and controlling the GLAD Labs platform.

**Key Details:**
- **Type:** React frontend
- **Location:** `web/oversight-hub/`
- **Local Port:** 3001
- **Status Page:** http://localhost:3001
- **API Dependency:** Strapi CMS (port 1337)

---

## 📋 Prerequisites

Ensure you have installed:

- [ ] **Node.js 18+** - Runtime
- [ ] **npm 8+** or **yarn 1.22+** - Package manager
- [ ] **Git** - Version control
- [ ] **Strapi running locally** - API backend

### Starting Strapi First

The Oversight Hub requires Strapi to be running. Start it in another terminal:

```bash
cd cms/strapi-main
npm run develop
```

---

## 🚀 Local Development Setup

### Step 1: Install Dependencies

```bash
cd web/oversight-hub
npm install
```

### Step 2: Configure Environment

Create `.env.local` in the `web/oversight-hub/` directory:

```
REACT_APP_STRAPI_API_URL=http://localhost:1337
REACT_APP_STRAPI_API_TOKEN=your-local-token-here
```

### Step 3: Get Strapi Token

1. Start Strapi: `npm run develop` (from `cms/strapi-main/`)
2. Visit http://localhost:1337/admin
3. Create admin account or login
4. Go to Settings → API Tokens
5. Create new token with admin permissions
6. Copy token to `.env.local`

### Step 4: Start Development Server

```bash
npm start
```

The dashboard opens at `http://localhost:3001`

---

## 📂 Project Structure

```
web/oversight-hub/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── .env.local
└── README.md
```

---

## 🔧 Common Tasks

### Fetching Data from Strapi

```javascript
import { fetchFromStrapi } from '../services/strapiService';

export default function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const result = await fetchFromStrapi('/api/endpoint');
      setData(result);
    }
    getData();
  }, []);

  return <div>{data && <p>{data.title}</p>}</div>;
}
```

### Adding a New Page

Create new file in `src/pages/NewPage.js`:

```javascript
export default function NewPage() {
  return <div>New Page Content</div>;
}
```

Add route in `src/App.js`:

```javascript
<Routes>
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

---

## 🐛 Troubleshooting

### Port 3001 Already in Use

```bash
PORT=3002 npm start
```

### Cannot Connect to Strapi

1. Verify Strapi is running
2. Check `REACT_APP_STRAPI_API_URL` in `.env.local`
3. Verify token is valid
4. Restart dev server

### Blank Page

1. Open DevTools (F12)
2. Check Console for red errors
3. Clear and reinstall:

```bash
rm -rf node_modules
npm install
npm start
```

### Environment Variables Not Working

Ensure `.env.local` is in `web/oversight-hub/` and restart dev server. Variables must start with `REACT_APP_`.

---

## 🔗 Related Documentation

- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Vercel
- **[Component Overview](./README.md)** - Architecture details
- **[Development Workflow](../../04-DEVELOPMENT_WORKFLOW.md)** - Git workflow
- **[Architecture & Design](../../02-ARCHITECTURE_AND_DESIGN.md)** - System design
- **[Main Documentation Hub](../../00-README.md)** - All GLAD Labs docs

---

**Last Updated:** October 21, 2025  
**Status:** Ready for Development
