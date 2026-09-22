import { expect, test } from '@playwright/test';

test('Badge paints the warning tone apart from success and danger', async ({
  page,
}, testInfo) => {
  await page.goto('/#badge');
  const section = page.locator('#badge');
  const warning = section.getByText('warning', { exact: true });
  const danger = section.getByText('danger', { exact: true });
  const success = section.getByText('success', { exact: true });
  await expect(warning).toBeVisible();
  const colorOf = (locator: typeof warning) =>
    locator.evaluate((node) => getComputedStyle(node).borderColor);
  const warningColor = await colorOf(warning);
  expect(warningColor).not.toBe(await colorOf(danger));
  expect(warningColor).not.toBe(await colorOf(success));
  expect(warningColor).toBe(
    await warning.evaluate((node) => getComputedStyle(node).color),
  );
  await section.screenshot({ path: testInfo.outputPath('badge.png') });
});
