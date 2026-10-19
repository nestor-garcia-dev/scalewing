import { expect, test, type Locator } from '@playwright/test';

import { colorContrast, tokenColor } from './contrast.js';

// The project's forcedColors option alone does not reach the page's media
// queries, so the forced-colors project emulates it as the other specs do.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('NavCount reads a count after a Nav word in its name, as a pill', async ({
  page,
}, testInfo) => {
  await page.goto('/#nav');
  const nav = page.getByRole('navigation', { name: 'Reserve areas' });
  const tasks = nav.getByRole('link', { name: 'Tasks 8 tasks to do' });
  await expect(tasks).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('link', { name: 'Nests 12' })).toBeVisible();
  await expect(
    nav.getByRole('link', { name: 'Traps', exact: true }),
  ).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Alerts 3' })).toBeVisible();

  const pill = tasks.locator('.sw-nav-count');
  await expect(pill).toHaveText('8');
  await expect(pill).toHaveAttribute('aria-hidden', 'true');
  const [pillBox, linkBox] = await Promise.all([
    pill.boundingBox(),
    tasks.boundingBox(),
  ]);
  // The pill sits inside the link, centred on the words' line.
  expect(pillBox && linkBox).toBeTruthy();
  if (pillBox && linkBox) {
    expect(pillBox.height).toBeGreaterThanOrEqual(19);
    expect(pillBox.y).toBeGreaterThanOrEqual(linkBox.y);
    expect(pillBox.y + pillBox.height).toBeLessThanOrEqual(
      linkBox.y + linkBox.height + 1,
    );
  }
  if (testInfo.project.name === 'forced-colors')
    await expect(pill).toHaveCSS('border-top-style', 'solid');
  else {
    const [fill, danger] = await Promise.all([
      pill.evaluate((node) => getComputedStyle(node).backgroundColor),
      page.evaluate(() => {
        const probe = document.createElement('div');
        probe.style.color = 'var(--sw-color-danger)';
        document.querySelector('[data-theme]')?.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      }),
    ]);
    expect(fill).toBe(danger);
  }
  await nav.screenshot({ path: testInfo.outputPath('nav-count.png') });
});

test('NavCount tone accent draws news in the accent colour, light and dark', async ({
  page,
}, testInfo) => {
  await page.goto('/#nav');
  const nav = page.getByRole('navigation', { name: 'Reserve areas' });
  const notes = nav.getByRole('link', { name: 'Field notes 3 new' });
  const pill = notes.locator('.sw-nav-count');
  await expect(pill).toHaveText('3');
  await expect(pill).toHaveAttribute('aria-hidden', 'true');
  // The same pill as the danger count beside it, inside its link (the row
  // may wrap on a phone, so the link, not the row, is its line).
  const danger = nav
    .getByRole('link', { name: 'Nests 12' })
    .locator('.sw-nav-count');
  const [accentBox, dangerBox, linkBox] = await Promise.all([
    pill.boundingBox(),
    danger.boundingBox(),
    notes.boundingBox(),
  ]);
  expect(accentBox && dangerBox && linkBox).toBeTruthy();
  expect(accentBox?.height).toBe(dangerBox?.height);
  if (accentBox && linkBox) {
    expect(accentBox.y).toBeGreaterThanOrEqual(linkBox.y);
    expect(accentBox.y + accentBox.height).toBeLessThanOrEqual(
      linkBox.y + linkBox.height + 1,
    );
  }
  if (testInfo.project.name === 'forced-colors') {
    await expect(pill).toHaveCSS('border-top-style', 'solid');
    return;
  }
  const fill = (node: Element) => getComputedStyle(node).backgroundColor;
  for (const scheme of ['Light', 'Dark']) {
    await page.getByRole('radio', { name: scheme }).first().check();
    await expect
      .poll(async () => pill.evaluate(fill))
      .toBe(await tokenColor(page, 'accent'));
    const figures = await pill.evaluate((node) => getComputedStyle(node).color);
    expect(figures).toBe(await tokenColor(page, 'onAccent'));
    expect(colorContrast(figures, await pill.evaluate(fill))).toBeGreaterThan(
      4.5,
    );
    expect(await pill.evaluate(fill)).not.toBe(await danger.evaluate(fill));
    await nav.screenshot({
      path: testInfo.outputPath(`nav-count-accent-${scheme}.png`),
    });
  }
});

