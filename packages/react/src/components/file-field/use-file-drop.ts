import { type DragEvent, useRef, useState } from 'react';

type DropHandlers = Partial<
  Record<
    'onDragEnter' | 'onDragOver' | 'onDragLeave' | 'onDrop',
    (event: DragEvent) => void
  >
>;

/** Whether a drag carries files, not text or a link dragged from the page. */
function carriesFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files');
}

/**
 * A disabled field still keeps the browser from opening a file dropped on
 * it, and shows no copy cursor: the drop does nothing.
 */
function refuse(event: DragEvent) {
  if (!carriesFiles(event)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'none';
}

/**
 * A drop target for one file: whether files are dragged over it, and the
 * handlers that keep the browser from opening a dropped file and hand the
 * first one to `onFile`. A counter follows the drag through the target's
 * children, whose enter and leave events would otherwise flicker it. While
 * `disabled`, a dropped file is refused and a drag in progress ends.
 */
export function useFileDrop({
  disabled,
  onFile,
}: {
  disabled: boolean;
  onFile: (file: File) => void;
}) {
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);
  // A drag that began before the field was disabled ends here too, so its
  // tint is gone when the field is enabled again.
  const stop = (event: DragEvent) => {
    refuse(event);
    depth.current = 0;
    setDragging(false);
  };
  if (disabled)
    return {
      dragging: false,
      handlers: {
        onDragOver: refuse,
        // Leaving or dropping ends a drag that began while enabled.
        onDragLeave: stop,
        onDrop: stop,
      } satisfies DropHandlers,
    };
  return {
    dragging,
    handlers: {
      onDragEnter: (event: DragEvent) => {
        if (!carriesFiles(event)) return;
        event.preventDefault();
        depth.current += 1;
        setDragging(true);
      },
      onDragOver: (event: DragEvent) => {
        if (!carriesFiles(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
      },
      onDragLeave: (event: DragEvent) => {
        if (!carriesFiles(event)) return;
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setDragging(false);
      },
      onDrop: (event: DragEvent) => {
        if (!carriesFiles(event)) return;
        event.preventDefault();
        depth.current = 0;
        setDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) onFile(file);
      },
    },
  };
}
