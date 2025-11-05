# 📊 Oversight Hub (React)

> Admin dashboard for monitoring and managing the Glad Labs platform

## 📍 Location

- **Source**: `web/oversight-hub/`
- **Main Entry**: `web/oversight-hub/README.md` (component-level)
- **Component Docs**: This folder (`docs/components/oversight-hub/`)

---

## 📚 Documentation

### Development & Setup

- See `README.md` in `web/oversight-hub/` for local development

### Configuration

- **`.env.example`** - Environment variables template
- **Firebase configuration** - Authentication and data storage
- **Routing configuration** - Application routes setup

---

## 🎯 Key Features

- **React 18** - Modern frontend framework
- **Firebase Integration** - Real-time database and authentication
- **Task Management** - Create, track, and execute AI tasks
- **Dashboard Views** - System health, financials, content queue, marketing analytics
- **Real-time Updates** - Pub/Sub messaging for live updates
- **Cost Tracking** - Monitor AI model costs and optimize spending

---

## 📂 Folder Structure

```
web/oversight-hub/
├── README.md                    ← Component README
├── src/
│   ├── App.jsx                 ← Root application component
│   ├── OversightHub.jsx        ← Main hub component
│   ├── firebaseConfig.js       ← Firebase setup
│   ├── index.js                ← React entry point
│   ├── components/
│   │   ├── Header.jsx          ← App header
│   │   ├── Sidebar.jsx         ← Navigation sidebar
│   │   ├── TaskList.jsx        ← Task list component
│   │   ├── Dashboard.jsx       ← Dashboard views
│   │   ├── Financials.jsx      ← Cost tracking
│   │   └── [other components]
│   ├── routes/
│   │   ├── Dashboard.jsx       ← Dashboard route
│   │   ├── Content.jsx         ← Content management
│   │   ├── Analytics.jsx       ← Analytics view
│   │   └── Settings.jsx        ← Settings
│   ├── hooks/
│   │   ├── useTasks.js         ← Tasks hook
│   │   ├── useRuns.js          ← Runs hook
│   │   ├── useFinancials.js    ← Financials hook
│   │   └── useFirestoreCollection.js
│   ├── services/
│   │   ├── taskService.js      ← Task operations
│   │   └── pubsub.js           ← Pub/Sub messaging
│   ├── store/
│   │   └── useStore.js         ← State management
│   └── lib/
│       ├── api.js              ← API integration
│       ├── date.js             ← Date utilities
│       └── firebase.js         ← Firebase utilities
└── public/                     ← Static assets
```

---

## 🔗 Integration Points

### Firebase Integration

**Config**: `src/firebaseConfig.js`

Key integrations:

- **Firestore**: Real-time database for tasks, runs, financials
- **Authentication**: Firebase Auth for user login
- **Cloud Messaging**: Notifications and updates

### API Integration

**Client**: `src/lib/api.js`

Connects to:

- Co-founder Agent (`http://localhost:8000`)
- Strapi CMS (`http://localhost:1337`)

### Pub/Sub Integration

**Service**: `src/services/pubsub.js`

Real-time messaging for:

- Task execution updates
- Cost tracking changes
- System health alerts

---

## 🧪 Testing

```bash
# Start from oversight-hub directory
cd web/oversight-hub

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

---

## 🚀 Development Workflow

### Local Development

```bash
# Start React dev server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 📋 Related Documentation

**In this component docs:**

- Setup: See `README.md` in `web/oversight-hub/`

**In main docs hub:**

- Dashboard Architecture: `docs/02-ARCHITECTURE_AND_DESIGN.md#dashboard-react`
- Firebase Setup: `docs/guides/FIREBASE_SETUP.md` (if exists)
- Deployment: `docs/03-DEPLOYMENT_AND_INFRASTRUCTURE.md`

---

## 🔑 Environment Variables

Required in `.env`:

```
REACT_APP_FIREBASE_API_KEY=<key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<domain>
REACT_APP_FIREBASE_PROJECT_ID=<project>
REACT_APP_FIREBASE_STORAGE_BUCKET=<bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<sender>
REACT_APP_FIREBASE_APP_ID=<app>
REACT_APP_COFOUNDER_API_URL=http://localhost:8000
REACT_APP_STRAPI_API_URL=http://localhost:1337
```

---

## ✅ Quick Links

- **Development**: Local setup in `web/oversight-hub/README.md`
- **Architecture**: `docs/02-ARCHITECTURE_AND_DESIGN.md`
- **Deployment**: `docs/03-DEPLOYMENT_AND_INFRASTRUCTURE.md`
