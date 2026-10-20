import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('ListRow truncate keeps the title and detail to one line, the words whole for every reader', async ({
  page,
}) => {
  await page.goto('/#list-group');
  const wetlands = page
    .locator('#list-group')
    .getByRole('list', { name: 'Wetlands' });
  const heron = wetlands.getByRole('link', {
    name: 'Heron calls heard along the north marsh before dawn, and how to tell them from the egrets New',
  });
  await expect(heron).toHaveAccessibleDescription(
    'Guide · Wetlands › Herons and egrets › Calls at dawn and dusk · 12 pages · Oct 16',
  );

  // One line each, cut with an ellipsis: the box is narrower than its words.
  const words = heron.locator('.sw-list-row-title-text');
  const detail = heron.locator('.sw-list-row-detail');
  for (const part of [words, detail]) {
    await expect(part).toHaveCSS('text-overflow', 'ellipsis');
    await expect(part).toHaveCSS('white-space', 'nowrap');
    const [scroll, client, height, line] = await part.evaluate((node) => [
      node.scrollWidth,
      node.clientWidth,
      node.getBoundingClientRect().height,
      Number.parseFloat(getComputedStyle(node).lineHeight),
    ]);
    expect(scroll).toBeGreaterThan(client);
    expect(height).toBe(line);
  }
  await expect(words).toHaveAttribute(
    'title',
    'Heron calls heard along the north marsh before dawn, and how to tell them from the egrets',
  );

  // The dot stays visible after the cut words, on the title's line.
  const [wordsBox, dotBox, labelBox] = await Promise.all([
    words.boundingBox(),
    heron.locator('.sw-list-row-unread').boundingBox(),
    heron.locator('.sw-list-row-label').boundingBox(),
  ]);
  expect(wordsBox && dotBox && labelBox).toBeTruthy();
  if (wordsBox && dotBox && labelBox) {
    // A space-2 across, read from the token rather than written here.
    const space2 = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.width = 'var(--sw-space-2)';
      document.querySelector('[data-theme]')?.append(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return width;
    });
    expect(space2).toBeGreaterThan(0);
    expect(dotBox.width).toBe(space2);
    expect(dotBox.x).toBeGreaterThan(wordsBox.x + wordsBox.width);
    expect(dotBox.x + dotBox.width).toBeLessThanOrEqual(
      labelBox.x + labelBox.width + 0.5,
    );
  }

  // A row whose words fit is not cut, and its tag keeps its words whole.
  const warbler = wetlands.getByRole('link', { name: 'Reed nests' });
  const fits = await warbler
    .locator('.sw-list-row-title-text')
    .evaluate((node) => node.scrollWidth <= node.clientWidth);
  expect(fits).toBe(true);
  const tag = warbler.locator('.sw-list-row-tag');
  await expect(tag).toHaveText('Only in English');
  expect(
    await tag.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);

  // The row's menu stays whole beside the cut words, outside the link.
  const more = wetlands.getByRole('button', {
    name: 'More for Heron calls heard along the north marsh before dawn, and how to tell them from the egrets',
  });
  await expect(more).toBeVisible();
  expect(await more.evaluate((node) => node.closest('a') === null)).toBe(true);

  // A button row is cut the same way; a statement row's value and its line
  // keep their words whole while its title and detail are cut.
  const woodlands = page
    .locator('#list-group')
    .getByRole('list', { name: 'Woodlands' });
  const owl = woodlands.getByRole('button', {
    name: 'Reading owl pellets: bones, fur and what the owl ate last week',
  });
  await expect(owl.locator('.sw-list-row-title-text')).toHaveCSS(
    'text-overflow',
    'ellipsis',
  );
  const beetles = woodlands.getByRole('listitem').nth(1);
  const cut = await beetles
    .locator('.sw-list-row-title-text')
    .evaluate((node) => node.scrollWidth > node.clientWidth);
  expect(cut).toBe(true);
  for (const part of ['.sw-list-row-value', '.sw-list-row-value-detail']) {
    const whole = beetles.locator(part);
    await expect(whole).not.toHaveCSS('text-overflow', 'ellipsis');
    expect(
      await whole.evaluate((node) => node.scrollWidth <= node.clientWidth),
    ).toBe(true);
  }
  await expect(beetles.locator('.sw-list-row-value')).toHaveText('214 trees');

  // Nothing scrolls the page sideways.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
