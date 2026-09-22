import { typographyVariants } from '@scalewing/tokens';
import { cssActionMenuClasses } from './css-action-menu.js';
import { cssAccordionClasses } from './css-accordion.js';
import { cssButtonClasses } from './css-button.js';
import { cssChartClasses } from './css-chart.js';
import { cssCheckboxClasses } from './css-checkbox.js';
import { cssRadioGroupClasses } from './css-radio-group.js';
import { cssChromeClasses } from './css-chrome.js';
import { cssDataClasses } from './css-data.js';
import { cssDateFieldClasses } from './css-date-field.js';
import { cssDialogClasses } from './css-dialog.js';
import { cssSelectClasses } from './css-select.js';
import { cssSplitClasses } from './css-split.js';
import { cssSwitchClasses } from './css-switch.js';
import { cssSpinnerClasses } from './css-spinner.js';
import { cssProgressClasses } from './css-progress.js';
import { cssTooltipClasses } from './css-tooltip.js';
import { cssSeparatorClasses } from './css-separator.js';
import { cssResponsiveClasses } from './css-responsive.js';
import { cssFilterChipsClasses } from './css-filter-chips.js';
import { cssGridClasses } from './css-grid.js';
import { cssDenominationGridClasses } from './css-denomination-grid.js';
import { cssFieldClasses } from './css-field.js';
import { cssToastClasses } from './css-toast.js';

function textVariantRules(): string {
  return Object.entries(typographyVariants)
    .map(([name, variant]) => {
      const tabular =
        'tabularNums' in variant && variant.tabularNums
          ? ' font-variant-numeric: tabular-nums;'
          : '';
      return `.sw-text-${name} { font-family: var(--sw-font-sans); font-size: ${variant.fontSize}px; line-height: ${variant.lineHeight}px; font-weight: ${variant.fontWeight}; letter-spacing: ${variant.letterSpacing}px;${tabular} }`;
    })
    .join('\n');
}

export function cssComponentClasses(): string {
  return `.sw-card {
  border-radius: var(--sw-radius-lg);
  color: var(--sw-color-text);
}

.sw-card-glass {
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  box-shadow: inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
}

.sw-card-outlined {
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
}

.sw-card-elevated {
  background: var(--sw-color-surface);
  border-color: transparent;
  box-shadow: var(--sw-elevation-sm);
}

@media (prefers-reduced-transparency: reduce) {
  .sw-card-glass,
  .sw-app-header,
  .sw-button-secondary,
  .sw-badge-neutral,
  .sw-segmented,
  .sw-table-sticky thead th,
  .sw-bar-chart-track,
  .sw-dialog,
  .sw-accordion,
  .sw-select-list,
  .sw-action-menu-list,
  .sw-toast {
    background: var(--sw-color-surface);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

.sw-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sw-tabular {
  font-variant-numeric: tabular-nums;
}

${textVariantRules()}

${cssButtonClasses()}

${cssCheckboxClasses()}

${cssRadioGroupClasses()}

${cssDataClasses()}

${cssDateFieldClasses()}

${cssChartClasses()}

${cssChromeClasses()}

${cssDialogClasses()}

${cssAccordionClasses()}

${cssSelectClasses()}

${cssActionMenuClasses()}

${cssSwitchClasses()}

${cssSpinnerClasses()}

${cssProgressClasses()}

${cssTooltipClasses()}

${cssSeparatorClasses()}

${cssFilterChipsClasses()}

${cssGridClasses()}
${cssDenominationGridClasses()}

${cssFieldClasses()}

${cssSplitClasses()}

${cssToastClasses()}

${cssResponsiveClasses()}`;
}
