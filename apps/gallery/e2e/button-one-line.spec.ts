import { expect, type Locator, type Page, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

/** How many lines a control's words take: distinct tops of their text's line boxes. */
async function lineCount(control: Locator): Promise<number> {
  return control.evaluate((node) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const tops = new Set<number>();
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      const range = document.createRange();
      range.selectNodeContents(text);
      for (const rect of range.getClientRects())
        if (rect.width > 0) tops.add(Math.round(rect.top));
    }
    return tops.size;
  });
}

/** Whether any of a control's words are drawn outside its own box. */
async function spills(control: Locator): Promise<boolean> {
  return control.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      const range = document.createRange();
      range.selectNodeContents(text);
      for (const rect of range.getClientRects())
        if (
          rect.width > 0 &&
          (rect.left < box.left - 0.5 ||
            rect.right > box.right + 0.5 ||
            rect.top < box.top - 0.5 ||
            rect.bottom > box.bottom + 0.5)
        )
          return true;
    }
    return false;
  });
}

function crowdedRow(page: Page) {
  const row = page.locator('#button [data-sample="crowded-row"]');
  return {
    row,
    actions: row.locator('.sw-no-shrink'),
    button: row.getByRole('button', { name: 'Switch to the night roost' }),
    trigger: row.getByRole('button', {
      name: 'Great crested grebe colony · Wetland',
    }),
  };
}

// The sample is a header row from md (768 px) up; a phone puts its actions
// on a row of their own.
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/#button');
});

test('a Button and a text trigger in a crowded Inline stay one line at 768 px', async ({
  page,
}, testInfo) => {
  const { row, actions, button, trigger } = crowdedRow(page);
  await expect(button).toBeVisible();
  // The row is crowded: the title beside the actions wraps instead.
  const title = row.getByText('North marsh boardwalk', { exact: false });
  expect(await lineCount(title)).toBeGreaterThan(1);
  for (const control of [button, trigger]) {
    expect(await lineCount(control)).toBe(1);
    expect(await spills(control)).toBe(false);
  }
  // The actions' Inline keeps its natural width: both controls inside it.
  const widths = await actions.evaluate((node) => ({
    own: node.getBoundingClientRect().width,
    content: node.scrollWidth,
    shrink: getComputedStyle(node).flexShrink,
  }));
  expect(widths.shrink).toBe('0');
  expect(widths.content).toBeLessThanOrEqual(widths.own + 0.5);
  // Each pill is one control tall (the 32 px sm control, 44 on touch).
  const box = (await button.boundingBox())!;
  expect(box.height).toBeLessThanOrEqual(44.5);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await row.screenshot({ path: testInfo.outputPath('button-one-line.png') });
});

test('a Button straight in a crowded Inline keeps its words; the text beside it wraps', async ({
  page,
}) => {
  const row = page.locator('#button [data-sample="crowded-direct"]');
  const button = row.getByRole('button', {
    name: 'Hand the count to the next hide',
  });
  const text = row.getByText('Every hide on the west boardwalk', {
    exact: false,
  });
  expect(await lineCount(text)).toBeGreaterThan(1);
  expect(await lineCount(button)).toBe(1);
  expect(await spills(button)).toBe(false);
  expect(
    await button.evaluate((node) => getComputedStyle(node).flexShrink),
  ).toBe('0');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('in a container narrower than its words, a control wraps inside its pill, every word shown', async ({
  page,
}, testInfo) => {
  const { actions, button, trigger } = crowdedRow(page);
  // The controls' own row, made narrower than either control's words.
  await actions.evaluate((node) => (node.style.width = '160px'));
  for (const control of [button, trigger]) {
    expect(await lineCount(control)).toBeGreaterThan(1);
    expect(await spills(control)).toBe(false);
    const controlBox = (await control.boundingBox())!;
    expect(controlBox.width).toBeLessThanOrEqual(160.5);
  }
  // Nothing cut: the whole words are drawn and are still the names.
  await expect(button).toHaveText('Switch to the night roost');
  await expect(button).toHaveAccessibleName('Switch to the night roost');
  await expect(trigger).toHaveAccessibleName(
    'Great crested grebe colony · Wetland',
  );
  await actions.screenshot({
    path: testInfo.outputPath('button-wraps-in-narrow-container.png'),
  });
});
