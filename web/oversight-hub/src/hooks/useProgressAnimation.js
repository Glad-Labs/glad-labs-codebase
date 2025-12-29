/**
 * useProgressAnimation Hook
 *
 * Manages animated progress bar state and calculations.
 * Extracted to provide:
 * - Smooth progress value transitions
 * - Phase timing calculations
 * - Estimated time remaining
 * - Completion percentage
 *
 * Previously duplicated in Status message component (~50 lines)
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing animated progress bar
 *
 * @param {number} currentPhase - Current phase (1-6)
 * @param {number} totalPhases - Total phases (usually 6)
 * @param {boolean} isAnimating - Whether animation is active
 * @param {number} animationDuration - Duration per phase in seconds (default: 3)
 *
 * @returns {object} Contains:
 *   - progress: current progress percentage (0-100)
 *   - phaseProgress: progress within current phase (0-100)
 *   - estimatedTimeRemaining: seconds remaining
 *   - isComplete: whether all phases done
 *   - phase: formatted phase display string
 *
 * @example
 * const { progress, estimatedTimeRemaining } = useProgressAnimation(3, 6, true);
 * return <LinearProgress variant="determinate" value={progress} />;
 */
export const useProgressAnimation = (
  currentPhase = 1,
  totalPhases = 6,
  isAnimating = true,
  animationDuration = 3
) => {
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [startTime] = useState(Date.now());

  // Calculate overall progress
  const progress = useCallback(() => {
    const phasePercentage = 100 / totalPhases;
    const previousPhasesProgress = (currentPhase - 1) * phasePercentage;
    const currentPhaseProgress = phaseProgress * (phasePercentage / 100);
    return Math.min(previousPhasesProgress + currentPhaseProgress, 100);
  }, [currentPhase, totalPhases, phaseProgress]);

  // Animate phase progress
  useEffect(() => {
    if (!isAnimating) {return;}

    const animationInterval = setInterval(() => {
      setPhaseProgress((prev) => {
        const nextProgress = prev + 100 / (animationDuration * 10);
        return Math.min(nextProgress, 100);
      });
    }, 100);

    return () => clearInterval(animationInterval);
  }, [isAnimating, animationDuration]);

  // Reset when phase changes
  useEffect(() => {
    setPhaseProgress(0);
  }, [currentPhase]);

  // Calculate estimated time remaining
  const estimatedTimeRemaining = useCallback(() => {
    const remainingPhases = totalPhases - currentPhase;
    const timePerPhase = animationDuration + 1; // +1 for transition
    const totalSecondsRemaining = remainingPhases * timePerPhase;
    return Math.ceil(totalSecondsRemaining);
  }, [currentPhase, totalPhases, animationDuration]);

  // Format phase display
  const phaseDisplay = `Phase ${currentPhase}/${totalPhases}`;

  // Check if complete
  const isComplete = currentPhase >= totalPhases && phaseProgress >= 100;

  return {
    progress: progress(),
    phaseProgress,
    estimatedTimeRemaining: estimatedTimeRemaining(),
    isComplete,
    phase: phaseDisplay,
    elapsedTime: Math.floor((Date.now() - startTime) / 1000),
  };
};

export default useProgressAnimation;
