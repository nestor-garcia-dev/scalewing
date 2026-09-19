import { expect, test } from '@playwright/test';

test('Tooltip supports hover, focus, Escape, blur, and touch without replacing the trigger name', async ({
  page,
}, testInfo) => {
  await page.goto('/#tooltip');
  const section = page.locator('#tooltip');
  const trigger = section.getByRole('button', { name: 'Sighting details' });
  const tooltip = section.getByRole('tooltip');
  const firstTooltip = section.locator('.sw-tooltip').first();
  await expect(tooltip).toHaveCount(0);

  if (testInfo.project.name === 'mobile-es') {
    await trigger.tap();
    await expect(tooltip).toBeVisible();
    await expect(section.getByText('Actions pressed: 1.')).toBeVisible();
    await section.getByRole('heading', { name: 'Tooltip' }).tap();
    await expect(tooltip).toHaveCount(0);
  } else {
    await trigger.hover();
    await expect(tooltip).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(tooltip).toHaveCount(0);
  }

  await trigger.focus();
  await expect(tooltip).toBeVisible();
  const tooltipId = await tooltip.getAttribute('id');
  expect(tooltipId).toBeTruthy();
  await expect(trigger).toHaveAttribute('aria-describedby', tooltipId ?? '');
  await section.screenshot({ path: testInfo.outputPath('tooltip-focus.png') });
  await trigger.press('Escape');
  await expect(tooltip).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.evaluate((element: HTMLElement) => element.blur());
  await trigger.focus();
  await expect(tooltip).toBeVisible();
  await section.getByRole('button', { name: 'Habitat guide' }).focus();
  await expect(firstTooltip).toBeHidden();
  await expect(section.getByRole('tooltip')).toHaveCount(1);
});
