import { expect, test, type Page } from '@playwright/test';

test('Tooltip supports hover, focus, Escape, blur, and touch without replacing the trigger name', async ({
  page,
}, testInfo) => {
  await page.goto('/#tooltip');
  const section = page.locator('#tooltip');
  const trigger = section.getByRole('button', { name: 'Sighting details' });
  const tooltip = section.getByRole('tooltip');
  const firstTooltip = section.locator('.sw-tooltip').first();
  await expect(tooltip).toHaveCount(0);

  if (testInfo.project.name === 'mobile-es') {
    // A tap presses the button and leaves its help closed.
    await trigger.tap();
    await expect(section.getByText('Actions pressed: 1.')).toBeVisible();
    await expect(tooltip).toHaveCount(0);
    // A tap on a badge, which does nothing else, toggles its help.
    const badge = section.getByText('Protected', { exact: true });
    await badge.tap();
    await expect(tooltip).toHaveText(/may only be counted from the hides/);
    await section.getByRole('heading', { name: 'Tooltip' }).tap();
    await expect(tooltip).toHaveCount(0);
  } else {
    await trigger.hover();
    await expect(tooltip).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(tooltip).toHaveCount(0);
    // A click focuses the button but does not open its help; the hover
    // that came with it closes when the pointer leaves.
    await trigger.click();
    await page.mouse.move(0, 0);
    await expect(trigger).toBeFocused();
    await expect(tooltip).toHaveCount(0);
  }

  // A keyboard focus opens it.
  await section.getByRole('heading', { name: 'Tooltip' }).click();
  await trigger.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  // The button's own help, by name: on a phone the help of the button after
  // it can still be closing from the taps above.
  const help = section.getByRole('tooltip', {
    name: /^Sighting records include/,
  });
  await expect(help).toBeVisible();
  const tooltipId = await help.getAttribute('id');
  expect(tooltipId).toBeTruthy();
  await expect(trigger).toHaveAttribute('aria-describedby', tooltipId ?? '');
  await section.screenshot({ path: testInfo.outputPath('tooltip-focus.png') });
  await trigger.press('Escape');
  await expect(help).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(help).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(
    section.getByRole('button', { name: 'Habitat guide' }),
  ).toBeFocused();
  await expect(firstTooltip).toBeHidden();
  await expect(section.getByRole('tooltip')).toHaveCount(1);
});

test('Tooltip disabled keeps the trigger mounted without a tooltip or description', async ({
  page,
}) => {
  await page.goto('/#tooltip');
  const section = page.locator('#tooltip');
  const map = section.getByRole('button', { name: 'Habitat map' });
  const before = await map.elementHandle();
  if (!before) throw new Error('The map button is missing');

  await map.focus();
  await expect(section.getByRole('tooltip')).toHaveText(
    'Where each species lives',
  );
  await expect(map).toHaveAccessibleDescription('Where each species lives');

  await section.getByRole('switch', { name: "Show the map's help" }).check();
  await expect(
    section.getByText('Where each species lives', { exact: true }),
  ).toBeVisible();
  await expect(map).not.toHaveAttribute('aria-describedby');
  await expect(map).toHaveAccessibleDescription('');
  await map.focus();
  await map.hover();
  await expect(section.getByRole('tooltip')).toHaveCount(0);
  // The sighting, habitat guide, badge, range map and field notes tooltips.
  await expect(section.locator('.sw-tooltip')).toHaveCount(5);
  // The same button, not a new one, so a focused trigger would keep its focus.
  expect(await before.evaluate((element) => element.isConnected)).toBe(true);
});

/**
 * Chromium's own accessible name and description of the button `find`
 * returns in the page, not Playwright's computation.
 */
async function chromiumNaming(page: Page, find: string) {
  const cdp = await page.context().newCDPSession(page);
  const { result } = await cdp.send('Runtime.evaluate', { expression: find });
  if (!result.objectId) throw new Error(`${find} found nothing`);
  const { nodes } = await cdp.send('Accessibility.getPartialAXTree', {
    fetchRelatives: false,
    objectId: result.objectId,
  });
  await cdp.detach();
  return {
    description: nodes[0]?.description?.value ?? '',
    name: nodes[0]?.name?.value ?? '',
  };
}

