import { expect, test, type Page } from '@playwright/test';

const frame = '/?frame=app-shell';

async function open(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(frame);
  await expect(page.getByRole('main')).toBeVisible();
}

async function noSidewaysScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test('AppShell is a full pinned sidebar in a 1366 x 680 laptop window', async ({
  page,
}, testInfo) => {
  await open(page, 1366, 680);
  const nav = page.getByRole('navigation', { name: 'Field station' });
  await expect(nav).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
  const sidebar = page.locator('.sw-app-shell-sidebar');
  const box = (await sidebar.boundingBox())!;
  expect(Math.round(box.width)).toBe(240);
  expect(Math.round(box.height)).toBe(680);
  // Labels, a group caption and the count pill are drawn.
  const wetlands = nav.getByRole('link', {
    name: /^Wetlands ?3 sightings to check$/,
  });
  await expect(wetlands).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByText('Reserves')).toBeVisible();
  await expect(wetlands.locator('.sw-app-shell-label')).toBeVisible();
  // The whole nav, header and footer fit the window.
  await expect(page.getByText('Ranger Amaru Quispe')).toBeInViewport();
  const scrolls = await nav.evaluate(
    (element) => element.scrollHeight > element.clientHeight,
  );
  expect(scrolls).toBe(false);
  // The page scrolls with the document; the sidebar stays.
  await page.mouse.move(800, 400);
  await page.mouse.wheel(0, 600);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
  expect((await sidebar.boundingBox())!.y).toBe(0);
  const mainScrolls = await page
    .getByRole('main')
    .evaluate((element) => getComputedStyle(element).overflowY);
  expect(mainScrolls).toBe('visible');
  // A press moves the router, not the page.
  // A warning count is amber, apart from the danger pill.
  const rangers = nav.getByRole('link', {
    name: /^Rangers ?2 rotas to confirm$/,
  });
  const fill = (link: typeof rangers) =>
    link
      .locator('.sw-app-shell-count')
      .evaluate((pill) => getComputedStyle(pill).backgroundColor);
  expect(await fill(rangers)).not.toBe(await fill(wetlands));
  await rangers.click();
  await expect(page.getByRole('heading', { name: 'Rangers' })).toBeVisible();
  await noSidewaysScroll(page);
  await page.screenshot({ path: testInfo.outputPath('app-shell-full.png') });
});

test('AppShell is an icon rail with tooltips on an iPad in landscape', async ({
  page,
}, testInfo) => {
  await open(page, 1180, 820);
  const nav = page.getByRole('navigation', { name: 'Field station' });
  const sidebar = page.locator('.sw-app-shell-sidebar');
  const width = (await sidebar.boundingBox())!.width;
  expect(width).toBeGreaterThanOrEqual(68);
  expect(width).toBeLessThanOrEqual(70);
  const forests = nav.getByRole('link', { name: 'Forests' });
  // The label is hidden but names the link; the glyph is a 44 px target.
  const label = (await forests.locator('.sw-app-shell-label').boundingBox())!;
  expect(label.width).toBeLessThanOrEqual(1);
  const link = (await forests.boundingBox())!;
  expect(link.height).toBeGreaterThanOrEqual(44);
  expect(link.width).toBeGreaterThanOrEqual(43);
  // The rail's header replaces the full one.
  await expect(
    page.getByRole('button', { name: /Heron Marsh station/ }),
  ).toBeHidden();
  // Hover shows the label.
  await forests.hover();
  await expect(page.getByRole('tooltip', { name: 'Forests' })).toBeVisible();
  // The count is still drawn, on the glyph, and read.
  const dunes = nav.getByRole('link', { name: /^Coastal dunes ?12$/ });
  await expect(dunes.locator('.sw-app-shell-count')).toBeVisible();
  await noSidewaysScroll(page);
  await page.screenshot({ path: testInfo.outputPath('app-shell-rail.png') });
});

test('AppShell is a top bar with a menu drawer on an iPad in portrait', async ({
  page,
}, testInfo) => {
  await open(page, 820, 1180);
  await expect(page.locator('.sw-app-shell-sidebar')).toBeHidden();
  const menu = page.getByRole('button', { name: 'Open menu' });
  await expect(menu).toBeVisible();
  await menu.click();
  const drawer = page.getByRole('dialog', { name: 'Field station' });
  await expect(drawer).toBeVisible();
  const box = (await drawer.boundingBox())!;
  expect(box.x).toBe(0);
  expect(Math.round(box.height)).toBe(1180);
  await expect(
    drawer.getByRole('button', { name: 'Close menu' }),
  ).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath('app-shell-drawer.png') });
  // Escape closes it and focus returns to the menu button.
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(menu).toBeFocused();
  // A press outside closes it.
  await menu.click();
  await page.mouse.click(700, 600);
  await expect(drawer).toBeHidden();
  // Choosing a destination closes it and moves the page.
  await menu.click();
  await drawer.getByRole('link', { name: 'Forests' }).click();
  await expect(drawer).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Forests' })).toBeVisible();
  await noSidewaysScroll(page);
});

test('AppShell mirrors its drawer in right-to-left', async ({ page }) => {
  await open(page, 820, 1180);
  await page.evaluate(() =>
    document.documentElement.setAttribute('dir', 'rtl'),
  );
  await page.getByRole('button', { name: 'Open menu' }).click();
  const box = (await page
    .getByRole('dialog', { name: 'Field station' })
    .boundingBox())!;
  expect(Math.round(box.x + box.width)).toBe(820);
});
