import React, { useState } from 'react';
import { getAuthToken } from '../../services/authService';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [taskType, setTaskType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  // Task type definitions with required fields
  const taskTypes = {
    blog_post: {
      label: '📝 Blog Post',
      description: 'Create a comprehensive blog article',
      fields: [
        { name: 'title', label: 'Article Title', type: 'text', required: true },
        { name: 'topic', label: 'Topic', type: 'text', required: true },
        {
          name: 'keywords',
          label: 'SEO Keywords (comma-separated)',
          type: 'text',
          required: false,
        },
        {
          name: 'word_count',
          label: 'Word Count',
          type: 'number',
          required: false,
          defaultValue: 1500,
        },
        {
          name: 'style',
          label: 'Writing Style',
          type: 'select',
          required: true,
          options: ['technical', 'narrative', 'listicle', 'educational', 'thought-leadership'],
        },
      ],
    },
    image_generation: {
      label: '🖼️ Image Generation',
      description: 'Generate custom images',
      fields: [
        {
          name: 'description',
          label: 'Image Description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'count',
          label: 'Number of Images',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
          max: 5,
        },
        {
          name: 'style',
          label: 'Style',
          type: 'select',
          required: true,
          options: ['realistic', 'abstract', 'illustration', 'cartoon'],
        },
        {
          name: 'resolution',
          label: 'Resolution',
          type: 'select',
          required: true,
          options: ['512x512', '768x768', '1024x1024'],
          defaultValue: '768x768',
        },
      ],
    },
    social_media_post: {
      label: '📱 Social Media Post',
      description: 'Create a social media post',
      fields: [
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          required: true,
          options: ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok'],
        },
        { name: 'topic', label: 'Topic', type: 'text', required: true },
        {
          name: 'tone',
          label: 'Tone',
          type: 'select',
          required: true,
          options: ['professional', 'casual', 'academic', 'inspirational'],
        },
        {
          name: 'include_hashtags',
          label: 'Include Hashtags',
          type: 'select',
          required: true,
          options: ['yes', 'no'],
          defaultValue: 'yes',
        },
      ],
    },
    email_campaign: {
      label: '📧 Email Campaign',
      description: 'Create an email campaign',
      fields: [
        {
          name: 'subject',
          label: 'Email Subject',
          type: 'text',
          required: true,
        },
        { name: 'goal', label: 'Campaign Goal', type: 'text', required: true },
        {
          name: 'audience',
          label: 'Target Audience',
          type: 'text',
          required: false,
        },
        {
          name: 'tone',
          label: 'Tone',
          type: 'select',
          required: true,
          options: ['professional', 'casual', 'academic', 'inspirational'],
        },
      ],
    },
    content_brief: {
      label: '📋 Content Brief',
      description: 'Create a content strategy brief',
      fields: [
        { name: 'topic', label: 'Content Topic', type: 'text', required: true },
        {
          name: 'audience',
          label: 'Target Audience',
          type: 'text',
          required: true,
        },
        {
          name: 'goals',
          label: 'Content Goals',
          type: 'textarea',
          required: false,
        },
        {
          name: 'platforms',
          label: 'Target Platforms (comma-separated)',
          type: 'text',
          required: false,
        },
      ],
    },
  };

  const handleTaskTypeSelect = (type) => {
    setTaskType(type);
    setFormData({});
    setError(null);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const validateForm = () => {
    if (!taskType) {
      setError('Please select a task type');
      return false;
    }

    const fields = taskTypes[taskType].fields;
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setError(`${field.label} is required`);
        return false;
      }
    }

    // Validate that we have at least a topic for the backend
    const hasTopic = formData.topic || formData.description || formData.title;
    if (!hasTopic) {
      setError('Please provide a topic or description');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let response;

      // ✅ ROUTE TO CORRECT ENDPOINT BASED ON TASK TYPE
      if (taskType === 'blog_post') {
        // Use content generation endpoint for blog posts (triggers self-critique loop)
        const contentPayload = {
          topic: formData.topic || '',
          style: formData.style || 'professional',
          tone: formData.tone || 'professional',
          target_length: formData.word_count || 1500,
          tags: formData.keywords
            ? formData.keywords
                .split(',')
                .map((k) => k.trim())
                .filter((k) => k)
            : [],
        };

        console.log(
          '📤 Sending to content generation endpoint:',
          contentPayload
        );

        // ✅ CORRECT ENDPOINT FOR BLOG POSTS - Runs self-critique pipeline
        // Uses the actual backend endpoint: POST /api/content/blog-posts
        response = await fetch('http://localhost:8000/api/content/blog-posts', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            topic: contentPayload.topic || '',
            style: contentPayload.style || 'technical',
            tone: contentPayload.tone || 'professional',
            target_length: contentPayload.target_length || 1500,
            tags: contentPayload.tags || [],
            generate_featured_image: true,
            publish_mode: 'draft',
            enhanced: false,
            target_environment: 'production',
          }),
        });
      } else {
        // Use generic task endpoint for other types
        const taskPayload = {
          task_name: formData.title || formData.subject || `Task: ${taskType}`,
          topic: formData.topic || formData.description || '',
          primary_keyword: formData.keywords || formData.primary_keyword || '',
          target_audience: formData.target_audience || formData.audience || '',
          category: formData.category || taskType || 'general',
          metadata: {
            task_type: taskType,
            style: formData.style,
            word_count: formData.word_count,
            ...formData, // Include all original form data in metadata
          },
        };

        console.log('📤 Sending generic task payload:', taskPayload);

        response = await fetch('http://localhost:8000/api/tasks', {
          method: 'POST',
          headers,
          body: JSON.stringify(taskPayload),
        });
      }

      if (!response.ok) {
        let errorMessage = `Failed to create task: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('❌ Backend error response:', errorData);
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail)
              ? errorData.detail
                  .map((d) => `${d.loc?.join('.')}: ${d.msg}`)
                  .join('; ')
              : errorData.detail;
          }
        } catch (parseError) {
          // Couldn't parse JSON error response, use status text
        }
        throw new Error(errorMessage);
      }

      // Success response
      const result = await response.json();
      console.log('✅ Task created successfully:', result);

      // Notify parent and reset
      onTaskCreated();
      setTaskType('');
      setFormData({});
    } catch (err) {
      setError(`Failed to create task: ${err.message}`);
      console.error('Task creation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentTaskType = taskTypes[taskType];
  const currentFields = currentTaskType ? currentTaskType.fields : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-cyan-500 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-400">
            {taskType ? currentTaskType.label : '🚀 Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-900 border border-red-500 rounded-md text-red-100">
              ⚠️ {error}
            </div>
          )}

          {/* Task Type Selection */}
          {!taskType ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Select Task Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(taskTypes).map(([key, typeConfig]) => (
                  <button
                    key={key}
                    onClick={() => handleTaskTypeSelect(key)}
                    className="p-4 border-2 border-gray-600 rounded-lg hover:border-cyan-500 hover:bg-gray-700 transition text-left group"
                  >
                    <div className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300">
                      {typeConfig.label}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {typeConfig.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Back Button & Title */}
              <button
                type="button"
                onClick={() => {
                  setTaskType('');
                  setFormData({});
                }}
                className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 flex items-center gap-2"
              >
                ← Back to Task Types
              </button>

              {/* Dynamic Form Fields */}
              <div className="space-y-4">
                {currentFields.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="block text-gray-300 mb-2 font-medium"
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </label>

                    {field.type === 'text' || field.type === 'number' ? (
                      <input
                        id={field.name}
                        type={field.type}
                        value={
                          formData[field.name] ||
                          (field.defaultValue ? field.defaultValue : '')
                        }
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        placeholder={field.label}
                        min={field.min}
                        max={field.max}
                        className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
                      />
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        value={formData[field.name] || ''}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        placeholder={field.label}
                        rows={4}
                        className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 resize-none"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={field.name}
                        value={
                          formData[field.name] ||
                          (field.defaultValue ? field.defaultValue : '')
                        }
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="py-2 px-6 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin">⟳</span> Creating...
                    </>
                  ) : (
                    '✓ Create Task'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
