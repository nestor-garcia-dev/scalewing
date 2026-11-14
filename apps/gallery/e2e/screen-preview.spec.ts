import { createRequire } from 'node:module';

import { expect, test, type Page } from '@playwright/test';

import { textContrast } from './contrast.js';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

async function axeViolations(page: Page, contrast: boolean) {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return page.evaluate(
    (withContrast) =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [['#screen-preview .sw-screen-preview']] },
          {
            resultTypes: ['violations'],
            rules: { 'color-contrast': { enabled: withContrast } },
          },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    contrast,
  );
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('ScreenPreview draws one named image, a phone at every width', async ({
  page,
}, testInfo) => {
  await page.goto('/#screen-preview');
  const section = page.locator('#screen-preview');
  const device = section.getByRole('img', {
    name: "Today's census: 14 herons, 6 egrets, 20 birds in all",
  });
  await expect(device).toBeVisible();
  await expect(
    section.getByRole('img', {
      name: 'The north hide this week: counts by hour and a closed path',
    }),
  ).toBeVisible();
  const bezel = device.locator('xpath=..');
  const figure = section.locator('figure.sw-screen-preview-device').first();
  const phone = testInfo.project.name === 'mobile-es';
  const forced = testInfo.project.name === 'forced-colors';
  const bezelFill = await bezel.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  const width = (await figure.boundingBox())!.width;
  // The phone is drawn at every width: 20rem from md, its column below it.
  if (!forced) expect(bezelFill).not.toBe('rgba(0, 0, 0, 0)');
  if (!phone) expect(Math.round(width)).toBe(320);
  const tiles = section.locator('.sw-preview-tiles');
  const columns = await tiles.evaluate(
    (node) => getComputedStyle(node).gridTemplateColumns.split(' ').length,
  );
  expect(columns).toBe(phone ? 3 : 6);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  expect(await axeViolations(page, !forced)).toEqual([]);
  if (!forced) {
    for (const words of [
      section.locator('figure').getByText('Closed after rain'),
      device.getByText('Census · Today'),
      figure.getByText('A photo of the real board goes here.'),
    ])
      expect(await textContrast(words)).toBeGreaterThanOrEqual(4.5);
  }
  await section.screenshot({ path: testInfo.outputPath('screen-preview.png') });
});

/** The relative luminance of a computed `rgb()` colour, 0 (black) to 1. */
function luminance(rgb: string): number {
  const [r, g, b] = rgb
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map((part) => {
      const value = Number(part) / 255;
      return value <= 0.03928
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

for (const scheme of ['light', 'dark'] as const) {
  test(`two screenshots side by side stay phones with a near-black bezel, in ${scheme}`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'forced-colors',
      'forced colours draw the bezel as a system outline',
    );
    await page.addInitScript((value) => {
      window.localStorage.setItem('scalewing-gallery-color-scheme', value);
    }, scheme);
    await page.goto('/#screen-preview');
    await expect(
      page.locator(`[data-theme='${scheme}']`).first(),
    ).toBeVisible();
    const pair = page.locator('#screen-preview [data-sample="side-by-side"]');
    const phones = pair.locator('figure.sw-screen-preview-device');
    await expect(phones).toHaveCount(2);
    await pair.scrollIntoViewIfNeeded();
    const pageFill = await page
      .locator(`[data-theme='${scheme}']`)
      .first()
      .evaluate((node) => getComputedStyle(node).backgroundColor);
    for (const phone of await phones.all()) {
      const bezel = phone.locator('.sw-screen-preview-bezel');
      const look = await bezel.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          fill: style.backgroundColor,
          padding: parseFloat(style.paddingLeft),
        };
      });
      // A dark device in both schemes, not the dark scheme's near-white words.
      expect(luminance(look.fill)).toBeLessThan(0.05);
      expect(look.fill).not.toBe(pageFill);
      expect(look.padding).toBeGreaterThanOrEqual(8);
      // The screenshot fills the screen edge to edge, at full opacity.
      const screen = await phone
        .locator('.sw-screen-preview-screen')
        .boundingBox();
      const image = phone.locator('img.sw-preview-image');
      const shot = await image.boundingBox();
      expect(Math.abs(shot!.width - screen!.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(shot!.x - screen!.x)).toBeLessThanOrEqual(1);
      expect(
        await image.evaluate((node) => getComputedStyle(node).opacity),
      ).toBe('1');
      if (testInfo.project.name === 'mobile-es') {
        // About 150 px wide each on a 390 px page, and still phones.
        const box = await phone.boundingBox();
        expect(box!.width).toBeLessThan(200);
      }
    }
    await pair.screenshot({
      path: testInfo.outputPath(`side-by-side-${scheme}.png`),
    });
  });
}
