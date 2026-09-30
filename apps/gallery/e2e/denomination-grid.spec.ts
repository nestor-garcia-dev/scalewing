import { expect, test } from '@playwright/test';

test('DenominationGrid renders the strip table with tones and moves totals under labels on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#denomination-grid');
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
  }
  const section = page.locator('#denomination-grid');
  const strip = section.getByRole('table', { name: 'Tag movement by size' });
  await expect(strip.getByRole('columnheader')).toHaveCount(7);
  await expect(
    strip.getByRole('columnheader', { name: 'Total weight' }),
  ).toHaveAttribute('scope', 'col');
  const net = strip.getByRole('row', { name: /Net/ });
  await expect(net.getByRole('cell').first()).toHaveText('+9');
  await expect(net.getByRole('cell').nth(2)).toHaveText('-2');
  await expect(net.getByRole('cell').nth(5)).toHaveText('—');
  const isPhone = testInfo.project.name === 'mobile-es';
  const totalCell = net.locator('td.sw-denomination-total');
  const inlineTotal = net.locator('.sw-denomination-total-inline');
  // The total stays in the table at every width, so a screen reader reads
  // it in its row, under its column header (Teisoro SDAY-6).
  await expect(net).toHaveAccessibleName(/\+268 g/);
  await expect(
    strip.getByRole('cell', { name: '+268 g', exact: true }),
  ).toHaveCount(1);
  await expect(inlineTotal).toHaveAttribute('aria-hidden', 'true');
  if (isPhone) {
    // Drawn only under the row label; the cell's copy is visually hidden.
    await expect(inlineTotal).toBeVisible();
    const drawn = await totalCell.evaluate((cell) => {
      const value = cell.firstElementChild as HTMLElement;
      const box = value.getBoundingClientRect();
      return {
        cellWidth: cell.getBoundingClientRect().width,
        width: box.width,
        clip: getComputedStyle(value).clip,
      };
    });
    expect(drawn.width).toBeLessThanOrEqual(1);
    expect(drawn.cellWidth).toBeLessThanOrEqual(1);
    expect(drawn.clip).toBe('rect(0px, 0px, 0px, 0px)');
  } else {
    await expect(totalCell).toBeVisible();
    await expect(inlineTotal).toBeHidden();
  }
  const stripBounds = await strip.boundingBox();
  const sectionBounds = await section.boundingBox();
  expect(stripBounds?.width ?? 0).toBeLessThanOrEqual(
    (sectionBounds?.width ?? 0) + 1,
  );
  const tiles = section.getByRole('group', { name: 'Tags in the field kit' });
  await expect(tiles.getByRole('listitem')).toHaveCount(6);
  // A lone plain row labelled with the grid's words is named once, by the
  // grid's group: no region inside it repeats the name (Teisoro SDAY-31).
  await expect(tiles.getByRole('region')).toHaveCount(0);
  expect(await tiles.ariaSnapshot()).not.toContain('region');
  expect(
    await tiles.locator('.sw-denomination-tile-list').evaluate(
      // auto-fit lists collapsed empty tracks as 0px; count the filled ones.
      (element) =>
        getComputedStyle(element)
          .gridTemplateColumns.split(' ')
          .filter((track) => Number.parseFloat(track) > 0).length,
    ),
  ).toBe(isPhone ? 3 : 6);
  await expect(tiles.getByRole('listitem').nth(1)).toContainText('200 g');
  await expect(tiles.getByRole('listitem').nth(2)).toContainText('—');
  await expect(
    section
      .getByRole('region', { name: 'Counted' })
      .getByText('One S tag short'),
  ).toBeVisible();
  // A lone row without an icon still shows its total (Teisoro ENT-7).
  const fitted = section
    .getByRole('group', { name: 'Tags fitted today' })
    .getByRole('region', { name: 'Fitted' });
  await expect(fitted.getByText('53 g', { exact: true })).toBeVisible();
  await expect(fitted.getByText('Fitted', { exact: true })).toBeVisible();
  await section.screenshot({
    path: testInfo.outputPath('denomination-grid.png'),
  });
});

