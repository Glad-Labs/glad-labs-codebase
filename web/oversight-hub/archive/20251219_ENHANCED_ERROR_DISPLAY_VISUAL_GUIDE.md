# Enhanced Task Error Display - Visual Guide

## Overview

This guide shows what the enhanced error display looks like in the UI and how it compares to the previous implementation.

## Before vs After

### BEFORE (Basic Error Display)

```
┌─────────────────────────────────────┐
│ ❌                                   │
│ Task Failed                          │
│                                     │
│ Failed to generate content:          │
│ API timeout                          │
│                                     │
│ ┌──────────────────────────────────┐│
│ │  ✕ Discard                       ││
│ └──────────────────────────────────┘│
└─────────────────────────────────────┘

Simple, but lacks detail
```

### AFTER (Enhanced Error Display)

```
┌──────────────────────────────────────────┐
│ ✗ Task Failed                            │
│ Review error details below               │
├──────────────────────────────────────────┤
│                                          │
│ ❌ Error                                 │
│ Failed to generate content: API timeout  │
│                                          │
│ ┌──────────────────────────────────────┐│
│ │ ▼ Detailed Information     [expandable]││
│ │   Stage: content_generation          ││
│ │   Code: API_TIMEOUT                  ││
│ │   Context: Generating blog post...   ││
│ │   Failed at: Jan 15, 2024 10:45:32   ││
│ └──────────────────────────────────────┘│
│                                          │
│ ┌──────────────────────────────────────┐│
│ │ Task ID: 550e8400-e29b-41d4-a716-... ││
│ │ Duration: 15 seconds                 ││
│ └──────────────────────────────────────┘│
│                                          │
│ ┌────────────────────┬─────────────────┐│
│ │  ✕ Discard         │                 ││
│ └────────────────────┴─────────────────┘│
└──────────────────────────────────────────┘

Detailed, organized, expandable
```

## Component Sections

### 1. Error Header

```
┌─────────────────────────────────────────────────────┐
│ ✗ Task Failed                                       │
│ Review error details below                          │
└─────────────────────────────────────────────────────┘
```

- Red border and background
- Clear "Task Failed" indicator
- Instruction text below

### 2. Primary Error Message

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│ ❌ Error                                            │
│ Failed to generate content: API timeout             │
│ (after 30 seconds waiting for OpenAI response)      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Error emoji (❌) for visual indicator
- Main error title
- Full error message with context
- Red background with good contrast

### 3. Detailed Information (Expandable)

#### COLLAPSED State

```
┌──────────────────────────────────────┐
│ ▼ Detailed Information               │
└──────────────────────────────────────┘
```

- Click to expand
- Arrow indicator shows expand state

#### EXPANDED State

