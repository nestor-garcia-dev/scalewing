import { expect, test, type Locator } from '@playwright/test';

import { colorContrast, systemColor } from './contrast.js';

test('Table scroll wrappers are keyboard stops named after their table', async ({
  page,
}) => {
  await page.goto('/#table');
  const section = page.locator('#table');
  const census = section.getByRole('group', { name: 'Example census' });
  await expect(census).toHaveAttribute('tabindex', '0');
  await expect(
    census.getByRole('table', { name: 'Example census' }),
  ).toBeVisible();
  await census.focus();
  await expect(census).toBeFocused();
  const ring = await census.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  expect(ring).toBe('solid');
  await expect(
    section.getByRole('group', { name: 'Watch list' }),
  ).toHaveAttribute('tabindex', '0');
});

test('Numeric table cells align to the end, labels to the start', async ({
  page,
}) => {
  await page.goto('/#table');
  const table = page
    .locator('#table')
    .getByRole('table', { name: 'Example census' });
  const alignment = (name: string) =>
    table
      .getByRole('columnheader', { name })
      .evaluate((element) => getComputedStyle(element).textAlign);
  expect(await alignment('Species')).toBe('start');
  expect(await alignment('Sightings')).toBe('end');
  const firstRow = table.getByRole('row').nth(1);
  const cellAlignment = (index: number) =>
    firstRow
      .getByRole('cell')
      .nth(index)
      .evaluate((element) => getComputedStyle(element).textAlign);
  expect(await cellAlignment(0)).toBe('start');
  expect(await cellAlignment(2)).toBe('end');
});

/** The background actually painted behind an element: its own or its nearest ancestor's. */
function paintedGround(locator: Locator): Promise<string> {
  return locator.evaluate((element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const color = getComputedStyle(node).backgroundColor;
      if (!/rgba\(.*, 0\)|transparent/.test(color)) return color;
    }
    return 'rgb(255, 255, 255)';
  });
}

/** The first cell's text start, relative to its table. */
function textStart(cell: Locator): Promise<number> {
  return cell.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return (
      range.getBoundingClientRect().x -
      element.closest('table')!.getBoundingClientRect().x
    );
  });
}

test('a selected Table row is marked by a bar without moving a column or filling the row', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#table');
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(forced);
  const section = page.locator('#table');
  const table = section.getByRole('table', { name: 'Tracking collars' });
  const headerX = () =>
    table.getByRole('columnheader').evaluateAll((cells) =>
      // Relative to the table: at 390 px pressing Select scrolls the
      // table's own scroll region, which moves every column alike.
      cells.map(
        (cell) =>
          cell.getBoundingClientRect().x -
          cell.closest('table')!.getBoundingClientRect().x,
      ),
    );
  const firstCell = (row: number) =>
    table.getByRole('row').nth(row).getByRole('cell').first();
  const cellFill = (row: number) =>
    table
      .getByRole('row')
      .nth(row)
      .getByRole('cell')
      .nth(1)
      .evaluate((cell) => getComputedStyle(cell).backgroundColor);
  const before = await headerX();
  const textBefore = await textStart(firstCell(2));
  const idleFill = await cellFill(2);

  await table.getByRole('button', { name: 'Select c-221' }).click();
  const selected = table.getByRole('row').nth(2);
  await expect(selected).toHaveAttribute('aria-selected', 'true');
  // Teisoro NSF-12: the columns moved by 11 px when a row was picked.
  const after = await headerX();
  after.forEach((x, index) =>
    expect(Math.abs(x - before[index]!)).toBeLessThan(0.5),
  );
  expect(Math.abs((await textStart(firstCell(2))) - textBefore)).toBeLessThan(
    0.5,
  );
  expect(
    Math.abs((await textStart(firstCell(2))) - (await textStart(firstCell(1)))),
  ).toBeLessThan(0.5);
  // Review of PR #75: no fill, so accent text in the row keeps its contrast.
  expect(await cellFill(2)).toBe(idleFill);

  // The bar: a 4 px border on the first cell's out-of-flow ::before, at 3:1
  // or more against what is painted behind the row.
  const marker = await firstCell(2).evaluate((cell) => {
    const bar = getComputedStyle(cell, '::before');
    return {
      position: bar.position,
      width: bar.borderInlineStartWidth,
      style: bar.borderInlineStartStyle,
      color: bar.borderInlineStartColor,
    };
  });
  expect(marker).toMatchObject({
    position: 'absolute',
    width: '4px',
    style: 'solid',
  });
  if (forced) {
    // The bar stays in forced colors, in the system highlight.
    expect(marker.color).toBe(await systemColor(page, 'Highlight'));
  } else {
    expect(
      colorContrast(marker.color, await paintedGround(firstCell(2))),
    ).toBeGreaterThanOrEqual(3);
  }

  // A compact table's selected row starts its text where the others do.
  const watch = section.getByRole('table', { name: 'Watch list' });
  const watchFirst = (row: number) =>
    watch.getByRole('row').nth(row).getByRole('cell').first();
  await expect(watch.getByRole('row').nth(1)).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(
    Math.abs(
      (await textStart(watchFirst(1))) - (await textStart(watchFirst(2))),
    ),
  ).toBeLessThan(0.5);
  await table.scrollIntoViewIfNeeded();
  await section.screenshot({ path: testInfo.outputPath('table-selected.png') });
});

