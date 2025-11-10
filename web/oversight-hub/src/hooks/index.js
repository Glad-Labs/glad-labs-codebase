/**
 * Hooks Index
 *
 * Central export for all custom React hooks used in Orchestrator system.
 * Enables easy importing: import { useMessageExpand, useProgressAnimation } from './Hooks';
 */

export { useMessageExpand } from './useMessageExpand';
export { useProgressAnimation } from './useProgressAnimation';
export { useCopyToClipboard } from './useCopyToClipboard';
export { useFeedbackDialog } from './useFeedbackDialog';

/**
 * Usage Examples:
 *
 * // Expand/Collapse
 * import { useMessageExpand } from './Hooks';
 * const { expanded, handleToggle } = useMessageExpand(false, onExpand, onCollapse);
 *
 * // Progress Animation
 * import { useProgressAnimation } from './Hooks';
 * const { progress, estimatedTimeRemaining } = useProgressAnimation(currentPhase, 6, true);
 *
 * // Copy to Clipboard
 * import { useCopyToClipboard } from './Hooks';
 * const { copied, copyToClipboard, error } = useCopyToClipboard();
 *
 * // Feedback Dialog
 * import { useFeedbackDialog } from './Hooks';
 * const { isOpen, open, close, approve, reject } = useFeedbackDialog(onApprove, onReject);
 */
