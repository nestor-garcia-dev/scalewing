import { expect, type Locator, test } from '@playwright/test';

async function boxes(bar: Locator) {
  return bar.evaluate((node) => {
    const track = node.getBoundingClientRect();
    const fill = node.firstElementChild!.getBoundingClientRect();
    return {
      track: { x: track.x, width: track.width },
      fill: { x: fill.x, width: fill.width },
    };
  });
}

test('DataBar draws a statement line from the running total, hidden from assistive technology', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#data-bar');
  // The project's forcedColors use option alone leaves the media query
  // unmatched here, so emulate it as the other forced-colours specs do.
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', { name: 'How the colony moved' });
  await table.scrollIntoViewIfNeeded();

  // The row reads as its name and figure: the bar is not in the tree.
  const flewIn = table.getByRole('row', { name: 'Flew in +34' });
  await expect(flewIn).toBeVisible();
  const bar = flewIn.locator('.sw-data-bar');
  await expect(bar).toHaveAttribute('aria-hidden', 'true');

  // From 120 to 154 of 0 to 160: starts at 75 % and runs 21.25 %.
  const { track, fill } = await boxes(bar);
  expect(fill.x - track.x).toBeCloseTo(track.width * 0.75, 0);
  expect(fill.width).toBeCloseTo(track.width * 0.2125, 0);

  // Each tone is its own fill; forced colours draw them all as text.
  const fills = await table
    .locator('.sw-data-bar-fill')
    .evaluateAll((nodes) =>
      nodes.map((n) => getComputedStyle(n).backgroundColor),
    );
  expect(fills).toHaveLength(5);
  if (forced) {
    // CanvasText, not Canvas: drawn, not blanked out.
    const canvasText = await table.evaluate((node) => {
      const probe = document.createElement('span');
      probe.style.color = 'CanvasText';
      node.append(probe);
      const colour = getComputedStyle(probe).color;
      probe.remove();
      return colour;
    });
    expect(new Set(fills)).toEqual(new Set([canvasText]));
  } else expect(new Set(fills).size).toBe(5);

  // Right to left, the bar mirrors: it ends 75 % from the right.
  await table.evaluate((node) => node.setAttribute('dir', 'rtl'));
  const rtl = await boxes(bar);
  const fromRight =
    rtl.track.x + rtl.track.width - (rtl.fill.x + rtl.fill.width);
  expect(fromRight).toBeCloseTo(rtl.track.width * 0.75, 0);
  await table.evaluate((node) => node.removeAttribute('dir'));
  await table.screenshot({ path: testInfo.outputPath('data-bar.png') });
});

test('DataBar on a domain either side of zero draws a zero line and bars either way', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#data-bar');
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const table = page.getByRole('table', { name: 'Counted against expected' });
  await table.scrollIntoViewIfNeeded();
  await expect(
    table.getByRole('cell', { name: '−6', exact: true }),
  ).toBeVisible();

  const up = table
    .getByRole('row', { name: 'North reed bed +9' })
    .locator('.sw-data-bar');
  const down = table
    .getByRole('row', { name: 'East shore −6' })
    .locator('.sw-data-bar');
  await expect(up).toHaveClass(/sw-data-bar-diverging/);
  const zero = await up.evaluate((node) => {
    const style = getComputedStyle(node, '::before');
    const probe = document.createElement('span');
    probe.style.color = 'CanvasText';
    node.append(probe);
    const canvasText = getComputedStyle(probe).color;
    probe.remove();
    return {
      left: parseFloat(style.left) + parseFloat(style.marginLeft),
      width: style.width,
      fill: style.backgroundColor,
      canvasText,
    };
  });
  if (forced) expect(zero.fill).toBe(zero.canvasText);
  const a = await boxes(up);
  // Centred on zero: its middle half a pixel past its left edge.
  expect(Math.abs(zero.left + 0.5 - a.track.width / 2)).toBeLessThanOrEqual(
    0.5,
  );
  expect(zero.width).toBe('1px');
  // +9 runs from the middle toward the end, −6 from the middle toward the start.
  expect(a.fill.x - a.track.x).toBeCloseTo(a.track.width / 2, 0);
  expect(a.fill.width).toBeCloseTo(a.track.width * 0.45, 0);
  const b = await boxes(down);
  expect(b.fill.x + b.fill.width - b.track.x).toBeCloseTo(b.track.width / 2, 0);
  expect(b.fill.width).toBeCloseTo(b.track.width * 0.3, 0);
  // The end at zero is square, the far end rounded.
  const corners = await up.evaluate((node) => {
    const style = getComputedStyle(node.firstElementChild!);
    return [style.borderTopLeftRadius, style.borderTopRightRadius];
  });
  expect(corners[0]).toBe('0px');
  expect(corners[1]).not.toBe('0px');
  // A change past the domain is clamped to its end.
  const past = await boxes(
    table.getByRole('row', { name: 'Old quarry +14' }).locator('.sw-data-bar'),
  );
  expect(past.fill.x + past.fill.width).toBeCloseTo(
    past.track.x + past.track.width,
    0,
  );
  // A shortage is drawn in danger, apart from the over count's success;
  // forced colours draw both as text.
  await expect(down).toHaveClass(/sw-data-bar-danger/);
  const [short, over] = await Promise.all(
    [down, up].map((bar) =>
      bar.evaluate(
        (node) => getComputedStyle(node.firstElementChild!).backgroundColor,
      ),
    ),
  );
  // Money out's grey, from the statement above.
  const out = await page
    .getByRole('row', { name: 'Flew off −18' })
    .locator('.sw-data-bar-fill')
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  if (forced) {
    expect(short).toBe(zero.canvasText);
    expect(over).toBe(zero.canvasText);
  } else {
    expect(short).not.toBe(over);
    expect(short).not.toBe(out);
  }
  await table.screenshot({
    path: testInfo.outputPath('data-bar-diverging.png'),
  });
});
