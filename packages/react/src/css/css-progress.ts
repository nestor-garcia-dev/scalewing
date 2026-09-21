import { typographyVariants } from '@scalewing/tokens';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

export function cssProgressClasses(): string {
  return `.sw-progress {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
  max-width: 100%;
  min-width: 0;
  width: 100%;
}

.sw-progress-accent { --sw-progress-color: var(--sw-color-accent); }
.sw-progress-success { --sw-progress-color: var(--sw-color-success); }
.sw-progress-danger { --sw-progress-color: var(--sw-color-danger); }

.sw-progress-heading {
  align-items: baseline;
  display: flex;
  gap: var(--sw-space-2);
  justify-content: space-between;
  min-width: 0;
}

.sw-progress-label {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
  min-width: 0;
}

.sw-progress-count {
  color: var(--sw-color-muted);
  flex: none;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-variant-numeric: tabular-nums;
  line-height: ${caption.lineHeight}px;
}

.sw-progress-bar {
  appearance: none;
  background: var(--sw-color-border);
  border: 0;
  border-radius: var(--sw-radius-pill);
  display: block;
  height: var(--sw-space-2);
  overflow: hidden;
  width: 100%;
}

.sw-progress-bar::-webkit-progress-bar { background: var(--sw-color-border); }
.sw-progress-bar::-webkit-progress-value { background: var(--sw-progress-color); }
.sw-progress-bar::-moz-progress-bar { background: var(--sw-progress-color); }

@media (forced-colors: active) {
  .sw-progress-bar { background: CanvasText; forced-color-adjust: auto; }
  .sw-progress-bar::-webkit-progress-bar { background: Canvas; }
  .sw-progress-bar::-webkit-progress-value { background: Highlight; }
  .sw-progress-bar::-moz-progress-bar { background: Highlight; }
}`;
}

export function progressClassCatalog(): string[] {
  return [
    'sw-progress',
    'sw-progress-accent',
    'sw-progress-success',
    'sw-progress-danger',
    'sw-progress-heading',
    'sw-progress-label',
    'sw-progress-count',
    'sw-progress-bar',
  ];
}
