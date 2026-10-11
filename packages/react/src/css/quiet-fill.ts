/**
 * The quiet grey fill: the muted color at 16 % over whatever is beneath
 * (about #E8E8E9 on white). An open menu or list row, a held separator,
 * today's calendar ring fill, a neutral button and a banded dialog's close
 * button all take it, so they read as one grey.
 */
export const quietFill =
  'color-mix(in srgb, var(--sw-color-muted) 16%, transparent)';
