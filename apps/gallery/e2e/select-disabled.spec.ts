import { expect, test } from '@playwright/test';

import { axeViolations } from './axe-scan.js';
import { systemColor } from './contrast.js';

test('Select disabled is out of the Tab order, opens nothing and comes back on', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#select-disabled');
  const section = page.locator('#select-disabled');
  const trigger = section.getByRole('combobox', { name: 'Survey habitat' });
  const toggle = section.getByRole('button', {
    name: /^(Finish the upload|Start an upload)$/,
  });
  await expect(trigger).toBeDisabled();
  await expect(section.getByRole('status')).toHaveText(
    'Locked while the census uploads',
  );
  // A press does nothing: no list, the value kept.
  await trigger.click({ force: true });
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(trigger).toHaveText('Forest');
  // Out of the Tab order: from the control before it, Tab skips it.
  await toggle.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(trigger).not.toBeFocused();

  if (forced) {
    expect(
      await trigger.evaluate((element) => getComputedStyle(element).color),
    ).toBe(await systemColor(page, 'GrayText'));
  } else {
    expect(
      Number(
        await trigger.evaluate((element) => getComputedStyle(element).opacity),
      ),
    ).toBeLessThan(1);
  }
  // The demo, not the gallery's own code block.
  expect(
    await axeViolations(
      page,
      '#select-disabled :is(.sw-select, [role="status"])',
    ),
  ).toEqual([]);
  await section.screenshot({
    path: testInfo.outputPath('select-disabled.png'),
  });

  await toggle.click();
  await expect(trigger).toBeEnabled();
  await trigger.click();
  await page
    .getByRole('listbox')
    .getByRole('option', { name: 'Savanna' })
    .click();
  await expect(trigger).toHaveText('Savanna');
});
