import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

import { systemColor, textContrast, tokenColor } from './contrast.js';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

test('DenominationGrid valueRow: a value line under the counts, the total on it', async ({
  page,
}, testInfo) => {
  await page.goto('/#denomination-grid');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const isPhone = testInfo.project.name === 'mobile-es';

  const table = page.getByRole('table', { name: 'Seed sacks for the aviary' });
  await expect(table).toBeVisible();
  const lines = table.locator('tr.sw-denomination-value-row');
  await expect(lines).toHaveCount(3);
  const packed = lines.first();

  // Its name, each column's value centred (blank for none), and the total.
  await expect(
    packed.getByRole('rowheader', { name: 'Packed Weight' }),
  ).toContainText('Weight');
  const cells = packed.getByRole('cell');
  await expect(cells).toHaveText(['2 kg', '', '10 kg', '60 kg', '72 kg']);
  await expect(cells.first()).toHaveCSS('text-align', 'center');
  await expect(cells.first()).toHaveCSS('font-variant-numeric', 'tabular-nums');
  const total = packed.locator(
    isPhone ? '.sw-denomination-total-inline' : '.sw-denomination-total',
  );
  await expect(total).toHaveText('72 kg');
  await expect(total).toHaveCSS('font-weight', '700');
  await expect(total).toBeVisible();
  // The counts' own total cell is empty now.
  await expect(
    table
      .locator('tr')
      .filter({ has: page.getByRole('spinbutton', { name: 'Packed 1 kg' }) })
      .locator('.sw-denomination-total'),
  ).toHaveText('');

  if (forced) {
    await expect(cells.first()).toHaveCSS(
      'color',
      await systemColor(page, 'CanvasText'),
    );
  } else {
    // The subtle fill, under its pinned name too, and readable values.
    const subtle = await tokenColor(page, 'subtle');
    await expect(packed).toHaveCSS('background-color', subtle);
    await expect(packed.getByRole('rowheader')).toHaveCSS(
      'background-color',
      subtle,
    );
    expect(await textContrast(cells.first())).toBeGreaterThanOrEqual(4.5);
  }

  // A typed count changes its value; the count is described by it and the
  // value is no tab stop of its own.
  const tens = table.getByRole('spinbutton', { name: 'Packed 10 kg' });
  // Its value first, then its message: one sack over the store's none.
  await expect(tens).toHaveAccessibleDescription('10 kg Only 0 in the store.');
  await table
    .getByRole('group', { name: 'Packed 10 kg' })
    .getByRole('button', { name: 'One sack more' })
    .click();
  await expect(cells.nth(2)).toHaveText('20 kg');
  await expect(tens).toHaveAccessibleDescription('20 kg Only 0 in the store.');
  await tens.focus();
  await page.keyboard.press('Tab');
  await expect(
    table.getByRole('spinbutton', { name: 'Packed 20 kg' }),
  ).toBeFocused();

  // The read-only row's line, and no sideways page scroll on a phone.
  await expect(lines.nth(1).getByRole('cell')).toHaveText([
    '4 kg',
    '10 kg',
    '',
    '60 kg',
    '74 kg',
  ]);
  // A disabled row's line fades with it.
  const returned = lines.nth(2);
  await expect(returned).toHaveAttribute('aria-disabled', 'true');
  await expect(returned.getByRole('cell').first()).toHaveText('1 kg');
  expect(
    Number(
      await returned
        .getByRole('cell')
        .first()
        .evaluate((node) => getComputedStyle(node).opacity),
    ),
  ).toBeLessThan(1);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  // axe finds nothing in the grid. In forced colours its contrast check
  // reads the error's Mark ink against the page's white, not the system
  // background the browser paints, so contrast is checked without them.
  await page.addScriptTag({ path: require.resolve('axe-core') });
  const violations = await page.evaluate(
    (contrast) =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [['.sw-denomination-scroll-framed']] },
          {
            resultTypes: ['violations'],
            rules: { 'color-contrast': { enabled: contrast } },
          },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    !forced,
  );
  expect(violations).toEqual([]);
});
