import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

test('A pressable Table row picks its result from a press anywhere on it', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  const touch = testInfo.project.use.hasTouch === true;
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#table');
  const table = page.getByRole('table', { name: 'Pick a species' });
  await table.scrollIntoViewIfNeeded();
  const status = page.getByText(/^(No species picked|Picked .+)$/);
  await expect(status).toHaveText('No species picked');
  const leopard = table.getByRole('row').filter({ hasText: 'Snow leopard' });
  const leopardName = leopard.getByRole('button', { name: 'Snow leopard' });
  const alpine = leopard.getByRole('cell', { name: 'Alpine' });

  // One button per row, named by the species; the row is no control.
  await expect(table.getByRole('button')).toHaveCount(3);
  await expect(leopard).not.toHaveAttribute('tabindex');
  await expect(leopard).toHaveCSS('cursor', 'pointer');
  const [nameStyle, cellStyle] = await leopardName.evaluate((node) => {
    const style = (element: Element) => {
      const computed = getComputedStyle(element);
      return {
        color: computed.color,
        size: computed.fontSize,
        weight: computed.fontWeight,
        background: computed.backgroundColor,
        line: computed.textDecorationLine,
      };
    };
    return [style(node), style(node.closest('td')!)];
  });
  expect(nameStyle.weight).toBe('600');
  expect(cellStyle.weight).toBe('400');
  expect(nameStyle.size).toBe(cellStyle.size);
  expect(nameStyle.line).toBe('none');
  if (!forced) {
    expect(nameStyle.color).toBe(cellStyle.color);
    expect(nameStyle.background).toBe('rgba(0, 0, 0, 0)');
  }

  // axe finds nothing in the table: no nested control, every button named.
  await page.addScriptTag({ path: require.resolve('axe-core') });
  await table.evaluate((node) => node.setAttribute('data-check', 'press'));
  const violations = await page.evaluate(() =>
    (window as Window & { axe: Axe }).axe
      .run({ include: [['[data-check="press"]']] }, {})
      .then((result) => result.violations.map((violation) => violation.id)),
  );
  expect(violations).toEqual([]);

  // A press on another cell of the row picks it.
  await alpine.click();
  await expect(status).toHaveText('Picked Snow leopard');
  // So does a press on the figure at the row's far end.
  await table
    .getByRole('row')
    .filter({ hasText: 'Red fox' })
    .getByRole('cell', { name: '42' })
    .click();
  await expect(status).toHaveText('Picked Red fox');

  // Text dragged over in the row stays selectable and picks nothing.
  const box = (await alpine.boundingBox())!;
  const text = await alpine.evaluate((node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      y: rect.top + rect.height / 2,
    };
  });
  expect(box.width).toBeGreaterThan(0);
  await page.mouse.move(text.left + 1, text.y);
  await page.mouse.down();
  await page.mouse.move(text.right - 1, text.y, { steps: 5 });
  await page.mouse.up();
  expect(
    await page.evaluate(() => document.getSelection()?.toString() ?? ''),
  ).not.toBe('');
  await expect(status).toHaveText('Picked Red fox');
  await page.evaluate(() => document.getSelection()?.removeAllRanges());

  // A press with a modifier key is left to the browser.
  await alpine.click({ modifiers: ['Shift'] });
  await expect(status).toHaveText('Picked Red fox');
  await page.evaluate(() => document.getSelection()?.removeAllRanges());

  // Hovering fills the row and underlines its action.
  if (!touch) {
    await alpine.hover();
    if (forced) {
      await expect(leopard).toHaveCSS('outline-style', 'solid');
    } else {
      await expect(alpine).not.toHaveCSS(
        'background-color',
        'rgba(0, 0, 0, 0)',
      );
    }
    await expect(leopardName).toHaveCSS('text-decoration-line', 'underline');
    await page.mouse.move(0, 0);
    if (forced) await expect(leopard).toHaveCSS('outline-style', 'none');
    else await expect(alpine).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }

  // The keyboard reaches the action itself: the row shows it, Enter picks.
  await leopardName.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(leopardName).toBeFocused();
  await expect(leopardName).toHaveCSS('outline-style', 'solid');
  if (!forced)
    await expect(alpine).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.keyboard.press('Enter');
  await expect(status).toHaveText('Picked Snow leopard');
  await page.screenshot({ path: testInfo.outputPath('table-press.png') });

  // The page never scrolls sideways for it.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
