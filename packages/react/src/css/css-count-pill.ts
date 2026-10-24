import { typographyVariants } from '@scalewing/tokens';

import { toneTintFill, toneTintInk } from './tone-tint.js';

const caption = typographyVariants.caption;

/** The counts drawn as the pill: SectionNav's, a Nav word's and AppShell's. */
const pills = [
  'sw-section-nav-count',
  'sw-nav-count',
  'sw-app-shell-count',
] as const;

/** The pills that take a tone modifier: NavCount's and AppShell's item count. */
const tonedPills = ['sw-nav-count', 'sw-app-shell-count'] as const;

/** The tones other than the pill's own danger. */
const pillTones = ['accent', 'warning'] as const;

/** A toned pill's modifier class, such as `sw-nav-count-warning`. */
export function countToneClass(
  pill: (typeof tonedPills)[number],
  tone: (typeof pillTones)[number],
): string {
  return `${pill}-${tone}`;
}

function tonedSelector(tone: (typeof pillTones)[number]): string {
  return tonedPills
    .map((pill) => `[data-theme] .${pill}.${countToneClass(pill, tone)}`)
    .join(',\n');
}

/*
 * A count after a destination's words (a number waiting there, such as
 * tasks to do) is a filled pill: the danger colour with its on-colour
 * figures (4.5:1 in every palette, as a danger Button's label), caption
 * size at weight 700, a space-5 less space-1 (20) high and at least as
 * wide. Forced colours draw its edge. SectionNav's item count, Nav's
 * NavCount and AppShell's item count share it, so an area's count reads
 * the same in each.
 */
export function cssCountPillClasses(): string {
  const selector = pills.map((name) => `[data-theme] .${name}`).join(',\n');
  return `${selector} {
  align-items: center;
  background: var(--sw-color-danger);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  color: var(--sw-color-onDanger);
  display: inline-flex;
  font-size: ${caption.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  justify-content: center;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: 1;
  min-height: calc(var(--sw-space-5) - var(--sw-space-1));
  min-width: calc(var(--sw-space-5) - var(--sw-space-1));
  padding-inline: var(--sw-space-1);
}

/*
 * \`tone="accent"\` (NavCount, an AppShell item's \`countTone\`): a count that
 * is news, not work waiting (what was added since the person last looked),
 * is the accent fill with its on-colour figures (4.5:1 in every palette, as
 * a primary Button's label). \`tone="warning"\`: work that needs the person
 * but is not urgent is amber, the warning tint with the warning ink (a
 * warning Notice's, 4.5:1 on the tint in every palette) inside the warning
 * edge a warning Badge draws. One class more specific than the pill, so
 * each wins in any order.
 */
${tonedSelector('accent')} {
  background: var(--sw-color-accent);
  color: var(--sw-color-onAccent);
}

${tonedSelector('warning')} {
  background: ${toneTintFill('warning')};
  border: 1px solid var(--sw-color-warning);
  color: ${toneTintInk('warning')};
}

/*
 * A Nav link holding a count lays out as SectionNav's link does: the words
 * and the pill centred on one line a space-2 apart (the space text node
 * that keeps the name collapses), so the link is as tall as its siblings
 * and its words stay level with theirs. A Button already does this. At
 * zero specificity, so a link's \`hideBelow\` or \`hideFrom\` still hides it.
 * In forced colours a current link's underline runs under the pill's
 * figure too, as the pill is a flex item of the link.
 */
:where(.sw-nav a:has(> .sw-nav-count)) {
  align-items: center;
  display: inline-flex;
  gap: var(--sw-space-2);
}

@media (forced-colors: active) {
  ${selector.replaceAll('\n', '\n  ')} { border: 1px solid CanvasText; }
}`;
}

export function countPillClassCatalog(): string[] {
  return [
    ...pills,
    ...tonedPills.flatMap((pill) =>
      pillTones.map((tone) => countToneClass(pill, tone)),
    ),
  ];
}
