import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

test('Steps open shows every step as a region and only its marker follows the status', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#steps');
  const survey = page.getByRole('list', {
    name: 'Wader count, every step open',
  });
  await survey.scrollIntoViewIfNeeded();
  const items = survey.getByRole('listitem');

  // Every step is open from the start, a region named by its title, and
  // none is the current one.
  for (const name of ['The site', 'The count', 'Review'])
    await expect(survey.getByRole('region', { name })).toBeVisible();
  await expect(survey.getByRole('textbox', { name: 'Site' })).toBeVisible();
  await expect(
    survey.getByRole('spinbutton', { name: 'Herons' }),
  ).toBeVisible();
  await expect(survey.locator('[aria-current]')).toHaveCount(0);

  // Every title is at the open size, and the panels take the open padding.
  const sizes = await survey
    .locator('.sw-steps-title')
    .evaluateAll((titles) =>
      titles.map((title) => getComputedStyle(title).fontSize),
    );
  expect(new Set(sizes)).toEqual(new Set(['20px']));

  // Typing completes the site: a check replaces its number; the cursor stays.
  const site = survey.getByRole('textbox', { name: 'Site' });
  await site.fill('North marsh');
  await expect(items.nth(0)).toHaveClass(/sw-steps-item-done/);
  await expect(items.nth(0).locator('.sw-steps-marker')).toHaveText('');
  await expect(site).toBeFocused();
  await expect(survey.getByText('North marsh: 0 herons.')).toBeVisible();
  // A line joins each open step's marker to the next.
  const line = await items
    .nth(0)
    .evaluate((item) => getComputedStyle(item, '::after').height);
  expect(parseFloat(line)).toBeGreaterThan(0);

  // A block turns the step red; the steps after it grey out with why.
  await site.fill('Flooded');
  await expect(items.nth(0)).toHaveClass(/sw-steps-item-error/);
  await expect(items.nth(1)).toHaveClass(/sw-steps-item-upcoming/);
  await expect(survey.getByText('Choose another site to go on.')).toHaveCount(
    2,
  );
  await expect(site).toBeFocused();
  await expect(
    survey.getByRole('heading', {
      name: 'The count, Not started',
      exact: true,
    }),
  ).toBeVisible();
  // The greyed step's title stays muted at the open size.
  if (testInfo.project.name !== 'forced-colors') {
    const [blocked, greyed] = await survey
      .locator('.sw-steps-title')
      .evaluateAll((titles) =>
        titles.slice(0, 2).map((title) => getComputedStyle(title).color),
      );
    expect(greyed).not.toBe(blocked);
    await expect(items.nth(1).locator('.sw-steps-title')).toHaveCSS(
      'font-size',
      '20px',
    );
  }

  await page.addScriptTag({ path: require.resolve('axe-core') });
  await survey.evaluate((node) => node.setAttribute('data-check', 'open'));
  const violations = await page.evaluate(() =>
    (window as Window & { axe: Axe }).axe
      .run({ include: [['[data-check="open"]']] }, {})
      .then((result) => result.violations.map((violation) => violation.id)),
  );
  expect(violations).toEqual([]);

  await survey.screenshot({ path: testInfo.outputPath('steps-open.png') });
});
