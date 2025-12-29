# Task Result Preview - Error Display Improvements

## Overview

The Task Result Preview panel now displays much more detailed error information when tasks fail, helping you quickly understand what went wrong.

## Enhancements Made

### 1. **Improved Error Extraction**

The component now searches more thoroughly for error information:

**Sources checked (in priority order):**

- `task_metadata.error_message` - Primary error from orchestrator
- `task_metadata.error_details` - Structured error details
- `task_metadata.error_code` - Error classification code
- `task_metadata.error_type` - Type of error that occurred
- `task_metadata.stage` - Which stage failed
- `task_metadata.message` - Stage-specific message
- `error_message` (database column) - Direct error field
- `metadata` object - Additional context
- `result` object - Legacy error format

### 2. **Enhanced "No Error Details" Display**

When detailed error info is missing, the panel now shows what we DO know:

**Displays:**

- Current task status
- Topic (what was being processed)
- Task type (blog post, article, etc.)
- Failed stage (if available)
- Progress percentage
- Duration (time spent before failure)
- Helpful tip to check backend logs

Example:

```
❌ Task Failed
Status: failed
Topic: "How AI is Transforming Healthcare"
Task Type: blog_post
Failed at Stage: content_generation
Progress: 45%
Duration: 23 seconds

💡 If the error details are missing, check the backend logs...
```

### 3. **Better Metadata Organization**

Error metadata is now better organized:

**Special Fields (prominently displayed):**

- Error Code
- Error Type
- Failed Stage
- Stage Message
- Context
- Failure Timestamp

**Other Fields:**

- Automatically formatted and displayed
- Empty/null values are skipped
- Long values are truncated (300 chars max)
- Values are pretty-printed if JSON
- Field names are humanized (snake_case → readable)

### 4. **Improved Display Formatting**

- **Better whitespace handling**: Multi-line errors display cleanly
- **Smart truncation**: Long errors shown with "..." indicator
- **JSON formatting**: Complex objects shown with indentation
- **Color coding**: Different colors for different error types
- **Readable field names**: `error_code` → "error code"

### 5. **Secondary Error Support**

If multiple error sources are found, they're displayed as:

```
Secondary Error 1: [error details]
Secondary Error 2: [error details]
...
```

## What Information Gets Displayed

### When Full Details Are Available

```
❌ Error
[Primary error message]

▼ Detailed Information
Stage: content_generation
Message: Failed to call GPT API
Error Code: RATE_LIMIT
Error Type: API_ERROR
Context: Max tokens exceeded
Failed at: Dec 12, 2025 7:49:47 PM
[Other metadata fields...]

Task ID: 9b78a4d3...
Failed: Dec 12, 2025 7:49:47 PM
Duration: 23 seconds
```

### When Minimal Details Are Available

```
❌ Task Failed
Status: failed
Topic: "Article Title"
Task Type: blog_post
Failed at Stage: image_generation
Progress: 75%
Duration: 45 seconds

💡 If the error details are missing, check the backend logs...
```

## Backend Integration Tips

To provide complete error information from your backend:

### 1. **Store Error in Task Record**

```python
await db_service.update_task_status(
    task_id=task_id,
    status="failed",
    result=None,
    error_message="Primary error message here"  # Captured
)
```

### 2. **Use Task Metadata for Rich Details**

```python
await db_service.update_task(task_id, {
    "task_metadata": {
        "error_message": "Primary error description",
        "error_details": {
            "code": "API_ERROR",
            "type": "rate_limit"
        },
        "error_code": "RATE_LIMIT",
        "error_type": "API_ERROR",
        "stage": "content_generation",
        "message": "Detailed info about what failed"
    }
})
```

### 3. **Include Structured Error Objects**

```python
error_metadata = {
    "error_message": "GPT API rate limit exceeded",
    "error_code": "RATE_LIMIT_429",
    "error_type": "API_ERROR",
    "original_error": str(exception),
    "attempted_tokens": 8000,
    "max_tokens": 4000,
    "retry_after_seconds": 60,
    "timestamp": datetime.utcnow().isoformat()
}
```

## Error Categories

The panel handles different error formats automatically:

| Error Type        | Display As                  | Source                                   |
| ----------------- | --------------------------- | ---------------------------------------- |
| String            | Plain text                  | `error_message`, `task_metadata.message` |
| JSON              | Formatted object            | `error_details`, `metadata`              |
| Structured object | Formatted with field labels | Objects with code/type/etc               |
| Multiple errors   | List of secondary errors    | Various sources                          |

## Testing the Improvements

1. **Create a task that fails** through the Oversight Hub
2. **Click to preview the failed task**
3. **Observe the error details** displayed in the Result Preview panel
4. **Check for:**
   - Error message is readable
   - Stage information (if available)
   - Error codes and types
   - Duration and progress info
   - All metadata fields are formatted nicely

## Troubleshooting

### "No detailed error information available" showing?

- ✅ Task data is loaded but backend didn't capture error details
- **Solution:** Check backend logs to see the actual error
- Update backend to populate `error_message` or `task_metadata` fields

### Error message is truncated?

- ✅ Long errors are truncated to 300 characters to avoid UI overflow
- **Solution:** This is intentional; full details available in backend logs

### Fields showing as empty?

- ✅ Null/undefined/empty values are intentionally skipped
- **Solution:** Ensure backend populates fields before storing

### Multiple error messages showing?

- ✅ Component searches multiple sources (task_metadata, metadata, result, etc.)
- **Solution:** This is intentional to ensure no error info is lost
- Primary error at top, secondary errors below

## Files Modified

- `src/components/tasks/ErrorDetailPanel.jsx` - Enhanced error extraction and display logic

## Visual Improvements

**Before:**

```
❌ Task Failed
   No detailed error information available
```

**After:**

```
❌ Task Failed
   Review error details below

   ❌ Error
   [Actual error message with details]

   ▼ Detailed Information
   [Expanded metadata with stage, code, type, etc.]

   Task Info
   ID: 9b78a4d3...
   Status: failed
   Duration: 45 seconds
```

## Next Steps

1. **Test the error display** with failed tasks
2. **Update backend** to populate error fields more comprehensively
3. **Monitor error patterns** in the UI to improve error handling
4. **Add error recovery suggestions** for common failure modes
