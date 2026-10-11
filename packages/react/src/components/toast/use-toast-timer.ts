import { useEffect, useRef } from 'react';

type ToastTimerOptions = {
  /** The timer runs only while the toast is open and does not travel. */
  running: boolean;
  /** While true, the time left is held, as on hover or focus. */
  paused: boolean;
  /** The whole time the toast stays, in ms. */
  duration: number;
  onExpire: () => void;
};

/**
 * Closes the toast once `duration` ms have run, counting only the time it is
 * not paused. Opening it again (or a new duration) starts the count over.
 */
export function useToastTimer({
  duration,
  onExpire,
  paused,
  running,
}: ToastTimerOptions): void {
  const leftRef = useRef(duration);
  const expireRef = useRef(onExpire);

  useEffect(() => {
    expireRef.current = onExpire;
  }, [onExpire]);

  // A fresh count each time the toast opens or its duration changes.
  useEffect(() => {
    leftRef.current = duration;
  }, [duration, running]);

  useEffect(() => {
    if (!running || paused) return;
    const started = Date.now();
    let fired = false;
    const timer = window.setTimeout(() => {
      fired = true;
      leftRef.current = duration;
      expireRef.current();
    }, leftRef.current);
    return () => {
      window.clearTimeout(timer);
      // After it fired the count is whole again (a consumer that keeps the
      // toast open gets the full time on its next run, not none).
      if (!fired)
        leftRef.current = Math.max(0, leftRef.current - (Date.now() - started));
    };
  }, [duration, paused, running]);
}
