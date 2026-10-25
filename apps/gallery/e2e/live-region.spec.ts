import { expect, test, type Page } from '@playwright/test';

import { axeViolations } from './axe-scan.js';
import { paintedTextContrast, textContrast } from './contrast.js';

// The forced-colors project's option alone leaves the media query off.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

async function openSection(page: Page) {
  await page.goto('/#live-region');
  await expect(page.locator('#live-region')).toBeVisible();
}

test('LiveRegion is an always-mounted status whose words are swapped in', async ({
  page,
}, testInfo) => {
  await openSection(page);
  const section = page.locator('#live-region');
  const count = section.getByRole('status').filter({ hasText: /heron/ });
  await expect(count).toHaveText('No herons logged yet');
  await expect(count).toHaveAttribute('aria-live', 'polite');
  await expect(count).toHaveAttribute('aria-atomic', 'true');
  const firstWords = await count.evaluate((region) => {
    (region.firstElementChild as HTMLElement).dataset.first = '';
    return region.childElementCount;
  });
  expect(firstWords).toBe(1);

  await section.getByRole('button', { name: 'Log a heron' }).click();
  await expect(count).toHaveText('1 heron logged');
  // A new node holds the new words, so they are read; the region stays.
  expect(await count.locator('[data-first]').count()).toBe(0);

  // Drawn inline in Text's look, beside the button, at 4.5:1.
  const [button, line] = await Promise.all([
    section.getByRole('button', { name: 'Log a heron' }).boundingBox(),
    count.boundingBox(),
  ]);
  expect(line!.x).toBeGreaterThan(button!.x + button!.width);
  expect(
    Math.abs(line!.y + line!.height / 2 - (button!.y + button!.height / 2)),
  ).toBeLessThanOrEqual(2);
  if (testInfo.project.name === 'forced-colors')
    expect(await paintedTextContrast(count)).toBeGreaterThanOrEqual(4.5);
  else expect(await textContrast(count)).toBeGreaterThanOrEqual(4.5);
  await page.screenshot({ path: testInfo.outputPath('live-region.png') });
});

test('LiveRegion reads the same words again for a new key, from a hidden region', async ({
  page,
}) => {
  await openSection(page);
  const section = page.locator('#live-region');
  const copy = section.getByRole('button', {
    name: /^(Copy ring code|Copied)$/,
  });
  const hidden = section.locator('.sw-sr-only[role="status"]');
  await expect(hidden).toHaveCount(1);
  await expect(hidden).toHaveText('');
  await copy.click();
  await expect(copy).toHaveText('Copied');
  await expect(hidden).toHaveText('Ring code copied');
  await hidden.evaluate((region) => {
    (region.firstElementChild as HTMLElement).dataset.first = '';
  });
  await copy.click();
  await expect(hidden).toHaveText('Ring code copied');
  await expect(hidden.locator('[data-first]')).toHaveCount(0);
  // Visually hidden: a 1 px clipped box, still in the accessibility tree.
  const box = (await hidden.boundingBox())!;
  expect(box.width).toBeLessThanOrEqual(1);
  expect(box.height).toBeLessThanOrEqual(1);
});

test('LiveRegion assertive is an alert, and the section passes axe', async ({
  page,
}) => {
  await openSection(page);
  const section = page.locator('#live-region');
  const alert = section.getByRole('alert');
  await expect(alert).toHaveText('');
  await expect(alert).toHaveAttribute('aria-live', 'assertive');
  await section.getByRole('button', { name: 'Send the count' }).click();
  await expect(alert).toHaveText('Add a species before you send');
  // The demo, not the gallery's own code block.
  expect(await axeViolations(page, '#live-region .sw-card')).toEqual([]);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
