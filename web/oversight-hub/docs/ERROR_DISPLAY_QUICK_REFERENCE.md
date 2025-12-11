# Enhanced Error Display - Quick Reference

## For Frontend Developers

### Using ErrorDetailPanel

```jsx
import ErrorDetailPanel from '../components/tasks/ErrorDetailPanel';

// In your component:
{
  task.status === 'failed' && <ErrorDetailPanel task={task} />;
}
```

### What the Component Expects

The `task` object should have:

```javascript
{
  status: 'failed',  // Must be 'failed' to display
  error_message: 'Main error message',  // Optional
  error_details: {  // Optional
    failedAtStage: 'stage_name',
    stageMessage: 'Details about the failure',
    code: 'ERROR_CODE',
    context: 'Contextual info',
    timestamp: '2024-01-15T10:45:32Z'
  },
  task_metadata: {  // Optional - also searched for errors
    error_message: '...',
    error_details: {...},
    stage: '...',
    message: '...'
  },
  id: 'task-uuid',  // For display
  started_at: '2024-01-15T10:30:00Z',  // For duration calc
  completed_at: '2024-01-15T10:45:00Z'  // For duration calc
}
```

### Component Props

```jsx
<ErrorDetailPanel
  task={failedTask} // Required: task object with status === 'failed'
/>
```

### What It Displays

1. **Primary Error** - Main error message (always shown)
2. **Detailed Info** - Expandable section with metadata
3. **Secondary Errors** - Additional error messages
4. **Debug Info** - Task ID, timestamps, duration

### Styling

The component uses Tailwind CSS classes:

- Red (`red-500`, `red-600`, `red-900`) for error colors
- Gray (`gray-800`, `gray-400`) for secondary info
- Full dark theme compatible

---

## For Backend Developers

### Populating Error Information

When a task fails, populate the error fields:

```python
task_data = {
    'id': task_id,
    'status': 'failed',
    'error_message': 'Description of what went wrong',
    'error_details': {
        'failedAtStage': 'content_generation',
        'stageMessage': 'OpenAI API timeout after 30 seconds',
        'code': 'API_TIMEOUT',
        'context': 'Generating blog post about AI in Healthcare',
        'timestamp': datetime.utcnow().isoformat()
    },
    'task_metadata': {
        'error_message': 'Description of what went wrong',
        'error_details': {...},
        'stage': 'content_generation',
        'message': 'OpenAI API timeout after 30 seconds'
    }
}
```

### Database Update Example

```python
await db_service.update_task(task_id, {
    'status': 'failed',
    'error_message': task_data['error_message'],
    'error_details': json.dumps(task_data['error_details']),
    'task_metadata': json.dumps(task_data['task_metadata'])
})
```

### API Response

The API automatically includes error fields:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "task_name": "Blog Post - AI",
  "status": "failed",
  "error_message": "Failed to generate content: API timeout",
  "error_details": {
    "failedAtStage": "content_generation",
    "stageMessage": "OpenAI API did not respond within 30 seconds",
    "code": "API_TIMEOUT",
    "context": "Generating blog post about AI in Healthcare",
    "timestamp": "2024-01-15T10:45:32Z"
  },
  "task_metadata": {...}
}
```

### Best Practices

1. **Always set error_message** - The primary user-facing message
2. **Include failedAtStage** - Helps debugging multi-stage pipelines
3. **Be specific in stageMessage** - Include what was being done when it failed
4. **Use codes** - Machine-readable error classification
5. **Add context** - What inputs caused the failure
6. **Set timestamp** - When exactly did it fail

---

## Error Message Examples

### API Timeout

```python
{
    'error_message': 'Failed to generate content: API request timed out',
    'error_details': {
        'failedAtStage': 'content_generation',
        'stageMessage': 'OpenAI API did not respond within 30 seconds',
        'code': 'API_TIMEOUT',
        'context': 'topic: "AI in Healthcare", model: gpt-4',
        'timestamp': datetime.utcnow().isoformat()
    }
}
```

### Validation Error

```python
{
    'error_message': 'Invalid input: Topic exceeds 200 characters',
    'error_details': {
        'failedAtStage': 'validation',
        'stageMessage': 'Topic must be between 3 and 200 characters',
        'code': 'VALIDATION_ERROR',
        'context': f'topic length: {len(topic)}, max: 200',
        'timestamp': datetime.utcnow().isoformat()
    }
}
```

### Database Error

```python
{
    'error_message': 'Failed to save task result: Database connection lost',
    'error_details': {
        'failedAtStage': 'result_persistence',
        'stageMessage': 'PostgreSQL connection pool exhausted',
        'code': 'DB_CONNECTION_ERROR',
        'context': 'Active connections: 100/100',
        'timestamp': datetime.utcnow().isoformat()
    }
}
```

### External Service Error

```python
{
    'error_message': 'Failed to publish: Strapi CMS is unavailable',
    'error_details': {
        'failedAtStage': 'publishing',
        'stageMessage': 'HTTP 503 Service Unavailable from Strapi',
        'code': 'CMS_UNAVAILABLE',
        'context': 'strapi_url: cms.example.com, response: 503',
        'timestamp': datetime.utcnow().isoformat()
    }
}
```

---

## Testing Error Display

### Manual Test with Mock Data

```python
# Create a failed task for testing
test_task = {
    'id': str(uuid4()),
    'task_name': 'Test Task',
    'status': 'failed',
    'error_message': 'Test error message',
    'error_details': {
        'failedAtStage': 'test_stage',
        'stageMessage': 'This is a test error',
        'code': 'TEST_ERROR',
        'context': 'Testing error display',
        'timestamp': datetime.utcnow().isoformat()
    },
    'task_metadata': {
        'stage': 'test_stage',
        'message': 'This is a test error'
    },
    'started_at': (datetime.utcnow() - timedelta(minutes=5)).isoformat(),
    'completed_at': datetime.utcnow().isoformat()
}

