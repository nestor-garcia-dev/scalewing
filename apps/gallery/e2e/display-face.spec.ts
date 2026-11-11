import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test('a condensed display face reaches the titles and not the lead', async ({
  page,
}) => {
  await page.goto('/#display-face');
  const root = page.locator('#display-face [data-display-face="condensed"]');
  await expect(root).toBeVisible();
  const family = (text: string) =>
    root.getByText(text).evaluate((node) => getComputedStyle(node).fontFamily);
  expect(await family('Every match counts.')).toContain('Barlow Condensed');
  expect(await family('A table everyone trusts.')).toContain(
    'Barlow Condensed',
  );
  expect(await family('The lead keeps the system face.')).not.toContain(
    'Barlow Condensed',
  );
  expect(
    await axeViolations(page, '#display-face [data-display-face="condensed"]'),
  ).toEqual([]);
});
