import { expect, test } from '@playwright/test';

test('SegmentedControl and an attached ButtonGroup fill a phone, sized to their contents above it', async ({
  page,
}, testInfo) => {
  await page.goto('/#segmented-control');
  const phone = testInfo.project.name === 'mobile-es';
  const log = page.getByRole('radiogroup', { name: 'Field log' });
  const card = log.locator('xpath=ancestor::*[contains(@class, "sw-card")][1]');
  const [logBox, cardBox] = await Promise.all([
    log.boundingBox(),
    card.boundingBox(),
  ]);
  const radios = log.getByRole('radio');
  const widths = await radios.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().width)),
  );
  if (phone) {
    // The track fills the card's content box and the segments share it.
    expect(logBox!.width).toBeGreaterThan(cardBox!.width - 40);
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
  } else {
    expect(logBox!.width).toBeLessThan(cardBox!.width / 2);
  }
  // Each label stays on one line.
  const heights = await radios.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().height)),
  );
  expect(new Set(heights).size).toBe(1);
  for (const radio of await radios.all())
    expect(
      await radio.evaluate(
        (node) => node.scrollHeight <= node.clientHeight + 1,
      ),
    ).toBe(true);
  // Each label is its own block box that ends in an ellipsis, on a plain
  // raised segment and on a marked one.
  for (const label of [
    log.locator('.sw-segmented-item-label').first(),
    page
      .getByRole('radiogroup', { name: 'Survey, small' })
      .locator('.sw-segmented-item-label')
      .first(),
  ]) {
    const [display, overflow] = await label.evaluate((node) => {
      const style = getComputedStyle(node);
      return [style.display, style.textOverflow];
    });
    expect(display).not.toBe('inline');
    expect(overflow).toBe('ellipsis');
  }
  // A small track with marks fills a phone too, its labels in their own box.
  const marked = page.getByRole('radiogroup', { name: 'Survey, small' });
  await expect(
    marked.locator('.sw-segmented-item-label').first(),
  ).toBeVisible();
  if (phone) {
    const [markedBox, column] = await Promise.all([
      marked.boundingBox(),
      log.evaluate((node) =>
        node.closest('.sw-stack')!.getBoundingClientRect(),
      ),
    ]);
    expect(Math.round(markedBox!.width)).toBe(Math.round(column.width));
  }
  await card.screenshot({ path: testInfo.outputPath('segmented-full.png') });

  await page.goto('/#button-group');
  const tide = page.getByRole('group', { name: 'Tide window' });
  const tideBox = await tide.boundingBox();
  const column = await page
    .locator('#button-group')
    .getByRole('group', { name: 'Survey day' })
    .evaluate((node) => node.parentElement!.getBoundingClientRect().width);
  const buttons = await tide
    .getByRole('button')
    .evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().width)),
    );
  if (phone) {
    expect(Math.round(tideBox!.width)).toBe(Math.round(column));
    expect(Math.max(...buttons) - Math.min(...buttons)).toBeLessThanOrEqual(1);
  } else {
    expect(tideBox!.width).toBeLessThan(column);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await tide.screenshot({ path: testInfo.outputPath('button-group-full.png') });

  if (testInfo.project.name === 'forced-colors') return;
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  await tide.screenshot({
    path: testInfo.outputPath('button-group-full-dark.png'),
  });
});
