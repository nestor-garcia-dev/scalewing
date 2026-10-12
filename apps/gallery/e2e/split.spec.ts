import { expect, test } from '@playwright/test';

test('a Split leaves the next column room and never widens the page', async ({
  page,
}, testInfo) => {
  // The phone width that showed it, in every project.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#split');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#split');
  const split = section.locator('.sw-split');
  const row = split.locator('xpath=..');
  const census = row.getByText('Census counts stay a column.');
  await expect(split).toBeVisible();

  // At 390 px the split kept its 22rem pane, ran past the section and pushed
  // the next column to no width, so the gallery scrolled sideways (481 px).
  const rowBox = await row.boundingBox();
  const splitBox = await split.boundingBox();
  if (!rowBox || !splitBox) throw new Error('the split row has no box');
  expect(splitBox.x + splitBox.width).toBeLessThanOrEqual(
    rowBox.x + rowBox.width + 0.5,
  );
  // The next column keeps at least the split minimum (14rem).
  const min = await split.evaluate((node) =>
    Number.parseFloat(
      getComputedStyle(node).getPropertyValue('--sw-split-min'),
    ),
  );
  const rem = await page.evaluate(() =>
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
  const censusBox = await census.boundingBox();
  if (!censusBox) throw new Error('the next column has no box');
  expect(censusBox.x + censusBox.width).toBeLessThanOrEqual(
    rowBox.x + rowBox.width + 0.5,
  );
  expect(
    rowBox.x + rowBox.width - splitBox.x - splitBox.width,
  ).toBeGreaterThanOrEqual(min * rem - 0.5);

  // The whole gallery fits the viewport: nothing scrolls the page sideways.
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
  await section.screenshot({ path: testInfo.outputPath('split.png') });

  // The narrowed pane is as wide as it can be: a drag to the end keeps it,
  // and only a move to the start collapses it.
  const handle = section.getByRole('separator', { name: 'Resize Watch list' });
  await expect(handle).toHaveAttribute('aria-valuenow', '100');
  const pane = split.locator('.sw-split-pane');
  const before = (await pane.boundingBox())?.width ?? 0;
  const grip = await handle.boundingBox();
  if (!grip) throw new Error('the handle has no box');
  const y = grip.y + grip.height / 2;
  await page.mouse.move(grip.x + grip.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(grip.x + grip.width / 2 + 40, y, { steps: 4 });
  await page.mouse.up();
  await expect(handle).toHaveAccessibleName('Resize Watch list');
  expect((await pane.boundingBox())?.width ?? 0).toBeCloseTo(before, 0);
  await handle.press('ArrowLeft');
  await expect(
    section.getByRole('separator', { name: 'Show Watch list' }),
  ).toBeVisible();

  // Neither the held drag nor the collapse chose a width: expanded on a
  // desktop, the pane shows its 22rem again.
  await section
    .getByRole('separator', { name: 'Show Watch list' })
    .press('Enter');
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(handle).toHaveAttribute('aria-valuenow', /\d+/);
  await expect
    .poll(async () => Math.round((await pane.boundingBox())?.width ?? 0))
    .toBe(Math.round(22 * rem));
});
