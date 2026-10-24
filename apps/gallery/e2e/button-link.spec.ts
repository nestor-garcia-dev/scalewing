import { expect, test } from '@playwright/test';

import { textContrast } from './contrast.js';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('ButtonLink is a link that looks like each Button variant and rings the current page', async ({
  page,
}, testInfo) => {
  await page.goto('/#button-link');
  const section = page.locator('#button-link');
  const contact = section.getByRole('link', { name: 'Contact the rangers' });
  await expect(contact).toHaveAttribute('href', '#button-link');
  const box = (await contact.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44);
  await expect(contact).toHaveCSS('text-decoration-line', 'none');

  const current = section.getByRole('link', { name: 'Heron count' });
  await expect(current).toHaveAttribute('aria-current', 'page');

  const full = section.getByRole('link', { name: 'Join the spring count' });
  const sectionBox = (await section
    .locator('.sw-stack')
    .first()
    .boundingBox())!;
  expect(Math.round((await full.boundingBox())!.width)).toBe(
    Math.round(sectionBox.width),
  );

  if (testInfo.project.name !== 'forced-colors') {
    for (const name of ['Contact the rangers', 'Sign in', 'Visit the marsh']) {
      const link = section.getByRole('link', { name });
      expect(await textContrast(link), name).toBeGreaterThanOrEqual(4.5);
      const words = await link.evaluate(
        (element) => getComputedStyle(element).color,
      );
      // Hover keeps the variant's words, not the canvas link hover colour.
      await link.hover();
      await expect(link).toHaveCSS('color', words);
    }
    await expect(current).not.toHaveCSS('box-shadow', 'none');
    await expect(
      section.getByRole('link', { name: 'Owl count' }),
    ).not.toHaveCSS('box-shadow', 'none');
    await expect(contact).toHaveCSS('box-shadow', 'none');
  }

  // Focus from the keyboard draws the outline past the ring offset.
  await section.getByRole('link', { name: 'Field guide' }).focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(contact).toBeFocused();
  await expect(contact).not.toHaveCSS('outline-style', 'none');
  await section.screenshot({ path: testInfo.outputPath('button-link.png') });
});
