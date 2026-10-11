import { expect, test } from '@playwright/test';

/** A custom property's colour as the browser resolves it, on `node`. */
function resolved(node: Element, value: string): string {
  const probe = document.createElement('span');
  probe.style.color = value;
  node.append(probe);
  const colour = getComputedStyle(probe).color;
  probe.remove();
  return colour;
}

test('Table ledger tones figures, rules columns, indents sub rows and strikes a voided row', async ({
  page,
}, testInfo) => {
  await page.goto('/#table');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', { name: 'Colony ledger', exact: true });
  await table.scrollIntoViewIfNeeded();

  if (testInfo.project.name !== 'forced-colors') {
    const success = table.getByRole('cell', { name: '+14' });
    const [colour, expected] = await success.evaluate((node, fn) => {
      const resolve = new Function(`return (${fn})`)() as typeof resolved;
      return [
        getComputedStyle(node).color,
        resolve(node, 'var(--sw-color-success)'),
      ];
    }, resolved.toString());
    expect(colour).toBe(expected);
  }

  // Every cell after a row's first has a hairline at its inline start.
  const firstRow = table.getByRole('row').nth(1);
  const borders = await firstRow
    .locator('td, th')
    .evaluateAll((cells) =>
      cells.map((cell) => getComputedStyle(cell).borderInlineStartWidth),
    );
  expect(borders[0]).toBe('0px');
  for (const width of borders.slice(1)) expect(width).toBe('1px');

  // A sub row's header is indented past an entry's, with its guide bar.
  const entry = table.getByRole('rowheader', { name: 'Heron colony count' });
  const sub = table.getByRole('rowheader', { name: 'North reed bed' });
  const entryPad = await entry.evaluate((node) =>
    parseFloat(getComputedStyle(node).paddingInlineStart),
  );
  const subPad = await sub.evaluate((node) =>
    parseFloat(getComputedStyle(node).paddingInlineStart),
  );
  expect(subPad - entryPad).toBeGreaterThanOrEqual(32);
  const bar = await sub.evaluate((node) => {
    const style = getComputedStyle(node, '::after');
    return [style.borderInlineStartWidth, style.content];
  });
  expect(bar).toEqual(['2px', '""']);
  // A row header reads as body text, not as a column header.
  const [entryWeight, headerWeight] = await Promise.all([
    entry.evaluate((node) => getComputedStyle(node).fontWeight),
    table
      .getByRole('columnheader', { name: 'Entry' })
      .evaluate((node) => getComputedStyle(node).fontWeight),
  ]);
  expect(entryWeight).toBe('400');
  expect(headerWeight).toBe('600');

  // The struck row: line-through on every cell and its toned cell muted.
  const struck = table.getByRole('row', { name: /Double-counted pair/ });
  const decorations = await struck
    .locator('td, th')
    .evaluateAll((cells) =>
      cells.map((cell) => getComputedStyle(cell).textDecorationLine),
    );
  for (const line of decorations) expect(line).toBe('line-through');
  if (testInfo.project.name !== 'forced-colors') {
    const minus = struck.getByRole('cell', { name: '−2' }).first();
    const [colour, muted] = await minus.evaluate((node, fn) => {
      const resolve = new Function(`return (${fn})`)() as typeof resolved;
      return [
        getComputedStyle(node).color,
        resolve(node, 'var(--sw-color-muted)'),
      ];
    }, resolved.toString());
    expect(colour).toBe(muted);
  }
  await expect(
    struck.getByText(/Struck · Removed by the warden/),
  ).toBeVisible();
  const colourOf = (
    locator: typeof struck,
    token: string,
  ): Promise<[string, string]> =>
    locator.evaluate(
      (node, [fn, value]) => {
        const resolve = new Function(`return (${fn})`)() as typeof resolved;
        return [getComputedStyle(node).color, resolve(node, value!)] as [
          string,
          string,
        ];
      },
      [resolved.toString(), token],
    );
  if (testInfo.project.name !== 'forced-colors') {
    // The struck row's header is muted too, not only its td cells.
    const [header, muted] = await colourOf(
      struck.getByRole('rowheader'),
      'var(--sw-color-muted)',
    );
    expect(header).toBe(muted);
    const [accent, expected] = await colourOf(
      table
        .getByRole('row', { name: /Pair to confirm/ })
        .getByRole('cell', { name: '+2' })
        .first(),
      'var(--sw-color-accent)',
    );
    expect(accent).toBe(expected);
  }
  // A struck sub row keeps its indent.
  const struckSub = table.getByRole('row', { name: /East reed bed/ });
  await expect(struckSub).toHaveClass('sw-table-row-sub sw-table-row-struck');
  const struckSubPad = await struckSub
    .getByRole('rowheader')
    .evaluate((node) => parseFloat(getComputedStyle(node).paddingInlineStart));
  expect(struckSubPad).toBe(subPad);

  // The sticky header keeps its column rules on ::after, in forced colours
  // too, at the cell's inline start in both directions.
  const change = table.getByRole('columnheader', { name: 'Change' });
  const rule = () =>
    change.evaluate((cell) => {
      const style = getComputedStyle(cell, '::after');
      const box = cell.getBoundingClientRect();
      return {
        content: style.content,
        width: style.borderInlineStartWidth,
        style: style.borderInlineStartStyle,
        left: parseFloat(style.left),
        right: parseFloat(style.right),
        cell: box.width,
      };
    });
  const ltr = await rule();
  expect([ltr.content, ltr.width, ltr.style]).toEqual(['""', '1px', 'solid']);
  expect(ltr.left).toBe(0);
  await table.evaluate((node) => node.setAttribute('dir', 'rtl'));
  const rtl = await rule();
  expect(rtl.right).toBe(0);
  expect(rtl.width).toBe('1px');
  await table.evaluate((node) => node.removeAttribute('dir'));
  await table.screenshot({ path: testInfo.outputPath('table-ledger.png') });
});

test('Table ledger indents a compact sub row a step past its entry', async ({
  page,
}) => {
  await page.goto('/#table');
  const table = page.getByRole('table', { name: 'Colony ledger, compact' });
  const pad = (name: string) =>
    table
      .getByRole('rowheader', { name })
      .evaluate((node) =>
        parseFloat(getComputedStyle(node).paddingInlineStart),
      );
  const entry = await pad('Heron colony count');
  const sub = await pad('North reed bed');
  expect(sub - entry).toBeGreaterThanOrEqual(32);
  const bar = await table
    .getByRole('rowheader', { name: 'North reed bed' })
    .evaluate((node) => getComputedStyle(node, '::after').insetInlineStart);
  expect(parseFloat(bar)).toBeLessThan(sub);
});
