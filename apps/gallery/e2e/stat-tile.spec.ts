import { expect, test } from '@playwright/test';

import { textContrast } from './contrast.js';

test('StatTile fills the primary figure and tones the others', async ({
  page,
}, testInfo) => {
  await page.goto('/#stat-tile');
  const section = page.locator('#stat-tile');
  const primary = section.locator('.sw-stat-tile-primary');
  await expect(primary).toContainText('Total sightings');
  await expect(primary).toContainText('1,284');
  await expect(primary).toContainText('42 species');
  const fill = (element: HTMLElement) =>
    getComputedStyle(element).backgroundColor;
  const primaryFill = await primary.evaluate(fill);
  const forest = section.locator('.sw-stat-tile', { hasText: 'Forest' });
  expect(await forest.evaluate(fill)).not.toBe(primaryFill);
  const colorOf = (text: string) =>
    section
      .locator('.sw-stat-tile-value', { hasText: text })
      .evaluate((node) => getComputedStyle(node).color);
  const success = await colorOf('612');
  const danger = await colorOf('-3');
  const warning = await colorOf('27');
  expect(success).not.toBe(danger);
  expect(warning).not.toBe(danger);
  expect(warning).not.toBe(success);
  // Four tiles share one row on desktop and stack on a phone.
  const savanna = section.locator('.sw-stat-tile', { hasText: 'Savanna' });
  const forestBox = await forest.boundingBox();
  const savannaBox = await savanna.boundingBox();
  if (testInfo.project.name === 'mobile-es') {
    expect((savannaBox?.y ?? 0) > (forestBox?.y ?? 0)).toBe(true);
  } else {
    expect(Math.abs((savannaBox?.y ?? 0) - (forestBox?.y ?? 0))).toBeLessThan(
      2,
    );
  }
  await section.screenshot({ path: testInfo.outputPath('stat-tile.png') });
});

test('StatTile plain sits in a card, four in a row with hairlines between, two by two on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#stat-tile');
  const section = page.locator('#stat-tile');
  const plain = section.locator('.sw-stat-tile-plain');
  await expect(plain).toHaveCount(4);
  const first = plain.first();
  await expect(first).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(first).toHaveCSS('border-top-width', '0px');
  await expect(first).toHaveCSS('padding-top', '0px');
  // The nearest card around the tiles.
  const card = first.locator(
    'xpath=ancestor::*[contains(concat(" ", @class, " "), " sw-card ")][1]',
  );
  const [cardBox, tileBox] = await Promise.all([
    card.boundingBox(),
    first.boundingBox(),
  ]);
  // The card's padding, not the tile's, insets the figure.
  expect((tileBox?.x ?? 0) - (cardBox?.x ?? 0)).toBeGreaterThan(20);

  const phone = testInfo.project.name === 'mobile-es';
  const ys = await plain.evaluateAll((tiles) =>
    tiles.map((tile) => Math.round(tile.getBoundingClientRect().y)),
  );
  if (phone) {
    expect(ys[0]).toBe(ys[1]);
    expect(ys[2]).toBe(ys[3]);
    expect(ys[2]).toBeGreaterThan(ys[0] ?? 0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    ).toBe(0);
  } else expect(new Set(ys).size).toBe(1);
  // A hairline between neighbours in a row: three on a desktop, one per row on a phone.
  const hairlines = card.locator('.sw-separator-vertical');
  const visible = await hairlines.evaluateAll(
    (lines) =>
      lines.filter((line) => line.getBoundingClientRect().height > 0).length,
  );
  expect(visible).toBe(phone ? 2 : 3);
  await card.screenshot({ path: testInfo.outputPath('stat-tile-plain.png') });

  // In the dark theme the plain tiles stay on the card, their toned values
  // and muted words readable.
  if (testInfo.project.name !== 'forced-colors') {
    await page.getByRole('radio', { name: 'Dark' }).check();
    await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
    await expect(first).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    for (const text of ['−6', '+21'])
      expect(
        await textContrast(
          card.locator('.sw-stat-tile-value', { hasText: text }),
        ),
      ).toBeGreaterThanOrEqual(4.5);
    expect(
      await textContrast(card.locator('.sw-stat-tile-caption').first()),
    ).toBeGreaterThanOrEqual(4.5);
    await card.screenshot({
      path: testInfo.outputPath('stat-tile-plain-dark.png'),
    });
  }
});
