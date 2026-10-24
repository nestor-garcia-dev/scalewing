import { expect, test } from '@playwright/test';

test('Skeleton draws hidden bars in a named status, still under reduced motion', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.emulateMedia({
    reducedMotion: 'reduce',
    ...(forced ? { forcedColors: 'active' as const } : {}),
  });
  await page.goto('/#skeleton');
  const section = page.locator('#skeleton');
  const lines = section.getByRole('status', {
    name: "Loading this week's sightings",
  });
  await expect(lines).toBeVisible();
  const bars = lines.locator('.sw-skeleton-bar');
  await expect(bars).toHaveCount(3);
  const widths = await bars.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().width),
  );
  // Ragged ends, the last line the shortest.
  expect(widths[2]).toBeLessThan(widths[1]!);
  expect(widths[1]).toBeLessThan(widths[0]!);
  // Reduced motion: no pulse.
  await expect(bars.first()).toHaveCSS('animation-name', 'none');
  const rows = section.getByRole('status', { name: 'Loading rangers' });
  const row = rows.locator('.sw-skeleton-row').first();
  expect((await row.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  if (forced) await expect(bars.first()).toHaveCSS('border-top-style', 'solid');
  // The words replace the bars once loaded.
  await section.getByRole('button', { name: 'Show loaded' }).click();
  await expect(lines).toHaveCount(0);
  await expect(section.getByText('Twelve grey herons')).toBeVisible();
});

test('Skeleton pulses when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#skeleton');
  await expect(page.locator('#skeleton .sw-skeleton-bar').first()).toHaveCSS(
    'animation-name',
    'sw-skeleton-pulse',
  );
});
