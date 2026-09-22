import { expect, test } from '@playwright/test';

test('Grid renders equal-width columns and fewer columns on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#grid');
  const section = page.locator('#grid');
  const actions = section.getByRole('region', { name: 'Survey actions' });
  const columns = await actions.evaluate(
    (element) =>
      getComputedStyle(element).gridTemplateColumns.split(' ').length,
  );
  const isPhone = testInfo.project.name === 'mobile-es';
  expect(columns).toBe(isPhone ? 2 : 3);
  const buttons = actions.getByRole('button');
  await expect(buttons).toHaveCount(6);
  const first = await buttons.nth(0).boundingBox();
  const second = await buttons.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs((first?.width ?? 0) - (second?.width ?? 0))).toBeLessThan(2);
  const totals = section.getByRole('region', { name: 'Season totals' });
  expect(
    await totals.evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(' ').length,
    ),
  ).toBe(3);
  await section.screenshot({ path: testInfo.outputPath('grid.png') });
});
