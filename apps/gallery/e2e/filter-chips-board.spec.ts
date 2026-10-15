import { expect, test } from '@playwright/test';

test('FilterChips without a drawn label, with inline counts, scroll on one row', async ({
  page,
}, testInfo) => {
  await page.goto('/#filter-chips');
  const group = page.getByRole('group', { name: 'Nocturnal surveys' });
  await expect(group).toBeVisible();
  // The label names the group but is not drawn.
  const legend = group.locator('legend');
  expect(
    await legend.evaluate((node) => node.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(1);
  const owls = group.getByRole('radio', { name: 'Owls heard 3' });
  await expect(owls.locator('xpath=following-sibling::*[1]')).toHaveText(
    'Owls heard · 3',
  );
  // One row: every chip on the first chip's line.
  const tops = await group
    .locator('.sw-filter-chip')
    .evaluateAll((chips) =>
      chips.map((chip) => Math.round(chip.getBoundingClientRect().top)),
    );
  expect(new Set(tops).size).toBe(1);
  const box = group.locator('.sw-filter-chips-options');
  const [scrollWidth, clientWidth] = await box.evaluate((node) => [
    node.scrollWidth,
    node.clientWidth,
  ]);
  const phone = testInfo.project.name === 'mobile-es';
  if (phone) {
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    // The last chip is reached by the keyboard and scrolled into view.
    await group.getByRole('radio', { name: 'All 7' }).focus();
    await page.keyboard.press('ArrowLeft');
    const frogs = group.getByRole('radio', { name: 'Frog chorus 0' });
    await expect(frogs).toBeChecked();
    expect(await box.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
    // The focused chip sits inside the scroll box's visible part.
    const [chip, view] = await Promise.all([
      frogs.locator('xpath=..').boundingBox(),
      box.boundingBox(),
    ]);
    expect(chip!.x).toBeGreaterThanOrEqual(view!.x - 1);
    expect(chip!.x + chip!.width).toBeLessThanOrEqual(
      view!.x + view!.width + 1,
    );
  }
  // The page itself never scrolls sideways.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await group.screenshot({ path: testInfo.outputPath('chips-scroll.png') });

  if (testInfo.project.name === 'forced-colors') return;
  await page.getByRole('radio', { name: 'Dark' }).check();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  await group.screenshot({
    path: testInfo.outputPath('chips-scroll-dark.png'),
  });
});

test('FilterChips multiple turns several chips on as checkboxes', async ({
  page,
}, testInfo) => {
  await page.goto('/#filter-chips');
  const group = page.getByRole('group', { name: 'Watch days' });
  const fri = group.getByRole('checkbox', { name: 'Fri' });
  const mon = group.getByRole('checkbox', { name: 'Mon' });
  await expect(fri).toBeChecked();
  await expect(group.getByRole('checkbox', { name: 'Sat' })).toBeChecked();
  await mon.focus();
  await page.keyboard.press('Space');
  await expect(mon).toBeChecked();
  await expect(page.getByTestId('watch-days')).toHaveText(
    'Watch days: mon, fri, sat.',
  );
  // Each checkbox is its own Tab stop.
  await page.keyboard.press('Tab');
  await expect(group.getByRole('checkbox', { name: 'Tue' })).toBeFocused();
  await fri.click();
  await expect(fri).not.toBeChecked();
  await group.screenshot({ path: testInfo.outputPath('chips-multiple.png') });
});
