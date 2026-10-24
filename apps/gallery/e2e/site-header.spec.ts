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
