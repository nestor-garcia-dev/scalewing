import { expect, test, type Locator, type Page } from '@playwright/test';

function pageOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}

async function expectInsideViewport(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box && viewport).toBeTruthy();
  if (box && viewport) {
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  }
}

function formatRange(
  locale: string,
  options: Intl.DateTimeFormatOptions,
  start: string,
  end: string,
) {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: 'UTC',
  }).formatRange(new Date(`${start}T12:00:00Z`), new Date(`${end}T12:00:00Z`));
}

const short = { month: 'short', day: 'numeric', year: 'numeric' } as const;
const long = { weekday: 'short', ...short } as const;

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(true);
});

test('DateRangeButton picks a first and a last day and applies them', async ({
  page,
}, testInfo) => {
  await page.goto('/#date-range-button');
  const section = page.locator('#date-range-button');
  const shown = formatRange('en-US', short, '2026-10-06', '2026-10-12');
  const button = section.getByRole('button', {
    name: `Choose survey period, ${shown}`,
  });
  await expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  // The range shown is the visible text; the name adds the label.
  await expect(button.locator('[aria-hidden="true"]').last()).toHaveText(shown);
  const box = await button.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);

  const phone = (page.viewportSize()?.width ?? 0) < 768;
  const overflowBefore = await pageOverflow(page);
  await button.click();
  const picker = page.getByRole('dialog', { name: 'Choose survey period' });
  await expect(picker).toBeVisible();
  await expect(picker.getByRole('grid')).toHaveCount(phone ? 1 : 2);
  await expect(
    picker.getByRole('grid', { name: 'October 2026' }),
  ).toBeVisible();
  if (!phone)
    await expect(
      picker.getByRole('grid', { name: 'September 2026' }),
    ).toBeVisible();
  await expect(
    picker.getByRole('button', { name: 'Last 7 days' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expectInsideViewport(page, picker);
  expect(await pageOverflow(page)).toBeLessThanOrEqual(overflowBefore);
  await page.screenshot({ path: testInfo.outputPath('date-range-open.png') });
  // The open calendar sits beside the button in the attached group; the
  // next button keeps its divider and the last its rounded corners.
  const after = section.getByRole('button', { name: 'The period after' });
  await expect(after).toHaveCSS('margin-left', '-1px');
  await expect(after).not.toHaveCSS('border-top-right-radius', '0px');

  // Days after the station's today cannot be picked.
  await expect(
    picker.getByRole('gridcell', { name: 'Wednesday, October 14, 2026' }),
  ).toHaveAttribute('aria-disabled', 'true');
  await picker
    .getByRole('gridcell', { name: 'Thursday, October 1, 2026' })
    .click();
  await picker
    .getByRole('gridcell', { name: 'Saturday, October 10, 2026' })
    .click();
  const line = formatRange('en-US', long, '2026-10-01', '2026-10-10');
  if (phone)
    await expect(picker).toHaveAccessibleDescription(`${line} · 10 days`);
  else await expect(picker.getByRole('status')).toHaveText(`${line} 10 days`);
  await expect(
    picker.getByRole('gridcell', { name: 'Monday, October 5, 2026' }),
  ).toHaveAttribute('aria-selected', 'true');
  await picker.getByRole('button', { name: 'Apply' }).click();
  await expect(picker).toBeHidden();
  await expect(
    section.getByText('Serialized survey period: 2026-10-01 to 2026-10-10.'),
  ).toBeVisible();
  await expect(
    section.getByRole('button', {
      name: `Choose survey period, ${formatRange('en-US', short, '2026-10-01', '2026-10-10')}`,
    }),
  ).toBeFocused();
});

test('DateRangeButton keeps the value on Cancel and Escape, and a preset applies at once', async ({
  page,
}) => {
  await page.goto('/#date-range-button');
  const section = page.locator('#date-range-button');
  const button = section.getByRole('button', {
    name: /^Choose survey period, /,
  });
  const picker = page.getByRole('dialog', { name: 'Choose survey period' });

  await button.click();
  await picker
    .getByRole('gridcell', { name: 'Thursday, October 1, 2026' })
    .click();
  await picker.getByRole('button', { name: 'Cancel' }).click();
  await expect(picker).toBeHidden();
  await expect(button).toBeFocused();

  await button.press('Enter');
  await expect(picker).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(picker).toBeHidden();
  await expect(
    section.getByText('Serialized survey period: 2026-10-06 to 2026-10-12.'),
  ).toBeVisible();

  await button.click();
  await picker.getByRole('button', { name: 'Last month' }).click();
  await expect(picker).toBeHidden();
  await expect(
    section.getByText('Serialized survey period: 2026-09-01 to 2026-09-30.'),
  ).toBeVisible();
  // The period after would pass today; the one before steps 30 days back.
  await expect(
    section.getByRole('button', { name: 'The period after' }),
  ).toHaveAttribute('aria-disabled', 'true');
  await section.getByRole('button', { name: 'The period before' }).click();
  await expect(
    section.getByText('Serialized survey period: 2026-08-02 to 2026-08-31.'),
  ).toBeVisible();
});

test('DateRangeButton moves by keyboard and limits the length', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === 'mobile-es',
    'The sheet is a touch layout; the popover holds the keyboard path.',
  );
  await page.goto('/#date-range-button');
  const section = page.locator('#date-range-button');
  await section
    .getByRole('button', { name: /^Choose survey period, / })
    .focus();
  await page.keyboard.press('Enter');
  const picker = page.getByRole('dialog', { name: 'Choose survey period' });
  await expect(
    picker.getByRole('gridcell', { name: 'Monday, October 12, 2026' }),
  ).toBeFocused();
  // Shift+PageUp moves a year back; the months follow the focus.
  await page.keyboard.press('Shift+PageUp');
  await expect(
    picker.getByRole('grid', { name: 'October 2025' }),
  ).toBeVisible();
  await page.keyboard.press('Enter');
  // 366 days from Oct 12, 2025 is Oct 12, 2026; nothing after it is pickable.
  await page.keyboard.press('Shift+PageDown');
  await expect(
    picker.getByRole('gridcell', { name: 'Monday, October 12, 2026' }),
  ).toBeFocused();
  await expect(
    picker.getByRole('gridcell', { name: 'Monday, October 12, 2026' }),
  ).not.toHaveAttribute('aria-disabled', /.*/);
  await expect(
    picker.getByRole('gridcell', { name: 'Tuesday, October 13, 2026' }),
  ).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('Enter');
  await expect(picker.getByRole('status')).toContainText('366 days');
  await page.keyboard.press('Tab');
  await expect(picker.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(
    section.getByText('Serialized survey period: 2025-10-12 to 2026-10-12.'),
  ).toBeVisible();
});

test('DateRangeButton fits two months on a tablet, the presets above them', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-en',
    'One width between md and lg is enough.',
  );
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto('/#date-range-button');
  await page
    .locator('#date-range-button')
    .getByRole('button', { name: /^Choose survey period, / })
    .click();
  const picker = page.getByRole('dialog', { name: 'Choose survey period' });
  const grids = picker.getByRole('grid');
  await expect(grids).toHaveCount(2);
  await expectInsideViewport(page, picker);
  const presets = await picker
    .getByRole('group', { name: 'Presets' })
    .boundingBox();
  const months = await grids.first().boundingBox();
  expect(presets && months).toBeTruthy();
  if (presets && months)
    expect(presets.y + presets.height).toBeLessThanOrEqual(months.y);
  expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
  await page.screenshot({ path: testInfo.outputPath('date-range-tablet.png') });
});

