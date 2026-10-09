import { expect, test } from '@playwright/test';

test('A sortable Table header is a button in the header style that sorts and says which way', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#table');
  const table = page.getByRole('table', { name: 'Sorted census' });
  await table.scrollIntoViewIfNeeded();
  const species = table.getByRole('columnheader', { name: 'Species' });
  const sightings = table.getByRole('columnheader', { name: 'Sightings' });
  const speciesButton = species.getByRole('button', { name: 'Species' });
  const sightingsButton = sightings.getByRole('button', { name: 'Sightings' });
  const firstSpecies = table.getByRole('row').nth(1).getByRole('cell').first();

  // Sorted by sightings, most first; only that header carries aria-sort.
  await expect(sightings).toHaveAttribute('aria-sort', 'descending');
  await expect(species).not.toHaveAttribute('aria-sort');
  await expect(
    table.getByRole('columnheader', { name: 'Habitat' }).getByRole('button'),
  ).toHaveCount(0);
  await expect(firstSpecies).toHaveText('Red fox');

  // The button keeps the header's text style, not a link's or a button's.
  const style = (element: HTMLElement) => {
    const computed = getComputedStyle(element);
    return {
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      background: computed.backgroundColor,
      decoration: computed.textDecorationLine,
    };
  };
  const header = await species.evaluate(style);
  const button = await speciesButton.evaluate(style);
  expect(button.fontSize).toBe(header.fontSize);
  expect(button.fontWeight).toBe(header.fontWeight);
  expect(button.decoration).toBe('none');
  if (!forced) expect(button.background).toBe('rgba(0, 0, 0, 0)');

  // In the numeric column the chevron comes before the name, so the name's
  // end lines up with the figures under it.
  const glyph = sightingsButton.locator('.sw-table-sort-glyph');
  const nameEnd = await sightingsButton.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element.firstChild as Node);
    return range.getBoundingClientRect().right;
  });
  const glyphBox = await glyph.boundingBox();
  expect(glyphBox).not.toBeNull();
  expect(glyphBox!.x + glyphBox!.width).toBeLessThanOrEqual(nameEnd);
  const figureEnd = await table
    .getByRole('row')
    .nth(1)
    .getByRole('cell')
    .last()
    .evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect().right;
    });
  expect(Math.abs(nameEnd - figureEnd)).toBeLessThanOrEqual(1);

  // A press sorts by that column, ascending, then the other way round.
  await speciesButton.click();
  await expect(species).toHaveAttribute('aria-sort', 'ascending');
  await expect(sightings).not.toHaveAttribute('aria-sort');
  await expect(firstSpecies).toHaveText('Green sea turtle');
  await expect(speciesButton.locator('.sw-table-sort-glyph')).toHaveClass(
    /sw-table-sort-ascending/,
  );
  await speciesButton.press('Enter');
  await expect(species).toHaveAttribute('aria-sort', 'descending');
  await expect(firstSpecies).toHaveText('Snow leopard');

  // The coarse pointer's 44 px target.
  const coarse = await page.evaluate(
    () => matchMedia('(pointer: coarse)').matches,
  );
  expect(coarse).toBe(testInfo.project.name === 'mobile-es');
  if (coarse) {
    const box = await speciesButton.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await table.screenshot({ path: testInfo.outputPath('table-sort.png') });
});
