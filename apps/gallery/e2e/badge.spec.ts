import { expect, test } from '@playwright/test';

import { textContrast } from './contrast.js';

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

test('a Badge inside a filled button sits on the surface and keeps its contrast', async ({
  page,
}, testInfo) => {
  await page.goto('/#badge');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
  }
  const group = page
    .locator('#badge')
    .getByRole('group', { name: 'Nesting site' });
  const marsh = group.getByRole('button', { name: 'Marsh 2 nests' });
  const reef = group.getByRole('button', { name: 'Reef 0 nests' });
  await expect(marsh).toHaveAttribute('aria-pressed', 'true');
  // Teisoro NSF-1: a warning badge on the accent fill was about 1.1:1.
  for (const badge of [marsh.getByText('2 nests'), reef.getByText('0 nests')]) {
    expect(await textContrast(badge)).toBeGreaterThanOrEqual(4.5);
  }
  if (testInfo.project.name !== 'forced-colors') {
    const badge = await marsh.getByText('2 nests').evaluate((node) => {
      const style = getComputedStyle(node);
      const probe = document.createElement('span');
      node.closest('[data-theme]')?.append(probe);
      probe.style.color = 'var(--sw-color-text)';
      const text = getComputedStyle(probe).color;
      probe.style.color = 'var(--sw-color-warning)';
      const warning = getComputedStyle(probe).color;
      probe.remove();
      return {
        background: style.backgroundColor,
        border: style.borderTopColor,
        color: style.color,
        text,
        warning,
      };
    });
    expect(badge.background).toMatch(/^rgb\(/);
    // Words in the text color, the tone on the border (review of PR #73:
    // some palettes' tones are under 4.5:1 as text on the surface).
    expect(badge.color).toBe(badge.text);
    expect(badge.border).toBe(badge.warning);
  }
  await reef.click();
  await expect(reef).toHaveAttribute('aria-pressed', 'true');
  expect(await textContrast(reef.getByText('0 nests'))).toBeGreaterThanOrEqual(
    4.5,
  );
  await group.screenshot({ path: testInfo.outputPath('badge-in-button.png') });
});