# Return this from API and verify display
```

### Frontend Console Test

```javascript
// In browser console:
const testTask = {
  status: 'failed',
  error_message: 'Test error',
  error_details: {
    failedAtStage: 'testing',
    stageMessage: 'Testing error display',
    code: 'TEST',
  },
  task_metadata: {
    stage: 'testing',
    message: 'Testing',
  },
  id: 'test-id',
  started_at: new Date(Date.now() - 60000).toISOString(),
  completed_at: new Date().toISOString(),
};

// Open React DevTools and set this as task prop
```

---

## Troubleshooting

| Issue                 | Solution                                                        |
| --------------------- | --------------------------------------------------------------- |
| Error not showing     | Check if `status === 'failed'` and `error_message` is populated |
| Details not expanding | Verify `error_details` object exists and has fields             |
| Weird formatting      | Check for very long strings - they'll wrap naturally            |
| Missing context       | Ensure all error_details fields are populated in backend        |
| No task ID shown      | Verify task.id field exists and is valid UUID                   |

---

## Files Reference

| File                                   | Purpose                                  |
| -------------------------------------- | ---------------------------------------- |
| `ErrorDetailPanel.jsx`                 | Main error display component             |
| `ResultPreviewPanel.jsx`               | Integrates error panel for results       |
| `TaskDetailModal.jsx`                  | Integrates error panel for modal details |
| `task_routes.py`                       | Backend schema and conversion logic      |
| `ENHANCED_ERROR_DISPLAY_GUIDE.md`      | Full documentation                       |
| `ERROR_DISPLAY_ENHANCEMENT_SUMMARY.md` | Overview and summary                     |

---

## Common Patterns

### Pattern 1: Stage Failure with Recovery Suggestion

```python
{
    'error_message': 'Content generation failed - will retry',
    'error_details': {
        'failedAtStage': 'content_generation',
        'stageMessage': 'Rate limit exceeded. Retrying in 60 seconds.',
        'code': 'RATE_LIMITED',
        'context': 'retry_attempt: 2/3',
        'timestamp': datetime.utcnow().isoformat()
    }
}
```

### Pattern 2: User Input Error

```python
{
    'error_message': 'Invalid request - please check your input',
    'error_details': {
        'failedAtStage': 'validation',
        'stageMessage': 'Keyword must contain at least one word',
        'code': 'INVALID_INPUT',
        'context': f'keyword: "{keyword}"',
        'timestamp': datetime.utcnow().isoformat()
    }
}
```

### Pattern 3: Integration Error

```python
{
    'error_message': 'Failed to publish to Strapi',
    'error_details': {
        'failedAtStage': 'publishing',
        'stageMessage': 'Authentication failed with Strapi API',
        'code': 'AUTH_FAILED',
        'context': 'strapi_endpoint: /api/posts, status: 401',
        'timestamp': datetime.utcnow().isoformat()
    }
}
```

---

## Quick Checklist

When implementing error handling:

- [ ] Set `error_message` with clear user-facing text
- [ ] Set `failedAtStage` to identify where failure occurred
- [ ] Include `stageMessage` with technical details
- [ ] Use `code` for programmatic error handling
- [ ] Add `context` for debugging
- [ ] Set `timestamp` for timeline reconstruction
- [ ] Test error display in ResultPreviewPanel
- [ ] Test error display in TaskDetailModal
- [ ] Verify all fields render correctly
- [ ] Check mobile responsiveness

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: Production Ready ✅
