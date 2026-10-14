import { expect, test, type Page } from '@playwright/test';

function pageOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('ListGroup rows open, pick and state, the whole row pressing', async ({
  page,
}, testInfo) => {
  await page.goto('/#list-group');
  const section = page.locator('#list-group');
  const look = section.getByRole('list', { name: 'Worth a look' });
  await expect(look.getByRole('listitem')).toHaveCount(3);
  const row = look.getByRole('button', {
    name: 'Wed, Oct 7 · North marsh counted 6 fewer herons than expected',
  });
  await expect(row).toHaveAccessibleDescription(
    'Recounted Sat, Oct 10 by Field team A: 135 → 141.',
  );
  // A press on the detail line is the row's.
  await row.getByText('Recounted Sat, Oct 10').click();
  await expect(section.getByText('Opened: North marsh.')).toBeVisible();

  const link = look.getByRole('link', {
    name: '15 days since the camera traps were checked',
  });
  const [linkColor, textColor] = await Promise.all([
    link.evaluate((node) => getComputedStyle(node).color),
    row.evaluate((node) => getComputedStyle(node).color),
  ]);
  // Forced colours paint every link in the system link colour.
  if (testInfo.project.name !== 'forced-colors')
    expect(linkColor).toBe(textColor);
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(section.getByText('Opened: Camera traps.')).toBeVisible();

  const habitat = section.getByRole('list', { name: 'Survey habitat' });
  await habitat.getByRole('button', { name: 'Forest' }).click();
  await expect(habitat.getByRole('button', { name: 'Forest' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(
    habitat.getByRole('button', { name: 'Wetland' }),
  ).toHaveAttribute('aria-pressed', 'false');

  const coarse = testInfo.project.name === 'mobile-es';
  const box = await section
    .getByRole('list', { name: 'Survey habitat' })
    .getByRole('button', { name: 'Savanna' })
    .boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(coarse ? 44 : 40);
  if (coarse) expect(await pageOverflow(page)).toBe(0);
  await section.screenshot({ path: testInfo.outputPath('list-group.png') });
});

test('ListGroup bounds its rows to a scroll region with its total pinned under it', async ({
  page,
}, testInfo) => {
  await page.goto('/#list-group');
  const section = page.locator('#list-group');
  const region = section.getByRole('group', { name: 'Night counts' });
  const footer = section.locator('.sw-list-group-footer');
  await region.scrollIntoViewIfNeeded();
  const before = await region.boundingBox();
  // Four rows of a title and one detail line: twice the 12 px padding, the
  // 20 px title, the 18 px detail and the hairline. Taller rows show fewer.
  expect(before?.height).toBeCloseTo(4 * (24 + 20 + 18 + 1), 0);
  if (testInfo.project.name === 'desktop-en') {
    const second = await region.getByRole('listitem').nth(1).boundingBox();
    expect(second?.height).toBeCloseTo(24 + 20 + 18 + 1, 0);
  }
  if (testInfo.project.name !== 'forced-colors')
    await expect(region).toHaveClass(/sw-scroll-more-bottom/);

  await region.focus();
  await page.keyboard.press('End');
  await expect(region).toHaveClass(/sw-scroll-more-top/);
  await expect(region).not.toHaveClass(/sw-scroll-more-bottom/);
  await expect(
    region.getByRole('button', { name: /^Fri, Oct 9 · South reeds/ }),
  ).toBeInViewport();
  const [regionBox, footerBox] = await Promise.all([
    region.boundingBox(),
    footer.boundingBox(),
  ]);
  if (regionBox && footerBox)
    expect(footerBox.y).toBeCloseTo(regionBox.y + regionBox.height, 0);
  await expect(footer.getByText('8 nights')).toBeVisible();
  // The end keeps its words whole, one caption line, even beside a long detail.
  const note = region.locator('.sw-list-row-value-detail').first();
  expect((await note.boundingBox())?.height).toBeCloseTo(18, 0);
  await section
    .locator('.sw-list-group-scroll')
    .screenshot({ path: testInfo.outputPath('list-group-bounded.png') });
});

test('ListGroup keeps its chevron, check and hairlines in forced colours', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'forced-colors', 'Forced colours only.');
  await page.goto('/#list-group');
  const section = page.locator('#list-group');
  const chevron = section.locator('.sw-list-row-chevron').first();
  const check = section.locator('.sw-list-row-check').first();
  for (const mark of [chevron, check])
    expect(
      await mark.evaluate((node) => getComputedStyle(node).borderBottomColor),
    ).not.toBe('rgba(0, 0, 0, 0)');
  const hairline = await section
    .locator('.sw-list-item + .sw-list-item')
    .first()
    .evaluate((node) => getComputedStyle(node).borderTopStyle);
  expect(hairline).toBe('solid');
});