// The range map's anchor reads "Range map" whether the words are its
// tooltip's or the button's own.
const rangeMapButton = `[...document.querySelectorAll('#tooltip .sw-tooltip-anchor')]
  .find((anchor) => anchor.textContent === 'Range map')
  ?.querySelector('button')`;

test('Tooltip relationship label names an icon-only trigger once, and its own name stands while disabled', async ({
  page,
}, testInfo) => {
  await page.goto('/#tooltip');
  const section = page.locator('#tooltip');
  const map = section.getByRole('button', { name: 'Range map' });
  const before = await map.elementHandle();
  if (!before) throw new Error('The range map button is missing');
  await expect(map).toHaveText('');
  await expect(map).toHaveAccessibleDescription('');
  await expect(section.getByRole('tooltip')).toHaveCount(0);
  const tooltipId = await map.getAttribute('aria-labelledby');
  expect(tooltipId).toBeTruthy();
  // The hidden tooltip names the button in the browser's own tree too.
  expect(await chromiumNaming(page, rangeMapButton)).toEqual({
    description: '',
    name: 'Range map',
  });

  if (testInfo.project.name === 'mobile-es') {
    // A tap opens the destination and leaves its name closed.
    await map.tap();
    await expect(section.getByText('Opened: Range map.')).toBeVisible();
    await expect(section.getByRole('tooltip')).toHaveCount(0);
    await section.getByRole('heading', { name: 'Tooltip' }).tap();
  } else {
    await map.hover();
    await expect(section.getByRole('tooltip')).toHaveText('Range map');
    await page.mouse.move(0, 0);
  }
  await expect(section.getByRole('tooltip')).toHaveCount(0);

  // A keyboard focus shows the name.
  await map.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const tooltip = section.getByRole('tooltip');
  await expect(tooltip).toHaveText('Range map');
  await expect(tooltip).toHaveAttribute('id', tooltipId ?? '');
  await expect(map).not.toHaveAttribute('aria-describedby');
  await section.screenshot({
    path: testInfo.outputPath('tooltip-label-focus.png'),
  });
  await map.press('Escape');
  await expect(section.getByRole('tooltip')).toHaveCount(0);
  await expect(map).toBeFocused();
  await expect(map).toHaveAccessibleName('Range map');

  const names = section.getByRole('switch', {
    name: "Show the destinations' names",
  });
  await names.check();
  // The visible name names the same button; no reference to a missing tooltip.
  await expect(map).toHaveText('Range map');
  await section.screenshot({
    path: testInfo.outputPath('tooltip-label-names.png'),
  });
  await expect(map).not.toHaveAttribute('aria-labelledby');
  await expect(map).toHaveAccessibleDescription('');
  await map.focus();
  await map.hover();
  await expect(section.getByRole('tooltip')).toHaveCount(0);
  expect(await before.evaluate((element) => element.isConnected)).toBe(true);
  expect(await chromiumNaming(page, rangeMapButton)).toEqual({
    description: '',
    name: 'Range map',
  });

  await names.uncheck();
  await expect(map).toHaveText('');
  await expect(map).toHaveAttribute('aria-labelledby', /.+/);
  await expect(map).toHaveAccessibleName('Range map');
  expect(await before.evaluate((element) => element.isConnected)).toBe(true);
});

test('Tooltip keeps its bubble inside the screen beside a trigger at the edge', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#tooltip');
  const section = page.locator('#tooltip');
  const badge = section.getByText('Protected', { exact: true });
  await badge.scrollIntoViewIfNeeded();
  // Move the badge to the screen's right edge, as a header's last control.
  await badge.evaluate((element) => {
    const anchor = element.closest('.sw-tooltip-anchor') as HTMLElement;
    anchor.style.position = 'fixed';
    anchor.style.right = '8px';
    anchor.style.top = '120px';
  });
  await badge.focus();
  const tooltip = section.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
  const box = await tooltip.boundingBox();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  expect(box!.x).toBeGreaterThanOrEqual(8);
  expect(box!.x + box!.width).toBeLessThanOrEqual(width - 8 + 0.5);
  // Under the badge, a small gap away.
  const anchorBox = await badge.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(anchorBox!.y + anchorBox!.height);
  await page.screenshot({
    path: testInfo.outputPath('tooltip-edge.png'),
    clip: { x: 0, y: 80, width: 390, height: 200 },
  });
});
