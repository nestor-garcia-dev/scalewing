import { expect, test } from '@playwright/test';

test('Steps opens steps in order, folds done ones and moves focus to the step that opens', async ({
  page,
}, testInfo) => {
  await page.goto('/#steps');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const survey = page.getByRole('list', { name: 'Heron survey' });
  const items = survey.getByRole('listitem');
  await expect(items.nth(0)).toHaveAttribute('aria-current', 'step');
  await expect(survey.getByRole('textbox', { name: 'Site' })).toBeVisible();

  await survey.getByRole('button', { name: 'Continue' }).click();
  const count = survey.getByRole('heading', { name: 'The count' });
  await expect(count).toBeFocused();
  await expect(items.nth(1)).toHaveAttribute('aria-current', 'step');
  // The done step folds to its summary and Edit, named by its title.
  await expect(items.nth(0)).toContainText('North marsh');
  await expect(survey.getByRole('textbox', { name: 'Site' })).toHaveCount(0);
  const edit = survey.getByRole('button', { name: 'Edit The site' });
  await expect(edit).toBeVisible();

  // The marker is the xs control height, and a line joins it to the next.
  const marker = items.nth(0).locator('.sw-steps-marker');
  expect(Math.round((await marker.boundingBox())!.height)).toBe(28);
  const line = await items
    .nth(0)
    .evaluate((item) => getComputedStyle(item, '::after').height);
  expect(parseFloat(line)).toBeGreaterThan(0);

  await edit.click();
  await expect(survey.getByRole('heading', { name: 'The site' })).toBeFocused();

  // A long summary stays on one line.
  const statuses = page.getByRole('list', { name: 'Every status' });
  const summary = statuses.locator('.sw-steps-summary');
  const box = (await summary.boundingBox())!;
  expect(box.height).toBeLessThan(30);
  await expect(
    statuses.getByRole('heading', { level: 3, name: 'Skipped · not needed' }),
  ).toBeVisible();
  await expect(
    statuses.getByRole('heading', {
      level: 3,
      name: /^Upcoming\s*, Not started$/,
    }),
  ).toBeVisible();

  // Each connector starts below its marker, even under a wrapped title.
  for (const item of await page.locator('#steps .sw-steps-item').all()) {
    const gap = await item.evaluate((element) => {
      const after = getComputedStyle(element, '::after');
      if (after.content === 'none') return null;
      const marker = element.querySelector<HTMLElement>('.sw-steps-marker')!;
      const markerBottom =
        marker.getBoundingClientRect().bottom -
        element.getBoundingClientRect().top;
      return parseFloat(after.top) - markerBottom;
    });
    if (gap !== null) expect(gap).toBeGreaterThanOrEqual(3);
  }

  await page
    .locator('#steps')
    .screenshot({ path: testInfo.outputPath('steps.png') });
});
