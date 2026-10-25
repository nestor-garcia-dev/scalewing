import { createRequire } from 'node:module';

import { expect, test, type Page } from '@playwright/test';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

async function axeViolations(page: Page, contrast: boolean) {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return page.evaluate(
    (withContrast) =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [['#site-header .sw-site-header']] },
          {
            resultTypes: ['violations'],
            rules: { 'color-contrast': { enabled: withContrast } },
          },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    contrast,
  );
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

const header = (page: Page) =>
  page.locator('#site-header header.sw-site-header');

test('SiteHeader shows a row of destinations on a wide window, the current one marked', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-es', 'the phone has the menu');
  await page.goto('/#site-header');
  const bar = header(page);
  const nav = bar.locator('nav.sw-site-header-nav');
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Heron hide' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(
    bar.getByRole('link', { name: 'Contact the rangers' }),
  ).toBeVisible();
  await expect(bar.locator('summary')).toBeHidden();
  expect(
    await axeViolations(page, testInfo.project.name !== 'forced-colors'),
  ).toEqual([]);
  await bar.screenshot({ path: testInfo.outputPath('site-header-wide.png') });
});

test('SiteHeader opens its menu by touch and keyboard, closes with Escape and traps no focus', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-es', 'the menu is the phone’s');
  await page.goto('/#site-header');
  const bar = header(page);
  await expect(bar.locator('nav.sw-site-header-nav')).toBeHidden();
  // The menu button is the native details' summary, named by its state.
  const details = bar.locator('details.sw-site-header-menu');
  const button = details.locator('summary');
  await expect(button).toBeVisible();
  await expect(button).toHaveAccessibleName('Open the menu');
  expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expect(bar.getByRole('link', { name: 'Español' })).toBeVisible();

  await button.tap();
  await expect(details).toHaveAttribute('open', '');
  await expect(button).toHaveAccessibleName('Close the menu');
  const menu = bar.locator('nav.sw-site-header-menu-nav');
  await expect(menu.getByRole('link', { name: 'Heron hide' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(
    bar.getByRole('link', { name: 'Contact the rangers' }),
  ).toBeVisible();
  expect(await axeViolations(page, true)).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('site-header-menu.png') });

  // A tap on the button closes it again.
  await button.tap();
  await expect(details).not.toHaveAttribute('open');

  // Enter opens it from the keyboard; Escape closes it, focus back on the button.
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await menu.getByRole('link', { name: 'Marsh' }).focus();
  await page.keyboard.press('Escape');
  await expect(details).not.toHaveAttribute('open');
  await expect(button).toBeFocused();

  // Tab walks through the open menu and out of it, which closes it.
  await page.keyboard.press('Enter');
  for (let step = 0; step < 6; step += 1) await page.keyboard.press('Tab');
  await expect(bar.getByRole('link', { name: 'Sign in' })).toBeFocused();
  await expect(details).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(details).not.toHaveAttribute('open');
});

test('SiteHeader’s menu opens and closes with script off', async ({
  browser,
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-es', 'the menu is the phone’s');
  // The gallery is a script app: its rendered page, styles included, is
  // loaded again with script off, as a server-rendered page would be.
  await page.goto('/#site-header');
  await expect(header(page)).toBeVisible();
  const html = await page.content();
  const context = await browser.newContext({
    hasTouch: true,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const offline = await context.newPage();
  await offline.setContent(html.replace(/<script[\s\S]*?<\/script>/g, ''));
  const bar = offline.locator('#site-header header.sw-site-header');
  const details = bar.locator('details.sw-site-header-menu');
  const button = details.locator('summary');
  await button.tap();
  await expect(details).toHaveAttribute('open', '');
  await expect(
    bar.locator('nav.sw-site-header-menu-nav').getByRole('link', {
      name: 'Marsh',
    }),
  ).toBeVisible();
  await button.focus();
  await offline.keyboard.press('Enter');
  await expect(details).not.toHaveAttribute('open');
  await context.close();
});

test('SiteHeader’s skip link is hidden until focused, then shows over the bar’s start and jumps to its target', async ({
  page,
}) => {
  await page.goto('/#site-header');
  const bar = header(page);
  const skip = bar.getByRole('link', { name: 'Skip to content' });
  const unfocused = (await skip.boundingBox())!;
  expect(unfocused.width).toBeLessThanOrEqual(1);
  expect(unfocused.height).toBeLessThanOrEqual(1);

  // It is the header's first stop: Tab from the brand goes back to it.
  await bar.getByRole('link', { name: 'Wetland Trust' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(skip).toBeFocused();
  const shown = (await skip.boundingBox())!;
  const barBox = (await bar.boundingBox())!;
  const brand = (await bar
    .getByRole('link', { name: 'Wetland Trust' })
    .boundingBox())!;
  expect(shown.height).toBeGreaterThanOrEqual(44);
  expect(shown.y).toBeGreaterThanOrEqual(barBox.y);
  expect(shown.y + shown.height).toBeLessThanOrEqual(barBox.y + barBox.height);
  expect(Math.abs(shown.x - brand.x)).toBeLessThanOrEqual(1);
  expect(
    await skip.evaluate((link) => getComputedStyle(link).outlineStyle),
  ).toBe('solid');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#site-header-content$/);
  await expect(page.locator('#site-header-content')).toBeFocused();
});

test('A sticky SiteHeader pads the document’s scroll past the bar; one in the page flow does not', async ({
  page,
}, testInfo) => {
  await page.goto('/#site-header');
  const padding = () =>
    page.evaluate(
      () => getComputedStyle(document.documentElement).scrollPaddingTop,
    );
  expect(await padding()).toBe('auto');
  // The gallery's header stays in the page flow so the catalog does not
  // scroll under it; making it sticky here is deliberate.
  await header(page).evaluate((bar) =>
    bar.classList.add('sw-site-header-sticky'),
  );
  // The bar (56 px, 72 px from lg), its hairline and a 12 px gap.
  expect(await padding()).toBe(
    testInfo.project.name === 'mobile-es' ? '69px' : '85px',
  );
});

test('SiteHeader hides its compact actions while the menu is open', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-es', 'the menu is the phone’s');
  await page.goto('/#site-header');
  const bar = header(page);
  const compact = bar.locator('.sw-site-header-compact-actions');
  const button = bar.locator('details.sw-site-header-menu > summary');
  await expect(compact.getByRole('link', { name: 'Español' })).toBeVisible();
  await button.tap();
  await expect(compact.getByRole('link', { name: 'Español' })).toBeHidden();
  await expect(button).toBeVisible();
  await expect(bar.getByRole('link', { name: 'Wetland Trust' })).toBeVisible();
  await button.tap();
  await expect(compact.getByRole('link', { name: 'Español' })).toBeVisible();
});
