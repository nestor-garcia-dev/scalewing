import { typedInputs } from './css-document.js';

/*
 * The platform's monospace face by its generic CSS names only, as the
 * forced-colour rules name system colours: no face is chosen here, so
 * there is no type value for the tokens to own. Each platform draws its
 * own (SF Mono, Cascadia, Menlo …).
 */
export const monospaceFamilies = 'ui-monospace, monospace';

/*
 * Monospace text, for words read as typed code or marks (a Markdown source
 * being written, or a code set with `Text font="mono"`), at the size the
 * text already has; it outranks a Text variant's sans family. It outranks the
 * canvas's text controls, which take the page's family, so a `textarea` or
 * a text input can take it too.
 */
export function cssFontMonoClasses(): string {
  return `[data-theme] .sw-font-mono,
[data-theme] :is(${typedInputs}).sw-font-mono {
  font-family: ${monospaceFamilies};
}`;
}

export function fontMonoClassCatalog(): string[] {
  return ['sw-font-mono'];
}
