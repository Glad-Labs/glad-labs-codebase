/**
 * BlogPostCreator Component
 * AI-powered blog post creation with Strapi publishing integration
 * Integrates with Cofounder Agent API
 * Model selection and tracking
 */

import React, { useState, useEffect } from 'react';
import {
  createBlogPost,
  pollTaskStatus,
  publishBlogDraft,
} from '../services/cofounderAgentClient';
import { modelService } from '../services/modelService';
import './BlogPostCreator.css';

function BlogPostCreator() {
  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    style: 'technical',
    tone: 'professional',
    targetLength: 1500,
    tags: '',
    categories: '',
    publishMode: 'draft',
    targetEnvironment: 'production',
    selectedModel: 'auto', // 'auto' for best available, or specific model name
  });

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Load available models on mount
  useEffect(() => {
    const loadModels = async () => {
      setLoadingModels(true);
      try {
        const models = await modelService.getAvailableModels();
        setAvailableModels(models);
      } catch (err) {
        console.error('Failed to load models:', err);
        // Use default models on error
        setAvailableModels(modelService.getDefaultModels());
      } finally {
        setLoadingModels(false);
      }
    };

    loadModels();
  }, []);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle model selection change
  const handleModelChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      selectedModel: value,
    }));
  };

  // Create blog post
  const handleGenerateBlogPost = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.topic.trim()) {
      setError('Please enter a blog post topic');
      return;
    }

    setIsGenerating(true);
    setProgress({ stage: 'queued', percentage: 0 });

    try {
      // Start generation
      const response = await createBlogPost({
        topic: formData.topic,
        style: formData.style,
        tone: formData.tone,
        targetLength: parseInt(formData.targetLength),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        categories: formData.categories
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        publishMode: formData.publishMode,
        targetEnvironment: formData.targetEnvironment,
      });

      const taskId = response.task_id;

      // Poll for completion
      const result = await pollTaskStatus(taskId, (task) => {
        setProgress(task.progress);
      });

      if (result.status === 'completed') {
        setGeneratedPost(result.result);
        setSuccessMessage(
          formData.publishMode === 'publish'
            ? 'Blog post created and published successfully! 🎉'
            : 'Blog post created successfully! Review and publish it whenever ready. 📝'
        );
        // Reset form
        setFormData({
          topic: '',
          style: 'technical',
          tone: 'professional',
          targetLength: 1500,
          tags: '',
          categories: '',
          publishMode: 'draft',
          targetEnvironment: 'production',
        });
      } else if (result.status === 'failed') {
        setError(
          `Generation failed: ${result.error?.message || 'Unknown error'}`
        );
      }
    } catch (err) {
      console.error('Error generating blog post:', err);
      setError(err.message || 'Failed to generate blog post');
    } finally {
      setIsGenerating(false);
    }
  };

  // Publish draft
  const handlePublishDraft = async () => {
    if (!generatedPost?.strapi_post_id) {
      setError('Cannot publish this post');
      return;
    }

    try {
      setIsGenerating(true);
      await publishBlogDraft(
        generatedPost.strapi_post_id,
        formData.targetEnvironment
      );
      setSuccessMessage('Blog post published successfully! 🚀');
      setGeneratedPost(null);
    } catch (err) {
      setError(`Failed to publish: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="blog-creator-container">
      <div className="blog-creator-card">
        {/* Header */}
        <div className="blog-creator-header">
          <h2>✨ AI Blog Post Creator</h2>
          <p>
            Generate high-quality blog posts with AI and publish directly to
            Strapi
          </p>
        </div>

        {/* Form Section */}
        {!generatedPost && (
          <form onSubmit={handleGenerateBlogPost} className="blog-creator-form">
            {/* Topic Input - Main Field */}
            <div className="form-group">
              <label htmlFor="topic">Blog Post Topic *</label>
              <input
                id="topic"
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., How to optimize AI costs in production"
                className="form-input"
                disabled={isGenerating}
              />
              <small>Enter the main topic or title for your blog post</small>
            </div>

            {/* Advanced Options Toggle */}
            <div className="advanced-toggle">
              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                disabled={isGenerating}
              >
                {showAdvanced ? '▼' : '▶'} Advanced Options
              </button>
            </div>

            {/* Advanced Options - Collapsible */}
            {showAdvanced && (
              <div className="advanced-options">
                {/* Content Style */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="style">Content Style</label>
                    <select
                      id="style"
                      name="style"
                      value={formData.style}
                      onChange={handleInputChange}
                      className="form-select"
                      disabled={isGenerating}
                    >
                      <option value="technical">Technical</option>
                      <option value="narrative">Narrative</option>
                      <option value="listicle">Listicle</option>
                      <option value="educational">Educational</option>
                      <option value="thought-leadership">
                        Thought Leadership
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tone">Tone</label>
                    <select
                      id="tone"
                      name="tone"
                      value={formData.tone}
                      onChange={handleInputChange}
                      className="form-select"
                      disabled={isGenerating}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="academic">Academic</option>
                      <option value="inspirational">Inspirational</option>
                    </select>
                  </div>

                  {/* Model Selection */}
                  <div className="form-group">
                    <label htmlFor="selectedModel">
                      AI Model{' '}
                      {loadingModels && (
                        <span className="loading-spinner">⏳</span>
                      )}
                    </label>
                    <select
                      id="selectedModel"
                      name="selectedModel"
                      value={formData.selectedModel}
                      onChange={handleModelChange}
                      className="form-select model-select"
                      disabled={isGenerating || loadingModels}
                    >
                      <option value="auto">🤖 Auto (Best Available)</option>
                      <optgroup label="Local Models (Free)">
                        {availableModels
                          .filter((m) => m.provider === 'ollama')
                          .map((m) => (
                            <option key={m.name} value={m.name}>
                              {m.icon} {m.displayName} ({m.estimatedVramGb}GB)
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Cloud Models">
                        {availableModels
                          .filter((m) => m.provider !== 'ollama')
                          .map((m) => (
                            <option key={m.name} value={m.name}>
                              {m.icon} {m.displayName}{' '}
                              {m.isFree ? '(Free)' : '(Paid)'}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                    {availableModels.length > 0 && (
                      <small className="model-info">
                        {formData.selectedModel === 'auto'
                          ? '✓ Will use best available model'
                          : availableModels.find(
                              (m) => m.name === formData.selectedModel
                            )?.description}
                      </small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="targetLength">Target Length</label>
                    <input
                      id="targetLength"
                      type="number"
                      name="targetLength"
                      value={formData.targetLength}
                      onChange={handleInputChange}
                      min="200"
                      max="5000"
                      step="100"
                      className="form-input"
                      disabled={isGenerating}
                    />
                    <small>Words (200-5000)</small>
                  </div>
                </div>

                {/* Tags & Categories */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tags">Tags</label>
                    <input
                      id="tags"
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., AI, cost-optimization, production"
                      className="form-input"
                      disabled={isGenerating}
                    />
                    <small>Comma-separated tags</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="categories">Categories</label>
                    <input
                      id="categories"
                      type="text"
                      name="categories"
                      value={formData.categories}
                      onChange={handleInputChange}
                      placeholder="e.g., Technical Guides, Tutorials"
                      className="form-input"
                      disabled={isGenerating}
                    />
                    <small>Comma-separated categories</small>
                  </div>
                </div>

                {/* Publish Options */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="publishMode">Publishing Mode</label>
                    <select
                      id="publishMode"
                      name="publishMode"
                      value={formData.publishMode}
                      onChange={handleInputChange}
                      className="form-select"
                      disabled={isGenerating}
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="publish">Publish Immediately</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="targetEnvironment">
                      Target Environment
                    </label>
                    <select
                      id="targetEnvironment"
                      name="targetEnvironment"
                      value={formData.targetEnvironment}
                      onChange={handleInputChange}
                      className="form-select"
                      disabled={isGenerating}
                    >
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}

            {/* Progress */}
            {isGenerating && progress && (
              <div className="progress-section">
                <div className="progress-info">
                  <span className="progress-stage">
                    {progress.message || 'Processing...'}
                  </span>
                  <span className="progress-percentage">
                    {progress.percentage}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner"></span>
                    {progress?.message || 'Generating...'}
                  </>
                ) : (
                  '✨ Generate Blog Post'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Generated Post Preview */}
        {generatedPost && (
          <div className="generated-post-section">
            <div className="post-preview">
              <h3>📄 Generated Blog Post</h3>

              <div className="post-meta">
                <p>
                  <strong>Title:</strong> {generatedPost.title}
                </p>
                <p>
                  <strong>Word Count:</strong> {generatedPost.word_count} words
                </p>
                <p>
                  <strong>Summary:</strong> {generatedPost.summary}
                </p>
              </div>

              <div className="post-content-preview">
                <h4>Preview:</h4>
                <div className="post-content-scroll">
                  {generatedPost.content}
                </div>
              </div>

              {generatedPost.featured_image_url && (
                <div className="post-image">
                  <img src={generatedPost.featured_image_url} alt="Featured" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="post-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setGeneratedPost(null);
                  setSuccessMessage(null);
                }}
                disabled={isGenerating}
              >
                ← Back to Form
              </button>

              {formData.publishMode === 'draft' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePublishDraft}
                  disabled={isGenerating}
                >
                  {isGenerating ? '🔄 Publishing...' : '🚀 Publish Now'}
                </button>
              )}

              {formData.publishMode === 'publish' && (
                <div className="publish-status">
                  <span className="badge badge-success">✓ Published</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPostCreator;
