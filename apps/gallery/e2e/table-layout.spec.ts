import { expect, type Locator, test } from '@playwright/test';

/** Each header cell's left edge and width, in order. */
async function columnEdges(table: Locator) {
  return table.getByRole('columnheader').evaluateAll((cells) =>
    cells.map((cell) => {
      const box = cell.getBoundingClientRect();
      return [Math.round(box.left), Math.round(box.width)];
    }),
  );
}

test('A fixed Table keeps its columns when a filter hides a row, its tall rows aligned to the top', async ({
  page,
}, testInfo) => {
  await page.goto('/#table');
  const table = page.getByRole('table', { name: 'Field log' });
  await table.scrollIntoViewIfNeeded();
  const before = await columnEdges(table);
  // Every column is sized (12, 8, 16 and 8 rem, plus 12 px of padding a
  // side). On a phone they overflow, so each keeps its width and the table
  // scrolls; on a desktop the spare width is shared in proportion.
  const rootFont = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
  const sized = [12, 8, 16, 8].map((rem) => rem * rootFont + 24);
  if (testInfo.project.name === 'mobile-es') {
    expect(before.map(([, width]) => width)).toEqual(sized.map(Math.round));
  } else {
    const total = sized.reduce((sum, width) => sum + width, 0);
    const first = before[0]?.[1] ?? 0;
    sized.forEach((width, index) =>
      expect((before[index]?.[1] ?? 0) / first).toBeCloseTo(
        width / sized[0]!,
        1,
      ),
    );
    expect(
      before.reduce((sum, [, width]) => sum + (width ?? 0), 0),
    ).toBeGreaterThan(total);
  }

  await page.getByRole('checkbox', { name: 'Verified entries only' }).check();
  await expect(table.getByRole('row')).toHaveCount(3);
  expect(await columnEdges(table)).toEqual(before);

  // Every cell of a tall row starts on its first line.
  const row = table.getByRole('row').nth(1);
  const tops = await row.getByRole('cell').evaluateAll((cells) =>
    cells.map((cell) => {
      const range = document.createRange();
      range.selectNodeContents(cell);
      return Math.round(range.getClientRects()[0]?.top ?? 0);
    }),
  );
  expect(new Set(tops).size).toBe(1);
  await table.screenshot({ path: testInfo.outputPath('table-fixed.png') });
});

test('A min column is only as wide as its dates, on one line', async ({
  page,
}, testInfo) => {
  await page.goto('/#table');
  const table = page.getByRole('table', { name: 'Feeding log' });
  await table.scrollIntoViewIfNeeded();
  const date = table.getByRole('cell', { name: 'Sep 25, 2026' });
  const lines = await date.evaluate((cell) => {
    const range = document.createRange();
    range.selectNodeContents(cell);
    return new Set(
      [...range.getClientRects()].map((rect) => Math.round(rect.top)),
    ).size;
  });
  expect(lines).toBe(1);
  const textWidth = await date.evaluate((cell) => {
    const range = document.createRange();
    range.selectNodeContents(cell);
    return range.getBoundingClientRect().width;
  });
  const cellBox = await date.boundingBox();
  // The cell is the text and its padding: compact cells pad 8 px a side.
  expect(cellBox!.width).toBeLessThanOrEqual(textWidth + 16 + 2);
  await table.screenshot({ path: testInfo.outputPath('table-min.png') });
});
