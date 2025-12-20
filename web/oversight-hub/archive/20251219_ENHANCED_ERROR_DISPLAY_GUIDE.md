# Enhanced Task Error Display - Implementation Guide

## Overview

This enhancement improves error visibility and debugging experience when tasks fail by providing detailed, structured error information throughout the UI.

## Changes Made

### 1. Frontend Components

#### New Component: `ErrorDetailPanel.jsx`

- **Location**: `web/oversight-hub/src/components/tasks/ErrorDetailPanel.jsx`
- **Purpose**: Displays comprehensive error information for failed tasks
- **Features**:
  - Extracts error info from multiple sources (task_metadata, error_message field, metadata, result)
  - Shows primary error message prominently
  - Expands to show detailed error metadata (stage, code, context, timestamp)
  - Displays secondary errors if multiple failures occurred
  - Shows task debug info (ID, failure timestamp, duration)
  - Gracefully handles missing error information

**Error Extraction Order**:

1. `task.task_metadata.error_message` (primary source)
2. `task.task_metadata.error_details` (detailed metadata)
3. `task.error_message` (fallback)
4. `task.metadata.error_message` (legacy)
5. `task.metadata.error` (legacy)
6. `task.result.error` (legacy)

**Metadata Fields Extracted**:

- `failedAtStage`: Which pipeline stage failed
- `stageMessage`: Detailed message from the stage
- `code`: Error code
- `context`: Error context
- `timestamp`: When the error occurred
- Any other custom metadata

#### Updated: `ResultPreviewPanel.jsx`

- **Changes**:
  - Imports and uses `ErrorDetailPanel` component
  - Replaces basic error message with comprehensive error display
  - Maintains action buttons for task rejection
  - Better visual hierarchy for error information

#### Updated: `TaskDetailModal.jsx`

- **Changes**:
  - Imports and uses `ErrorDetailPanel` component
  - Shows detailed errors when task status is 'failed'
  - Preserves backward compatibility with other error displays

### 2. Backend Updates

#### Updated: `task_routes.py`

**TaskResponse Schema**:
Added two new fields to better communicate errors:

```python
error_message: Optional[str] = None  # Error message for failed tasks
error_details: Optional[Dict[str, Any]] = None  # Detailed error info
```

**convert_db_row_to_dict() Function**:
Enhanced to:

- Map database `error_message` column to response field
- Extract error details from `task_metadata.error_details`
- Promote top-level error_message if present in task_metadata
- Handle JSON parsing of error details
- Provide fallback error information if available

**Error Data Flow**:

1. Backend stores error info in database (error_message column + error_details)
2. convert_db_row_to_dict() normalizes this data
3. TaskResponse includes both error_message and error_details
4. Frontend ErrorDetailPanel extracts and displays in appropriate format

### 3. Error Data Structure

When a task fails, the error information is structured as:

```json
{
  "id": "task-uuid",
  "status": "failed",
  "error_message": "Primary error message describing what failed",
  "error_details": {
    "failedAtStage": "content_generation",
    "stageMessage": "Failed to generate content: API timeout",
    "code": "API_TIMEOUT",
    "context": "Generating content for topic: AI Healthcare",
    "timestamp": "2024-01-15T10:45:32Z"
  },
  "task_metadata": {
    "error_message": "Same as error_message",
    "error_details": { ... },
    "stage": "content_generation",
    "message": "Failed to generate content: API timeout"
  }
}
```

## Implementation Details

### Error Display Flow

1. **Task Failed State**:
   - ResultPreviewPanel detects `task.status === 'failed'`
   - Renders header with "✗ Task Failed" styling
   - Calls `<ErrorDetailPanel task={task} />`

2. **ErrorDetailPanel Processing**:
   - Calls `getErrorDetails()` to extract from multiple sources
   - Structures errors into: primary, secondary, metadata, stack
   - Renders based on what information is available

3. **Error Rendering**:
   - **Primary Error**: Large, prominent display with context
   - **Detailed Info**: Expandable section with metadata
     - Failed stage indicator
     - Stage message with details
     - Error code
     - Context information
     - Exact failure timestamp
   - **Secondary Errors**: Additional error messages from logs
   - **Debug Info**: Task ID, failure time, execution duration

### Color Scheme

- **Red backgrounds**: Primary errors and headers
- **Red borders**: Error boundaries and panels
- **Red text**: Error messages and labels
- **Gray section**: Debug information (secondary)

### Responsiveness

- All error text wraps properly on smaller screens
- Monospace fonts for IDs and technical details
- Expandable sections to keep UI compact
- Touch-friendly button sizes

