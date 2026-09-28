import { type Locator } from '@playwright/test';

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
