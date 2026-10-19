/** The link schemes a page may use; any other is shown as plain words. */
export const markdownLinkSchemes = ['http:', 'https:', 'mailto:'] as const;

/**
 * The address a link may open, normalised as the browser reads it, or null
 * for any scheme but http, https and mailto (`javascript:`, `data:`, a
 * relative or protocol-relative address, anything that is not a URL).
 */
export function safeLinkHref(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  return (markdownLinkSchemes as readonly string[]).includes(parsed.protocol)
    ? parsed.href
    : null;
}

/** The id in `photo:<id>`, or null for any other image address. */
export function photoId(url: string): string | null {
  const match = /^photo:([A-Za-z0-9_-]{1,64})$/.exec(url.trim());
  return match ? match[1]! : null;
}

const imageSchemes = ['http:', 'https:', 'blob:'];
const imageData = /^data:image\/(png|jpeg|gif|webp|avif|svg\+xml)[;,]/i;

/**
 * Whether a resolved photo's address may be drawn: relative, `https:`,
 * `http:`, `blob:` or a `data:` PNG, JPEG, GIF, WebP, AVIF or SVG (an
 * `img` never runs an SVG's script); never any other scheme.
 */
export function isSafeImageSrc(src: string): boolean {
  if (typeof src !== 'string' || src.trim() === '') return false;
  let parsed: URL;
  try {
    parsed = new URL(src, 'https://relative.invalid/');
  } catch {
    return false;
  }
  if (parsed.protocol === 'data:') return imageData.test(src.trim());
  return imageSchemes.includes(parsed.protocol);
}

/** A heading's words as an id: lower case, accents dropped, hyphens. */
function slug(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Heading ids for one document: from a heading's words, `section` when
 * nothing is left, after `prefix`; a repeat takes the next free `-2`,
 * `-3`. Each base remembers its next number, so many repeats stay linear.
 */
export class HeadingIds {
  private readonly taken = new Set<string>();
  private readonly next = new Map<string, number>();

  constructor(private readonly prefix: string) {}

  take(text: string): string {
    const base = `${this.prefix}${slug(text) || 'section'}`;
    let id = base;
    let count = this.next.get(base) ?? 2;
    if (this.taken.has(id)) {
      do {
        id = `${base}-${count}`;
        count += 1;
      } while (this.taken.has(id));
    }
    this.next.set(base, count);
    this.taken.add(id);
    return id;
  }
}
