import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';

test('TableRow rule="after" draws a 2 px grey cut under a row', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#table');
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', {
    name: 'Nesting sites by nests',
    exact: true,
  });
  await table.scrollIntoViewIfNeeded();

  const cut = table.getByRole('row', { name: '3 Willow carr 33' });
  const next = table.getByRole('row', { name: '4 Shingle spit 27' });
  for (const cell of await cut.locator('th, td').all()) {
    const [width, style] = await cell.evaluate((node) => {
      const css = getComputedStyle(node);
      return [css.borderBottomWidth, css.borderBottomStyle];
    });
    expect(width).toBe('2px');
    expect(style).toBe('solid');
  }
  // The rows around it keep the 1 px hairline.
  for (const row of [next, table.getByRole('row', { name: '2 Salt marsh 38' })])
    expect(
      await row
        .locator('td')
        .first()
        .evaluate((node) => getComputedStyle(node).borderBottomWidth),
    ).toBe('1px');

  const colour = await cut
    .locator('td')
    .first()
    .evaluate((node) => getComputedStyle(node).borderBottomColor);
  if (forced) {
    const text = await cut
      .locator('td')
      .first()
      .evaluate((node) => getComputedStyle(node).color);
    expect(colour).toBe(text);
  } else {
    // The muted grey, stronger than the border hairline.
    const [muted, border] = await cut
      .locator('td')
      .first()
      .evaluate((node) => {
        const probe = document.createElement('span');
        node.append(probe);
        probe.style.color = 'var(--sw-color-muted)';
        const m = getComputedStyle(probe).color;
        probe.style.color = 'var(--sw-color-border)';
        const b = getComputedStyle(probe).color;
        probe.remove();
        return [m, b];
      });
    expect(colour).toBe(muted);
    expect(colour).not.toBe(border);
  }

  // Compact density keeps the rule.
  expect(
    await page
      .getByRole('table', { name: 'Nesting sites by nests, compact' })
      .getByRole('row', { name: '3 Willow carr 33' })
      .locator('td')
      .first()
      .evaluate((node) => getComputedStyle(node).borderBottomWidth),
  ).toBe('2px');

  await expect(
    page
      .getByText('The line under 3rd place marks the sites that get a ranger.')
      .first(),
  ).toBeVisible();
  expect(
    await axeViolations(page, 'table[aria-label="Nesting sites by nests"]'),
  ).toEqual([]);
  await table.screenshot({ path: testInfo.outputPath('table-row-rule.png') });
});
