import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('ListGroup tiles: one list, three tiles across or one a row on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#list-group');
  const list = page
    .locator('#list-group')
    .getByRole('list', { name: 'New arrivals' });
  const items = list.getByRole('listitem');
  await expect(items).toHaveCount(3);
  await expect(list.getByRole('link')).toHaveCount(3);
  await expect(
    list.getByRole('link', { name: 'Owl boxes' }),
  ).toHaveAccessibleDescription('Guide · Woodlands › Owls');

  const boxes = await items.evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        radius: parseFloat(style.borderTopLeftRadius),
        borders: [
          style.borderTopWidth,
          style.borderRightWidth,
          style.borderBottomWidth,
          style.borderLeftWidth,
        ],
      };
    }),
  );
  const listBox = await list.boundingBox();
  expect(listBox).toBeTruthy();
  if (!listBox) return;

  // Each tile is a panel: a hairline on every side and a rounded corner.
  for (const box of boxes) {
    expect(box.borders).toEqual(['1px', '1px', '1px', '1px']);
    expect(box.radius).toBeGreaterThan(0);
  }

  if (testInfo.project.name === 'mobile-es') {
    // One a row, the list's width, a space-3 (12 px) apart.
    for (const box of boxes) {
      expect(Math.abs(box.x - listBox.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.width - listBox.width)).toBeLessThanOrEqual(1);
    }
    expect(boxes[1]!.y - (boxes[0]!.y + boxes[0]!.height)).toBeCloseTo(12, 0);
  } else {
    // Three equal tiles on one row, 12 px apart, filling the list.
    for (const box of boxes) {
      expect(Math.abs(box.y - boxes[0]!.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.width - boxes[0]!.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.height - boxes[0]!.height)).toBeLessThanOrEqual(1);
    }
    expect(boxes[1]!.x - (boxes[0]!.x + boxes[0]!.width)).toBeCloseTo(12, 0);
    expect(
      Math.abs(boxes[2]!.x + boxes[2]!.width - (listBox.x + listBox.width)),
    ).toBeLessThanOrEqual(1);
  }

  // The long title is cut to one line inside its tile.
  const long = list.getByRole('link', {
    name: 'Heron colony disturbance near the north marsh boardwalk',
  });
  const title = long.locator('.sw-list-row-title-text');
  const cut = await title.evaluate(
    (node) => node.scrollWidth > node.clientWidth,
  );
  expect(cut).toBe(true);

  // A tile's focus ring stays inside it.
  await long.focus();
  await expect(long).toBeFocused();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
