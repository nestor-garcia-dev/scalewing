import { expect, test } from '@playwright/test';

test('FilterChips wraps long labels and supports native single-choice keyboard behavior', async ({
  page,
}, testInfo) => {
  await page.goto('/#filter-chips');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const section = page.locator('#filter-chips');
  const group = section.getByRole('group', { name: 'Sighting filters' });
  const all = group.getByRole('radio', { name: 'All sightings (42)' });
  const forest = group.getByRole('radio', {
    name: 'Forest canopy records (18)',
  });
  const desert = group.getByRole('radio', { name: 'Desert scrub (0)' });
  const wetland = group.getByRole('radio', {
    name: 'Wetland observations across the migration season (12)',
  });
  const selva = group.getByRole('radio', {
    name: 'Observaciones de selva tropical (8)',
  });
  await expect(all).toBeChecked();
  await expect(desert).toBeDisabled();
  await expect(group.locator('.sw-filter-chips-options')).toHaveCSS(
    'flex-wrap',
    'wrap',
  );
  const bounds = await selva.boundingBox();
  const groupBounds = await group.boundingBox();
  expect(bounds).not.toBeNull();
  expect(groupBounds).not.toBeNull();
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(
    (groupBounds?.x ?? 0) + (groupBounds?.width ?? 0) + 1,
  );
  await section.screenshot({ path: testInfo.outputPath('filter-chips.png') });

  await forest.click();
  await expect(forest).toBeChecked();
  await expect(
    section.getByText('Selected filter: forest. Callbacks: 1.'),
  ).toBeVisible();
  await forest.press('ArrowRight');
  await expect(desert).not.toBeChecked();
  await expect(wetland).toBeChecked();
  await expect(
    section.getByText('Selected filter: wetland. Callbacks: 2.'),
  ).toBeVisible();
  await selva.focus();
  await selva.press('Space');
  await expect(selva).toBeChecked();
  await expect(
    section.getByText('Selected filter: selva. Callbacks: 3.'),
  ).toBeVisible();
  await section.getByRole('button', { name: 'Add sighting' }).click();
  await expect(
    group.getByRole('radio', { name: 'All sightings (43)' }),
  ).toBeVisible();
  await expect(selva).toBeChecked();
});
