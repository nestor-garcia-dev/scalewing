import {
  pressedRingGap,
  pressedRingWidth,
  webButtonVariants,
} from './css-button.js';

/*
 * A link drawn as a Button (`ButtonLink`) wears the Button's own classes.
 * The canvas paints every link in the accent, with no underline, and in the
 * text colour on hover, from `[data-theme] a`; these rules restore each
 * variant's words over that, hover included, at one class more. A link
 * that is the current page (`aria-current="page"`, such as a site's
 * Contact us on Contact) takes the pressed button's accent ring past a gap
 * in the page background, so the mark keeps the accent's contrast whatever
 * the fill; forced colours drop box shadows, so there the same ring is a
 * Highlight border on an out-of-flow ::after, as a pressed Button's is.
 */
const variantWords: Record<(typeof webButtonVariants)[number], string> = {
  primary: 'var(--sw-color-onAccent)',
  secondary: 'var(--sw-color-onSecondary)',
  tertiary: 'var(--sw-color-onTertiary)',
  ghost: 'var(--sw-color-accent)',
  danger: 'var(--sw-color-onDanger)',
  neutral: 'var(--sw-color-text)',
};

export const buttonLinkClass = 'sw-button-link';

export function cssButtonLinkClasses(): string {
  const words = webButtonVariants
    .map(
      (variant) =>
        `[data-theme] a.${buttonLinkClass}.sw-button-${variant},\n[data-theme] a.${buttonLinkClass}.sw-button-${variant}:hover { color: ${variantWords[variant]}; }`,
    )
    .join('\n');
  return `[data-theme] a.${buttonLinkClass} {
  text-decoration: none;
}

${words}

[data-theme] a.${buttonLinkClass}[aria-current='page'] {
  box-shadow: 0 0 0 ${pressedRingGap}px var(--sw-color-background), 0 0 0 ${pressedRingWidth}px var(--sw-color-accent);
}

[data-theme] a.${buttonLinkClass}[aria-current='page']:focus-visible {
  outline-offset: calc(var(--sw-focus-ring-offset) + ${pressedRingWidth}px);
}

@media (forced-colors: active) {
  [data-theme] a.${buttonLinkClass} { color: LinkText; }
  [data-theme] a.${buttonLinkClass}[aria-current='page'] { border-color: Highlight; position: relative; }
  [data-theme] a.${buttonLinkClass}[aria-current='page']::after { border: ${pressedRingWidth - pressedRingGap}px solid Highlight; border-radius: inherit; content: ''; inset: calc(-1px - ${pressedRingWidth}px); pointer-events: none; position: absolute; }
}`;
}

export function buttonLinkClassCatalog(): string[] {
  return [buttonLinkClass];
}
