import { expect, test } from '@playwright/test';

test('Spinner announces once while decorative indicators honor reduced motion', async ({
  page,
}, testInfo) => {
  await page.goto('/#spinner');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page.evaluate(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
  ).toBe(true);
  const section = page.locator('#spinner');
  const status = section.getByRole('status');
  await expect(status).toHaveText('Loading sightings');
  await expect(section.getByRole('status')).toHaveCount(1);
  await expect(section.locator('.sw-spinner[aria-hidden="true"]')).toHaveCount(
    3,
  );
  const icon = status.locator('.sw-spinner-icon');
  await expect(icon).toHaveCSS('animation-name', 'none');
  await section.screenshot({
    path: testInfo.outputPath('spinner-reduced-motion.png'),
  });

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(icon).toHaveCSS('animation-name', 'sw-spinner-rotate');
});
