'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * A stable function that reports an error to the consumer's latest
 * `onError`, so a new callback each render never restarts a page's draw.
 */
export function useErrorReport(
  onError: ((error: unknown) => void) | undefined,
): (error: unknown) => void {
  const latest = useRef(onError);
  useEffect(() => {
    latest.current = onError;
  });
  return useCallback((error: unknown) => latest.current?.(error), []);
}
