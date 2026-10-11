import { typographyVariants } from '@scalewing/tokens';

import {
  type TintColor,
  toneInkTextShare,
  toneTintFill,
  toneTintInk,
  toneTintShare,
} from './tone-tint.js';

export const noticeTones = ['info', 'success', 'warning', 'danger'] as const;

export const noticeVariants = ['default', 'band'] as const;

/** `default` is a rounded note in the flow; `band` a full-width strip of page chrome. */
export type NoticeVariant = (typeof noticeVariants)[number];

/** The notice's meaning: information, a good outcome, a caution, a refusal. */
export type NoticeTone = (typeof noticeTones)[number];

/** How much of a tone's color the notice's fill mixes into the surface. */
export const noticeTintShare = toneTintShare;

/** How far the notice's words move from the tone's color toward the text color. */
export const noticeInkTextShare = toneInkTextShare;

/** The semantic color a tone is drawn from. */
export function noticeToneColor(tone: NoticeTone): TintColor {
  return tone === 'info' ? 'accent' : tone;
}

function toneRules(): string {
  return noticeTones
    .map(
      (tone) =>
        `.sw-notice-${tone} { --sw-notice-fill: ${toneTintFill(noticeToneColor(tone))}; --sw-notice-ink: ${toneTintInk(noticeToneColor(tone))}; }`,
    )
    .join('\n');
}

const label = typographyVariants.label;
const body = typographyVariants.body;
const caption = typographyVariants.caption;

/*
 * A tinted block in the page: the tone's fill, its words in the tone's ink,
 * label-size type. An optional glyph leads; the title (a bold lead) and a
 * text message share a row while they fit and wrap under one another when
 * they do not; a message of elements (a field, a checkbox) is stacked under
 * the title. An action ends the row (a small Button
 * overhangs the padding rather than growing it) and drops under the text on
 * a narrow column. Controls inside keep their own colors. Forced
 * colors draw a border instead of the fill.
 */
export function cssNoticeClasses(): string {
  return `${toneRules()}

.sw-notice {
  align-items: flex-start;
  background: var(--sw-notice-fill);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-notice-ink);
  column-gap: var(--sw-space-2);
  display: flex;
  flex-wrap: wrap;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-width: 0;
  padding: var(--sw-space-2) var(--sw-space-3);
  row-gap: var(--sw-space-2);
  /* Muted words of a control inside (a field's or a checkbox's
     description) take the ink, which keeps 4.5:1 on the fill. */
  --sw-color-muted: var(--sw-notice-ink);
}

.sw-notice-icon {
  display: inline-flex;
  flex: none;
  min-height: ${label.lineHeight}px;
  align-items: center;
}

.sw-notice-content {
  align-items: baseline;
  column-gap: var(--sw-space-2);
  display: flex;
  flex: 1 1 16rem;
  flex-wrap: wrap;
  min-width: 0;
  row-gap: var(--sw-space-1);
}

.sw-notice-stacked {
  align-items: stretch;
  flex-direction: column;
  row-gap: var(--sw-space-2);
}

.sw-notice-title {
  font-weight: ${label.fontWeight};
  min-width: 0;
}

.sw-notice-body {
  flex: 1 1 auto;
  font-weight: ${body.fontWeight};
  min-width: 0;
}

.sw-notice-action {
  align-items: center;
  align-self: flex-start;
  display: inline-flex;
  flex: none;
  min-height: ${label.lineHeight}px;
}

/* A small Button keeps the note one text line tall: it overhangs the
   padding evenly instead of growing the row. */
.sw-notice-action > .sw-button {
  margin-block: calc((${label.lineHeight}px - var(--sw-control-sm-min-height)) / 2);
}

/* A band across the page's full width, such as an environment strip
   above the app header: square, the xs control height, caption type,
   its words centered on one line that wraps on a phone. A glyph or an
   action stays on the words' row (no wrap): the words wrap instead. */
.sw-notice-band {
  align-items: center;
  border-radius: 0;
  flex-wrap: nowrap;
  font-size: ${caption.fontSize}px;
  justify-content: center;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-height: var(--sw-control-xs-min-height);
  padding: var(--sw-space-1) var(--sw-space-4);
  text-align: center;
  width: 100%;
}

.sw-notice-band .sw-notice-content {
  flex: 0 1 auto;
  justify-content: center;
}

.sw-notice-band .sw-notice-icon,
.sw-notice-band .sw-notice-action { min-height: ${caption.lineHeight}px; }

.sw-notice-band .sw-notice-action { align-self: center; }

.sw-notice-band .sw-notice-action > .sw-button {
  margin-block: calc((${caption.lineHeight}px - var(--sw-control-sm-min-height)) / 2);
}

@media (forced-colors: active) {
  .sw-notice { border: 1px solid CanvasText; }
  .sw-notice-band { border-width: 0 0 1px; }
}`;
}

export function noticeClassCatalog(): string[] {
  return [
    'sw-notice',
    ...noticeTones.map((tone) => `sw-notice-${tone}`),
    'sw-notice-icon',
    'sw-notice-content',
    'sw-notice-stacked',
    'sw-notice-title',
    'sw-notice-body',
    'sw-notice-action',
    'sw-notice-band',
  ];
}
