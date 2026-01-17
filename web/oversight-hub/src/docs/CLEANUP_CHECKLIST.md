/\*\*

- Old Code Cleanup Checklist for Phase 6
-
- This document identifies code that should be cleaned up after Phase 6
- integration is complete and tested.
  \*/

// ============================================================================
// SECTION 1: OLD APPROVAL ENDPOINTS TO DEPRECATE
// ============================================================================

/\*\*

- OLD BACKEND ENDPOINTS TO DEPRECATE (in src/cofounder_agent/routes/\*)
-
- These should be deprecated after all clients migrate to new unified endpoints:
-
- 1.  POST /api/orchestrator/executions/{id}/approve
- - Used by: OrchestratorPage (NOW UPDATED ✅)
- - Replace with: PUT /api/tasks/{id}/status/validated
- - Status: DEPRECATED (use new endpoint)
-
- 2.  POST /api/orchestrator/executions/{id}/reject
- - Used by: OrchestratorPage (NOW UPDATED ✅)
- - Replace with: PUT /api/tasks/{id}/status/validated
- - Status: DEPRECATED (use new endpoint)
-
- 3.  GET /api/orchestrator/executions/{id}/export
- - Used by: OrchestratorPage (NOT UPDATED - keep for now)
- - Replace with: New export endpoint
- - Status: KEEP FOR NOW (not part of status workflow)
-
- 4.  GET /api/orchestrator/executions/{id}/learnings
- - Used by: OrchestratorPage (NOT UPDATED - keep for now)
- - Replace with: New learnings endpoint
- - Status: KEEP FOR NOW (not part of status workflow)
    \*/

// ============================================================================
// SECTION 2: OLD FRONTEND CODE TO CLEAN
// ============================================================================

/\*\*

- OLD IMPORTS IN COMPONENTS
-
- Before (OrchestratorPage.jsx):
- import { makeRequest } from '../services/cofounderAgentClient';
-
- After:
- // makeRequest removed - only imported where needed for non-status operations
- import { unifiedStatusService } from '../services/unifiedStatusService';
-
- Status: CLEANED ✅ (see updated OrchestratorPage.jsx)
  \*/

/\*\*

- OLD COMPONENT HANDLERS
-
- The following old handlers in various components should be replaced:
-
- OrchestratorPage.jsx - handleApprove():
- OLD:
-     await makeRequest(
-       `/api/orchestrator/executions/${executionId}/approve`,
-       'POST', {}
-     );
-
- NEW:
-     await unifiedStatusService.approve(executionId, feedback);
-
- Status: CLEANED ✅
-
- OrchestratorPage.jsx - handleReject():
- OLD:
-     await makeRequest(
-       `/api/orchestrator/executions/${executionId}/reject`,
-       'POST', {}
-     );
-
- NEW:
-     await unifiedStatusService.reject(executionId, reason);
-
- Status: CLEANED ✅
-
- TaskActions.jsx - handleApproveSubmit():
- OLD:
-     await onApprove(selectedTask.id, feedback);
-
- NEW:
-     await unifiedStatusService.approve(selectedTask.id, feedback);
-     await onApprove(...);  // Call legacy callback if needed
-
- Status: CLEANED ✅
-
- TaskActions.jsx - handleRejectSubmit():
- OLD:
-     await onReject(selectedTask.id, reason);
-
- NEW:
-     await unifiedStatusService.reject(selectedTask.id, reason);
-     await onReject(...);  // Call legacy callback if needed
-
- Status: CLEANED ✅
  \*/

// ============================================================================
// SECTION 3: OLD STATE MANAGEMENT TO REMOVE
// ============================================================================

/\*\*

- OBSOLETE STATE VARIABLES
-
- The following state variables in components are now handled by the
- unified service and should be removed:
-
- In OrchestratorPage.jsx:
- - None (all state is still used)
-
- In TaskActions.jsx:
- - None (error/validation state now enhanced)
-
- In TaskDetailModal.jsx:
- - Old modal state can be removed if using Dialog from MUI
- - Status: CLEANED ✅ (now uses MUI Dialog)
    \*/

// ============================================================================
// SECTION 4: OLD TEST FILES TO REMOVE
// ============================================================================

/\*\*

- OLD TEST FILES THAT SHOULD BE REMOVED
-
- Files testing old approval workflow:
- - (List any old approval tests here that should be removed)
-
- Status: TBD after new tests are verified
  \*/

// ============================================================================
// SECTION 5: DEPRECATED UTILITIES TO REMOVE
// ============================================================================

