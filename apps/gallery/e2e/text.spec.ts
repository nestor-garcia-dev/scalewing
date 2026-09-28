import { expect, test } from '@playwright/test';

// Stack gap={3} is spacing step 3.
const gap3 = 12;

// The project's forcedColors option alone does not reach the page's media
// queries, so the forced-colors project emulates it as the other specs do.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(true);
});

test('Text keeps no browser margin, so a Stack gap alone spaces it', async ({
  page,
}, testInfo) => {
  await page.goto('/#text');
  const section = page.locator('#text');
  const title = section.getByRole('heading', { name: 'Text', level: 2 });
  const purpose = section.locator('p').first();
  const centered = section.getByRole('heading', {
    name: 'Centered heading that wraps on a narrow screen',
  });
  const caption = section.getByText('End-aligned caption');

  for (const text of [title, purpose, centered]) {
    const margin = await text.evaluate((node) => {
      const style = getComputedStyle(node);
      return [style.marginTop, style.marginBottom];
    });
    expect(margin).toEqual(['0px', '0px']);
  }

  const titleBox = await title.boundingBox();
  const purposeBox = await purpose.boundingBox();
  expect(
    (purposeBox?.y ?? 0) - (titleBox?.y ?? 0) - (titleBox?.height ?? 0),
  ).toBeCloseTo(gap3, 0);
  const centeredBox = await centered.boundingBox();
  const captionBox = await caption.boundingBox();
  expect(
    (captionBox?.y ?? 0) - (centeredBox?.y ?? 0) - (centeredBox?.height ?? 0),
  ).toBeCloseTo(gap3, 0);

  await section.screenshot({ path: testInfo.outputPath('text.png') });
});

test('an authored margin on Text still wins over the reset', async ({
  page,
}) => {
  await page.goto('/#field');
  // Field's visually hidden label is Text with the sw-sr-only utility.
  const hidden = page.locator('#field .sw-sr-only[class*="sw-text-"]').first();
  await expect(hidden).toHaveText('Compact region');
  expect(
    await hidden.evaluate((node) => getComputedStyle(node).marginTop),
  ).toBe('-1px');
});
