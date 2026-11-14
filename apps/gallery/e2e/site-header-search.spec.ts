import { expect, test, type Page } from '@playwright/test';

import { axeViolations } from './axe-scan.js';
import { textContrast } from './contrast.js';

/*
 * FutMas F-024 owner review: the header's search. A field in the bar from
 * lg with results dropping down under it; below lg a search button that
 * opens the same form over the whole window as a native popover. The
 * gallery's stand-in script fills the results, as a site's script would.
 */
const schemes = ['light', 'dark'] as const;

async function openIn(page: Page, scheme: (typeof schemes)[number]) {
  await page.addInitScript((value) => {
    window.localStorage.setItem('scalewing-gallery-color-scheme', value);
  }, scheme);
  await page.goto('/#site-header-search');
  await expect(page.locator(`[data-theme='${scheme}']`).first()).toBeVisible();
}

const header = (page: Page) =>
  page.locator('#site-header-search header.sw-site-header').first();

const crowded = (page: Page) =>
  page.locator(
    '#site-header-search [data-sample="crowded"] header.sw-site-header',
  );

/** How many lines an element's words take. */
async function lineCount(page: Page, selector: string): Promise<number> {
  return page.evaluate((target) => {
    const node = document.querySelector(target)!;
    const range = document.createRange();
    range.selectNodeContents(node);
    const tops = new Set(
      [...range.getClientRects()]
        .filter((rect) => rect.width > 0)
        .map((rect) => Math.round(rect.top)),
    );
    return tops.size;
  }, selector);
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

for (const scheme of schemes) {
  test(`on a laptop the search is a field in the bar whose results drop down, in ${scheme}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-es', 'the phone has a button');
    await openIn(page, scheme);
    const bar = header(page);
    await expect(bar.getByRole('button', { name: 'Search' })).toBeHidden();
    await expect(
      bar.getByRole('button', { name: 'Close search' }),
    ).toBeHidden();
    const field = bar.getByRole('searchbox', {
      name: 'Search the field guide',
    });
    await expect(field).toBeVisible();
    // The field sits after the destinations, before the bar's end.
    const nav = await bar.locator('nav.sw-site-header-nav').boundingBox();
    const box = await field.boundingBox();
    expect(box!.x).toBeGreaterThan(nav!.x + nav!.width);

    await field.fill('heron');
    const results = bar.locator('.sw-site-header-search-results');
    await expect(results).toBeVisible();
    await expect(results.getByRole('link')).toHaveCount(2);
    const first = results.getByRole('link', { name: /Herons and egrets/ });
    await expect(first).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath(`search-laptop-${scheme}.png`),
    });
    // The panel lies over the page under the field, not in the bar's flow.
    const panel = await results.boundingBox();
    const under = await field.boundingBox();
    expect(panel!.y).toBeGreaterThan(under!.y + under!.height);
    if (testInfo.project.name !== 'forced-colors') {
      expect(
        await textContrast(first.locator('.sw-site-header-search-result-text')),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        await textContrast(bar.locator('.sw-site-header-search-status')),
      ).toBeGreaterThanOrEqual(4.5);
    }
    // Forced colours repaint every colour, so contrast is the system's.
    if (testInfo.project.name !== 'forced-colors')
      expect(
        await axeViolations(page, '#site-header-search .sw-site-header'),
      ).toEqual([]);

    await field.fill('');
    await expect(results).toBeHidden();
  });

  test(`on a phone the search button opens the search over the window, in ${scheme}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-es', 'the phone’s layout');
    await openIn(page, scheme);
    const bar = header(page);
    const field = bar.getByRole('searchbox', {
      name: 'Search the field guide',
    });
    await expect(field).toBeHidden();
    const open = bar.getByRole('button', { name: 'Search' });
    await expect(open).toBeVisible();
    const button = await open.boundingBox();
    expect(button!.height).toBeGreaterThanOrEqual(44);
    expect(button!.width).toBeGreaterThanOrEqual(44);

    await open.tap();
    await expect(field).toBeVisible();
    await expect(field).toBeFocused();
    const panel = bar.locator('.sw-site-header-search');
    const viewport = page.viewportSize()!;
    const box = await panel.boundingBox();
    expect(box).toMatchObject({ x: 0, y: 0, width: viewport.width });
    expect(box!.height).toBeGreaterThanOrEqual(viewport.height - 1);
    // An iPhone zooms into a field under 16 px.
    expect(
      await field.evaluate((input) =>
        parseFloat(getComputedStyle(input).fontSize),
      ),
    ).toBeGreaterThanOrEqual(16);

    await field.fill('heron');
    await expect(
      bar.locator('.sw-site-header-search-results').getByRole('link'),
    ).toHaveCount(2);
    expect(
      await axeViolations(page, '#site-header-search .sw-site-header-search'),
    ).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`search-phone-${scheme}.png`),
    });

    // Cancel, a word beside the field's own clear ✕, closes the search.
    const cancel = bar.getByRole('button', { name: 'Cancel', exact: true });
    await expect(cancel).toHaveText('Cancel');
    expect(await cancel.getAttribute('aria-label')).toBeNull();
    const cancelBox = await cancel.boundingBox();
    expect(cancelBox!.height).toBeGreaterThanOrEqual(44);
    expect(cancelBox!.width).toBeGreaterThanOrEqual(44);
    const look = await cancel.evaluate((node) => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--sw-color-accent)';
      node.append(probe);
      const accent = getComputedStyle(probe).color;
      probe.remove();
      return { color: getComputedStyle(node).color, accent };
    });
    expect(look.color).toBe(look.accent);
    expect(await textContrast(cancel)).toBeGreaterThanOrEqual(4.5);
    await expect(bar.getByRole('button', { name: 'Close search' })).toHaveCount(
      0,
    );
    await cancel.tap();
    await expect(field).toBeHidden();
    await open.tap();
    await expect(field).toBeVisible();
    // A search field's first Escape clears its words; the next one closes.
    await field.fill('');
    await page.keyboard.press('Escape');
    await expect(field).toBeHidden();
  });
}

