/**
 * useCopyToClipboard Hook
 *
 * Manages clipboard copy functionality with visual feedback.
 * Extracted to provide:
 * - Copy to clipboard with browser API
 * - Visual feedback state (success/error)
 * - Auto-dismiss after delay
 * - Accessibility messaging
 *
 * Previously duplicated across Result and Command messages (~35 lines each)
 */

import { useState, useCallback } from 'react';

/**
 * Hook for copying text to clipboard with feedback
 *
 * @param {number} feedbackDuration - Duration to show feedback in ms (default: 2000)
 * @returns {object} Contains:
 *   - copied: whether copy was successful
 *   - copying: whether copy is in progress
 *   - copyToClipboard: async function to copy text
 *   - error: error message if copy failed
 *   - reset: function to reset state
 *
 * @example
 * const { copied, copyToClipboard, error } = useCopyToClipboard();
 *
 * const handleCopy = async () => {
 *   await copyToClipboard("Text to copy");
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleCopy}>Copy</button>
 *     {copied && <span>✓ Copied!</span>}
 *     {error && <span>✗ {error}</span>}
 *   </>
 * );
 */
export const useCopyToClipboard = (feedbackDuration = 2000) => {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState(null);

  const copyToClipboard = useCallback(
    async (text) => {
      setCopying(true);
      setError(null);

      try {
        // Check if Clipboard API available (modern browsers)
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } else {
          // Fallback for older browsers or non-HTTPS
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);

          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);

          setCopied(true);
        }

        // Auto-dismiss feedback
        setTimeout(() => {
          setCopied(false);
        }, feedbackDuration);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to copy to clipboard';
        setError(errorMessage);

        // Auto-dismiss error
        setTimeout(() => {
          setError(null);
        }, feedbackDuration);
      } finally {
        setCopying(false);
      }
    },
    [feedbackDuration]
  );

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
    setCopying(false);
  }, []);

  return {
    copied,
    copying,
    error,
    copyToClipboard,
    reset,
  };
};

export default useCopyToClipboard;
