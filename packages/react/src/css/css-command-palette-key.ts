import { typographyVariants } from '@scalewing/tokens';

const caption = typographyVariants.caption;

/*
 * A key cap: a key's name or glyph ("⌘K", "↵") in a small rounded hairline
 * box in the muted colour, caption size at weight 500 with tabular figures.
 * CommandPaletteTrigger's shortcut hint and the palette's Enter hint share
 * it. Forced colours keep its edge.
 */
export function cssCommandPaletteKeyClasses(): string {
  return `.sw-command-palette-key {
  align-items: center;
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  color: var(--sw-color-muted);
  display: inline-flex;
  flex: none;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  justify-content: center;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
  min-width: var(--sw-space-5);
  padding-inline: var(--sw-space-1);
  white-space: nowrap;
}

@media (forced-colors: active) {
  .sw-command-palette-key { border-color: CanvasText; color: CanvasText; }
}`;
}
