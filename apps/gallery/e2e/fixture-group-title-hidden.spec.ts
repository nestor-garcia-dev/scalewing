import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test('FixtureGroup titleHidden names the list without drawing the caption', async ({
  page,
}, testInfo) => {
  await page.goto('/#fixture-row');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const list = page.getByRole('list', {
    name: 'Heron Marsh vs Otter Pool, Sunday 25 October',
    exact: true,
  });
  await list.scrollIntoViewIfNeeded();
  await expect(list.getByRole('listitem')).toHaveCount(1);

  const caption = page.locator(
    `[id="${await list.getAttribute('aria-labelledby')}"]`,
  );
  // Clipped to a pixel and out of the flow: the heading above is the
  // only one drawn, and the row starts right under the card's gap.
  const box = await caption.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(1);
  expect(box!.height).toBeLessThanOrEqual(1);
  expect(
    await caption.evaluate((node) => getComputedStyle(node).position),
  ).toBe('absolute');
  const day = page.getByText('Sunday 25 October', { exact: true });
  const gap = (await list.boundingBox())!.y - (await day.boundingBox())!.y;
  const dayHeight = (await day.boundingBox())!.height;
  // Stack gap={2} is 8 px: no caption's height or padding between them.
  expect(Math.round(gap - dayHeight)).toBe(8);

  // A drawn caption beside it still takes room.
  const drawn = page.getByText('Sunday 25 October · North meadow hides', {
    exact: true,
  });
  expect((await drawn.boundingBox())!.height).toBeGreaterThan(1);

  const card = list.locator('xpath=ancestor::*[contains(@class,"sw-card")][1]');
  expect(
    await axeViolations(page, '#fixture-row .sw-card .sw-fixture-group'),
  ).toEqual([]);
  await card.screenshot({
    path: testInfo.outputPath('fixture-group-title-hidden.png'),
  });
});
