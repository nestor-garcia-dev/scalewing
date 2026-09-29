import { expect, test } from '@playwright/test';

test('SegmentedControl filled variant stretches, splits evenly and fills the selection', async ({
  page,
}, testInfo) => {
  await page.goto('/#segmented-control');
  const section = page.locator('#segmented-control');
  const filled = section.getByRole('radiogroup', { name: 'Survey period' });
  const filledBox = await filled.boundingBox();
  // The track sits in its field wrapper (for the error message); the
  // wrapper's parent is the layout it stretches in.
  const layoutWidth = (element: HTMLElement) =>
    (
      element.closest('.sw-segmented-field')!.parentElement as HTMLElement
    ).getBoundingClientRect().width;
  const parentBox = { width: await filled.evaluate(layoutWidth) };
  expect(filledBox).not.toBeNull();
  expect(Math.abs((filledBox?.width ?? 0) - parentBox.width)).toBeLessThan(2);

  const day = filled.getByRole('radio', { name: 'Daytime' });
  const night = filled.getByRole('radio', { name: 'Nighttime' });
  const dayBox = await day.boundingBox();
  const nightBox = await night.boundingBox();
  expect(Math.abs((dayBox?.width ?? 0) - (nightBox?.width ?? 0))).toBeLessThan(
    2,
  );

  const fill = (element: HTMLElement) =>
    getComputedStyle(element).backgroundColor;
  const selectedFill = await day.evaluate(fill);
  const idleFill = await night.evaluate(fill);
  expect(selectedFill).not.toBe(idleFill);
  await expect(day).toHaveAttribute('aria-checked', 'true');
  await night.click();
  await expect(night).toHaveAttribute('aria-checked', 'true');
  expect(await night.evaluate(fill)).toBe(selectedFill);
  // In an Inline the same variant takes only its labels' width, halves still equal.
  const inline = section.getByRole('radiogroup', { name: 'Species names' });
  const inlineBox = await inline.boundingBox();
  // Well under the full width the same variant takes in a Stack (at 390 px
  // the Inline wraps, so its own width is no measure).
  expect(inlineBox?.width ?? 0).toBeLessThan((filledBox?.width ?? 0) * 0.75);
  const common = await inline
    .getByRole('radio', { name: 'Common' })
    .boundingBox();
  const scientific = await inline
    .getByRole('radio', { name: 'Scientific' })
    .boundingBox();
  expect(
    Math.abs((common?.width ?? 0) - (scientific?.width ?? 0)),
  ).toBeLessThan(2);
  // A disabled control keeps its recorded choice and refuses clicks and arrows.
  const recorded = section.getByRole('radiogroup', {
    name: 'Recorded sighting',
  });
  await expect(recorded).toHaveAttribute('aria-disabled', 'true');
  const wild = recorded.getByRole('radio', { name: 'In the wild' });
  const captive = recorded.getByRole('radio', { name: 'In captivity' });
  await expect(captive).toBeDisabled();
  await wild.focus();
  await page.keyboard.press('ArrowRight');
  await expect(wild).toHaveAttribute('aria-checked', 'true');
  expect(
    await recorded.evaluate((element) => getComputedStyle(element).opacity),
  ).not.toBe('1');
  await section.screenshot({
    path: testInfo.outputPath('segmented-control.png'),
  });
});

test('SegmentedControl shows an error under the track, described on the group', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#segmented-control');
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(forced);
  const section = page.locator('#segmented-control');
  const group = section.getByRole('radiogroup', { name: 'Herd movement' });
  const field = group.locator('xpath=..');
  const region = field.locator('.sw-field-error');
  await expect(group).toHaveAttribute('aria-required', 'true');
  // The polite region exists, empty, before any error (as Field's does).
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(region).toHaveText('');
  await expect(group).not.toHaveAttribute('aria-invalid', 'true');
  const border = () =>
    group.evaluate((element) => getComputedStyle(element).borderTopColor);
  const idleBorder = await border();
  const widthBefore = (await group.boundingBox())?.width ?? 0;
  // The filled Herd movement takes the Stack's width; so does compact.
  const filledBoxWidth = (await group.boundingBox())?.width;
  const button = section.getByRole('button', { name: 'Log movement' });
  const gapBefore =
    ((await button.boundingBox())?.y ?? 0) -
    ((await group.boundingBox())?.y ?? 0);

  await button.click();
  await expect(region).toHaveText('Choose arriving or leaving.');
  await expect(group).toHaveAttribute('aria-invalid', 'true');
  await expect(group).toHaveAccessibleDescription(
    'Choose arriving or leaving.',
  );
  await expect(section.getByRole('alert')).toHaveCount(0);
  // Teisoro DRW-20: the direction's outline turns danger beside the red
  // Reason and Notes.
  expect(await border()).not.toBe(idleBorder);
  // Under the track, and the track keeps its width.
  const regionBox = await region.boundingBox();
  const groupBox = await group.boundingBox();
  expect(regionBox!.y).toBeGreaterThanOrEqual(groupBox!.y + groupBox!.height);
  expect(Math.abs(groupBox!.width - widthBefore)).toBeLessThan(1);
  // The compact variant in a Stack: the message sits under a track that
  // keeps its full width, on one line (review of PR #75).
  const groupSize = section.getByRole('radiogroup', { name: 'Group size' });
  const sizeMessage = groupSize.locator('xpath=..').locator('.sw-field-error');
  await expect(sizeMessage).toHaveText('Choose the group size.');
  await expect(groupSize).toHaveAttribute('aria-invalid', 'true');
  await expect(groupSize).toHaveAccessibleDescription('Choose the group size.');
  const sizeBox = await groupSize.boundingBox();
  const sizeMessageBox = await sizeMessage.boundingBox();
  expect(sizeMessageBox!.y).toBeGreaterThanOrEqual(
    sizeBox!.y + sizeBox!.height,
  );
  expect(Math.abs(sizeMessageBox!.width - sizeBox!.width)).toBeLessThan(1);
  expect(Math.abs(sizeBox!.width - (filledBoxWidth ?? 0))).toBeLessThan(1);
  expect(sizeMessageBox!.height).toBeLessThanOrEqual(
    await sizeMessage.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).lineHeight),
    ),
  );
  await section.screenshot({
    path: testInfo.outputPath('segmented-control-error.png'),
  });

  await group.getByRole('radio', { name: 'Leaving' }).click();
  await groupSize.getByRole('radio', { name: 'Pair' }).click();
  await expect(region).toHaveText('');
  await expect(sizeMessage).toHaveText('');
  await expect(group).not.toHaveAttribute('aria-invalid', 'true');
  // Empty again, the region takes no room.
  const gapAfter =
    ((await button.boundingBox())?.y ?? 0) -
    ((await group.boundingBox())?.y ?? 0);
  expect(Math.abs(gapAfter - gapBefore)).toBeLessThan(1);
});
