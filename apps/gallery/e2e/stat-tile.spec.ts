import { expect, test } from '@playwright/test';

test('StatTile fills the primary figure and tones the others', async ({
  page,
}, testInfo) => {
  await page.goto('/#stat-tile');
  const section = page.locator('#stat-tile');
  const primary = section.locator('.sw-stat-tile-primary');
  await expect(primary).toContainText('Total sightings');
  await expect(primary).toContainText('1,284');
  await expect(primary).toContainText('42 species');
  const fill = (element: HTMLElement) =>
    getComputedStyle(element).backgroundColor;
  const primaryFill = await primary.evaluate(fill);
  const forest = section.locator('.sw-stat-tile', { hasText: 'Forest' });
  expect(await forest.evaluate(fill)).not.toBe(primaryFill);
  const colorOf = (text: string) =>
    section
      .locator('.sw-stat-tile-value', { hasText: text })
      .evaluate((node) => getComputedStyle(node).color);
  const success = await colorOf('612');
  const danger = await colorOf('-3');
  const warning = await colorOf('27');
  expect(success).not.toBe(danger);
  expect(warning).not.toBe(danger);
  expect(warning).not.toBe(success);
  // Four tiles share one row on desktop and stack on a phone.
  const savanna = section.locator('.sw-stat-tile', { hasText: 'Savanna' });
  const forestBox = await forest.boundingBox();
  const savannaBox = await savanna.boundingBox();
  if (testInfo.project.name === 'mobile-es') {
    expect((savannaBox?.y ?? 0) > (forestBox?.y ?? 0)).toBe(true);
  } else {
    expect(Math.abs((savannaBox?.y ?? 0) - (forestBox?.y ?? 0))).toBeLessThan(
      2,
    );
  }
  await section.screenshot({ path: testInfo.outputPath('stat-tile.png') });
});
