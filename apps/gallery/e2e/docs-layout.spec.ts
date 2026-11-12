import { expect, test, type Locator, type Page } from '@playwright/test';

import { axeViolations } from './axe-scan.js';
import { systemColor, textContrast } from './contrast.js';

/*
 * FutMas F-024-S03: a docs page's frame. Three widths: a phone (the
 * navigation is a disclosure at the top of the article), a laptop from lg
 * (the side navigation, no aside) and a wide window from 80rem (the aside
 * at the end). Only one copy of the navigation is ever displayed, so only
 * one "Guide" landmark is in the accessibility tree.
 */
const laptop = { width: 1100, height: 900 };
const wide = { width: 1440, height: 900 };

const themes = [
  { palette: 'cerulean', scheme: 'light' },
  { palette: 'cerulean', scheme: 'dark' },
  { palette: 'ink', scheme: 'light' },
  { palette: 'harvest', scheme: 'dark' },
] as const;

type Theme = (typeof themes)[number];

async function openIn(page: Page, theme: Theme): Promise<void> {
  await page.addInitScript(
    ([palette, scheme]) => {
      window.localStorage.setItem('scalewing-gallery-palette', palette);
      window.localStorage.setItem('scalewing-gallery-color-scheme', scheme);
    },
    [theme.palette, theme.scheme] as const,
  );
  await page.goto('/#docs-layout');
  await expect(
    page.locator(`[data-theme='${theme.scheme}']`).first(),
  ).toBeVisible();
}

const frame = (page: Page) => page.locator('#docs-layout .sw-docs-layout');

/** The navigation landmarks named Guide that assistive technology sees. */
const guideNavs = (page: Page) =>
  frame(page).getByRole('navigation', { name: 'Guide' });

async function expectReadable(words: Locator[]): Promise<void> {
  for (const word of words)
    expect(await textContrast(word)).toBeGreaterThanOrEqual(4.5);
}

