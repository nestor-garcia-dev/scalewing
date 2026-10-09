/*
 * The shade an edge draws while content is scrolled out past it: an inset
 * shadow a spacing step wide in the text color at low strength, so it reads
 * on every palette and in dark mode. It is the box's own shadow, painted
 * under the content, so no cell moves. A box scrolled to its middle shades
 * both edges. The rules name the shadows outright rather than through
 * inherited variables, so a scroll region inside another never takes its
 * ancestor's shade.
 */
const shadeColor = 'color-mix(in srgb, var(--sw-color-text) 28%, transparent)';

type Side = 'left' | 'right';

function edgeShade(side: Side): string {
  const offset =
    side === 'left' ? 'var(--sw-space-6)' : 'calc(-1 * var(--sw-space-6))';
  return `inset ${offset} 0 var(--sw-space-5) calc(-1 * var(--sw-space-5)) ${shadeColor}`;
}

/**
 * The shade each inline edge of `selector` draws while `useScrollOverflow`
 * marks it (`sw-scroll-more-start`, `sw-scroll-more-end`). The start edge is
 * the left in a left-to-right box and the right in RTL. A box that scrolls
 * itself (a `Tabs` strip) takes these alone; a scroll region takes them
 * through `scrollRegionRules`.
 */
export function scrollShadeRules(selector: string): string {
  const more = (edge: 'start' | 'end') => `${selector}.sw-scroll-more-${edge}`;
  const both = `${more('start')}.sw-scroll-more-end`;
  return [
    `${more('start')} { box-shadow: ${edgeShade('left')}; }`,
    `${more('end')} { box-shadow: ${edgeShade('right')}; }`,
    `${more('start')}:dir(rtl) { box-shadow: ${edgeShade('right')}; }`,
    `${more('end')}:dir(rtl) { box-shadow: ${edgeShade('left')}; }`,
    // Last: it ties the :dir(rtl) rules on specificity and must win them.
    `${both} { box-shadow: ${edgeShade('left')}, ${edgeShade('right')}; }`,
  ].join('\n');
}

/**
 * A scroll region is a full-width box that scrolls its own content when the
 * content is wider (or taller) than the box, so a wide table never widens the
 * page. It is a keyboard stop, so its focus ring is drawn inside its edge
 * where an ancestor's clipping cannot hide it. While its content is scrolled
 * out past an inline edge, `ScrollRegion` adds `sw-scroll-more-start` or
 * `sw-scroll-more-end`, and that edge draws a shade: the cue that the content
 * goes on, which overlay scrollbars (phones, macOS) do not give. In forced
 * colors the shade is not drawn and the system's scrollbar is the cue. Table
 * and the DenominationGrid strip share it.
 */
export function scrollRegionRules(selector: string): string {
  return `${selector} {
  overflow: auto;
  width: 100%;
}

${selector}:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

${scrollShadeRules(selector)}`;
}

export function scrollRegionClassCatalog(): string[] {
  return ['sw-scroll-more-start', 'sw-scroll-more-end'];
}

/**
 * A region whose start column is pinned (sticky, on an opaque fill) hides
 * its own start shade under that column, so the column casts the shade
 * instead: a gradient a spacing step wide just past its inline end, drawn by
 * its `::after` (the pinned cell is positioned, so it holds the gradient).
 * `pinned` lists the pinned cells' selectors inside the region. Forced colors
 * draw no shade here either.
 */
export function pinnedStartShadeRules(
  region: string,
  pinned: readonly string[],
): string {
  const after = (direction: '' | ':dir(rtl)') =>
    pinned
      .map(
        (cell) => `${region}.sw-scroll-more-start${direction} ${cell}::after`,
      )
      .join(',\n');
  return `${after('')} {
  background: linear-gradient(to right, ${shadeColor}, transparent);
  content: '';
  inset-block: 0;
  inset-inline-start: 100%;
  pointer-events: none;
  position: absolute;
  width: var(--sw-space-5);
}

${after(':dir(rtl)')} {
  background: linear-gradient(to left, ${shadeColor}, transparent);
}

@media (forced-colors: active) {
  ${after('').replaceAll('\n', '\n  ')} { display: none; }
}`;
}
