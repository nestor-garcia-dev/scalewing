function markerRules(): string {
  return `/* A token chevron replaces the user-agent triangle: it points to the inline end when closed and down when open. */
.sw-accordion-summary::-webkit-details-marker { display: none; }

.sw-accordion-marker {
  border-bottom: 2px solid var(--sw-color-muted);
  border-right: 2px solid var(--sw-color-muted);
  box-sizing: border-box;
  flex: none;
  height: var(--sw-space-2);
  margin-inline-end: var(--sw-space-1);
  transform: rotate(-45deg);
  transition: transform var(--sw-motion-default) var(--sw-motion-easing);
  width: var(--sw-space-2);
}

.sw-accordion-marker:dir(rtl) { transform: rotate(135deg); }

.sw-accordion[open] > .sw-accordion-summary .sw-accordion-marker {
  transform: rotate(45deg);
}

@media (prefers-reduced-motion: reduce) {
  .sw-accordion-marker { transition: none; }
}

@media (forced-colors: active) {
  .sw-accordion-marker { border-color: CanvasText; }
}`;
}

export function cssAccordionClasses(): string {
  return `.sw-accordion {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-lg);
  box-shadow: inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  color: var(--sw-color-text);
}

/* A nested disclosure sits inside a larger surface, so its corners are smaller. */
.sw-accordion-sm { border-radius: var(--sw-radius-md); }

.sw-accordion-summary {
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  gap: var(--sw-space-3);
  list-style: none;
  min-height: var(--sw-control-md-min-height);
}

.sw-accordion-heading {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.sw-accordion-summary:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

${markerRules()}`;
}

export function accordionClassCatalog(): string[] {
  return [
    'sw-accordion',
    'sw-accordion-sm',
    'sw-accordion-summary',
    'sw-accordion-heading',
    'sw-accordion-marker',
  ];
}
