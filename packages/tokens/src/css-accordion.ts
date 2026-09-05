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

.sw-accordion-summary {
  cursor: pointer;
  display: list-item;
  min-height: var(--sw-control-md-min-height);
}

.sw-accordion-summary::-webkit-details-marker {
  color: var(--sw-color-muted);
}

.sw-accordion-summary::marker {
  color: var(--sw-color-muted);
}

.sw-accordion-summary:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}`;
}

export function accordionClassCatalog(): string[] {
  return ['sw-accordion', 'sw-accordion-summary'];
}