/** The space between a destination's words and its pill. */
async function wordsToPill(destination: Locator) {
  return destination.evaluate((node) => {
    const pill = node.querySelector('.sw-nav-count');
    const range = document.createRange();
    const words = [...node.childNodes].find(
      (child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim(),
    );
    if (!pill || !words) return Number.NaN;
    range.selectNodeContents(words);
    return (
      pill.getBoundingClientRect().left - range.getBoundingClientRect().right
    );
  });
}

test('NavCount sits a space-2 after the words, as in a Button and in SectionNav, its words level with the others', async ({
  page,
}) => {
  await page.goto('/#nav');
  const nav = page.getByRole('navigation', { name: 'Reserve areas' });
  const tasks = nav.getByRole('link', { name: /^Tasks / });
  const alerts = nav.getByRole('button', { name: 'Alerts 3' });
  expect(await wordsToPill(tasks)).toBeCloseTo(8, 0);
  expect(await wordsToPill(alerts)).toBeCloseTo(8, 0);
  const rangers = page
    .locator('#section-nav')
    .getByRole('link', { name: /^Rangers/ })
    .first();
  // SectionNav's link spaces its pill by the same gap.
  await expect(rangers.locator('.sw-section-nav-count')).toBeVisible();
  await expect(rangers).toHaveCSS('column-gap', '8px');

  // A link with a count is as tall as one without, its words level.
  const [withCount, without] = await Promise.all([
    tasks.boundingBox(),
    nav.getByRole('link', { name: 'Sightings' }).boundingBox(),
  ]);
  expect(withCount?.height).toBe(without?.height);
  expect(withCount?.y).toBe(without?.y);
});

test('a counted link still hides with hideBelow and hideFrom', async ({
  page,
}, testInfo) => {
  await page.goto('/#nav');
  // A CSS locator: a hidden link leaves the accessibility tree.
  const tasks = page
    .locator('nav[aria-label="Reserve areas"] a')
    .filter({ hasText: 'Tasks' });
  // The classes hideBelow and hideFrom put on a Box: the side that applies
  // at this width hides the link, the other leaves its layout.
  const [hides, keeps] =
    testInfo.project.name === 'mobile-es'
      ? ['sw-hide-below-md', 'sw-hide-from-md']
      : ['sw-hide-from-md', 'sw-hide-below-md'];
  await tasks.evaluate((node, name) => node.classList.add(name), hides);
  await expect(tasks).toHaveCSS('display', 'none');
  await tasks.evaluate((node, [from, to]) => node.classList.replace(from, to), [
    hides,
    keeps,
  ] as const);
  await expect(tasks).toHaveCSS('display', 'flex');
});

test("NavCount names its destinations in Chromium's own accessibility tree", async ({
  page,
}) => {
  await page.goto('/#nav');
  const session = await page.context().newCDPSession(page);
  const { nodes } = (await session.send('Accessibility.getFullAXTree')) as {
    nodes: { role?: { value?: string }; name?: { value?: string } }[];
  };
  const names = nodes
    .filter((node) => ['link', 'button'].includes(node.role?.value ?? ''))
    .map((node) => node.name?.value);
  expect(names).toEqual(
    expect.arrayContaining([
      'Tasks 8 tasks to do',
      'Nests 12',
      'Traps',
      'Field notes 3 new',
      'Alerts 3',
      'Savanna 4',
    ]),
  );
});
