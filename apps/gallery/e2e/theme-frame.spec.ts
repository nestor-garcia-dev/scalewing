import { expect, test } from '@playwright/test';

test("a site frame puts a short page's footer at the frame's foot", async ({
  page,
}) => {
  await page.goto('/#theme-frame');
  const root = page.locator('#theme-frame [data-frame="site"]');
  await expect(root).toBeVisible();
  const frame = (await root.boundingBox())!;
  const footer = (await root.locator('footer').boundingBox())!;
  const words = (await root.getByText('One short page.').boundingBox())!;
  expect(Math.round(footer.y + footer.height)).toBe(
    Math.round(frame.y + frame.height),
  );
  expect(footer.y).toBeGreaterThan(words.y + words.height + 100);
  // The demo's 18rem stand-in for the window, at a 16 px root size.
  expect(frame.height).toBeGreaterThanOrEqual(287);
});
