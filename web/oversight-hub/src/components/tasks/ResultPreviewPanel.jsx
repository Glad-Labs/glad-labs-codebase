import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getAuthToken } from '../../services/authService';
import ErrorDetailPanel from './ErrorDetailPanel';
import ConstraintComplianceDisplay from './ConstraintComplianceDisplay';

const ResultPreviewPanel = ({
  task = null,
  onApprove = () => {},
  onReject = () => {},
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSEO, setEditedSEO] = useState({});
  const [publishDestination, setPublishDestination] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState('');
  const [reviewerId, setReviewerId] = useState('admin');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGenerationProgress, setImageGenerationProgress] = useState(0);
  const [imageSource, setImageSource] = useState('pexels');
  const [imageGenerationMessage, setImageGenerationMessage] = useState('');
  const [hasGeneratedImage, setHasGeneratedImage] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Helper function to extract full title from content (e.g., "Title: Best Eats in the Northeast USA: A Culinary Guide")
  const extractTitleFromContent = (content, fallbackTitle) => {
    if (!content) return fallbackTitle;

    // Look for "Title: ..." pattern on its own line or at start
    const titleMatch = content.match(/^[\s]*Title:\s*(.+?)(?:\n|$)/im);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }

    // Look for standalone title (word followed by newline/end, before headings)
    // This catches cases like "My Title\nIntroduction"
    const standaloneTitleMatch = content.match(
      /^[\s]*([A-Z][^\n]+?)[\s]*\n(?=[A-Z])/
    );
    if (standaloneTitleMatch && standaloneTitleMatch[1]) {
      const candidate = standaloneTitleMatch[1].trim();
      // Only use if it's at least 5 characters and looks like a title
      if (
        candidate.length >= 5 &&
        !candidate.match(
          /^(Introduction|Content|Body|Summary|Conclusion|Main|Points):/i
        )
      ) {
        return candidate;
      }
    }

    // Fallback to first heading if no Title: pattern
    const headingMatch = content.match(/^#+\s*(.+?)$/m);
    if (headingMatch && headingMatch[1]) {
      return headingMatch[1].trim();
    }

    return fallbackTitle;
  };

  // Helper function to clean content - remove title and section headers
  const cleanContent = (content, title) => {
    if (!content) return '';

    let cleaned = content;

    // STEP 1: Remove full title if it appears at the beginning
    // Handle multi-line titles and "Title: " prefixed titles
    if (title) {
      const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Pattern 1: "Title: {actual_title}" at start
      cleaned = cleaned.replace(
        new RegExp(`^Title:\\s*${escapedTitle}\\s*\\n*`, 'im'),
        ''
      );

      // Pattern 2: Just the title on its own line at start
      cleaned = cleaned.replace(
        new RegExp(`^${escapedTitle}\\s*\\n*`, 'im'),
        ''
      );

      // Pattern 3: Title anywhere in first 200 chars (fallback for extracted titles)
      if (cleaned.length > 0 && cleaned.substring(0, 200).includes(title)) {
        const idx = cleaned.indexOf(title);
        if (idx < 150) {
          cleaned =
            cleaned.substring(0, idx) + cleaned.substring(idx + title.length);
        }
      }
    }

    // STEP 2: Remove "Title: " prefix if it remains at the beginning
    cleaned = cleaned.replace(/^Title:\s*/im, '');

    // STEP 3: Remove common section headers that shouldn't be in the body
    const sectionHeaders = [
      /^Introduction:\s*\n?/gm,
      /^Main Points:\s*\n?/gm,
      /^Main Content:\s*\n?/gm,
      /^Conclusion:\s*\n?/gm,
      /^Summary:\s*\n?/gm,
      /^Body:\s*\n?/gm,
      /^Content:\s*\n?/gm,
    ];

    sectionHeaders.forEach((pattern) => {
      cleaned = cleaned.replace(pattern, '');
    });

    // STEP 4: Remove extra whitespace that might result from cleanup
    cleaned = cleaned
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n');

    return cleaned.trim();
  };

  // Helper function to generate featured image using Pexels or SDXL
  const generateFeaturedImage = async (isRetry = false) => {
    if (!editedTitle) {
      alert('⚠️ Please set a title first');
      return;
    }

    setIsRetrying(isRetry);
    setIsGeneratingImage(true);
    setImageGenerationProgress(0);
    setImageGenerationMessage('');
    if (!isRetry) {
      setHasGeneratedImage(false);
    }

    let progressInterval = null;

    try {
      const token = getAuthToken();

      // Simulate progress updates (faster for Pexels retries)
      progressInterval = setInterval(
        () => {
          setImageGenerationProgress((prev) => {
            if (isRetry) {
              // Pexels-only retry should finish faster
              if (prev < 60) return prev + Math.random() * 40;
            } else {
              // Full generation might use SDXL
              if (prev < 80) return prev + Math.random() * 30;
            }
            return prev;
          });
        },
        isRetry ? 200 : 300
      );

      // Determine which image sources to try based on user selection
      // NOTE: isRetry just means "fetch another one", doesn't override user's source selection
      const usePexels = imageSource === 'pexels' || imageSource === 'both';
      const useSDXL = imageSource === 'sdxl' || imageSource === 'both';

      // Extract keywords from SEO metadata if available
      let keywords = [];
      if (editedSEO?.keywords) {
        // Handle both string and array formats
        if (typeof editedSEO.keywords === 'string') {
          keywords = editedSEO.keywords
            .split(',')
            .map((kw) => kw.trim())
            .filter((kw) => kw.length > 0)
            .slice(0, 5); // Limit to top 5 keywords
        } else if (Array.isArray(editedSEO.keywords)) {
          keywords = editedSEO.keywords
            .slice(0, 5)
            .map((kw) => String(kw).trim());
        }
      }

      // Use primary keyword (first keyword) as the search topic if available
      // This gives better Pexels results than the full title
      // Example: title="How AI Revolutionizes Healthcare" + keywords=["AI", "healthcare", ...]
      // becomes search prompt: "AI" instead of the full title
      const searchPrompt = keywords.length > 0 ? keywords[0] : editedTitle;

      const requestPayload = {
        prompt: searchPrompt, // Primary keyword or full title as fallback
        title: editedTitle,
        keywords: keywords.length > 0 ? keywords : undefined,
        use_pexels: usePexels,
        use_generation: useSDXL,
        // Request different image on retry by adding random offset
        // This tells Pexels to return different results (e.g., next page)
        page: isRetry ? Math.floor(Math.random() * 5) + 2 : 1, // Pages 2-6 on retry
      };

      console.log('📸 Generating image with:', requestPayload);

      const response = await fetch(
        'http://localhost:8000/api/media/generate-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (!response.ok) {
        let errorMsg = 'Image generation failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.detail || errorMsg;
        } catch (e) {
          errorMsg = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      console.log('📸 Image generation result:', result);

      if (result.success && result.image_url) {
        setFeaturedImageUrl(result.image_url);
        const source = result.image?.source || result.source || 'image service';
        setImageGenerationMessage(
          `✅ Image from ${source} in ${result.generation_time?.toFixed(2) || '?'}s`
        );
        setHasGeneratedImage(true);
        setImageGenerationProgress(100);
        setIsRetrying(false);
        console.log(
          `✅ Featured image ${isRetry ? 'refetched' : 'generated'}:`,
          result
        );
      } else {
        throw new Error(result.message || 'No image URL returned');
      }
    } catch (error) {
      console.error('❌ Image generation error:', error);
      setIsRetrying(false);
      setImageGenerationMessage(
        `❌ Failed: ${error.message || 'Unknown error'}`
      );
    } finally {
      clearInterval(progressInterval);
      setIsGeneratingImage(false);
      setTimeout(() => setImageGenerationProgress(0), 500);
    }
  };
  React.useEffect(() => {
    if (task) {
      // ✅ PRIORITY: Check task_metadata.content (where orchestrator stores generated content)
      const taskMeta = task.task_metadata || {};
      let content = '';
      let title = '';
      let seo = {};
      let excerpt = '';
      let featuredImage = '';

      // PRIMARY: Load from task_metadata (orchestrator output)
      if (taskMeta.content) {
        content = taskMeta.content;
        // First try to extract from content, then fall back to metadata
        title = extractTitleFromContent(
          content,
          taskMeta.title || task.title || task.topic || 'Generated Content'
        );
        excerpt = taskMeta.excerpt || '';
        featuredImage = taskMeta.featured_image_url || '';

        seo = {
          title: taskMeta.seo_title || taskMeta.title || '',
          description: taskMeta.seo_description || excerpt || '',
          keywords: taskMeta.seo_keywords || '',
        };

        console.log('✅ Loaded content from task_metadata:', {
          hasContent: !!content,
          contentLength: content?.length || 0,
          title,
          hasExcerpt: !!excerpt,
        });
      }
      // FALLBACK: Check result_data field (may be JSON string)
      else if (task.result_data) {
        try {
          const resultData =
            typeof task.result_data === 'string'
              ? JSON.parse(task.result_data)
              : task.result_data;

          if (resultData.content) {
            content = resultData.content;
            // First try to extract from content, then fall back to metadata
            title = extractTitleFromContent(
              content,
              resultData.title || task.title || 'Generated Content'
            );
            excerpt = resultData.excerpt || '';

            seo = {
              title: resultData.title || '',
              description: excerpt || '',
              keywords: resultData.keywords || '',
            };

            console.log('✅ Loaded content from result_data:', {
              hasContent: !!content,
              contentLength: content?.length || 0,
            });
          }
        } catch (e) {
          console.warn('Failed to parse result_data:', e);
        }
      }
      // FALLBACK: Legacy content_tasks structure
      else if (task.content) {
        content = task.content;
        // First try to extract from content, then fall back to metadata
        title = extractTitleFromContent(
          content,
          task.title || task.topic || task.task_name || 'Generated Content'
        );
        excerpt = task.excerpt || '';

        seo = {
          title: task.title || task.topic || '',
          description: task.excerpt || '',
          keywords:
            task.tags && Array.isArray(task.tags)
              ? task.tags.join(', ')
              : typeof task.tags === 'string'
                ? task.tags
                : '',
        };
      }
      // FALLBACK: Handle result object (legacy)
      else if (task.result) {
        if (typeof task.result === 'string') {
          content = task.result;
          title = task.title || task.task_name || 'Generated Content';
        } else if (typeof task.result === 'object') {
          content =
            task.result.content ||
            task.result.generated_content ||
            task.result.article ||
            task.result.body ||
            task.result.text ||
            JSON.stringify(task.result, null, 2);

          // 🎯 For blog posts, prioritize extracted title from content, then fall back to other sources
          title = extractTitleFromContent(
            content,
            task.result.seo_title ||
              task.result.title ||
              task.result.article_title ||
              task.result.seo?.title ||
              task.title ||
              task.task_name ||
              'Generated Content'
          );

          seo = task.result.seo || {
            title: task.result.seo_title || task.result.article_title || '',
            description:
              task.result.seo_description || task.result.meta_description || '',
            keywords: task.result.keywords || task.result.tags || '',
          };
        }
      }

      // ✅ Clean up content by removing section headers and title duplicates
      const cleanedContent = cleanContent(content, title);

      setEditedContent(cleanedContent);
      setEditedTitle(title);
      setEditedSEO(seo || { title: '', description: '', keywords: '' });
      setFeaturedImageUrl(featuredImage);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900 rounded-lg border border-cyan-500/30">
        <div className="text-4xl mb-4">📋</div>
        <div className="text-lg font-semibold">No task selected</div>
        <div className="text-sm mt-2 text-center">
          Select a task from the queue to preview results
        </div>
      </div>
    );
  }

  if (task.status === 'pending' || task.status === 'in_progress') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900 rounded-lg border border-cyan-500/30">
        <div className="text-4xl mb-4 animate-pulse">⏳</div>
        <div className="text-lg font-semibold">Task in progress</div>
        <div className="text-sm mt-2">
          Results will appear here when complete
        </div>
      </div>
    );
  }

  if (task.status === 'failed') {
    return (
      <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-red-500/30 overflow-hidden">
        {/* Header */}
        <div className="border-b border-red-500/30 p-4 bg-gray-800">
          <h3 className="text-lg font-bold text-red-400">✗ Task Failed</h3>
          <p className="text-xs text-red-300 mt-1">
            Review error details below
          </p>
        </div>

        {/* Error Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorDetailPanel task={task} />
        </div>

        {/* Action Buttons */}
        <div className="border-t border-red-500/30 bg-gray-800 p-4 flex gap-3 justify-end">
          <button
            onClick={() => onReject(task)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
          >
            ✕ Discard
          </button>
        </div>
      </div>
    );
  }

  // Handle approval submission
  const handleApprovalSubmit = async (approved) => {
    if (!task?.id && !task?.task_id) {
      console.error('❌ No task ID available for approval');
      alert('Error: Cannot approve without task ID');
      return;
    }

    // Validate approval feedback
    if (approvalFeedback.length < 10 || approvalFeedback.length > 1000) {
      alert('Feedback must be between 10 and 1000 characters');
      return;
    }

    if (!reviewerId || reviewerId.length < 2) {
      alert('Reviewer ID is required (minimum 2 characters)');
      return;
    }

    setApprovalLoading(true);

    try {
      const taskId = task.id || task.task_id;
      const token = getAuthToken();

      const approvalPayload = {
        approved,
        human_feedback: approvalFeedback,
        reviewer_id: reviewerId,
        featured_image_url: featuredImageUrl,
      };

      console.log('📤 Sending approval request:', {
        taskId,
        ...approvalPayload,
      });

      const response = await fetch(
        `http://localhost:8000/api/content/tasks/${taskId}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(approvalPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP ${response.status}: Approval failed`
        );
      }

      const result = await response.json();
      console.log('✅ Approval submitted:', result);

      // Call the callback
      if (approved) {
        onApprove({
          ...task,
          status: 'approved',
          approval_status: 'approved',
          approval_timestamp: result.approval_timestamp,
          reviewer_id: reviewerId,
          cms_post_id: result.strapi_post_id,
          published_url: result.published_url,
          featured_image_url: featuredImageUrl,
        });
      } else {
        onReject({
          ...task,
          status: 'rejected',
          approval_status: 'rejected',
          rejection_reason: approvalFeedback,
          reviewer_id: reviewerId,
        });
      }

      const successMsg =
        approved && result.published_url
          ? `✅ Task approved and published!\n\nURL: ${result.published_url}\n\nMessage: ${result.message}`
          : `✅ Task ${approved ? 'approved' : 'rejected'} successfully!\n\nMessage: ${result.message}`;

      alert(successMsg);
    } catch (error) {
      console.error('❌ Approval error:', error);
      alert(`❌ Error submitting approval: ${error.message}`);
    } finally {
      setApprovalLoading(false);
    }
  };

  // Task completed - show results
  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="border-b border-cyan-500/30 p-4 bg-gray-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-cyan-400">✓ Results Preview</h3>
          <p className="text-xs text-gray-400 mt-1">
            Review and approve before publishing
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded font-medium transition ${
            isEditing
              ? 'bg-cyan-600 text-white hover:bg-cyan-700'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isEditing ? '✓ Done Editing' : '✎ Edit'}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Task Summary */}
        <div className="bg-gray-800/50 border border-cyan-500/30 rounded p-4">
          <h3 className="text-sm font-semibold text-cyan-400 mb-3">
            📊 Task Summary
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">Task ID:</span>
              <p className="text-gray-200 font-mono break-all">
                {task?.id?.slice(0, 12)}...
              </p>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <p className="text-gray-200 capitalize font-semibold">
                {task?.status === 'awaiting_approval' ? (
                  <span className="text-yellow-400">⏳ Awaiting Approval</span>
                ) : (
                  task?.status
                )}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <p className="text-gray-200">
                {task?.type || task?.task_type || 'unknown'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Quality Score:</span>
              <p className="text-gray-200">
                {task?.task_metadata?.quality_score
                  ? `${task.task_metadata.quality_score}/100`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          ) : (
            <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-100 break-words whitespace-normal">
              {editedTitle || 'Untitled'}
            </div>
          )}
        </div>

        {/* Featured Image */}
        {task?.task_metadata?.featured_image_url || featuredImageUrl ? (
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Featured Image
            </label>
            <div className="p-3 bg-gray-800 rounded border border-gray-700">
              <img
                src={featuredImageUrl || task.task_metadata?.featured_image_url}
                alt="Featured"
                className="w-full max-h-64 object-cover rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div
                style={{ display: 'none' }}
                className="text-gray-400 text-sm py-4"
              >
                Image URL:{' '}
                {featuredImageUrl || task.task_metadata?.featured_image_url}
              </div>
            </div>
          </div>
        ) : null}

        {/* Featured Image URL Input or Generator */}
        <div>
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            Featured Image URL
          </label>

          {/* Image Source Selector */}
          <div className="mb-3 flex gap-2">
            <label className="text-xs text-gray-400 pt-2">Source:</label>
            <select
              value={imageSource}
              onChange={(e) => setImageSource(e.target.value)}
              disabled={isGeneratingImage}
              className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              <option value="pexels">🖼️ Pexels (Free, Fast)</option>
              <option value="sdxl">🎨 SDXL (GPU-based)</option>
              <option value="both">🔄 Try Both (Pexels first)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="Enter image URL or generate one..."
              className="flex-1 p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={generateFeaturedImage}
              disabled={isGeneratingImage || !editedTitle}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {isGeneratingImage ? (
                <>
                  <span className="animate-spin">⟳</span> Generating...
                </>
              ) : (
                '🎨 Generate'
              )}
            </button>

            {hasGeneratedImage && (
              <button
                onClick={() => generateFeaturedImage(true)}
                disabled={isGeneratingImage}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                title="Fetch another image using the same source"
              >
                {isGeneratingImage ? (
                  <>
                    <span className="animate-spin">⟳</span> Searching...
                  </>
                ) : (
                  '🔄 Try Again'
                )}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {isGeneratingImage && imageGenerationProgress > 0 && (
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(imageGenerationProgress, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                {Math.round(Math.min(imageGenerationProgress, 100))}% -{' '}
                {imageGenerationMessage
                  ? imageGenerationMessage.split(' in ')[0]
                  : 'Generating...'}
              </p>
            </div>
          )}

          {imageGenerationMessage && (
            <p
              className={`text-xs mt-2 ${
                imageGenerationMessage.includes('✅')
                  ? 'text-green-400'
                  : 'text-orange-400'
              }`}
            >
              {imageGenerationMessage}
            </p>
          )}

          {!editedTitle && (
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Set a title first to generate a relevant image
            </p>
          )}
        </div>

        {/* Excerpt */}
        {task?.task_metadata?.excerpt && (
          <div>
            <label className="block text-sm font-semibold text-cyan-400 mb-2">
              Excerpt
            </label>
            <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-300 italic">
              {task.task_metadata.excerpt}
            </div>
          </div>
        )}

        {/* Content Preview */}
        <div>
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            Content ({editedContent?.length || 0} characters)
          </label>
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
              rows={12}
            />
          ) : (
            <div className="p-4 bg-gray-800 rounded border border-gray-700 prose prose-invert max-w-none">
              {editedContent ? (
                <>
                  {task.type?.includes('blog') || task.type === 'blog_post' ? (
                    <div className="text-gray-300 max-h-96 overflow-y-auto">
                      <ReactMarkdown>{editedContent}</ReactMarkdown>
                    </div>
                  ) : (
                    <pre className="text-gray-300 whitespace-pre-wrap break-words text-sm">
                      {editedContent}
                    </pre>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No content available. The generation may have failed.
                </div>
              )}
            </div>
          )}
        </div>

        {/* QA Feedback */}
        {task?.task_metadata?.qa_feedback && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">
              🔍 QA Feedback
            </h4>
            <p className="text-sm text-gray-300">
              {task.task_metadata.qa_feedback}
            </p>
          </div>
        )}

        {/* SEO Metadata (for blog posts) */}
        {task.type?.includes('blog') && (
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-cyan-400 mb-3">
              SEO Metadata
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Meta Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSEO.title || ''}
                    onChange={(e) =>
                      setEditedSEO({ ...editedSEO, title: e.target.value })
                    }
                    maxLength="60"
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                ) : (
                  <div className="p-2 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
                    {editedSEO.title || 'Not set'}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {editedSEO.title?.length || 0}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Meta Description
                </label>
                {isEditing ? (
                  <textarea
                    value={editedSEO.description || ''}
                    onChange={(e) =>
                      setEditedSEO({
                        ...editedSEO,
                        description: e.target.value,
                      })
                    }
                    maxLength="160"
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    rows={2}
                  />
                ) : (
                  <div className="p-2 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
                    {editedSEO.description || 'Not set'}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {editedSEO.description?.length || 0}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Keywords
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSEO.keywords || ''}
                    onChange={(e) =>
                      setEditedSEO({ ...editedSEO, keywords: e.target.value })
                    }
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                ) : (
                  <div className="p-2 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
                    {editedSEO.keywords || 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Publish Destination */}
        <div className="border-t border-gray-700 pt-4">
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            Publish To
          </label>
          <select
            value={publishDestination}
            onChange={(e) => setPublishDestination(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select destination...</option>
            <option value="cms-db">💾 CMS DB</option>
            <option value="twitter">𝕏 Twitter/X</option>
            <option value="facebook">👍 Facebook</option>
            <option value="instagram">📸 Instagram</option>
            <option value="linkedin">💼 LinkedIn</option>
            <option value="email">📧 Email Campaign</option>
            <option value="google-drive">☁️ Google Drive</option>
            <option value="download">💾 Download Only</option>
          </select>
        </div>

        {/* Compliance Metrics */}
        {task.constraint_compliance && (
          <div className="border-t border-gray-700 pt-4">
            <ConstraintComplianceDisplay
              compliance={task.constraint_compliance}
              phaseBreakdown={task.task_metadata?.phase_compliance}
            />
          </div>
        )}

        {/* Approval Section */}
        {task.status === 'awaiting_approval' && (
          <div className="border-t border-yellow-700/50 pt-4 bg-yellow-900/20 p-4 rounded">
            <h4 className="text-sm font-semibold text-yellow-400 mb-3">
              ⏳ Human Approval Required
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Reviewer ID *
                </label>
                <input
                  type="text"
                  value={reviewerId}
                  onChange={(e) => setReviewerId(e.target.value)}
                  placeholder="your.username"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alphanumeric, dots, dashes, underscores
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Approval Feedback * (10-1000 characters)
                </label>
                <textarea
                  value={approvalFeedback}
                  onChange={(e) => setApprovalFeedback(e.target.value)}
                  placeholder="Provide your review feedback, reason for decision..."
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {approvalFeedback.length}/1000 characters
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-cyan-500/30 bg-gray-800 p-4 flex gap-3 justify-end">
        {task.status === 'awaiting_approval' ? (
          <>
            <button
              onClick={() => handleApprovalSubmit(false)}
              disabled={approvalLoading || !approvalFeedback || !reviewerId}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {approvalLoading ? (
                <>
                  <span className="animate-spin">⟳</span> Rejecting...
                </>
              ) : (
                '✕ Reject'
              )}
            </button>
            <button
              onClick={() => handleApprovalSubmit(true)}
              disabled={approvalLoading || !approvalFeedback || !reviewerId}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {approvalLoading ? (
                <>
                  <span className="animate-spin">⟳</span> Approving...
                </>
              ) : (
                '✓ Approve'
              )}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onReject(task)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition disabled:opacity-50"
            >
              ✕ Reject
            </button>
            <button
              onClick={() => {
                const updatedTask = {
                  ...task,
                  title: editedTitle,
                  featured_image_url: featuredImageUrl,
                  result: {
                    ...task.result,
                    content: editedContent,
                    seo: editedSEO,
                  },
                  publish_destination: publishDestination,
                };
                onApprove(updatedTask);
              }}
              disabled={isLoading || !publishDestination}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⟳</span> Publishing...
                </>
              ) : (
                '✓ Approve & Publish'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPreviewPanel;