/\*\*

- DEPRECATED UTILITY FUNCTIONS
-
- None currently (all utilities are still used or backward compatible)
  \*/

// ============================================================================
// SECTION 6: MIGRATION COMPLETE CHECKLIST
// ============================================================================

/\*\*

- ITEMS COMPLETED IN PHASE 6:
-
- Frontend (Oversight Hub):
- ✅ Created statusEnums.js with new/legacy mappings
- ✅ Created unifiedStatusService.js with all operations
- ✅ Updated OrchestratorPage.jsx to use new service
- ✅ Updated TaskActions.jsx to use new service
- ✅ Updated TaskDetailModal.jsx with tabs and history
- ✅ Updated TaskManagement.jsx with metrics dashboard
- ✅ Created integration test suite
- ✅ Maintained backward compatibility
-
- Backend (Python):
- ⏳ Status mapping migration (SQL script)
- ⏳ Backward compatibility layer
- ⏳ Update API documentation
-
- Operations:
- ⏳ Database migration execution
- ⏳ User training/documentation
- ⏳ Deployment to staging
- ⏳ User acceptance testing
- ⏳ Deployment to production
- ⏳ Decommission old endpoints (after 30-day notice)
  \*/

// ============================================================================
// SECTION 7: DEPRECATION TIMELINE
// ============================================================================

/\*\*

- PHASE 6 DEPRECATION PLAN:
-
- WEEK 1-2 (Current):
- - Deploy new unified service
- - Update all client code to use new service
- - Run both systems in parallel
- - Collect metrics on success rate
-
- WEEK 3-4 (Post-Deployment):
- - Monitor error logs
- - Verify all operations working
- - Gather user feedback
- - Document any edge cases
-
- MONTH 2:
- - Begin official deprecation notice (30 days notice)
- - Email all integrators about upcoming changes
- - Provide migration guide
- - Support questions
-
- MONTH 3+:
- - Remove old endpoints from codebase
- - Archive old code in git
- - Update documentation
- - Celebrate completion 🎉
    \*/

// ============================================================================
// SECTION 8: FILES TO ARCHIVE (NOT DELETE)
// ============================================================================

/\*\*

- ARCHIVE THESE FILES (keep in git history, move to archive/ folder):
-
- - Old approval workflow documentation
- - Legacy status enum definitions (if separate file)
- - Old test files for approval workflow
-
- These should be moved to archive/ directory with date stamp for reference.
  \*/

// ============================================================================
// SECTION 9: KNOWN ISSUES & NOTES
// ============================================================================

/\*\*

- KNOWN ISSUES TO WATCH:
-
- 1.  Legacy endpoint fallback:
- - unifiedStatusService tries new endpoint first
- - Falls back to legacy /orchestrator/executions endpoint
- - This creates temporary double-call overhead
- - Should be removed once old endpoint is decommissioned
-
- 2.  Status mapping incompleteness:
- - Old system has 5 statuses, new has 9
- - Some mappings are one-to-many (e.g., on_hold → pending_approval)
- - May lose some status information during transition
- - Document if any status value is lost
-
- 3.  Metadata expansion:
- - New system stores more metadata
- - Old system had minimal tracking
- - Backfill of historical data may be needed
-
- 4.  Validation differences:
- - Old system had basic validation
- - New system has context-aware validation
- - Some tasks may fail validation that previously passed
- - Document any breaking validation changes
    \*/

// ============================================================================
// SECTION 10: CLEANUP EXECUTION GUIDE
// ============================================================================

/\*\*

- HOW TO SAFELY CLEAN UP OLD CODE:
-
- 1.  Verify all tests pass with new system
- npm run test:all
-
- 2.  Run 7 days of production monitoring
- - Check error rates
- - Monitor latency
- - Verify no old endpoints are being called
-
- 3.  Create deprecation PR with comments marking old code:
- - Comment out old endpoints
- - Add deprecation notices
- - Link to new implementations
-
- 4.  Wait 30 days after deprecation notice
- - Give clients time to migrate
- - Collect feedback
- - Handle edge cases
-
- 5.  Remove old code:
- - Delete commented code
- - Remove old test files
- - Update documentation
- - Create archive branch
-
- 6.  Deploy removal:
- - Deploy to staging first
- - Run full test suite
- - Monitor for errors
- - Deploy to production
    \*/

export default {
CLEANUP_STATUS: 'IN_PROGRESS',
LAST_UPDATED: '2026-01-16',
NEXT_PHASE: 'Execute production deployment and monitoring',
};
