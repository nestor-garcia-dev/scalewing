import { typographyVariants } from '@scalewing/tokens';

const { body, title, label, caption } = typographyVariants;

/*
 * A page of Markdown in body type: blocks a space-4 apart, a heading a
 * space-6 below what comes before it and a space-2 above what follows.
 * `#` is the title size, `##` body size and `###` label size, all at the
 * title's weight. At zero specificity (`:where`), so a consumer's layout
 * can still space the view itself.
 */
function flowRules(): string {
  return `.sw-markdown {
  color: var(--sw-color-text);
  font-family: var(--sw-font-sans);
  font-size: ${body.fontSize}px;
  letter-spacing: ${body.letterSpacing}px;
  line-height: ${body.lineHeight}px;
  overflow-wrap: anywhere;
}

:where(.sw-markdown) > *,
:where(.sw-markdown-quote) > *,
:where(.sw-markdown-list li) > * { margin-block: 0; }

:where(.sw-markdown, .sw-markdown-quote, .sw-markdown-list li) > * + * {
  margin-block-start: var(--sw-space-4);
}

:where(.sw-markdown) > * + .sw-markdown-heading { margin-block-start: var(--sw-space-6); }
:where(.sw-markdown) > .sw-markdown-heading + * { margin-block-start: var(--sw-space-2); }

.sw-markdown-heading {
  color: var(--sw-color-text);
  font-weight: ${title.fontWeight};
  scroll-margin-block-start: var(--sw-space-6);
}

.sw-markdown-heading-1 {
  font-size: ${title.fontSize}px;
  letter-spacing: ${title.letterSpacing}px;
  line-height: ${title.lineHeight}px;
}

.sw-markdown-heading-2 {
  font-size: ${body.fontSize}px;
  line-height: ${body.lineHeight}px;
}

.sw-markdown-heading-3 {
  font-size: ${label.fontSize}px;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}`;
}

/*
 * Lists hang their markers in the page's margin a space-5 in; a tight
 * list's items are a space-2 apart. A link is the accent, underlined, so
 * it never depends on colour alone, and thickens to the focus ring's
 * width while hovered. In the highlighted box, whose tint neither the
 * accent nor the muted colour clears at 4.5:1 in every palette, links
 * (still underlined) and photo captions are the text colour.
 */
function inlineRules(): string {
  return `.sw-markdown-list {
  padding-inline-start: var(--sw-space-5);
}

.sw-markdown-list > li + li { margin-block-start: var(--sw-space-2); }

[data-theme] .sw-markdown-link {
  color: var(--sw-color-accent);
  text-decoration-line: underline;
}

[data-theme] .sw-markdown-link:hover {
  text-decoration-thickness: var(--sw-focus-ring-width);
}

[data-theme] .sw-markdown-quote :is(.sw-markdown-link, .sw-markdown-caption) {
  color: var(--sw-color-text);
}`;
}

/*
 * A block quote is the highlighted box: the accent's subtle tint with an
 * accent bar at its start, at the small radius. A photo fills the page's
 * width at the medium radius, its caption muted under it.
 */
function boxRules(): string {
  return `.sw-markdown-quote {
  background: var(--sw-color-accentSubtle);
  border-inline-start: var(--sw-space-1) solid var(--sw-color-accent);
  border-radius: var(--sw-radius-sm);
  margin-inline: 0;
  padding: var(--sw-space-3) var(--sw-space-4);
}

.sw-markdown-figure {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
  margin-inline: 0;
}

.sw-markdown-image {
  border-radius: var(--sw-radius-md);
  display: block;
  height: auto;
  width: 100%;
}

.sw-markdown-caption {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

@media (forced-colors: active) {
  .sw-markdown-quote { border: 1px solid CanvasText; border-inline-start-width: var(--sw-space-1); }
}`;
}

export function cssMarkdownClasses(): string {
  return `${flowRules()}

${inlineRules()}

${boxRules()}`;
}

export function markdownClassCatalog(): string[] {
  return [
    'sw-markdown',
    'sw-markdown-paragraph',
    'sw-markdown-heading',
    'sw-markdown-heading-1',
    'sw-markdown-heading-2',
    'sw-markdown-heading-3',
    'sw-markdown-list',
    'sw-markdown-item-text',
    'sw-markdown-link',
    'sw-markdown-quote',
    'sw-markdown-figure',
    'sw-markdown-image',
    'sw-markdown-caption',
  ];
}
