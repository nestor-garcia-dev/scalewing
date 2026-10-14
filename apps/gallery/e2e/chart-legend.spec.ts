import { expect, type Locator, test } from '@playwright/test';

import { systemColor, tokenColor } from './contrast.js';

/** Each item's swatch: its kind, its painted colours and its box. */
function swatches(list: Locator) {
  return list.locator('.sw-chart-legend-swatch').evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return {
        kind: node.className.split('sw-chart-legend-').pop(),
        background: style.backgroundColor,
        border: `${style.borderTopStyle} ${style.borderTopColor}`,
        clip: style.clipPath,
        width: box.width,
        height: box.height,
      };
    }),
  );
}

test('ChartLegend reads as a list of words, each beside its swatch', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#chart-legend');
  const list = page.getByRole('list', { name: 'Lake count key' });
  await list.scrollIntoViewIfNeeded();

  // The swatches are hidden, so each item is named by its words alone.
  await expect(list.getByRole('listitem')).toHaveText([
    'Herons',
    'Egrets, with the dawn recount',
    'Running total',
    'This week',
  ]);
  for (const swatch of await list.locator('.sw-chart-legend-swatch').all())
    await expect(swatch).toHaveAttribute('aria-hidden', 'true');

  const [herons, egrets, line, box] = await swatches(list);
  expect(herons!.kind).toBe('bar');
  expect(line!.height).toBe(2);
  expect(line!.width).toBe(16);
  expect(box!.width).toBe(16);
  expect(box!.height).toBe(12);
  if (forced) {
    const canvasText = await systemColor(page, 'CanvasText');
    expect([herons!.background, egrets!.background, line!.background]).toEqual([
      canvasText,
      canvasText,
      canvasText,
    ]);
    expect(box!.border).toBe(`dashed ${canvasText}`);
  } else {
    // Two series in two hues, and the line and box in the accent.
    expect(herons!.background).not.toBe(egrets!.background);
    const accent = await tokenColor(page, 'accent');
    expect(line!.background).toBe(accent);
    expect(box!.border).toBe(`dashed ${accent}`);
  }

  // Each swatch is centred on the first line of its words (18 px), even
  // when the words wrap to a second line.
  const centres = await list
    .locator('.sw-chart-legend-item')
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const swatch = node.firstElementChild!.getBoundingClientRect();
        return (
          swatch.top + swatch.height / 2 - node.getBoundingClientRect().top
        );
      }),
    );
  for (const centre of centres) expect(centre).toBeCloseTo(9, 0);
  await list.evaluate((node) => {
    node.style.maxWidth = '120px';
  });
  const wrapped = list.getByRole('listitem').nth(1);
  expect((await wrapped.boundingBox())!.height).toBeGreaterThan(18);
  const wrappedCentre = await wrapped.evaluate((node) => {
    const swatch = node.firstElementChild!.getBoundingClientRect();
    return swatch.top + swatch.height / 2 - node.getBoundingClientRect().top;
  });
  expect(wrappedCentre).toBeCloseTo(9, 0);
  await list.evaluate((node) => node.style.removeProperty('max-width'));

  // A narrow screen wraps the items; nothing runs past the list.
  const overflow = await list.evaluate(
    (node) => node.scrollWidth - node.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await list.screenshot({ path: testInfo.outputPath('chart-legend.png') });
});

test('ChartLegend draws a marker as a downward triangle and statement bars in their tones', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'forced-colors');
  await page.goto('/#chart-legend');
  const water = page.getByRole('list', { name: 'Water level key' });
  await water.scrollIntoViewIfNeeded();
  const [, marker, owed] = await swatches(water);
  expect(marker!.clip).toBe('polygon(0px 0px, 100% 0px, 50% 100%)');
  expect(marker!.background).toBe(await tokenColor(page, 'danger'));
  expect(owed!.background).toBe(await tokenColor(page, 'warning'));

  // The five statement tones are five fills; dark keeps them apart too.
  const colony = page.getByRole('list', { name: 'Colony day key' });
  const light = (await swatches(colony)).map((swatch) => swatch.background);
  expect(new Set(light).size).toBe(5);
  await page.getByRole('radio', { name: 'Dark' }).check();
  const dark = (await swatches(colony)).map((swatch) => swatch.background);
  expect(new Set(dark).size).toBe(5);
  expect(dark).not.toEqual(light);
  await colony.screenshot({
    path: testInfo.outputPath('chart-legend-dark.png'),
  });
});
