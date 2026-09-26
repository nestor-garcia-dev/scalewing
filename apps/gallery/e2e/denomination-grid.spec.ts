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
  await expect(strip.getByRole('columnheader')).toHaveCount(6);
  const net = strip.getByRole('row', { name: /Net/ });
  await expect(net.getByRole('cell').first()).toHaveText('+9');
  await expect(net.getByRole('cell').nth(2)).toHaveText('-2');
  await expect(net.getByRole('cell').nth(5)).toHaveText('—');
  const isPhone = testInfo.project.name === 'mobile-es';
  const totalCell = net.locator('td.sw-denomination-total');
  const inlineTotal = net.locator('.sw-denomination-total-inline');
  if (isPhone) {
    await expect(totalCell).toBeHidden();
    await expect(inlineTotal).toBeVisible();
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