for (const theme of themes) {
  test(`DocsLayout on a phone is a disclosure that opens the grouped links, in ${theme.palette} ${theme.scheme}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-es', 'the phone’s layout');
    await openIn(page, theme);
    const layout = frame(page);
    await expect(layout.locator('.sw-docs-layout-side')).toBeHidden();
    await expect(layout.locator('.sw-docs-layout-aside')).toBeHidden();
    const details = layout.locator('details.sw-docs-layout-disclosure');
    const summary = details.locator('summary');
    await expect(summary).toBeVisible();
    await expect(summary).toHaveText('Browse the guide');
    expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    // The article fills the width under the summary.
    const article = layout.locator('article');
    expect((await article.boundingBox())!.y).toBeGreaterThan(
      (await summary.boundingBox())!.y,
    );
    await expect(guideNavs(page)).toHaveCount(0);

    await summary.click();
    await expect(details).toHaveAttribute('open', '');
    await expect(guideNavs(page)).toHaveCount(1);
    const nav = guideNavs(page);
    const current = nav.getByRole('link', { name: 'Your first count' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    const herons = nav.getByRole('link', { name: 'Herons and egrets' });
    expect((await herons.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const birds = nav.getByRole('list', { name: 'Birds' });
    await expect(birds.getByRole('listitem')).toHaveCount(3);

    const width = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(width).toBeLessThanOrEqual(0);
    expect(await axeViolations(page, '#docs-layout .sw-docs-layout')).toEqual(
      [],
    );
    await expectReadable([
      summary,
      current,
      herons,
      nav.getByText('Habitats', { exact: true }),
    ]);
    await page.screenshot({
      path: testInfo.outputPath(`docs-layout-phone-${theme.scheme}.png`),
    });

    await summary.click();
    await expect(details).not.toHaveAttribute('open');
  });

  test(`DocsLayout from lg shows the side navigation and hides the disclosure and the aside, in ${theme.palette} ${theme.scheme}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-en', 'one wide project');
    await page.setViewportSize(laptop);
    await openIn(page, theme);
    const layout = frame(page);
    const side = layout.locator('.sw-docs-layout-side');
    await expect(side).toBeVisible();
    await expect(
      layout.locator('details.sw-docs-layout-disclosure'),
    ).toBeHidden();
    await expect(layout.locator('.sw-docs-layout-aside')).toBeHidden();
    await expect(guideNavs(page)).toHaveCount(1);
    await expect(
      layout.getByRole('navigation', { name: 'On this page' }),
    ).toHaveCount(0);

    const nav = guideNavs(page);
    const current = nav.getByRole('link', { name: 'Your first count' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(current).toHaveCSS('font-weight', '600');
    // The side column at the start, the article beside it (the side
    // column is sticky, so only their inline positions are compared).
    const sideBox = (await side.boundingBox())!;
    const articleBox = (await layout.locator('article').boundingBox())!;
    expect(articleBox.x).toBeGreaterThan(sideBox.x + sideBox.width);
    expect(Math.round(sideBox.width)).toBe(240);

    expect(await axeViolations(page, '#docs-layout .sw-docs-layout')).toEqual(
      [],
    );
    await expectReadable([
      current,
      nav.getByRole('link', { name: 'Ducks' }),
      nav.getByText('Start here', { exact: true }),
    ]);
    await layout.screenshot({
      path: testInfo.outputPath(`docs-layout-laptop-${theme.scheme}.png`),
    });
  });

  test(`DocsLayout from 80rem adds the aside column at the end, in ${theme.palette} ${theme.scheme}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-en', 'one wide project');
    await page.setViewportSize(wide);
    await openIn(page, theme);
    const layout = frame(page);
    const aside = layout.locator('.sw-docs-layout-aside');
    await expect(aside).toBeVisible();
    const onThisPage = layout.getByRole('navigation', {
      name: 'On this page',
    });
    await expect(onThisPage).toHaveCount(1);
    await expect(guideNavs(page)).toHaveCount(1);
    const [sideBox, articleBox, asideBox] = await Promise.all(
      [
        layout.locator('.sw-docs-layout-side'),
        layout.locator('article'),
        aside,
      ].map(async (part) => (await part.boundingBox())!),
    );
    expect(articleBox.x).toBeGreaterThan(sideBox.x + sideBox.width);
    expect(asideBox.x).toBeGreaterThan(articleBox.x + articleBox.width);
    expect(articleBox.width).toBeLessThanOrEqual(46 * 16);

    expect(await axeViolations(page, '#docs-layout .sw-docs-layout')).toEqual(
      [],
    );
    await expectReadable([
      onThisPage.getByRole('link', { name: 'Before you go' }),
    ]);
    await layout.screenshot({
      path: testInfo.outputPath(`docs-layout-wide-${theme.scheme}.png`),
    });
  });
}

test('DocsLayout’s disclosure opens and closes with script off', async ({
  browser,
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-es', 'the phone’s layout');
  // The gallery is a script app: its rendered page, styles included, is
  // loaded again with script off, as a server-rendered docs page would be.
  await page.goto('/#docs-layout');
  await expect(frame(page)).toBeVisible();
  const html = await page.content();
  const context = await browser.newContext({
    hasTouch: true,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const offline = await context.newPage();
  await offline.setContent(html.replace(/<script[\s\S]*?<\/script>/g, ''));
  const details = frame(offline).locator('details.sw-docs-layout-disclosure');
  const summary = details.locator('summary');
  await expect(details).not.toHaveAttribute('open');
  await summary.click();
  await expect(details).toHaveAttribute('open', '');
  await expect(
    guideNavs(offline).getByRole('link', { name: 'North marsh' }),
  ).toBeVisible();
  await summary.focus();
  await offline.keyboard.press('Enter');
  await expect(details).not.toHaveAttribute('open');
  await context.close();
});

test('DocsLayout in forced colours draws links as LinkText and the current one with a Highlight edge', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'forced-colors', 'forced colours only');
  await page.setViewportSize(laptop);
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#docs-layout');
  const nav = guideNavs(page);
  const current = nav.getByRole('link', { name: 'Your first count' });
  await expect(current).toBeVisible();
  const [linkText, highlight] = await Promise.all([
    systemColor(page, 'LinkText'),
    systemColor(page, 'Highlight'),
  ]);
  await expect(nav.getByRole('link', { name: 'Ducks' })).toHaveCSS(
    'color',
    linkText,
  );
  await expect(current).toHaveCSS('border-top-color', highlight);
});
