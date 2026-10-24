import { expect, test } from '@playwright/test';

test('EmptyState is a centred dashed panel that fits a page column and a card', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#empty-state');
  const section = page.locator('#empty-state');
  const inPage = section.getByTestId('empty-state-page');
  const panel = inPage.locator('.sw-empty-state');
  await expect(panel).toHaveCSS('border-top-style', 'dashed');
  await expect(panel).toHaveCSS('text-align', 'center');

  const title = section.getByRole('heading', {
    level: 2,
    name: 'No nests counted on the north island yet',
  });
  await expect(title).toBeVisible();
  // The glyph is decorative.
  await expect(panel.locator('.sw-empty-state-icon')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  // Centred: the glyph and the title share the panel's middle.
  const box = (await panel.boundingBox())!;
  const middle = box.x + box.width / 2;
  for (const part of [panel.locator('.sw-empty-state-icon'), title]) {
    const partBox = (await part.boundingBox())!;
    expect(
      Math.abs(partBox.x + partBox.width / 2 - middle),
    ).toBeLessThanOrEqual(1);
  }
  // It fills its column.
  const column = (await inPage.boundingBox())!;
  expect(Math.round(box.width)).toBe(Math.round(column.width));

  // The actions wrap inside the panel and never widen the page.
  const buttons = panel.locator('.sw-empty-state-actions').getByRole('button');
  await expect(buttons).toHaveCount(2);
  for (const button of await buttons.all()) {
    const b = (await button.boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(box.x);
    expect(b.x + b.width).toBeLessThanOrEqual(box.x + box.width);
    expect(b.height).toBeGreaterThanOrEqual(
      testInfo.project.name === 'mobile-es' ? 44 : 0,
    );
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  // Inside a card under its own heading: an h3, inside the card's padding.
  const inCard = section.getByTestId('empty-state-card');
  await expect(
    inCard.getByRole('heading', { level: 3, name: 'No otters seen this week' }),
  ).toBeVisible();
  const card = (await inCard.boundingBox())!;
  const cardPanel = (await inCard.locator('.sw-empty-state').boundingBox())!;
  expect(cardPanel.x + cardPanel.width).toBeLessThanOrEqual(
    card.x + card.width + 0.5,
  );

  await section.screenshot({ path: testInfo.outputPath('empty-state.png') });
});

test('EmptyState stays centred in right-to-left', async ({ page }) => {
  await page.goto('/#empty-state');
  await page.evaluate(() =>
    document.documentElement.setAttribute('dir', 'rtl'),
  );
  const panel = page.getByTestId('empty-state-page').locator('.sw-empty-state');
  const box = (await panel.boundingBox())!;
  const title = (await panel.getByRole('heading').boundingBox())!;
  expect(
    Math.abs(title.x + title.width / 2 - (box.x + box.width / 2)),
  ).toBeLessThanOrEqual(1);
});
