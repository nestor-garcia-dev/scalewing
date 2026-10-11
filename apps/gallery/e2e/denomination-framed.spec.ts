import { expect, test } from '@playwright/test';

import { systemColor, textContrast, tokenColor } from './contrast.js';

test('DenominationGrid framed table: blank zeros, strong totals, tone pills and a plain − at zero', async ({
  page,
}, testInfo) => {
  await page.goto('/#denomination-grid');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const isPhone = testInfo.project.name === 'mobile-es';

  const table = page.getByRole('table', { name: 'Wading birds at the weir' });
  const region = page.locator('.sw-denomination-scroll-framed');
  await expect(region).toHaveCount(1);
  await expect(table).toBeVisible();

  // The frame: a hairline all round with rounded corners.
  await expect(region).toHaveCSS('border-top-width', '1px');
  await expect(region).toHaveCSS('border-top-left-radius', '8px');
  if (forced)
    await expect(region).toHaveCSS(
      'border-top-color',
      await systemColor(page, 'CanvasText'),
    );
  else
    await expect(region).toHaveCSS(
      'border-top-color',
      await tokenColor(page, 'border'),
    );

  // The heading row on the subtle fill, a rule between columns.
  const head = table.getByRole('columnheader', { name: 'Herons' });
  if (!forced)
    await expect(head).toHaveCSS(
      'background-color',
      await tokenColor(page, 'subtle'),
    );
  await expect(head).toHaveCSS('border-left-width', '1px');

  // Under the frame a quiet row's pinned label keeps the subtle fill, and
  // an entry cell keeps its own space-1 padding.
  if (!forced)
    await expect(table.getByRole('rowheader', { name: /^Expected/ })).toHaveCSS(
      'background-color',
      await tokenColor(page, 'subtle'),
    );
  await expect(table.locator('td.sw-denomination-entry').first()).toHaveCSS(
    'padding-top',
    '4px',
  );

  // Zeros are blank: the ibises expected none.
  const expected = table.getByRole('row', { name: /Expected/ });
  await expect(expected.getByRole('cell').nth(2)).toHaveText('');
  await expect(expected.getByRole('cell').first()).toHaveText('14');

  // Strong totals: bold, a neutral row's in the text color.
  const total = expected.locator(
    isPhone ? '.sw-denomination-total-inline' : '.sw-denomination-total',
  );
  await expect(total).toHaveCSS('font-weight', '700');
  if (!forced)
    await expect(total).toHaveCSS('color', await tokenColor(page, 'text'));

  // The storks one short: a danger pill whose ink keeps 4.5:1 on its tint.
  const difference = table.getByRole('row', { name: /Difference/ });
  const pill = difference
    .getByRole('cell')
    .nth(3)
    .locator('.sw-denomination-cell-value');
  await expect(pill).toHaveText('−1');
  await expect(difference.getByRole('cell').first()).toHaveText('');
  if (forced) {
    await expect(pill).toHaveCSS('outline-style', 'solid');
  } else {
    expect(
      await pill.evaluate((node) => getComputedStyle(node).backgroundColor),
    ).not.toBe('rgba(0, 0, 0, 0)');
    expect(await textContrast(pill)).toBeGreaterThanOrEqual(4.5);
    const after = table
      .getByRole('row', { name: /After/ })
      .getByRole('cell')
      .nth(3)
      .locator('.sw-denomination-cell-value');
    expect(await textContrast(after)).toBeGreaterThanOrEqual(4.5);
  }

  // − at zero stays disabled but is not faded.
  const ibises = table.getByRole('group', { name: 'Counted Ibises' });
  const less = ibises.getByRole('button', { name: 'One bird fewer' });
  await expect(less).toBeDisabled();
  if (!forced) await expect(less).toHaveCSS('opacity', '1');
  await ibises.getByRole('button', { name: 'One bird more' }).click();
  await expect(
    table.getByRole('spinbutton', { name: 'Counted Ibises' }),
  ).toHaveValue('1');
  await expect(less).toBeEnabled();
  // The count moved the difference: the ibis is now one over.
  await expect(
    difference.getByRole('cell').nth(2).locator('.sw-denomination-cell-value'),
  ).toHaveText('+1');
});
