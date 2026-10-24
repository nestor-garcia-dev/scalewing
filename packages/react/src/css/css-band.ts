import { breakpointQuery } from './breakpoints.js';

/** A band's fill: the page's surface, the quiet subtle fill, or the dark inverse band. */
export const bandTones = ['surface', 'subtle', 'inverse'] as const;

export type BandTone = (typeof bandTones)[number];

/** How wide a band's content column runs: the page container or the reading width. */
export const bandWidths = ['container', 'reading'] as const;

export type BandWidth = (typeof bandWidths)[number];

export function bandToneClass(tone: BandTone): string {
  return `sw-band-${tone}`;
}

export function bandWidthClass(width: BandWidth): string {
  return `sw-band-inner-${width}`;
}

/*
 * The inverse band re-scopes the theme's colours for everything inside it:
 * words, muted words, hairlines, the quiet subtle fill, links and the
 * accent (a primary button, the focus ring) read on the dark fill, so
 * Text, links and Buttons need no band-aware variant. Every plain link,
 * a quiet one included, takes the band's words with a half-strength
 * underline, since its colour is the words' own (WCAG 1.4.1). The muted
 * words, hairline and subtle fill are mixes of the two band colours, so a
 * brand overlay of `inverse` moves them too; the muted mix keeps 7:1 on
 * the default bands and on a navy one.
 */
function inverseScope(): string {
  return `.sw-band-inverse {
  --sw-color-background: var(--sw-color-inverse);
  --sw-color-surface: var(--sw-color-inverse);
  --sw-color-text: var(--sw-color-onInverse);
  --sw-color-muted: color-mix(in srgb, var(--sw-color-onInverse) 78%, var(--sw-color-inverse));
  --sw-color-border: color-mix(in srgb, var(--sw-color-onInverse) 18%, var(--sw-color-inverse));
  --sw-color-subtle: color-mix(in srgb, var(--sw-color-onInverse) 10%, var(--sw-color-inverse));
  --sw-color-accent: var(--sw-color-onInverse);
  --sw-color-onAccent: var(--sw-color-inverse);
  background: var(--sw-color-inverse);
  color: var(--sw-color-onInverse);
}

[data-theme] .sw-band-inverse a:not(.sw-button) {
  color: var(--sw-color-onInverse);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, currentColor 50%, transparent);
  text-underline-offset: 0.2em;
}

[data-theme] .sw-band-inverse a:not(.sw-button):hover {
  text-decoration-color: currentColor;
}`;
}

/*
 * The surface band is the cards' fill (white in light, a step above the
 * black page in dark), so it stands apart from a grouped or dark page; the
 * subtle band is the quiet grey.
 *
 * A band is a full-width stretch of the page in one fill with its content
 * in a centred column, the page gutter at its sides (the 16 px phone
 * gutter, 24 px from md).
 */
export function cssBandClasses(): string {
  return `.sw-band {
  box-sizing: border-box;
  width: 100%;
}

.sw-band-surface {
  background: var(--sw-color-surface);
  color: var(--sw-color-text);
}

.sw-band-subtle {
  background: var(--sw-color-subtle);
  color: var(--sw-color-text);
}

${inverseScope()}

.sw-band-inner {
  box-sizing: border-box;
  margin-inline: auto;
  padding-inline: var(--sw-space-4);
  width: 100%;
}

.${bandWidthClass('container')} { max-width: calc(var(--sw-container-max) + 2 * var(--sw-space-5)); }

.${bandWidthClass('reading')} { max-width: calc(var(--sw-reading-max) + 2 * var(--sw-space-5)); }

@media ${breakpointQuery('from', 'md')} {
  .sw-band-inner { padding-inline: var(--sw-space-5); }
}

@media (forced-colors: active) {
  .sw-band-inverse { border-block: 1px solid CanvasText; }
}`;
}

export function bandClassCatalog(): string[] {
  return [
    'sw-band',
    'sw-band-inner',
    ...bandTones.map(bandToneClass),
    ...bandWidths.map(bandWidthClass),
  ];
}
