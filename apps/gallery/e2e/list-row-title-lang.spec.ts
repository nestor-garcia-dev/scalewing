import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test("ListRow titleLang marks the title's words only, the row's name and description unchanged", async ({
  page,
}) => {
  await page.goto('/#list-group');
  const guides = page
    .locator('#list-group')
    .getByRole('list', { name: 'Field guides' });

  // The Spanish guide on the English page: its name is still its title.
  const frog = guides.getByRole('link', { name: 'Coro de ranas' });
  await expect(frog).toHaveAccessibleDescription(
    'Course · 16 pages · Sep 24 Only in Spanish',
  );
  await expect(frog).not.toHaveAttribute('lang');
  const marked = frog.locator('[lang]');
  await expect(marked).toHaveCount(1);
  await expect(marked).toHaveAttribute('lang', 'es');
  await expect(marked).toHaveClass('sw-list-row-title');
  await expect(marked).toHaveText('Coro de ranas');

  // The page's language everywhere else in the row, `:lang()` included.
  await expect(frog.locator('.sw-list-row-title:lang(es)')).toHaveCount(1);
  for (const part of ['.sw-list-row-detail', '.sw-list-row-tag'])
    await expect(frog.locator(`${part}:lang(es)`)).toHaveCount(0);

  // A row without titleLang carries no lang.
  const heron = guides.getByRole('link', { name: 'Heron calls New' });
  await expect(heron.locator('[lang]')).toHaveCount(0);

  // The marked title is still the row's first line, above its detail.
  const [titleBox, detailBox] = await Promise.all([
    marked.boundingBox(),
    frog.locator('.sw-list-row-detail').boundingBox(),
  ]);
  expect(titleBox && detailBox).toBeTruthy();
  if (titleBox && detailBox)
    expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(detailBox.y);
});
