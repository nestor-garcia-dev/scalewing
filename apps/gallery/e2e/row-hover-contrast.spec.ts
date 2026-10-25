import { expect, test, type Locator, type Page } from '@playwright/test';

import { axeViolations } from './axe-scan.js';
import {
  paintedTextContrast,
  systemColor,
  textContrast,
  tokenColor,
} from './contrast.js';

/*
 * FutMas F-010-S22 gap 1: muted words on a pressable row's hover fill
 * measured 4.14:1 (ink light). While a row shows the fill its muted parts
 * take the text colour. Axe at rest never sees the hover state, so these
 * checks hover first, then measure and scan. The palettes are the ones
 * whose muted colour falls lowest on the fill.
 */
const themes = [
  { palette: 'ink', scheme: 'light' },
  { palette: 'harvest', scheme: 'dark' },
  { palette: 'mocha', scheme: 'dark' },
  { palette: 'sunburst', scheme: 'dark' },
] as const;

type RowCase = {
  name: string;
  hash: string;
  row: (page: Page) => Locator;
  muted: (row: Locator) => Locator;
};

/** Axe's WCAG A and AA rules on one element, found by a mark set on it. */
async function scan(page: Page, element: Locator): Promise<string[]> {
  await element.evaluate((node) => node.setAttribute('data-hover-scan', ''));
  return axeViolations(page, '[data-hover-scan]');
}

const rows: RowCase[] = [
  {
    name: 'a FixtureRow link',
    hash: '#fixture-row',
    row: (page) =>
      page.locator('#fixture-row').getByRole('link', {
        name: 'Heron Marsh with Otter Pool, 8:00, Hide 1',
      }),
    muted: (row) => row.locator('.sw-fixture-end'),
  },
  {
    name: 'a FixtureRow with an action',
    hash: '#fixture-row',
    row: (page) =>
      page.locator('#fixture-row').getByRole('button', {
        name: 'Otter Pool vs Bittern Fen, 9:15, Hide 2',
      }),
    muted: (row) => row.locator('.sw-fixture-end'),
  },
  {
    name: 'a ListRow',
    hash: '#list-group',
    row: (page) =>
      page
        .getByRole('list', { name: 'Station' })
        .getByRole('button', { name: /^Riverbank den/ }),
    muted: (row) => row.locator('.sw-list-row-detail'),
  },
  {
    name: 'a pressable TableRow',
    hash: '#table',
    row: (page) =>
      page
        .getByRole('table', { name: 'Pick a species' })
        .getByRole('row')
        .filter({ hasText: 'Snow leopard' }),
    muted: (row) => row.getByRole('cell', { name: 'Alpine' }),
  },
];

async function openIn(
  page: Page,
  hash: string,
  theme: (typeof themes)[number],
): Promise<void> {
  await page.addInitScript(
    ([palette, scheme]) => {
      window.localStorage.setItem('scalewing-gallery-palette', palette);
      window.localStorage.setItem('scalewing-gallery-color-scheme', scheme);
    },
    [theme.palette, theme.scheme] as const,
  );
  await page.goto(`/${hash}`);
  await expect(
    page.locator(`[data-theme='${theme.scheme}']`).first(),
  ).toBeVisible();
}

for (const theme of themes) {
  for (const rowCase of rows) {
    test(`Hovering ${rowCase.name} keeps its muted words at 4.5:1 in ${theme.palette} ${theme.scheme}`, async ({
      page,
    }, testInfo) => {
      test.skip(
        testInfo.project.name === 'forced-colors',
        'Forced colours drop the fill; checked once below.',
      );
      await openIn(page, rowCase.hash, theme);
      const row = rowCase.row(page);
      await row.scrollIntoViewIfNeeded();
      const muted = rowCase.muted(row);
      await expect(muted).toBeVisible();
      await row.hover();

      const hovers = await page.evaluate(
        () => window.matchMedia('(hover: hover)').matches,
      );
      if (hovers) {
        // The fill is on, and the muted words read as the text colour.
        await expect
          .poll(() =>
            muted.evaluate((element) => getComputedStyle(element).color),
          )
          .toBe(await tokenColor(page, 'text'));
      }
      expect(await textContrast(muted)).toBeGreaterThanOrEqual(4.5);
      // Scanned while the pointer is still over the row.
      expect(await scan(page, muted)).toEqual([]);
    });
  }
}

test('Hovered rows are outlined in forced colours, their words painted at 4.5:1', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'forced-colors', 'Forced colours only.');
  await page.emulateMedia({ forcedColors: 'active' });
  for (const rowCase of rows) {
    await page.goto(`/${rowCase.hash}`);
    const row = rowCase.row(page);
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    const outline = await row.evaluate(
      (element) => getComputedStyle(element).outlineColor,
    );
    expect(outline, rowCase.name).toBe(await systemColor(page, 'Highlight'));
    expect(
      await paintedTextContrast(rowCase.muted(row)),
      rowCase.name,
    ).toBeGreaterThanOrEqual(4.5);
    expect(await scan(page, rowCase.muted(row)), rowCase.name).toEqual([]);
  }
});
