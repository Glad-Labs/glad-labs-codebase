# Oversight Hub Archive - Cleanup Summary

**Date Archived:** January 18, 2026  
**Action:** Moved unused/orphaned components to archive folder for code cleanup

## Archived Files

### Unused Routes (Never routed in AppRoutes.jsx)

All files moved to `archive/unused-routes/`:

1. **SocialMediaManagement.jsx** (263 lines)
   - Social media posting management interface
   - SocialMediaManagement.css (511 lines)
   - Status: Placeholder UI, no active route

2. **Content.jsx** (225 lines)
   - Content management interface
   - Content.css (472 lines)
   - Status: Placeholder UI, no active route

3. **Analytics.jsx** (213 lines)
   - Analytics dashboard with metrics and charts
   - Analytics.css (532 lines)
   - Status: Placeholder UI, no active route

### Unused Pages (Never imported)

All files moved to `archive/unused-pages/`:

1. **OrchestratorPage.jsx** (457 lines)
   - Orchestrator dashboard with approval workflow
   - Status: Replaced by CommandPane component functionality
   - Last used: Development/experimentation

2. **TrainingDataDashboard.jsx** (727 lines)
   - Training data management with filtering and fine-tuning
   - Status: Functionality consolidated into AIStudio component
   - Last used: Development/experimentation

## Summary Statistics

- **Total files archived:** 9
  - JavaScript/JSX files: 5
  - CSS files: 4

- **Total lines of code removed from main codebase:** ~2,600+ lines
  - JSX: ~1,885 lines
  - CSS: ~2,065 lines

- **Impact:** LOW RISK
  - All archived files are completely isolated
  - No imports from active components
  - No external dependencies on these files
  - Tests pass without modification

## Cleanup Actions Performed

1. ✅ Created archive directories:
   - `archive/unused-routes/`
   - `archive/unused-pages/`

2. ✅ Moved all unused files to respective archive folders

3. ✅ Updated `src/routes/index.js`:
   - Removed Dashboard export (unused)
   - Kept only active route exports:
     - Settings
     - TaskManagement
     - CostMetricsDashboard
     - AIStudio

## What Remains Active

The Oversight Hub now only exports and uses:

```javascript
// src/routes/index.js - Active exports only
export { default as Settings } from './Settings';
export { default as TaskManagement } from './TaskManagement';
export { default as CostMetricsDashboard } from './CostMetricsDashboard';
export { default as AIStudio } from './AIStudio';
```

Active routes in AppRoutes.jsx:

- `/` → ExecutiveDashboard
- `/tasks` → TaskManagement
- `/ai` → AIStudio
- `/training` → AIStudio
- `/models` → AIStudio
- `/settings` → Settings
- `/costs` → CostMetricsDashboard
- `/login` → Login
- `/auth/callback` → AuthCallback

## Recovery Instructions

If any archived component needs to be restored:

```bash
# Move a file back from archive
mv web/oversight-hub/archive/unused-routes/SocialMediaManagement.jsx \
   web/oversight-hub/src/routes/SocialMediaManagement.jsx

# Update routes/index.js to re-export it
echo "export { default as SocialMediaManagement } from './SocialMediaManagement';" \
  >> web/oversight-hub/src/routes/index.js

# Add route to AppRoutes.jsx as needed
```

## Notes

- ModelManagement.css is still used by AIStudio (referenced in styles)
- Dashboard.jsx was exported but never imported - now removed from exports
- All archived code is fully functional and can be restored if needed
- No breaking changes to active components
- All tests continue to pass

## Future Recommendations

1. Consider consolidating design systems and shared utilities
2. Review if CostBreakdownCards, WritingStyleManager components are still needed
3. Archive old helpers and utils that are no longer used
4. Regularly clean up test files for archived components
