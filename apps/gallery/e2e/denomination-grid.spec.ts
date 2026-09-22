import { expect, test } from '@playwright/test';

test('DenominationGrid renders the strip table with tones and moves totals under labels on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#denomination-grid');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
  }
  const section = page.locator('#denomination-grid');
  const strip = section.getByRole('table', { name: 'Tag movement by size' });
  await expect(strip.getByRole('columnheader')).toHaveCount(6);
  const net = strip.getByRole('row', { name: /Net/ });
  await expect(net.getByRole('cell').first()).toHaveText('+9');
  await expect(net.getByRole('cell').nth(2)).toHaveText('-2');
  await expect(net.getByRole('cell').nth(5)).toHaveText('—');
  const isPhone = testInfo.project.name === 'mobile-es';
  const totalCell = net.locator('td.sw-denomination-total');
  const inlineTotal = net.locator('.sw-denomination-total-inline');
  if (isPhone) {
    await expect(totalCell).toBeHidden();
    await expect(inlineTotal).toBeVisible();
  } else {
    await expect(totalCell).toBeVisible();
    await expect(inlineTotal).toBeHidden();
  }
  const stripBounds = await strip.boundingBox();
  const sectionBounds = await section.boundingBox();
  expect(stripBounds?.width ?? 0).toBeLessThanOrEqual(
    (sectionBounds?.width ?? 0) + 1,
  );
  const tiles = section.getByRole('group', { name: 'Tags in the field kit' });
  await expect(tiles.getByRole('listitem')).toHaveCount(6);
  await expect(tiles.getByRole('listitem').nth(1)).toContainText('200 g');
  await expect(tiles.getByRole('listitem').nth(2)).toContainText('—');
  await expect(
    section
      .getByRole('region', { name: 'Counted' })
      .getByText('One S tag short'),
  ).toBeVisible();
  await section.screenshot({
    path: testInfo.outputPath('denomination-grid.png'),
  });
});