```
┌─────────────────────────────────────────┐
│ ▼ Detailed Information                  │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ Stage: content_generation           ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ Code: API_TIMEOUT                   ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ Context: Generating blog post about ││
│ │          AI in Healthcare            ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ Failed at: 2024-01-15T10:45:32Z     ││
│ └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

Each metadata field shown in its own box:

- **Stage**: Which pipeline stage failed
- **Code**: Error classification code
- **Context**: What was being done
- **Timestamp**: Exact failure time

### 4. Debug Information

```
┌─────────────────────────────────────────┐
│ Task ID: 550e8400-e29b-41d4-a716-... │
│ Failed: Jan 15, 2024 10:45:32 AM      │
│ Duration: 15 seconds                   │
└─────────────────────────────────────────┘
```

- Task identifier for reference
- Failure timestamp in readable format
- How long the task ran before failing
- Gray background (secondary info)

### 5. Action Buttons

```
┌──────────────────────────────────────────┐
│                   ✕ Discard              │
└──────────────────────────────────────────┘
```

- Red button (matches error theme)
- Clear action (Discard the failed task)
- Proper spacing and size for touch

---

## Real-World Examples

### Example 1: API Timeout Error

```
┌─────────────────────────────────────────────────────┐
│ ✗ Task Failed                                       │
│ Review error details below                          │
├─────────────────────────────────────────────────────┤
│ ❌ Error                                            │
│ Failed to generate content: API timeout             │
│                                                     │
│ ▼ Detailed Information                              │
│   Stage: content_generation                         │
│   Code: API_TIMEOUT                                 │
│   Context: OpenAI API call, model: gpt-4,           │
│            max_tokens: 2000                         │
│   Failed at: 2024-01-15T10:45:32Z                   │
│                                                     │
│ Task ID: 550e8400-e29b-41d4-a716-...                │
│ Duration: 35 seconds                                │
├─────────────────────────────────────────────────────┤
│                        ✕ Discard                    │
└─────────────────────────────────────────────────────┘
```

### Example 2: Database Error

```
┌─────────────────────────────────────────────────────┐
│ ✗ Task Failed                                       │
│ Review error details below                          │
├─────────────────────────────────────────────────────┤
│ ❌ Error                                            │
│ Failed to save task result: Database connection lost│
│                                                     │
│ ▼ Detailed Information                              │
│   Stage: result_persistence                         │
│   Code: DB_CONNECTION_ERROR                         │
│   Context: PostgreSQL pool exhausted, active        │
│            connections: 100/100                     │
│   Failed at: 2024-01-15T10:46:15Z                   │
│                                                     │
│ Task ID: 550e8401-e29b-41d4-a716-...                │
│ Duration: 42 seconds                                │
├─────────────────────────────────────────────────────┤
│                        ✕ Discard                    │
└─────────────────────────────────────────────────────┘
```

### Example 3: Validation Error

```
┌─────────────────────────────────────────────────────┐
│ ✗ Task Failed                                       │
│ Review error details below                          │
├─────────────────────────────────────────────────────┤
│ ❌ Error                                            │
│ Invalid input: Topic exceeds maximum length         │
│                                                     │
│ ▼ Detailed Information                              │
│   Stage: validation                                 │
│   Code: VALIDATION_ERROR                            │
│   Context: topic length: 256 characters,            │
│            max allowed: 200                         │
│   Failed at: 2024-01-15T10:40:22Z                   │
│                                                     │
│ Task ID: 550e8402-e29b-41d4-a716-...                │
│ Duration: 2 seconds                                 │
├─────────────────────────────────────────────────────┤
│                        ✕ Discard                    │
└─────────────────────────────────────────────────────┘
```

### Example 4: Minimal Error (No Details)

```
┌─────────────────────────────────────────────────────┐
│ ✗ Task Failed                                       │
│ Review error details below                          │
├─────────────────────────────────────────────────────┤
│ ❌                                                  │
│ Task Failed                                         │
│ No detailed error information available             │
│                                                     │
│ Task ID: 550e8403-e29b-41d4-a716-...                │
├─────────────────────────────────────────────────────┤
│                        ✕ Discard                    │
└─────────────────────────────────────────────────────┘
```

---

## Mobile View

### Mobile - Collapsed (iPhone size)

```
┌──────────────────┐
│ ✗ Task Failed    │
│ Review error     │
├──────────────────┤
│ ❌ Error         │
│ Failed to        │
│ generate content:│
│ API timeout      │
│                  │
│ ▼ Detailed Info  │
│                  │
│ Task ID:         │
│ 550e8400-...     │
│ Duration: 15sec  │
├──────────────────┤
│ ✕ Discard        │
└──────────────────┘
```

### Mobile - Expanded

```
┌──────────────────┐
│ ✗ Task Failed    │
│ Review error     │
├──────────────────┤
│ ❌ Error         │
│ Failed to        │
│ generate content:│
│ API timeout      │
│                  │
│ ▼ Detailed Info  │
│ Stage:           │
│ content_gen...   │
│                  │
│ Code:            │
│ API_TIMEOUT      │
│                  │
│ Context:         │
│ Generating blog  │
│ post about...    │
│                  │
│ Failed at:       │
│ Jan 15 10:45:32  │
│                  │
│ Task ID:         │
│ 550e8400-...     │
│ Duration: 15sec  │
├──────────────────┤
│ ✕ Discard        │
└──────────────────┘
```

---

## Color Scheme

### Error Colors

| Element           | Color      | Hex              |
| ----------------- | ---------- | ---------------- |
| Borders           | Red 500    | #ef4444          |
| Background (Main) | Red 900/20 | Semi-transparent |
| Text (Error)      | Red 300    | #fca5a5          |
| Text (Label)      | Red 400    | #f87171          |
| Icon              | Red Emoji  | ❌               |

### Secondary Colors

| Element          | Color       | Hex              |
| ---------------- | ----------- | ---------------- |
| Headers          | Gray 800    | #1f2937          |
| Text (Secondary) | Gray 400    | #9ca3af          |
| Debug Background | Gray 800/50 | Semi-transparent |

---

## Responsive Behavior

### Desktop (>768px)

- Full error panel displayed
- Detailed section expands inline
- All fields visible at once
- Buttons at bottom right

### Tablet (500-768px)

- Slightly compressed layout
- Expandable section takes more space when open
- Text wraps appropriately
- Touch-friendly buttons

### Mobile (<500px)

- Full width panels
- Expandable sections stack vertically
- All text wraps naturally
- Large touch targets for buttons

---

## Animation States

### Expand Animation (Click Details)

```
Before Click:
▼ Detailed Information

