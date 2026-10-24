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
          { include: [['#hero .sw-hero']] },
          {
            resultTypes: ['violations'],
            rules: {
              'color-contrast': { enabled: withContrast },
              // The gallery shows each hero under its section's h2; on a
              // page the hero's h1 comes first.
              'heading-order': { enabled: false },
            },
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

test('Hero sets the picture beside the words, under them on a phone with full-width actions', async ({
  page,
}, testInfo) => {
  await page.goto('/#hero');
  const hero = page.getByRole('region', { name: 'Every heron counted.' });
  await expect(
    hero.getByRole('heading', { level: 1, name: 'Every heron counted.' }),
  ).toBeVisible();
  const words = (await hero.locator('.sw-hero-text').boundingBox())!;
  const picture = (await hero
    .getByRole('img', { name: 'This week at the hide' })
    .boundingBox())!;
  const visit = (await hero
    .getByRole('link', { name: 'Plan a visit' })
    .boundingBox())!;
  const trails = (await hero
    .getByRole('link', { name: 'See the trails' })
    .boundingBox())!;
  if (testInfo.project.name === 'mobile-es') {
    expect(picture.y).toBeGreaterThanOrEqual(words.y + words.height);
    expect(Math.round(visit.width)).toBe(Math.round(words.width));
    expect(trails.y).toBeGreaterThan(visit.y + visit.height - 1);
  } else {
    expect(picture.x).toBeGreaterThanOrEqual(words.x + words.width);
    expect(Math.round(trails.y)).toBe(Math.round(visit.y));
    expect(visit.width).toBeLessThan(words.width / 2);
  }

  const plain = page.getByRole('region', {
    name: 'Walk the marsh at your own pace.',
  });
  const plainWords = (await plain.locator('.sw-hero-text').boundingBox())!;
  // 46rem, the reading width.
  expect(plainWords.width).toBeLessThanOrEqual(736.5);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  const forced = testInfo.project.name === 'forced-colors';
  expect(await axeViolations(page, !forced)).toEqual([]);
  if (!forced) {
    for (const words of [
      hero.getByText('For birdwatchers'),
      hero.getByText(
        'The north marsh in every season, from the hide to the shore.',
      ),
    ])
      expect(await textContrast(words)).toBeGreaterThanOrEqual(4.5);
  }
  await hero.screenshot({ path: testInfo.outputPath('hero.png') });
});
