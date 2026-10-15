import { typographyVariants } from '@scalewing/tokens';

const caption = typographyVariants.caption;

/*
 * The dialog's frame beyond its title: a consumer icon before the title, a
 * muted description under it, and a footer pinned to the bottom edge.
 *
 * With an icon or a description the header row centers its parts (the
 * icon, the title over the description, the close button). The footer is
 * sticky to the bottom of the dialog's own scrollport, bleeds to its
 * edges under a hairline, and sits on the solid surface so content
 * scrolling under it never shows through: the summary figure first, the
 * actions at the end, wrapping under one another on a narrow sheet. In a
 * bottom sheet its surface reaches the sheet's bottom edge and its own
 * padding clears the home indicator (see the sheet rules in css-dialog.ts).
 */
export function cssDialogFrameClasses(): string {
  return `.sw-dialog-header-framed {
  align-items: center;
  gap: var(--sw-space-3);
}

.sw-dialog-icon {
  display: inline-flex;
  flex: none;
}

.sw-dialog-description { margin: 0; }

.sw-dialog-footer {
  align-items: center;
  background: var(--sw-color-surface);
  border-top: 1px solid var(--sw-color-border);
  /* Sticky insets count from the scrollport's padding edge: step past the
     dialog's own padding to sit on its bottom edge. */
  bottom: calc(-1 * var(--sw-space-5));
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2) var(--sw-space-4);
  margin: 0 calc(-1 * var(--sw-space-5)) calc(-1 * var(--sw-space-5));
  padding: var(--sw-space-3) var(--sw-space-5);
  position: sticky;
}

.sw-dialog-footer-status {
  align-items: center;
  column-gap: var(--sw-space-2);
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  min-width: 0;
}

/* The status line: muted caption words beside the actions. Its children
   sit on one row and wrap as one phrase. */
.sw-dialog-footer-note {
  color: var(--sw-color-muted);
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
  min-width: 0;
  overflow-wrap: anywhere;
}

/* With no figure and no status line the live region stays in the
   dialog, so a first figure is still announced, but it takes no room in
   the footer. */
.sw-dialog-footer-status:empty {
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  width: 1px;
}

.sw-dialog-footer-actions {
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  justify-content: flex-end;
  margin-inline-start: auto;
}

@media (forced-colors: active) {
  .sw-dialog-footer { border-top-color: CanvasText; }
}`;
}

export function dialogFrameClassCatalog(): string[] {
  return [
    'sw-dialog-header-framed',
    'sw-dialog-icon',
    'sw-dialog-titles',
    'sw-dialog-description',
    'sw-dialog-footer',
    'sw-dialog-footer-status',
    'sw-dialog-footer-note',
    'sw-dialog-footer-actions',
  ];
}
