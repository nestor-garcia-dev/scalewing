import { type MarkdownImageResolver } from './markdown-model.js';

export type MarkdownOptions = {
  /**
   * Turns `![caption](photo:<id>)` into a photo: its `src` and its `alt`
   * (the caption when left out); null leaves it out. Any other image is
   * left out. A new function reads the source again, so keep it stable
   * (`useCallback`) where the view renders often.
   */
  resolveImage?: MarkdownImageResolver;
  /**
   * Put before every heading id, such as "page-", so its ids never clash
   * with the page's or another view's (`''`, the default, is none). Pass
   * the same one to the view and to `inspectMarkdown`.
   */
  idPrefix?: string;
};

/** Refuses what neither the view nor `inspectMarkdown` can read. */
export function assertMarkdownInput(
  owner: string,
  source: unknown,
  { resolveImage, idPrefix }: MarkdownOptions,
): void {
  if (typeof source !== 'string')
    throw new RangeError(`${owner} source must be text`);
  if (resolveImage !== undefined && typeof resolveImage !== 'function')
    throw new RangeError(`${owner} resolveImage must be a function`);
  if (
    idPrefix !== undefined &&
    (typeof idPrefix !== 'string' || !/^([A-Za-z][\w-]*)?$/.test(idPrefix))
  )
    throw new RangeError(
      `${owner} idPrefix must be empty or start with a letter and hold letters, digits, - or _`,
    );
}
