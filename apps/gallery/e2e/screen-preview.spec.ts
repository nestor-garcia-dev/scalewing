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

test('ScreenPreview draws one named image, a phone from md and a card on a phone', async ({
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
  const figure = section.locator('figure.sw-screen-preview-device');
  const phone = testInfo.project.name === 'mobile-es';
  const forced = testInfo.project.name === 'forced-colors';
  const bezelFill = await bezel.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  const width = (await figure.boundingBox())!.width;
  if (phone) {
    expect(bezelFill).toBe('rgba(0, 0, 0, 0)');
  } else {
    if (!forced) expect(bezelFill).not.toBe('rgba(0, 0, 0, 0)');
    expect(Math.round(width)).toBe(320);
  }
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
