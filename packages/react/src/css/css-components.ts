import { cssActionBarClasses } from './css-action-bar.js';
import { cssActionMenuClasses } from './css-action-menu.js';
import { cssAccordionClasses } from './css-accordion.js';
import { cssButtonClasses } from './css-button.js';
import { cssCalendarButtonClasses } from './css-calendar-button.js';
import { cssChartClasses } from './css-chart.js';
import { cssCheckboxClasses } from './css-checkbox.js';
import { cssRadioGroupClasses } from './css-radio-group.js';
import { cssChromeClasses } from './css-chrome.js';
import { cssSectionNavClasses } from './css-section-nav.js';
import { cssDataClasses } from './css-data.js';
import { cssSegmentedClasses } from './css-segmented.js';
import { cssTableClasses } from './css-table.js';
import { cssDateFieldClasses } from './css-date-field.js';
import { cssDialogClasses } from './css-dialog.js';
import { cssSelectClasses } from './css-select.js';
import { cssSplitClasses } from './css-split.js';
import { cssSwitchClasses } from './css-switch.js';
import { cssTextClasses } from './css-text.js';
import { cssSpinnerClasses } from './css-spinner.js';
import { cssProgressClasses } from './css-progress.js';
import { cssTooltipClasses } from './css-tooltip.js';
import { cssInfoTipClasses } from './css-info-tip.js';
import { cssSeparatorClasses } from './css-separator.js';
import { cssStatTileClasses } from './css-stat-tile.js';
import { cssTabsClasses } from './css-tabs.js';
import { cssResponsiveClasses } from './css-responsive.js';
import { cssFilterChipsClasses } from './css-filter-chips.js';
import { cssGridClasses } from './css-grid.js';
import { cssGridSpanClasses } from './css-grid-span.js';
import { cssDenominationGridClasses } from './css-denomination-grid.js';
import { cssFieldClasses } from './css-field.js';
import { cssToastClasses } from './css-toast.js';
import { cssBoxBorderClasses } from './css-box-border.js';
import { cssPopupHostRules } from './stacking.js';

/*
 * Reduce Transparency swaps every glass surface for the solid surface. It is
 * emitted after every component rule: at equal specificity the later rule wins,
 * so a glass rule emitted after this block would keep its blur.
 */
function reducedTransparencyRules(): string {
  return `@media (prefers-reduced-transparency: reduce) {
  .sw-card-glass,
  .sw-app-header,
  .sw-action-bar,
  .sw-badge-neutral,
  .sw-segmented,
  .sw-table-sticky thead th,
  .sw-denomination-strip .sw-denomination-label,
  .sw-denomination-strip thead .sw-denomination-corner:first-child,
  .sw-bar-chart-track,
  .sw-dialog,
  .sw-accordion,
  .sw-select-list,
  .sw-action-menu-list,
  .sw-date-field-calendar,
  .sw-toast {
    background: var(--sw-color-surface);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}`;
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

${cssPopupHostRules()}

.sw-card-outlined {
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
}

.sw-card-elevated {
  background: var(--sw-color-surface);
  border-color: transparent;
  box-shadow: var(--sw-elevation-sm);
}

/* Plain information on a quiet fill, apart from rows that press. */
.sw-card-filled {
  background: var(--sw-color-subtle);
}

.sw-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sw-tabular {
  font-variant-numeric: tabular-nums;
}

${cssTextClasses()}

${cssButtonClasses()}

${cssCheckboxClasses()}

${cssRadioGroupClasses()}

${cssDataClasses()}

${cssSegmentedClasses()}

${cssTableClasses()}

${cssDateFieldClasses()}

${cssCalendarButtonClasses()}

${cssChartClasses()}

${cssChromeClasses()}

${cssSectionNavClasses()}

${cssDialogClasses()}

${cssAccordionClasses()}

${cssSelectClasses()}

${cssActionMenuClasses()}

${cssActionBarClasses()}

${cssSwitchClasses()}

${cssSpinnerClasses()}

${cssProgressClasses()}

${cssTooltipClasses()}

${cssInfoTipClasses()}

${cssSeparatorClasses()}

${cssStatTileClasses()}

${cssTabsClasses()}

${cssFilterChipsClasses()}

${cssGridClasses()}
${cssGridSpanClasses()}
${cssDenominationGridClasses()}

${cssFieldClasses()}

${cssSplitClasses()}

${cssToastClasses()}

${cssResponsiveClasses()}

${cssBoxBorderClasses()}

${reducedTransparencyRules()}`;
}