After Click (Animates down):
▼ Detailed Information
  Stage: content_generation
  Code: API_TIMEOUT
  ... (slides down smoothly)
```

- Arrow rotates 180°
- Content slides down
- Smooth height transition

---

## Accessibility Features

### Color Contrast

- Red text (#f87171) on dark background (#1f2937) = WCAG AAA
- Gray text (#9ca3af) on gray background = WCAG AA
- Icon colors sufficient for distinction

### Text Hierarchy

- Error title: Large font
- Details: Regular font
- Debug info: Smaller font
- Clear visual separation

### Keyboard Navigation

- Expandable button is focusable
- Enter/Space to toggle
- Discard button is accessible
- Tab order logical

### Screen Readers

- Semantic HTML used
- Button labels clear
- Error status announced
- Details button state announced

---

## Dark Mode Support

The component uses Tailwind dark mode compatible colors:

- Red backgrounds: Automatically adjusted
- Gray text: Maintains contrast
- Borders: Visible in both themes
- Icons: Native emojis (always visible)

---

## Interaction Flow

```
1. User views failed task
                ↓
2. ErrorDetailPanel component renders
                ↓
3. Error extraction logic runs
                ↓
4. Primary error displayed prominently
                ↓
5. User clicks "Detailed Information" (optional)
                ↓
6. Details section expands
                ↓
7. User reviews metadata
                ↓
8. User clicks "Discard" to reject task
                ↓
9. Task removed from queue
```

---

## Copy Examples

### Error Messages (Primary)

- "Failed to generate content: API timeout"
- "Invalid input: Topic exceeds 200 characters"
- "Failed to publish: CMS is unavailable"
- "Database connection lost"

### Stage Labels

- "content_generation"
- "validation"
- "publishing"
- "result_persistence"

### Error Codes

- "API_TIMEOUT"
- "VALIDATION_ERROR"
- "CMS_UNAVAILABLE"
- "DB_CONNECTION_ERROR"

### Context Examples

- "OpenAI API call, model: gpt-4, max_tokens: 2000"
- "topic: 'AI Healthcare', length: 256, max: 200"
- "strapi_url: cms.example.com, status: 503"
- "active connections: 100/100"

---

## Common Variations

### Variation 1: Error with Secondary Errors

```
Primary Error
↓
Detailed Information (expandable)
↓
Secondary Error 1: [additional error]
↓
Secondary Error 2: [additional error]
↓
Debug Info
```

### Variation 2: Error with No Metadata

```
Primary Error
↓
(No Details section)
↓
Debug Info
↓
Action Buttons
```

### Variation 3: Error with Full Context

```
Primary Error (Large, prominent)
↓
Detailed Information with all fields populated
↓
Multiple secondary errors
↓
Complete debug information
↓
Discard button
```

---

## Testing Visual Elements

When testing, verify:

- [ ] Error icon (❌) displays correctly
- [ ] Red colors render properly
- [ ] Text wraps at screen edges
- [ ] Expandable button works smoothly
- [ ] Arrow rotates on expand
- [ ] All metadata fields visible when expanded
- [ ] Debug section at bottom
- [ ] Discard button prominent
- [ ] No layout shifts or jumps
- [ ] Mobile view is readable
- [ ] Touch targets are large enough

---

**Last Updated**: 2024  
**Created for**: Enhanced Error Display Feature  
**Purpose**: Visual Documentation and Reference
