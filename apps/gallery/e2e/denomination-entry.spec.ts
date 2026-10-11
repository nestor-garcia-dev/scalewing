import { expect, test } from '@playwright/test';

test('DenominationGrid entry rows count in place beside read-only rows', async ({
  page,
}, testInfo) => {
  await page.goto('/#denomination-grid');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  }
  const region = page.getByRole('group', {
    name: 'Tag packs for the morning round',
  });
  const table = region.getByRole('table');
  await expect(
    table.getByRole('columnheader', { name: 'S × 10' }),
  ).toBeVisible();

  const medium = table.getByRole('spinbutton', { name: 'Fitted M × 10' });
  await expect(medium).toHaveValue('1');
  await table
    .getByRole('group', { name: 'Fitted M × 10' })
    .getByRole('button', { name: 'One pack more' })
    .click();
  await expect(medium).toHaveValue('2');
  const fitted = table.getByRole('row', { name: /Fitted/ });
  // The row header reads its label and caption as words apart.
  await expect(
    table.getByRole('rowheader', { name: /^Fitted this morning/ }),
  ).toBeVisible();
  await expect(fitted).toContainText('45 tags');

  // A plain label's row keeps its tone on its total.
  if (testInfo.project.name !== 'forced-colors') {
    const total = fitted.locator(
      testInfo.project.name === 'mobile-es'
        ? '.sw-denomination-total-inline'
        : '.sw-denomination-total-value',
    );
    expect(
      await total.evaluate((node) => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--sw-color-success)';
        node.append(probe);
        const success = getComputedStyle(probe).color;
        probe.remove();
        return getComputedStyle(node).color === success;
      }),
    ).toBe(true);
  }

  // Plain row labels: no tone stripe, the text color at label weight.
  const label = table.locator('.sw-denomination-label').first();
  expect(
    await label.evaluate((node) => getComputedStyle(node, '::before').content),
  ).toBe('none');
  await expect(label).toHaveCSS('font-weight', '600');
  if (testInfo.project.name !== 'forced-colors')
    expect(
      await label.evaluate((node) => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--sw-color-text)';
        node.append(probe);
        const text = getComputedStyle(probe).color;
        probe.remove();
        return getComputedStyle(node).color === text;
      }),
    ).toBe(true);

  // A count past the stock says why under it.
  await medium.fill('9');
  await expect(medium).toHaveAttribute('aria-invalid', 'true');
  await expect(region.getByText('Only 4 in stock.')).toBeVisible();

  // The disabled row's entry is disabled and the row says so.
  const returned = table.getByRole('row', { name: /Returned/ });
  await expect(returned).toHaveAttribute('aria-disabled', 'true');
  await expect(returned.getByRole('spinbutton').first()).toBeDisabled();

  // The quiet row sits on a fill of its own.
  const stock = table.getByRole('row', { name: /In stock/ });
  if (testInfo.project.name !== 'forced-colors')
    expect(
      await stock.evaluate((row) => getComputedStyle(row).backgroundColor),
    ).not.toBe(
      await fitted.evaluate((row) => getComputedStyle(row).backgroundColor),
    );

  // The page never scrolls sideways; a narrow strip scrolls in its region.
  // (Other sections hidden: they are not this check's subject.)
  const documentWidth = await page.evaluate(() => {
    for (const other of document.querySelectorAll<HTMLElement>(
      '.gallery-section:not(#denomination-grid)',
    ))
      other.style.display = 'none';
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    };
  });
  expect(documentWidth.scrollWidth).toBe(documentWidth.viewport);
  // Every count keeps the md control height.
  expect(Math.round((await medium.boundingBox())!.height)).toBe(44);
  // A narrow strip scrolls instead of crushing a count under its buttons.
  expect((await medium.boundingBox())!.width).toBeGreaterThanOrEqual(48);

  await region
    .locator('xpath=ancestor::*[contains(@class, "sw-card")][1]')
    .screenshot({ path: testInfo.outputPath('denomination-entry.png') });
});
