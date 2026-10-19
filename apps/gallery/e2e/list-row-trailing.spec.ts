import { expect, test } from '@playwright/test';

import { systemColor, tokenColor } from './contrast.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('ListRow marks a new row, tags it and holds its menu outside the row', async ({
  page,
}, testInfo) => {
  await page.goto('/#list-group');
  const section = page.locator('#list-group');
  const guides = section.getByRole('list', { name: 'Field guides' });
  await expect(guides.getByRole('listitem')).toHaveCount(3);

  // The unread words are in the name; the tag describes the row.
  const heron = guides.getByRole('link', { name: 'Heron calls New' });
  await expect(heron).toHaveAccessibleDescription('Guide · 2 pages · Oct 16');
  const owl = guides.getByRole('link', { name: 'Owl pellets New' });
  await expect(owl).toHaveAccessibleDescription(
    'Guide · 1 page · Oct 16 Only in English',
  );
  const frog = guides.getByRole('link', { name: 'Coro de ranas' });
  await expect(frog.locator('.sw-list-row-unread')).toHaveCount(0);

  // The dot is an accent disc a space-2 across after the title's words.
  const dot = owl.locator('.sw-list-row-unread');
  const box = await dot.boundingBox();
  expect(box?.width).toBe(8);
  expect(box?.height).toBe(8);
  const titleBox = await owl.locator('.sw-list-row-title').boundingBox();
  expect(box && titleBox).toBeTruthy();
  if (box && titleBox) {
    expect(box.y).toBeGreaterThan(titleBox.y);
    expect(box.y + box.height).toBeLessThan(titleBox.y + titleBox.height);
  }
  const forced = testInfo.project.name === 'forced-colors';
  await expect(dot).toHaveCSS(
    'border-top-color',
    forced
      ? await systemColor(page, 'CanvasText')
      : await tokenColor(page, 'accent'),
  );

  // The menu is a sibling of the row's link, not inside it.
  const more = guides.getByRole('button', { name: 'More for Owl pellets' });
  expect(await more.evaluate((node) => node.closest('a') === null)).toBe(true);
  // The tag and the menu sit on the row's middle, the menu after the tag.
  const [tagBox, moreBox, rowBox] = await Promise.all([
    owl.locator('.sw-list-row-tag').boundingBox(),
    more.boundingBox(),
    owl.boundingBox(),
  ]);
  expect(tagBox && moreBox && rowBox).toBeTruthy();
  if (tagBox && moreBox && rowBox) {
    expect(moreBox.x).toBeGreaterThan(tagBox.x + tagBox.width);
    const middle = rowBox.y + rowBox.height / 2;
    expect(Math.abs(tagBox.y + tagBox.height / 2 - middle)).toBeLessThan(2);
    expect(Math.abs(moreBox.y + moreBox.height / 2 - middle)).toBeLessThan(2);
  }
  if (testInfo.project.name === 'mobile-es')
    expect(moreBox?.height).toBeGreaterThanOrEqual(44);

  // The menu acts; the row does not open.
  await more.click();
  await page.getByRole('menuitem', { name: 'Archive…' }).click();
  await expect(section.getByText('Opened: Archive Owl pellets.')).toBeVisible();
  // The row opens from anywhere on it, its tag included.
  await owl.locator('.sw-list-row-tag').click();
  await expect(section.getByText('Opened: Owl pellets.')).toBeVisible();

  // The action keeps the row's end inset: none in a plain list, a space-4
  // inside a panel's hairline.
  const [plainList, panelMore, panelList] = await Promise.all([
    guides.boundingBox(),
    section.getByRole('button', { name: 'More for Observers' }).boundingBox(),
    section.locator('.sw-list-group-panel').last().boundingBox(),
  ]);
  expect(moreBox && plainList && panelMore && panelList).toBeTruthy();
  if (moreBox && plainList && panelMore && panelList) {
    expect(
      plainList.x + plainList.width - (moreBox.x + moreBox.width),
    ).toBeCloseTo(0, 0);
    expect(
      panelList.x + panelList.width - (panelMore.x + panelMore.width),
    ).toBeCloseTo(17, 0);
  }

  // A menu in a panel opens over it, not clipped by the panel's edge.
  await section.getByRole('button', { name: 'More for Observers' }).click();
  await page.getByRole('menuitem', { name: 'Invite an observer' }).click();
  await expect(section.getByText('Opened: Invite an observer.')).toBeVisible();

  // Nothing scrolls the page sideways.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
  await guides.screenshot({
    path: testInfo.outputPath('list-row-trailing.png'),
  });
  if (forced) return;
  await page.getByRole('radio', { name: 'Dark' }).first().check();
  await expect
    .poll(async () =>
      dot.evaluate((node) => getComputedStyle(node).borderTopColor),
    )
    .toBe(await tokenColor(page, 'accent'));
  await guides.screenshot({
    path: testInfo.outputPath('list-row-trailing-dark.png'),
  });
});

test('ListRow with an action: the row, then its menu, in the Tab order, and one hover fill', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-es', 'keyboard and hover');
  await page.goto('/#list-group');
  const guides = page.getByRole('list', { name: 'Field guides' });
  const heron = guides.getByRole('link', { name: 'Heron calls New' });
  await heron.focus();
  await page.keyboard.press('Tab');
  await expect(
    guides.getByRole('button', { name: 'More for Heron calls' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    guides.getByRole('link', { name: 'Owl pellets New' }),
  ).toBeFocused();

  if (testInfo.project.name === 'forced-colors') return;
  // Hovering the row fills the whole item, its menu's side too, once.
  const item = guides.getByRole('listitem').first();
  const fill = (node: Element) => getComputedStyle(node).backgroundColor;
  await expect.poll(() => item.evaluate(fill)).toBe('rgba(0, 0, 0, 0)');
  await heron.hover();
  await expect.poll(() => item.evaluate(fill)).not.toBe('rgba(0, 0, 0, 0)');
  expect(await heron.evaluate(fill)).toBe('rgba(0, 0, 0, 0)');
});
