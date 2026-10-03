import { expect, test } from '@playwright/test';

test('Tabs select with the pointer and the keyboard, show one panel and scroll on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#tabs');
  const section = page.locator('#tabs');
  const list = section.getByRole('tablist', { name: 'Habitats' });
  const panel = section
    .getByRole('tabpanel')
    .and(section.locator('[id^="habitats-panel-"]'));
  const forest = list.getByRole('tab', { name: 'Forest' });
  const savanna = list.getByRole('tab', { name: 'Savanna' });
  await expect(forest).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveCount(1);
  await expect(panel).toContainText('Red fox');

  await savanna.click();
  await expect(savanna).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toContainText('Lion pride');
  await expect(panel).toHaveAttribute(
    'aria-labelledby',
    'habitats-tab-savanna',
  );

  await page.keyboard.press('ArrowRight');
  await expect(list.getByRole('tab', { name: 'Ocean' })).toBeFocused();
  await expect(panel).toContainText('sea turtle');
  await page.keyboard.press('End');
  await expect(list.getByRole('tab', { name: 'Desert' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('ArrowRight');
  await expect(forest).toHaveAttribute('aria-selected', 'true');

  const underline = (element: HTMLElement) =>
    getComputedStyle(element).borderBottomColor;
  expect(await forest.evaluate(underline)).not.toBe(
    await savanna.evaluate(underline),
  );
  // Without sticky the strip stays in page flow.
  expect(
    await list.evaluate((element) => getComputedStyle(element).position),
  ).toBe('static');

  const overflow = await list.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );
  if (testInfo.project.name === 'mobile-es') {
    expect(overflow).toBe(true);
  }
  await section.screenshot({ path: testInfo.outputPath('tabs.png') });
});

test('A sticky Tabs strip stays at the top of its page while the panel scrolls under it, its first label on the space-4 gutter', async ({
  page,
}, testInfo) => {
  // The project's forcedColors option alone does not reach the page's media
  // queries, so the forced-colors project emulates it as the other specs do.
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#tabs');
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(forced);
  const frame = page.getByTestId('tabs-sticky-page');
  const strip = frame.getByRole('tablist', { name: 'Reserve log' });
  const title = frame.getByText('Wetland reserve');
  await frame.scrollIntoViewIfNeeded();

  // The first label, the title and the panel's cards share one start edge:
  // the strip runs edge to edge and each tab's md padding is the gutter.
  const textStart = (element: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return range.getBoundingClientRect().left;
  };
  const frameLeft = await frame.evaluate(
    (element) => element.getBoundingClientRect().left + element.clientLeft,
  );
  const stripBox = await strip.boundingBox();
  expect(stripBox).toBeTruthy();
  if (!stripBox) return;
  expect(Math.abs(stripBox.x - frameLeft)).toBeLessThan(1);
  const birds = strip.getByRole('tab', { name: 'Birds' });
  const labelStart = await birds.evaluate(textStart);
  expect(labelStart - frameLeft).toBeCloseTo(16, 0);
  expect(Math.abs(labelStart - (await title.evaluate(textStart)))).toBeLessThan(
    1,
  );
  const firstEntry = frame.getByText('Grey heron · Reed bed edge');
  const entryCard = frame.locator('.sw-card').first();
  const cardBox = await entryCard.boundingBox();
  expect(cardBox && Math.abs(cardBox.x - labelStart)).toBeLessThan(1);

  const style = await strip.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      position: computed.position,
      zIndex: computed.zIndex,
      backgroundColor: computed.backgroundColor,
      backdropFilter: computed.backdropFilter,
      borderBottomWidth: computed.borderBottomWidth,
      borderBottomStyle: computed.borderBottomStyle,
      paddingLeft: computed.paddingLeft,
    };
  });
  expect(style.position).toBe('sticky');
  expect(style.zIndex).toBe('4');
  expect(style.borderBottomWidth).toBe('1px');
  expect(style.borderBottomStyle).toBe('solid');
  expect(style.paddingLeft).toBe('0px');
  if (forced) {
    // Forced colors: a solid system canvas, nothing showing through.
    expect(style.backgroundColor).not.toMatch(/[/,] 0(\.\d+)?\)$/);
    expect(style.backdropFilter).toBe('none');
  } else {
    // The page canvas, a little see-through, over the glass blur.
    expect(style.backgroundColor).toMatch(/ 0\.9\)$/);
    expect(style.backdropFilter).toContain('blur(');
  }

  // Scroll the page under the strip: it stays at the frame's top and the
  // log passes under it.
  await frame.evaluate((element) => {
    element.scrollTop = 160;
  });
  const frameTop = await frame.evaluate(
    (element) => element.getBoundingClientRect().top + element.clientTop,
  );
  const stuck = await strip.boundingBox();
  expect(stuck).toBeTruthy();
  if (!stuck) return;
  expect(Math.abs(stuck.y - frameTop)).toBeLessThan(1);
  const titleBox = await title.boundingBox();
  expect(titleBox && titleBox.y + titleBox.height).toBeLessThan(stuck.y);
  const under = await entryCard.boundingBox();
  expect(under && under.y).toBeLessThan(stuck.y + stuck.height);
  // The strip paints over the panel: a press on it reaches a tab.
  const onTop = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x, y)?.closest('[role="tab"]')?.id,
    [labelStart + 4, stuck.y + stuck.height / 2],
  );
  expect(onTop).toBe('reserve-tab-birds');
  await page.screenshot({ path: testInfo.outputPath('tabs-sticky.png') });

  // Still reachable after a long scroll: switch sections from the stuck strip.
  await frame.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const mammals = strip.getByRole('tab', { name: 'Mammals' });
  await mammals.click();
  await expect(mammals).toHaveAttribute('aria-selected', 'true');
  await expect(frame.getByText('Water vole · Alder carr')).toBeVisible();
  await expect(firstEntry).toBeHidden();
});

test('A sticky Tabs strip turns solid canvas under Reduce Transparency', async ({
  page,
}) => {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }],
  });
  await page.goto('/#tabs');
  const strip = page
    .getByTestId('tabs-sticky-page')
    .getByRole('tablist', { name: 'Reserve log' });
  const solid = await strip.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      background: computed.backgroundColor,
      backdropFilter: computed.backdropFilter,
      canvas: getComputedStyle(element.closest('[data-theme]') ?? document.body)
        .backgroundColor,
      reduced: matchMedia('(prefers-reduced-transparency: reduce)').matches,
    };
  });
  expect(solid.reduced).toBe(true);
  expect(solid.backdropFilter).toBe('none');
  expect(solid.background).toBe(solid.canvas);
});
