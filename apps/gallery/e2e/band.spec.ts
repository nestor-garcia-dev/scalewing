import { createRequire } from 'node:module';

import { expect, test, type Page } from '@playwright/test';

import { colorContrast, textContrast } from './contrast.js';

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
          { include: [['#band .sw-band']] },
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

test('Band draws a dark band whose words, links and button read on it, and a grey strip', async ({
  page,
}, testInfo) => {
  await page.goto('/#band');
  const section = page.locator('#band');
  const inverse = section.getByRole('region', {
    name: 'Join the spring heron count',
  });
  const subtle = section.getByRole('region', { name: 'Wetland notes' });
  await expect(inverse).toBeVisible();
  await expect(subtle).toBeVisible();

  // The page gutter: 16 px on a phone, 24 px from md.
  const gutter = testInfo.project.name === 'mobile-es' ? '16px' : '24px';
  await expect(inverse.locator('.sw-band-inner')).toHaveCSS(
    'padding-left',
    gutter,
  );

  const forced = testInfo.project.name === 'forced-colors';
  expect(await axeViolations(page, !forced)).toEqual([]);
  if (!forced) {
    for (const words of [
      inverse.getByText('Join the spring heron count'),
      inverse.getByText('Two mornings at the north hide'),
      inverse.getByRole('link', { name: 'field guide' }),
    ])
      expect(await textContrast(words)).toBeGreaterThanOrEqual(7);
    const button = inverse.getByRole('button', {
      name: 'Sign up for a morning',
    });
    const [fill, label] = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.backgroundColor, style.color];
    });
    expect(colorContrast(fill, label)).toBeGreaterThanOrEqual(4.5);
    await page.getByRole('radio', { name: 'Dark' }).check();
    expect(
      await textContrast(inverse.getByText('Two mornings at the north hide')),
    ).toBeGreaterThanOrEqual(7);
  }
  await section.screenshot({ path: testInfo.outputPath('band.png') });
});