test('a wide DenominationGrid strip scrolls inside its container and never widens the page', async ({
  page,
}, testInfo) => {
  await page.goto('/#denomination-grid');
  const section = page.locator('#denomination-grid');
  const wide = section.getByRole('table', { name: 'Sightings by hour' });
  await expect(wide.getByRole('columnheader')).toHaveCount(11);

  // Measure the page with only this section shown, so another section's
  // layout cannot mask or cause the result.
  const documentWidth = await page.evaluate(() => {
    for (const other of document.querySelectorAll<HTMLElement>(
      '.gallery-section:not(#denomination-grid)',
    )) {
      other.style.display = 'none';
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    };
  });
  expect(documentWidth.scrollWidth).toBe(documentWidth.viewport);

  const region = section.getByRole('group', { name: 'Sightings by hour' });
  await expect(region).toHaveClass(/sw-denomination-scroll/);
  await expect(region).toHaveAttribute('tabindex', '0');
  const card = region.locator(
    'xpath=ancestor::*[contains(@class, "sw-card")][1]',
  );
  const regionBox = await region.boundingBox();
  const cardBox = await card.boundingBox();
  expect(regionBox!.x).toBeGreaterThanOrEqual(cardBox!.x);
  expect(regionBox!.x + regionBox!.width).toBeLessThanOrEqual(
    cardBox!.x + cardBox!.width + 0.5,
  );

  const isPhone = testInfo.project.name === 'mobile-es';
  const scrolls = await region.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );
  expect(scrolls).toBe(isPhone);
  if (isPhone) {
    const label = wide.getByRole('rowheader', { name: /Birds/ });
    const before = await label.boundingBox();
    await region.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
    const after = await label.boundingBox();
    // The label stays pinned at the region's start edge after scrolling.
    expect(after!.x).toBeGreaterThanOrEqual(regionBox!.x - 0.5);
    expect(after!.x).toBeLessThanOrEqual(before!.x + 0.5);
    // The header corner stays pinned over the labels, so each column head
    // stays over its counts.
    const corner = await wide
      .locator('thead .sw-denomination-corner')
      .first()
      .boundingBox();
    expect(Math.abs(corner!.x - after!.x)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(corner!.width - after!.width)).toBeLessThanOrEqual(0.5);
    // The tone stripe is the pinned label's own box, so it moves with it.
    const stripe = await label.evaluate((element) => {
      const style = getComputedStyle(element, '::before');
      return { position: style.position, width: style.width };
    });
    expect(stripe.position).toBe('absolute');
    expect(Number.parseFloat(stripe.width)).toBeGreaterThan(0);
  }

  // Without totalLabel the total column also takes no width on a phone:
  // its corner and cells lose their padding (review of PR #73).
  const unnamedTotals = wide.locator(
    'thead .sw-denomination-total-head, td.sw-denomination-total',
  );
  await expect(wide.locator('thead .sw-denomination-total-head')).toHaveCount(
    1,
  );
  for (const width of await unnamedTotals.evaluateAll((cells) =>
    cells.map((cell) => cell.getBoundingClientRect().width),
  )) {
    if (isPhone) expect(width).toBeLessThanOrEqual(1);
    else expect(width).toBeGreaterThan(8);
  }
  await expect(
    wide.getByRole('cell', { name: '117 sightings', exact: true }),
  ).toHaveCount(1);

  const nested = section.getByRole('group', { name: 'Kit check by size' });
  const outlined = nested.locator(
    'xpath=ancestor::*[contains(@class, "sw-card-outlined")][1]',
  );
  const nestedBox = await nested.boundingBox();
  const outlinedBox = await outlined.boundingBox();
  expect(nestedBox!.x).toBeGreaterThanOrEqual(outlinedBox!.x);
  expect(nestedBox!.x + nestedBox!.width).toBeLessThanOrEqual(
    outlinedBox!.x + outlinedBox!.width + 0.5,
  );
  const nestedTable = nested.getByRole('table', { name: 'Kit check by size' });
  const tableRight = await nestedTable.evaluate(
    (element) => element.getBoundingClientRect().right,
  );
  if (!isPhone) {
    expect(tableRight).toBeLessThanOrEqual(
      nestedBox!.x + nestedBox!.width + 0.5,
    );
  }
  await section.screenshot({
    path: testInfo.outputPath('denomination-grid-wide.png'),
  });
});

