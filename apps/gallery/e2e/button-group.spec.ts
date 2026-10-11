import { expect, test } from '@playwright/test';

test('ButtonGroup sits at the end on desktop and stacks full width on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#button-group');
  const section = page.locator('#button-group');
  const group = section.getByRole('group', { name: 'Sighting actions' });
  const discard = group.getByRole('button', { name: 'Discard' });
  const save = group.getByRole('button', { name: 'Save sighting' });
  const groupBox = await group.boundingBox();
  const discardBox = await discard.boundingBox();
  const saveBox = await save.boundingBox();
  expect(groupBox).not.toBeNull();
  expect(discardBox).not.toBeNull();
  expect(saveBox).not.toBeNull();
  const isPhone = testInfo.project.name === 'mobile-es';
  if (isPhone) {
    // Stacked, each button the whole row, primary last.
    expect((saveBox?.y ?? 0) > (discardBox?.y ?? 0)).toBe(true);
    expect(
      Math.abs((saveBox?.width ?? 0) - (groupBox?.width ?? 0)),
    ).toBeLessThan(2);
    expect(
      Math.abs((discardBox?.width ?? 0) - (groupBox?.width ?? 0)),
    ).toBeLessThan(2);
  } else {
    // One row, flush with the end of the group.
    expect(Math.abs((saveBox?.y ?? 0) - (discardBox?.y ?? 0))).toBeLessThan(2);
    const groupEnd = (groupBox?.x ?? 0) + (groupBox?.width ?? 0);
    const saveEnd = (saveBox?.x ?? 0) + (saveBox?.width ?? 0);
    expect(Math.abs(groupEnd - saveEnd)).toBeLessThan(2);
    expect((saveBox?.width ?? 0) < (groupBox?.width ?? 0) / 2).toBe(true);
  }
  await save.click();
  await expect(section.getByText('Last press: Save sighting')).toBeVisible();
  await section.screenshot({ path: testInfo.outputPath('button-group.png') });
});

test('ButtonGroup attached is one joined control that keeps its row on a phone', async ({
  page,
}, testInfo) => {
  await page.goto('/#button-group');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const group = page.getByRole('group', { name: 'Survey day' });
  const previous = group.getByRole('button', { name: 'Previous day' });
  const today = group.getByRole('button', { name: 'Today' });
  const next = group.getByRole('button', { name: 'Next day' });
  await expect(next).toBeDisabled();
  const [a, b, c] = await Promise.all(
    [previous, today, next].map(
      async (button) => (await button.boundingBox())!,
    ),
  );
  // One row of one height, touching: each button starts where the last
  // ended, less the shared 1 px border.
  expect(Math.abs(a!.y - b!.y)).toBeLessThan(1);
  expect(Math.abs(a!.height - c!.height)).toBeLessThan(1);
  expect(Math.abs(b!.x - (a!.x + a!.width - 1))).toBeLessThan(1);
  expect(Math.abs(c!.x - (b!.x + b!.width - 1))).toBeLessThan(1);
  const corners = () =>
    Promise.all(
      [previous, today, next].map((button) =>
        button.evaluate((node) => {
          const style = getComputedStyle(node);
          return [style.borderTopLeftRadius, style.borderTopRightRadius];
        }),
      ),
    );
  let radii = await corners();
  expect(radii[0]![0]).not.toBe('0px');
  expect(radii[0]![1]).toBe('0px');
  expect(radii[1]).toEqual(['0px', '0px']);
  expect(radii[2]![0]).toBe('0px');
  expect(radii[2]![1]).not.toBe('0px');
  // Right to left mirrors the outer corners.
  await group.evaluate((node) => node.setAttribute('dir', 'rtl'));
  radii = await corners();
  expect(radii[0]![1]).not.toBe('0px');
  expect(radii[0]![0]).toBe('0px');
  await group.evaluate((node) => node.removeAttribute('dir'));
  // The group is as wide as its buttons, even on a phone.
  const box = (await group.boundingBox())!;
  expect(Math.abs(box.width - (c!.x + c!.width - a!.x))).toBeLessThan(2);
  // Keyboard focus keeps the standard outer ring, raised over the
  // neighbours so the next button does not cover it.
  await previous.focus();
  await page.keyboard.press('Tab');
  await expect(today).toBeFocused();
  const focus = await today.evaluate((node) => {
    const style = getComputedStyle(node);
    return [style.position, style.zIndex, style.outlineOffset];
  });
  expect(focus).toEqual(['relative', '2', '2px']);
  await group.screenshot({
    path: testInfo.outputPath('button-group-attached.png'),
  });

  // A pressed toggle is raised over its neighbour; a borderless variant
  // still shows a divider (forced colours draw every border).
  const views = page.getByRole('group', { name: 'Sighting view' });
  const list = views.getByRole('button', { name: 'List' });
  await expect(list).toHaveAttribute('aria-pressed', 'true');
  await expect(list).toHaveCSS('z-index', '1');
  const recount = page
    .getByRole('group', { name: 'Count actions' })
    .getByRole('button', { name: 'Recount' });
  const divider = await recount.evaluate((node) => {
    const style = getComputedStyle(node);
    return [
      style.borderLeftWidth,
      style.borderLeftStyle,
      style.borderLeftColor,
    ];
  });
  expect(divider[0]).toBe('1px');
  expect(divider[1]).toBe('solid');
  if (!forced) expect(divider[2]).not.toBe('rgba(0, 0, 0, 0)');
});