test('in a right-to-left table the bar sits at the right edge, clear of a checkbox', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#table');
  const table = page
    .locator('#table')
    .getByRole('table', { name: 'أطواق التتبع' });
  const row = (id: string) =>
    table
      .getByRole('row')
      .filter({ has: page.getByRole('checkbox', { name: id }) });
  const selected = row('c-221');
  await expect(selected).toHaveAttribute('aria-selected', 'true');
  const measure = (target: Locator) =>
    target
      .getByRole('cell')
      .first()
      .evaluate((cell) => {
        const bar = getComputedStyle(cell, '::before');
        const cellBox = cell.getBoundingClientRect();
        const mark = cell
          .querySelector('.sw-checkbox-mark')!
          .getBoundingClientRect();
        return {
          barRight: bar.right,
          barLeft: bar.left,
          barWidth: Number.parseFloat(bar.borderInlineStartWidth),
          barRightBorder: Number.parseFloat(bar.borderRightWidth),
          cellRight: cellBox.right,
          markRight: mark.right,
          markLeft: mark.left,
        };
      });
  const bar = await measure(selected);
  // Inline start is the right in right-to-left: the bar hugs the cell's
  // right edge and is drawn with the right border.
  expect(bar.barRight).toBe('0px');
  expect(bar.barRightBorder).toBe(4);
  // The bar spans the cell's last 4 px; the checkbox's mark stays clear.
  expect(bar.markRight).toBeLessThanOrEqual(bar.cellRight - bar.barWidth);
  // Picking a row does not move its checkbox.
  const unselected = await measure(row('c-104'));
  expect(Math.abs(unselected.markRight - bar.markRight)).toBeLessThan(0.5);
  await table.getByRole('checkbox', { name: 'c-104' }).check();
  await expect(row('c-104')).toHaveAttribute('aria-selected', 'true');
  expect(
    Math.abs((await measure(row('c-104'))).markRight - unselected.markRight),
  ).toBeLessThan(0.5);
  await table.scrollIntoViewIfNeeded();
  await table.screenshot({
    path: testInfo.outputPath('table-rtl-selected.png'),
  });
});

