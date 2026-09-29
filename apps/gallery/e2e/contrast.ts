import { type Locator, type Page } from '@playwright/test';

type Rgb = [number, number, number];

/** A computed color, rgb()/rgba() or color(srgb …) in 0–1 units, as 0–255 channels. */
function parseComputedColor(value: string): Rgb {
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  const scale = value.startsWith('color(srgb') ? 255 : 1;
  return [parts[0]! * scale, parts[1]! * scale, parts[2]! * scale];
}

function relativeLuminance([red, green, blue]: Rgb): number {
  const channel = (value: number) => {
    const unit = value / 255;
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
  );
}

/** The WCAG contrast ratio between two opaque computed colors. */
export function colorContrast(first: string, second: string): number {
  const [light, dark] = [
    relativeLuminance(parseComputedColor(first)),
    relativeLuminance(parseComputedColor(second)),
  ].sort((a, b) => b - a);
  return (light! + 0.05) / (dark! + 0.05);
}

/** A CSS color as the page computes it inside the themed canvas. */
function computedColor(page: Page, value: string): Promise<string> {
  return page.evaluate((color) => {
    const probe = document.createElement('span');
    probe.style.color = color;
    (document.querySelector('[data-theme]') ?? document.body).append(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();
    return computed;
  }, value);
}

/** A system color keyword, such as `Highlight`, as the page resolves it. */
export function systemColor(page: Page, name: string): Promise<string> {
  return computedColor(page, name);
}

/** A semantic color token (`--sw-color-<token>`) as the page resolves it. */
export function tokenColor(page: Page, token: string): Promise<string> {
  return computedColor(page, `var(--sw-color-${token})`);
}

/**
 * The WCAG contrast ratio of an element's text color against the background
 * painted behind it: its own and its ancestors' background colors composited
 * over white, outermost first. Opacity on the element or an ancestor fades
 * the text and every background inside that node, as it is drawn.
 */
export function textContrast(locator: Locator): Promise<number> {
  return locator.evaluate((element) => {
    type Rgba = [number, number, number, number];
    // Computed colors are rgb()/rgba(), or color(srgb …) in 0–1 units for
    // a color-mix().
    function parse(value: string): Rgba {
      const parts = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
      const scale = value.startsWith('color(srgb') ? 255 : 1;
      return [
        parts[0]! * scale,
        parts[1]! * scale,
        parts[2]! * scale,
        parts[3] ?? 1,
      ];
    }
    function over(top: Rgba, bottom: Rgba): Rgba {
      const alpha = top[3] + bottom[3] * (1 - top[3]);
      if (alpha === 0) return [0, 0, 0, 0];
      const mix = (index: number) =>
        (top[index]! * top[3] + bottom[index]! * bottom[3] * (1 - top[3])) /
        alpha;
      return [mix(0), mix(1), mix(2), alpha];
    }
    function luminance([red, green, blue]: Rgba): number {
      const channel = (value: number) => {
        const unit = value / 255;
        return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
      };
      return (
        0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
      );
    }

    // Outermost first: a node's opacity fades its own background and
    // everything inside it, so each layer carries the product of its own
    // and its ancestors' opacity.
    const chain: Element[] = [];
    for (let node: Element | null = element; node; node = node.parentElement)
      chain.unshift(node);
    let background: Rgba = [255, 255, 255, 1];
    let opacity = 1;
    for (const node of chain) {
      const style = getComputedStyle(node);
      opacity *= Number(style.opacity);
      const layer = parse(style.backgroundColor);
      background = over(
        [layer[0], layer[1], layer[2], layer[3] * opacity],
        background,
      );
    }
    const text = parse(getComputedStyle(element).color);
    const drawn = over(
      [text[0], text[1], text[2], text[3] * opacity],
      background,
    );
    const [light, dark] = [luminance(drawn), luminance(background)].sort(
      (first, second) => second - first,
    );
    return (light! + 0.05) / (dark! + 0.05);
  });
}

/**
 * The contrast of what is actually painted inside an element's text: a
 * screenshot of the text's own box, decoded in the page, and the WCAG ratio
 * between its lightest and darkest pixels. Unlike `textContrast`, which reads
 * computed colors, it sees what the browser draws on top of them, such as
 * the forced-colors backplate behind text (a HighlightText label on a Canvas
 * backplate paints as 1.00:1 while its computed colors say 11:1).
 * Antialiasing only lowers the extremes, so the result is a floor.
 */
export async function paintedTextContrast(locator: Locator): Promise<number> {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const rect = range.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  const page = locator.page();
  const png = await page.screenshot({ clip: box });
  return page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const channel = (value: number) => {
      const unit = value / 255;
      return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
    };
    let darkest = 1;
    let lightest = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      const luminance =
        0.2126 * channel(pixels[index]!) +
        0.7152 * channel(pixels[index + 1]!) +
        0.0722 * channel(pixels[index + 2]!);
      darkest = Math.min(darkest, luminance);
      lightest = Math.max(lightest, luminance);
    }
    return (lightest + 0.05) / (darkest + 0.05);
  }, png.toString('base64'));
}