test('a DenominationGrid row keeps its glyph beside its words at every width', async ({
  page,
}, testInfo) => {
  await page.goto('/#denomination-grid');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const section = page.locator('#denomination-grid');
  const isPhone = testInfo.project.name === 'mobile-es';

  /** The glyph's box and the box of the words' first line, in one row header. */
  const layoutOf = (table: string, name: RegExp) =>
    section
      .getByRole('table', { name: table })
      .getByRole('rowheader', { name })
      .evaluate((header) => {
        const glyph = header
          .querySelector('.sw-denomination-icon')!
          .getBoundingClientRect();
        const text = header.querySelector('.sw-denomination-label-text')!;
        const range = document.createRange();
        range.selectNodeContents(text);
        const lines = [...range.getClientRects()];
        const first = lines[0]!;
        const inline = header.querySelector('.sw-denomination-total-inline');
        return {
          glyph: { left: glyph.left, right: glyph.right, top: glyph.top },
          first: { left: first.left, top: first.top, bottom: first.bottom },
          textLeft: Math.min(...lines.map((line) => line.left)),
          lineCount: new Set(lines.map((line) => Math.round(line.top))).size,
          inlineTop: inline?.getBoundingClientRect().top ?? null,
          textBottom: text.getBoundingClientRect().bottom,
        };
      });

  // Teisoro DRW-28: at 390 the glyph sat on its own line over the word.
  for (const name of [/Tagged/, /Released/, /Net/]) {
    const row = await layoutOf('Tag movement by size', name);
    expect(row.first.left, String(name)).toBeGreaterThan(row.glyph.right);
    expect(row.glyph.top, String(name)).toBeLessThan(row.first.bottom);
    if (isPhone) {
      // The phone total takes its own line under the glyph and words.
      expect(row.inlineTop!, String(name)).toBeGreaterThanOrEqual(
        row.textBottom - 0.5,
      );
    }
  }

  // A tiles row's glyph keeps its 8 px gap at every width; only the
  // strip's pinned label column narrows it on a phone (review of PR #83).
  const tilesGap = await section
    .getByRole('region', { name: 'Counted' })
    .locator('.sw-denomination-label-line')
    .evaluate((line) => {
      const glyph = line
        .querySelector('.sw-denomination-icon')!
        .getBoundingClientRect();
      const text = line
        .querySelector('.sw-denomination-label-text')!
        .getBoundingClientRect();
      return text.left - glyph.right;
    });
  expect(tilesGap).toBeCloseTo(8, 0);
  const stripGap = await section
    .getByRole('table', { name: 'Tag movement by size' })
    .getByRole('rowheader', { name: /Tagged/ })
    .locator('.sw-denomination-label-line')
    .evaluate((line) => {
      const glyph = line
        .querySelector('.sw-denomination-icon')!
        .getBoundingClientRect();
      const text = line
        .querySelector('.sw-denomination-label-text')!
        .getBoundingClientRect();
      return text.left - glyph.right;
    });
  expect(stripGap).toBeCloseTo(isPhone ? 4 : 8, 0);

  // A long label wraps its words beside the glyph, never under it.
  const long = await layoutOf('Den watch by tag size', /Returned to the den/);
  expect(long.textLeft).toBeGreaterThan(long.glyph.right);
  if (isPhone) expect(long.lineCount).toBeGreaterThan(1);
  await section
    .getByRole('table', { name: 'Den watch by tag size' })
    .screenshot({ path: testInfo.outputPath('denomination-label-line.png') });
});
