import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('Button width full takes the row a ••• menu leaves, and fills a column', async ({
  page,
}) => {
  await page.goto('/#button');
  const example = page.locator('#button-width');
  const edit = example.getByRole('button', { name: 'Edit', exact: true });
  const more = example.getByRole('button', { name: 'More for Heron log' });
  const log = example.getByRole('button', { name: 'Log a sighting' });
  await expect(edit).toBeVisible();

  const [row, editBox, moreBox, logBox] = await Promise.all([
    example.boundingBox(),
    edit.boundingBox(),
    more.boundingBox(),
    log.boundingBox(),
  ]);
  expect(row && editBox && moreBox && logBox).toBeTruthy();
  if (!row || !editBox || !moreBox || !logBox) return;

  // Edit starts at the row's start and ends one gap (8 px) before the menu,
  // which keeps its own square at the row's end.
  expect(Math.abs(editBox.x - row.x)).toBeLessThanOrEqual(1);
  expect(
    Math.abs(moreBox.x + moreBox.width - (row.x + row.width)),
  ).toBeLessThanOrEqual(1);
  expect(Math.abs(moreBox.width - moreBox.height)).toBeLessThanOrEqual(1);
  expect(moreBox.width).toBeLessThan(editBox.width);
  expect(
    Math.abs(moreBox.x - (editBox.x + editBox.width) - 8),
  ).toBeLessThanOrEqual(1);
  const middle = (box: { y: number; height: number }) => box.y + box.height / 2;
  expect(Math.abs(middle(editBox) - middle(moreBox))).toBeLessThanOrEqual(1);

  // Alone in a column it fills it.
  expect(Math.abs(logBox.width - row.width)).toBeLessThanOrEqual(1);

  // Its words stay centred.
  const centred = await edit.evaluate(
    (node) => getComputedStyle(node).justifyContent,
  );
  expect(centred).toBe('center');

  // No sideways scroll on the page.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
