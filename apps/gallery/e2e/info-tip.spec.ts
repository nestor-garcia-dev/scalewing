import { expect, test, type Locator, type Page } from '@playwright/test';

import { systemColor } from './contrast.js';

const tip = 'Counted at the last high tide, before the hides opened';

// The project's forcedColors option alone does not reach the page's media
// queries, so the forced-colors project emulates it as the other specs do.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(true);
});

/** The bubble keeps a space-2 (8 px) inset inside the screen. */
async function expectInsideTheScreen(page: Page, bubble: Locator) {
  const box = await bubble.boundingBox();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  expect(box!.x).toBeGreaterThanOrEqual(8 - 0.5);
  expect(box!.x + box!.width).toBeLessThanOrEqual(width - 8 + 0.5);
}

test('InfoTip opens on a press, hover or keyboard focus, as the button’s description, and never submits its form', async ({
  page,
}, testInfo) => {
  await page.goto('/#info-tip');
  const section = page.locator('#info-tip');
  const button = section.getByRole('button', {
    name: 'About the expected waders',
  });
  await button.scrollIntoViewIfNeeded();
  // Its own bubble, by name: a Tab moves on to the next InfoTip's.
  const bubble = section.getByRole('tooltip', { name: tip });
  const status = section.getByRole('status').first();
  const submitted = section.getByText('Counts submitted: 0');
  await expect(button).toHaveAccessibleDescription(tip);
  await expect(button).toHaveAttribute('type', 'button');
  await expect(bubble).toHaveCount(0);
  await expect(status).toHaveText('');
  const target = await button.boundingBox();
  expect(target!.width).toBeGreaterThanOrEqual(44);
  expect(target!.height).toBeGreaterThanOrEqual(44);

  if (testInfo.project.name === 'mobile-es') {
    // A tap opens it, unlike a Tooltip on a Button, and a press says it.
    await button.tap();
    await expect(bubble).toHaveText(tip);
    await expect(status).toHaveText(tip);
    await expectInsideTheScreen(page, bubble);
    await section.screenshot({ path: testInfo.outputPath('info-tip-tap.png') });
    await button.tap();
    await expect(bubble).toHaveCount(0);
    await expect(status).toHaveText('');
    await button.tap();
    await expect(bubble).toBeVisible();
    // A tap outside closes it.
    await section.getByRole('heading', { name: 'InfoTip' }).tap();
    await expect(bubble).toHaveCount(0);
    // The small one is still a 44 px target on a touch screen.
    const small = await section
      .getByRole('button', { name: 'About the tide table' })
      .boundingBox();
    expect(small!.width).toBeGreaterThanOrEqual(44);
    expect(small!.height).toBeGreaterThanOrEqual(44);
  } else {
    await button.hover();
    await expect(bubble).toHaveText(tip);
    await page.mouse.move(0, 0);
    await expect(bubble).toHaveCount(0);
    // A click opens it and keeps it open after the pointer leaves.
    await button.click();
    await page.mouse.move(0, 0);
    await expect(bubble).toHaveText(tip);
    await expect(status).toHaveText(tip);
    await expectInsideTheScreen(page, bubble);
    await button.click();
    await expect(bubble).toHaveCount(0);
    await page.mouse.move(0, 0);
    // A click outside closes it.
    await button.click();
    await page.mouse.move(0, 0);
    await expect(bubble).toBeVisible();
    await section.getByRole('heading', { name: 'InfoTip' }).click();
    await expect(bubble).toHaveCount(0);
  }

  // A keyboard focus shows it; Enter and Space toggle it; Escape closes it.
  await button.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expect(bubble).toHaveText(tip);
  await expect(status).toHaveText('');
  await page.keyboard.press('Enter');
  await expect(status).toHaveText(tip);
  await section.screenshot({ path: testInfo.outputPath('info-tip-focus.png') });
  await page.keyboard.press('Enter');
  await expect(bubble).toHaveCount(0);
  await page.keyboard.press('Space');
  await expect(bubble).toHaveText(tip);
  await page.keyboard.press('Escape');
  await expect(bubble).toHaveCount(0);
  await expect(button).toBeFocused();
  await page.keyboard.press('Space');
  await expect(bubble).toBeVisible();
  // Blur closes it.
  await page.keyboard.press('Tab');
  await expect(bubble).toHaveCount(0);

  // None of the presses submitted the form around it.
  await expect(submitted).toBeVisible();
});

test('InfoTip keeps its bubble inside a phone screen at the end of a row', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#info-tip');
  const section = page.locator('#info-tip');
  const button = section.getByRole('button', {
    name: 'About the expected waders',
  });
  await button.scrollIntoViewIfNeeded();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  const anchor = await button.boundingBox();
  // The row puts the glyph at the end of the column, near the right edge.
  expect(anchor!.x + anchor!.width).toBeGreaterThan(width - 64);
  await button.focus();
  await page.keyboard.press('Enter');
  const bubble = section.getByRole('tooltip', { name: tip });
  await expect(bubble).toHaveText(tip);
  await expectInsideTheScreen(page, bubble);
  const box = await bubble.boundingBox();
  // Under the button, or over it where there is no room below.
  const below = box!.y >= anchor!.y + anchor!.height;
  const above = box!.y + box!.height <= anchor!.y;
  expect(below || above).toBe(true);
  if (testInfo.project.name === 'forced-colors') {
    // The bubble keeps a CanvasText border.
    const border = await bubble.evaluate((element) => {
      const style = getComputedStyle(element);
      return { color: style.borderTopColor, style: style.borderTopStyle };
    });
    expect(border).toEqual({
      color: await systemColor(page, 'CanvasText'),
      style: 'solid',
    });
  }
  await page.screenshot({
    path: testInfo.outputPath('info-tip-edge.png'),
    clip: {
      x: 0,
      y: Math.max(0, anchor!.y - 80),
      width: 390,
      height: 240,
    },
  });
});