## Backend Error Reporting

Stages should report errors like this:

```python
# When a stage fails:
task_metadata = {
    "error_message": "Description of what went wrong",
    "error_details": {
        "failedAtStage": "stage_name",
        "stageMessage": "Detailed message about the failure",
        "code": "ERROR_CODE",
        "context": "Context when error occurred",
        "timestamp": datetime.utcnow().isoformat()
    },
    "stage": "stage_name",
    "message": "Detailed message about the failure"
}

# Store in database:
await db_service.update_task(task_id, {
    "status": "failed",
    "error_message": task_metadata["error_message"],
    "error_details": json.dumps(task_metadata["error_details"]),
    "task_metadata": json.dumps(task_metadata)
})
```

## Testing the Enhancement

### Test Case 1: Basic Error Display

1. Create a task that fails with simple error message
2. Verify error appears in ResultPreviewPanel
3. Verify error appears in TaskDetailModal

### Test Case 2: Detailed Error Info

1. Create a task that fails with error_details metadata
2. Click "Detailed Information" to expand
3. Verify all metadata fields display correctly
4. Check formatting and readability

### Test Case 3: Multiple Error Sources

1. Create a task with errors in multiple locations (metadata, task_metadata, result)
2. Verify ErrorDetailPanel prioritizes correctly
3. Check that secondary errors appear in correct section

### Test Case 4: Legacy Errors

1. Test with old error formats (plain string, JSON)
2. Verify graceful fallback to basic error display
3. Confirm no UI breakage

### Test Case 5: Missing Error Info

1. Create a failed task with no error information
2. Verify appropriate "No detailed error information" message
3. Check that task ID and timestamp still display

## Frontend Integration Checklist

- ✅ ErrorDetailPanel component created
- ✅ ResultPreviewPanel updated
- ✅ TaskDetailModal updated
- ✅ Imports added correctly
- ✅ CSS classes use existing Tailwind colors
- ✅ Error extraction covers all sources
- ✅ Graceful fallbacks implemented
- ✅ Mobile responsive design
- ✅ Expandable sections for compact layout
- ✅ Timestamp formatting for readability

## Backend Integration Checklist

- ✅ TaskResponse schema updated
- ✅ convert_db_row_to_dict() enhanced
- ✅ Error field mapping implemented
- ✅ JSON parsing for error_details
- ✅ Fallback error extraction from task_metadata
- ✅ No breaking changes to existing code
- ✅ Backward compatible with legacy data

## Performance Considerations

- **Frontend**:
  - Error details rendering only when needed (failed status)
  - Expandable sections prevent unnecessary rendering
  - No additional API calls required
  - Efficient error data extraction

- **Backend**:
  - Error conversion happens once during task retrieval
  - No additional database queries
  - JSON parsing only for error_details field
  - Minimal overhead

## Future Enhancements

1. **Error Categories**: Classify errors (timeout, API error, validation, etc.)
2. **Error Templates**: Show common solutions for known errors
3. **Error Analytics**: Track which errors occur most frequently
4. **Retry Suggestions**: Offer retry options for transient errors
5. **Error Logging**: Send errors to centralized logging system
6. **User Feedback**: Allow users to provide feedback on errors
7. **Error Search**: Search/filter tasks by error type or message

## Debugging Helper Functions

If you need to debug error display, you can manually set error data:

```javascript
// In browser console for testing:
const testTask = {
  id: 'test-id',
  status: 'failed',
  error_message: 'Test error message',
  error_details: {
    failedAtStage: 'generation',
    stageMessage: 'Test stage message',
    code: 'TEST_ERROR',
  },
  task_metadata: {
    stage: 'generation',
    message: 'Test metadata message',
  },
  started_at: new Date(Date.now() - 60000).toISOString(),
  completed_at: new Date().toISOString(),
};

// Then pass to component for testing
```

## Files Modified

| File                                                            | Changes                          |
| --------------------------------------------------------------- | -------------------------------- |
| `web/oversight-hub/src/components/tasks/ErrorDetailPanel.jsx`   | ✨ NEW - Error display component |
| `web/oversight-hub/src/components/tasks/ResultPreviewPanel.jsx` | Enhanced error display           |
| `web/oversight-hub/src/components/tasks/TaskDetailModal.jsx`    | Enhanced error display           |
| `src/cofounder_agent/routes/task_routes.py`                     | Schema + conversion logic        |

## Dependencies

- React (existing)
- Tailwind CSS (existing)
- date-fns (for date formatting, if using in future)

No new external dependencies required!
