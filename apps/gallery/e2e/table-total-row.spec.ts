import { expect, test } from '@playwright/test';

test('TableRow variant="total" sets a subtotal mid-table at 600 under a 2 px rule', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#table');
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', {
    name: 'Waders through the day',
    exact: true,
  });
  await table.scrollIntoViewIfNeeded();

  const total = table.getByRole('row', { name: 'Expected at dusk 136' });
  const name = total.getByRole('rowheader', { name: 'Expected at dusk' });
  const figure = total.getByRole('cell', { name: '136' });
  for (const cell of [name, figure]) {
    const [weight, rule, fill] = await cell.evaluate((node) => {
      const style = getComputedStyle(node);
      return [style.fontWeight, style.borderTopWidth, style.backgroundColor];
    });
    expect(weight).toBe('600');
    expect(rule).toBe('2px');
    if (!forced) expect(fill).toBe('rgba(0, 0, 0, 0)');
  }

  // The rows around it keep their own weight and the 1 px rule between them.
  const before = table.getByRole('rowheader', { name: 'Flew off' });
  const after = table.getByRole('rowheader', { name: 'Counted at dusk' });
  for (const cell of [before, after])
    expect(
      await cell.evaluate((node) => getComputedStyle(node).fontWeight),
    ).toBe('400');

  // The collapsed 2 px rule wins over the row above's 1 px one: the total
  // row is half a pixel taller than an ordinary row with the same content.
  const height = async (row: string) =>
    (await table.getByRole('row', { name: row }).boundingBox())!.height;
  expect(await height('Expected at dusk 136')).toBeGreaterThan(
    await height('Counted at dusk 133'),
  );

  // A toned figure keeps its tone at weight 600.
  if (!forced) {
    const [colour, accent] = await figure.evaluate((node) => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--sw-color-accent)';
      node.append(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return [getComputedStyle(node).color, resolved];
    });
    expect(colour).toBe(accent);
  }

  // Compact density keeps the weight and the rule.
  const compact = page
    .getByRole('table', { name: 'Waders through the day, compact' })
    .getByRole('rowheader', { name: 'Expected at dusk' });
  expect(
    await compact.evaluate((node) => [
      getComputedStyle(node).fontWeight,
      getComputedStyle(node).borderTopWidth,
    ]),
  ).toEqual(['600', '2px']);

  if (forced) {
    const colour = await name.evaluate(
      (node) => getComputedStyle(node).borderTopColor,
    );
    const text = await name.evaluate((node) => getComputedStyle(node).color);
    expect(colour).toBe(text);
  }
  await table.screenshot({ path: testInfo.outputPath('table-total-row.png') });
});