test('a wide Table shades the edge with more columns past it, on a phone too', async ({
  page,
}, testInfo) => {
  const isForced = testInfo.project.name === 'forced-colors';
  // Forced colors are checked at phone width, where the table overflows.
  if (isForced) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ forcedColors: 'active' });
  }
  await page.goto('/#table');
  const region = page
    .locator('#table')
    .getByRole('group', { name: 'Survey log' });
  await region.scrollIntoViewIfNeeded();
  const metrics = () =>
    region.evaluate((element) => ({
      overflows: element.scrollWidth - element.clientWidth > 1,
      className: element.className,
      shadow: getComputedStyle(element).boxShadow,
    }));
  const isPhone = testInfo.project.name === 'mobile-es';
  const atStart = await metrics();
  testInfo.annotations.push({
    type: 'overflow',
    description: String(atStart.overflows),
  });
  // VLT-1 / HIS-3: at 390 px nine columns do not fit, so the end is shaded.
  if (isPhone || isForced) expect(atStart.overflows).toBe(true);
  if (!atStart.overflows) {
    // Nothing past either edge: no cue, and no shadow.
    expect(atStart.className).toBe('sw-table-wrap');
    expect(atStart.shadow).toBe('none');
    return;
  }
  await expect(region).toHaveClass('sw-table-wrap sw-scroll-more-end');
  if (isForced) {
    // Forced colors draw no shade; the system scrollbar is the cue.
    expect(
      await region.evaluate((element) => getComputedStyle(element).boxShadow),
    ).toBe('none');
  } else {
    // Read after the class lands: the region measures after its first paint.
    const shadow = await region.evaluate(
      (element) => getComputedStyle(element).boxShadow,
    );
    expect(shadow).toContain('inset');
    // The shade sits on the right edge: a negative horizontal offset.
    expect(shadow).toContain(' -32px 0px 24px -24px inset');
    expect(shadow).not.toContain(' 32px 0px 24px -24px inset');
  }
  await region.screenshot({
    path: testInfo.outputPath('table-scroll-start.png'),
  });

  await region.evaluate((element) => {
    element.scrollLeft = 40;
  });
  await expect(region).toHaveClass(
    'sw-table-wrap sw-scroll-more-start sw-scroll-more-end',
  );
  await region.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  await expect(region).toHaveClass('sw-table-wrap sw-scroll-more-start');
  if (!isForced) {
    // Scrolled to the end, only the left edge is shaded.
    const atEnd = await region.evaluate(
      (element) => getComputedStyle(element).boxShadow,
    );
    expect(atEnd).toContain(' 32px 0px 24px -24px inset');
    expect(atEnd).not.toContain(' -32px 0px 24px -24px inset');
  }
  await region.screenshot({
    path: testInfo.outputPath('table-scroll-end.png'),
  });
  // The table scrolls inside its region; the region stays within the screen.
  const box = await region.boundingBox();
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
    page.viewportSize()!.width,
  );
});

test('a wide right-to-left Table shades its start on the right and its end on the left', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile-es',
    'The survey log only overflows at phone width.',
  );
  await page.goto('/#table');
  const region = page
    .locator('#table')
    .getByRole('group', { name: 'Survey log' });
  await region.scrollIntoViewIfNeeded();
  // Turn the region right to left; a scroll event makes it measure again.
  await region.evaluate((element) => {
    element.setAttribute('dir', 'rtl');
    element.scrollLeft = 0;
    element.dispatchEvent(new Event('scroll'));
  });
  await expect(region).toHaveClass('sw-table-wrap sw-scroll-more-end');
  // The region really is right to left: it scrolls toward negative values.
  await region.evaluate((element) => {
    element.scrollLeft = -40;
  });
  expect(await region.evaluate((element) => element.scrollLeft)).toBeLessThan(
    0,
  );
  await expect(region).toHaveClass(
    'sw-table-wrap sw-scroll-more-start sw-scroll-more-end',
  );
  await region.evaluate((element) => {
    element.scrollLeft = 0;
  });
  await expect(region).toHaveClass('sw-table-wrap sw-scroll-more-end');
  const shadow = () =>
    region.evaluate((element) => getComputedStyle(element).boxShadow);
  // The end of a right-to-left table is its left edge: a positive offset.
  expect(await shadow()).toContain(' 32px 0px 24px -24px inset');
  expect(await shadow()).not.toContain(' -32px 0px 24px -24px inset');
  await region.evaluate((element) => {
    element.scrollLeft = -element.scrollWidth;
  });
  await expect(region).toHaveClass('sw-table-wrap sw-scroll-more-start');
  expect(await shadow()).toContain(' -32px 0px 24px -24px inset');
  expect(await shadow()).not.toContain(' 32px 0px 24px -24px inset');
});
