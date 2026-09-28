import { expect, test } from '@playwright/test';

test('a toned Toast tints its border and icon and announces danger as an alert', async ({
  page,
}, testInfo) => {
  await page.goto('/#toast');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#toast');
  const colorOf = (token: string) =>
    page.evaluate((name) => {
      const probe = document.createElement('span');
      probe.style.color = `var(--sw-color-${name})`;
      document.querySelector('[data-theme]')?.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }, token);

  // Teisoro DRW-14: every toast was the same neutral glass pill.
  await section.getByRole('button', { name: 'Save survey' }).click();
  const saved = page.getByRole('status').filter({ hasText: 'Survey saved.' });
  await expect(saved).toBeVisible();
  await expect(saved).toHaveClass(/sw-toast-success/);
  const icon = saved.locator('.sw-toast-icon');
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
  if (!forced) {
    const success = await colorOf('success');
    await expect(saved).toHaveCSS('border-top-color', success);
    await expect(icon).toHaveCSS('color', success);
    // The message keeps the text color.
    await expect(saved.getByText('Survey saved.')).toHaveCSS(
      'color',
      await colorOf('text'),
    );
  }
  await saved.screenshot({ path: testInfo.outputPath('toast-success.png') });

  await section.getByRole('button', { name: 'Close the reserve log' }).click();
  const closed = page
    .getByRole('alert')
    .filter({ hasText: 'The reserve log is already closed.' });
  await expect(closed).toBeVisible();
  await expect(closed).toHaveClass(/sw-toast-danger/);
  // Past the 800 ms default: a danger toast stays 6000 ms to be read.
  await page.waitForTimeout(1500);
  await expect(closed).toBeVisible();
  if (!forced) {
    await expect(closed).toHaveCSS('border-top-color', await colorOf('danger'));
  }
  await closed.screenshot({ path: testInfo.outputPath('toast-danger.png') });
});
