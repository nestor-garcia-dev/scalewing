import { expect, test } from '@playwright/test';

// Headless Chromium hides scrollbars; show them, 15 px wide, so the viewport
// a popover may use is narrower than innerWidth and 100vw. This forces its
// own worker, so it lives in its own file.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

// space-2 from the viewport edges.
const inset = 8;

// The project's forcedColors option alone does not reach the page's media
// queries, so the forced-colors project emulates it as the other specs do.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(true);
});

test('ActionMenu keeps its inset from the scrollbar, not the window edge', async ({
  page,
}) => {
  await page.goto('/#action-menu');
  await page.addStyleTag({
    content:
      '::-webkit-scrollbar { width: 15px; height: 15px; } ::-webkit-scrollbar-thumb { background: gray; }',
  });
  const { client, inner } = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    inner: window.innerWidth,
  }));
  expect(client).toBe(inner - 15);
  const section = page.locator('#action-menu');

  for (const name of [
    'Acciones del avistamiento',
    'More actions for Snow leopard',
  ]) {
    const trigger = section.getByRole('button', { name });
    await trigger.evaluate((node) => node.scrollIntoView({ block: 'center' }));
    await trigger.click();
    const menu = page.getByRole('menu', { name });
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    expect(box?.x).toBeGreaterThanOrEqual(inset);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
      client - inset,
    );
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  }
});
