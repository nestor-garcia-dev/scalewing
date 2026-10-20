import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

import { tokenColor } from './contrast.js';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test("Step titleDetail draws muted words beside an open step's title, outside its heading, wrapping on a phone", async ({
  page,
}, testInfo) => {
  await page.goto('/#steps');
  const notes = page.getByRole('list', {
    name: 'Field notes, every step open',
  });
  const long = 'Where the colony nests along the north marsh';

  // The region keeps the title as its name and is described by the words;
  // the heading is the title alone.
  const colony = notes.getByRole('region', { name: long });
  await expect(colony).toHaveAccessibleDescription(
    'Wetlands done · Woodlands empty',
  );
  const heading = colony.getByRole('heading', { name: long, exact: true });
  await expect(heading).toBeVisible();
  const detail = colony.locator('.sw-steps-title-detail');
  await expect(detail).toHaveText('Wetlands done · Woodlands empty');
  await expect(heading.locator('.sw-steps-title-detail')).toHaveCount(0);
  await expect(
    notes.getByRole('region', { name: 'A note' }),
  ).toHaveAccessibleDescription('Optional');
  await expect(
    notes.getByRole('region', { name: 'The site' }),
  ).toHaveAccessibleDescription('Checked Oct 16');
  const summary = notes.getByText('North marsh', { exact: true });
  await expect(summary).toBeVisible();
  // A done step's summary follows its title line, on the same row.
  const site = notes.getByRole('region', { name: 'The site' });
  const [siteWords, siteSummary] = await Promise.all([
    site.locator('.sw-steps-title-detail').boundingBox(),
    summary.boundingBox(),
  ]);
  expect(siteWords && siteSummary).toBeTruthy();
  if (siteWords && siteSummary)
    expect(siteSummary.x).toBeGreaterThanOrEqual(siteWords.x + siteWords.width);

  // The label size at the body's weight, in the muted colour.
  await expect(detail).toHaveCSS('font-size', '15px');
  await expect(detail).toHaveCSS('font-weight', '400');
  if (testInfo.project.name !== 'forced-colors')
    expect(await detail.evaluate((node) => getComputedStyle(node).color)).toBe(
      await tokenColor(page, 'muted'),
    );

  // "Optional" sits on the title's line, on its baseline, after it.
  const note = notes.getByRole('region', { name: 'A note' });
  const [noteTitle, optional] = await Promise.all([
    note.getByRole('heading', { name: 'A note' }).boundingBox(),
    note.locator('.sw-steps-title-detail').boundingBox(),
  ]);
  expect(noteTitle && optional).toBeTruthy();
  if (noteTitle && optional) {
    expect(optional.x).toBeGreaterThan(noteTitle.x + noteTitle.width);
    expect(optional.y).toBeGreaterThan(noteTitle.y);
    expect(optional.y + optional.height).toBeLessThanOrEqual(
      noteTitle.y + noteTitle.height + 1,
    );
  }

  // On a phone the long title wraps and its words take a line of their
  // own under it, at its start; at 1280 they sit beside it.
  const [titleBox, detailBox, regionBox] = await Promise.all([
    heading.boundingBox(),
    detail.boundingBox(),
    colony.boundingBox(),
  ]);
  expect(titleBox && detailBox && regionBox).toBeTruthy();
  if (titleBox && detailBox && regionBox) {
    expect(detailBox.x + detailBox.width).toBeLessThanOrEqual(
      regionBox.x + regionBox.width + 0.5,
    );
    if (testInfo.project.name === 'mobile-es') {
      expect(detailBox.y).toBeGreaterThanOrEqual(titleBox.y + titleBox.height);
      expect(Math.abs(detailBox.x - titleBox.x)).toBeLessThan(1);
    } else {
      expect(detailBox.x).toBeGreaterThan(titleBox.x + titleBox.width);
    }
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  // A step whose words describe it keeps them as it turns done.
  await note.getByRole('textbox', { name: 'Note' }).fill('Two egrets');
  await expect(
    notes.getByRole('heading', { name: 'A note, Done', exact: true }),
  ).toBeVisible();
  await expect(note.locator('.sw-steps-title-detail')).toHaveText('Optional');

  // The muted words keep their contrast, and nothing else axe checks fails.
  await page.addScriptTag({ path: require.resolve('axe-core') });
  await notes.evaluate((node) => node.setAttribute('data-check', 'notes'));
  const violations = await page.evaluate(() =>
    (window as unknown as { axe: Axe }).axe
      .run({ include: [['[data-check="notes"]']] }, {})
      .then((result) => result.violations.map((violation) => violation.id)),
  );
  expect(violations).toEqual([]);

  await notes.screenshot({
    path: testInfo.outputPath('steps-title-detail.png'),
  });
});