test('without a cancel word the open search keeps its named close glyph', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-es', 'the phone’s layout');
  await openIn(page, 'light');
  const bar = crowded(page);
  await bar.getByRole('button', { name: 'Search' }).tap();
  const field = bar.getByRole('searchbox', { name: 'Search the field guide' });
  await expect(field).toBeVisible();
  const close = bar.getByRole('button', { name: 'Close search' });
  await expect(close).toBeVisible();
  await expect(close).toHaveText('');
  await expect(close.locator('svg')).toHaveCount(1);
  await close.tap();
  await expect(field).toBeHidden();
});

test('on a crowded bar the field gives up its width before any label wraps', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-es', 'the bar from lg');
  await page.setViewportSize({ width: 1700, height: 900 });
  await openIn(page, 'light');
  const bar = crowded(page);
  const field = bar.locator('.sw-site-header-search');
  const sample = '#site-header-search [data-sample="crowded"]';
  const words = [
    ...[1, 2, 3].map(
      (n) => `${sample} .sw-site-header-nav li:nth-child(${n}) a`,
    ),
    `${sample} .sw-site-header-actions a`,
  ];
  // With room to spare the field keeps its full 16rem, the rest of the
  // room going to its start margin.
  await page.locator(sample).evaluate((node) => (node.style.width = '1600px'));
  expect(Math.round((await field.boundingBox())!.width)).toBe(256);
  const spare = await field.evaluate((node) =>
    parseFloat(getComputedStyle(node).marginInlineStart),
  );
  // The bar stops at its max width; it would fit the field at 16rem with
  // no room over at this width.
  const bar1600 = (await bar.locator('.sw-site-header-bar').boundingBox())!;
  const snug = bar1600.width - spare;
  // A bar a little short of room, then one that leaves the field its floor:
  // the field gives way, and no destination or action wraps.
  for (const [width, expected] of [
    [snug - 48, 208],
    [snug - 94, 162],
  ] as const) {
    await page
      .locator(sample)
      .evaluate((node, px) => (node.style.width = `${px}px`), width);
    const box = await field.boundingBox();
    expect(Math.abs(box!.width - expected)).toBeLessThanOrEqual(1);
    for (const selector of words)
      expect(await lineCount(page, selector), `${selector} at ${width}`).toBe(
        1,
      );
  }
  await page.locator(sample).screenshot({
    path: testInfo.outputPath('search-crowded.png'),
  });
});
