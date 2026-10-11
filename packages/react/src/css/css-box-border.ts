/**
 * `true` (solid) or `'dashed'` draws the hairline all round; `'bottom'`
 * draws it under the box only, for a full-width bar such as a header or a
 * section's sub-navigation.
 */
export type BoxBorderValue = boolean | 'dashed' | 'bottom';

const borderStyles = ['solid', 'dashed'] as const;

type BorderStyle = (typeof borderStyles)[number];

function borderClass(style: BorderStyle): string {
  return style === 'solid' ? 'sw-border' : `sw-border-${style}`;
}

/** The generated class for a Box `border` prop, or none for `false`. */
export function boxBorderClass(
  border: BoxBorderValue | undefined,
): string | undefined {
  if (!border) return undefined;
  if (border === 'bottom') return bottomBorderClass;
  return borderClass(border === 'dashed' ? 'dashed' : 'solid');
}

const bottomBorderClass = 'sw-border-bottom';

/*
 * A Box `border` is a token hairline. These rules are emitted after every
 * component rule so that, at equal specificity, the prop still wins over a
 * Box-based component's own frame. A consumer `style` wins over both. In
 * forced colors the system border color replaces the token and the style stays.
 */
export function cssBoxBorderClasses(): string {
  return [
    ...borderStyles.map(
      (style) =>
        `.${borderClass(style)} { border: 1px ${style} var(--sw-color-border); }`,
    ),
    `.${bottomBorderClass} { border-width: 0 0 1px; border-style: solid; border-color: var(--sw-color-border); }`,
  ].join('\n');
}

export function boxBorderClassCatalog(): string[] {
  return [...borderStyles.map(borderClass), bottomBorderClass];
}
