import { expect, test } from '@playwright/test';

test('sw-font-mono sets a textarea in the monospace face, its label and other controls in the page’s', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#field');
  const source = page.getByRole('textbox', { name: 'Field guide source' });
  const family = (locator: typeof source) =>
    locator.evaluate((node) => getComputedStyle(node).fontFamily);
  expect(await family(source)).toBe('ui-monospace, monospace');
  // A one-line text input takes it too.
  const band = page.getByRole('textbox', { name: 'Leg band code' });
  expect(await family(band)).toBe('ui-monospace, monospace');
  const species = page.getByRole('textbox', { name: 'Species name' });
  expect(await family(species)).toMatch(/^ui-sans-serif/);
  // The size is the control's own, as every text control's.
  const [mono, plain] = await Promise.all([
    source.evaluate((node) => getComputedStyle(node).fontSize),
    species.evaluate((node) => getComputedStyle(node).fontSize),
  ]);
  expect(mono).toBe(plain);
  const label = page.locator('#field').getByText('Field guide source', {
    exact: true,
  });
  expect(await family(label)).toMatch(/^ui-sans-serif/);
  await source.screenshot({ path: testInfo.outputPath('font-mono.png') });
});
