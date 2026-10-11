import { expect, test } from '@playwright/test';

test('a top-end Toast card shows its title, detail and action, holds on hover, and closes on its action', async ({
  page,
}, testInfo) => {
  await page.goto('/#toast');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const example = page.getByTestId('toast-card');
  await example.getByRole('button', { name: 'Save the heron count' }).click();

  const card = page
    .getByRole('status')
    .filter({ hasText: 'Heron count saved' });
  await expect(card).toBeVisible();
  await expect(card.locator('.sw-toast-title')).toHaveText('Heron count saved');
  await expect(card.locator('.sw-toast-detail')).toHaveText(
    '12 herons · 2 nests',
  );
  await expect(card.locator('.sw-toast-remaining')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  // In the top end corner, a space-4 gutter from the top and the end, once
  // it has dropped in.
  await card.evaluate((node) =>
    Promise.all(node.getAnimations().map((animation) => animation.finished)),
  );
  const viewport = page.viewportSize()!;
  const box = (await card.boundingBox())!;
  expect(Math.round(box.y)).toBe(16);
  expect(Math.round(viewport.width - (box.x + box.width))).toBe(16);
  expect(box.x).toBeGreaterThanOrEqual(16);
  await card.screenshot({ path: testInfo.outputPath('toast-card.png') });

  // The pointer on it holds the line where it is.
  await card.hover();
  await expect(card).toHaveClass(/sw-toast-paused/);
  const line = card.locator('.sw-toast-remaining');
  const scale = () =>
    line.evaluate((node) => getComputedStyle(node, '::after').transform);
  const held = await scale();
  await page.waitForTimeout(600);
  expect(await scale()).toBe(held);
  await expect(line).toHaveCSS('height', '4px');

  await card.getByRole('button', { name: 'Open' }).click();
  await expect(card).toBeHidden();
  await expect(example.getByText('Count opened: 1')).toBeVisible();
});