test('DateRangeButton speaks Spanish and keeps a phone page from scrolling sideways', async ({
  page,
}, testInfo) => {
  await page.goto('/#date-range-button');
  const section = page.locator('#date-range-button');
  const button = section.getByRole('button', {
    name: `Elegir periodo del censo, ${formatRange('es', short, '2026-09-01', '2026-09-14')}`,
  });
  await expectInsideViewport(page, button);
  if ((page.viewportSize()?.width ?? 0) < 768)
    expect(await pageOverflow(page)).toBe(0);
  await button.click();
  const picker = page.getByRole('dialog', { name: 'Elegir periodo del censo' });
  await expect(picker.getByRole('columnheader').first()).toHaveAttribute(
    'abbr',
    'lunes',
  );
  await expect(picker.getByRole('group')).toHaveCount(0);
  await expect(picker.getByRole('button', { name: 'Mostrar' })).toBeVisible();
  await expectInsideViewport(page, picker);
  await page.screenshot({ path: testInfo.outputPath('date-range-es.png') });
  await picker.getByRole('button', { name: 'Cancelar' }).click();
  await expect(picker).toBeHidden();
});

test('DateRangeButton draws its range and pressed preset in system colours', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'forced-colors',
    'Checks forced colours only.',
  );
  await page.goto('/#date-range-button');
  await page
    .locator('#date-range-button')
    .getByRole('button', { name: /^Choose survey period, / })
    .click();
  const picker = page.getByRole('dialog', { name: 'Choose survey period' });
  const pressed = picker.getByRole('button', { name: 'Last 7 days' });
  const highlight = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'Highlight';
    document.body.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  });
  await expect(pressed).toHaveCSS('background-color', highlight);
  const between = picker.getByRole('gridcell', {
    name: 'Friday, October 9, 2026',
  });
  const end = picker.getByRole('gridcell', {
    name: 'Monday, October 12, 2026',
  });
  const [betweenFill, endFill] = await Promise.all([
    between.evaluate((node) => getComputedStyle(node).backgroundColor),
    end.evaluate((node) => getComputedStyle(node).backgroundColor),
  ]);
  expect(betweenFill).not.toBe('rgba(0, 0, 0, 0)');
  expect(betweenFill).not.toBe(endFill);
});
