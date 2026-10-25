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
          { include: [['#site-footer .sw-site-footer']] },
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

test('SiteFooter draws named link groups on the dark band, two columns on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#site-footer');
  // A footer inside the gallery's section is not the page's contentinfo
  // landmark, as it is when a site puts it at the end of its body.
  const footer = page.locator('#site-footer footer.sw-site-footer');
  await expect(footer).toBeVisible();
  const visit = footer.getByRole('navigation', { name: 'Visit' });
  const trust = footer.getByRole('navigation', { name: 'The trust' });
  const legal = footer.getByRole('navigation', { name: 'Legal' });
  await expect(visit.getByRole('link', { name: 'Heron hide' })).toHaveAttribute(
    'aria-current',
    'page',
  );

  const [visitBox, trustBox, legalBox] = await Promise.all(
    [visit, trust, legal].map(async (nav) => (await nav.boundingBox())!),
  );
  if (testInfo.project.name === 'mobile-es') {
    // Two columns: Visit and The trust side by side, Legal under Visit.
    expect(Math.round(trustBox.y)).toBe(Math.round(visitBox.y));
    expect(legalBox.y).toBeGreaterThan(visitBox.y + visitBox.height - 1);
    expect(Math.round(legalBox.x)).toBe(Math.round(visitBox.x));
    const link = visit.getByRole('link', { name: 'North marsh' });
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    // The bottom row's language switch is the same touch target.
    const end = footer.getByRole('link', { name: 'Español' });
    expect((await end.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  } else {
    expect(Math.round(trustBox.y)).toBe(Math.round(visitBox.y));
    expect(Math.round(legalBox.y)).toBe(Math.round(visitBox.y));
  }
  const width = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(width).toBeLessThanOrEqual(0);

  const forced = testInfo.project.name === 'forced-colors';
  expect(await axeViolations(page, !forced)).toEqual([]);
  if (!forced) {
    for (const words of [
      visit.getByRole('link', { name: 'North marsh' }),
      footer.getByText('Counting the birds of the north marsh since 1990.'),
      footer.getByText('© Wetland Trust · wetlandtrust.org'),
    ])
      expect(await textContrast(words)).toBeGreaterThanOrEqual(7);
  }
  await footer.screenshot({ path: testInfo.outputPath('site-footer.png') });
});
