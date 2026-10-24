import { cssChartToneClasses } from './chart-tones.js';
import { cssActionBarClasses } from './css-action-bar.js';
import { cssActionMenuClasses } from './css-action-menu.js';
import { cssCommandPaletteClasses } from './css-command-palette.js';
import { cssContextSwitcherClasses } from './css-context-switcher.js';
import { cssAccordionClasses } from './css-accordion.js';
import { cssButtonClasses } from './css-button.js';
import { cssCalendarButtonClasses } from './css-calendar-button.js';
import { cssDateRangeClasses } from './css-date-range.js';
import { cssFileFieldClasses } from './css-file-field.js';
import { cssArticleClasses } from './css-article.js';
import { cssDocumentViewerClasses } from './css-document-viewer.js';
import { cssListClasses } from './css-list.js';
import { cssMarkdownClasses } from './css-markdown.js';
import { cssCountPillClasses } from './css-count-pill.js';
import { cssBarChartClasses } from './css-bar-chart.js';
import { cssChartLegendClasses } from './css-chart-legend.js';
import { cssChartPlotClasses } from './css-chart-plot.js';
import { cssLineChartClasses } from './css-line-chart.js';
import { cssDataBarClasses } from './css-data-bar.js';
import { cssPaginationClasses } from './css-pagination.js';
import { cssCheckboxClasses } from './css-checkbox.js';
import { cssRadioGroupClasses } from './css-radio-group.js';
import { cssChromeClasses } from './css-chrome.js';
import { cssSectionNavClasses } from './css-section-nav.js';
import { cssAppShellClasses } from './css-app-shell.js';
import { cssDataClasses } from './css-data.js';
import { cssSegmentedClasses } from './css-segmented.js';
import { cssTableClasses } from './css-table.js';
import { cssDateFieldClasses } from './css-date-field.js';
import { cssDialogClasses } from './css-dialog.js';
import { cssDialogBandedClasses } from './css-dialog-banded.js';
import { cssDialogFrameClasses } from './css-dialog-frame.js';
import { cssDialogCanvasClasses } from './css-dialog-canvas.js';
import { cssDialogGrabberClasses } from './css-dialog-grabber.js';
import { cssComboboxClasses } from './css-combobox.js';
import { cssSelectClasses } from './css-select.js';
import { cssMultiSelectClasses } from './css-multi-select.js';
import { cssSplitClasses } from './css-split.js';
import { cssSwitchClasses } from './css-switch.js';
import { cssTextClasses } from './css-text.js';
import { cssFontMonoClasses } from './css-font-mono.js';
import { cssSpinnerClasses } from './css-spinner.js';
import { cssProgressClasses } from './css-progress.js';
import { cssNoticeClasses } from './css-notice.js';
import { cssGlyphTileClasses } from './css-glyph-tile.js';
import { cssTooltipClasses } from './css-tooltip.js';
import { cssInfoTipClasses } from './css-info-tip.js';
import { cssSeparatorClasses } from './css-separator.js';
import { cssStatTileClasses } from './css-stat-tile.js';
import { cssDescriptionListClasses } from './css-description-list.js';
import { cssTabsClasses } from './css-tabs.js';
import { cssResponsiveClasses } from './css-responsive.js';
import { cssFilterChipsClasses } from './css-filter-chips.js';
import { cssGridClasses } from './css-grid.js';
import { cssGridSpanClasses } from './css-grid-span.js';
import { cssDenominationGridClasses } from './css-denomination-grid.js';
import { cssFieldClasses } from './css-field.js';
import { cssStepperClasses } from './css-stepper.js';
import { cssStepsClasses } from './css-steps.js';
import { cssToastClasses } from './css-toast.js';
import { cssToastCardClasses } from './css-toast-card.js';
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
  .sw-steps-item,
  .sw-badge-neutral,
  .sw-segmented,
  .sw-table-sticky thead :is(th, td),
  .sw-table .sw-table-footer-sticky :is(th, td),
  .sw-denomination-strip .sw-denomination-label,
  .sw-denomination-strip thead .sw-denomination-corner:first-child,
  .sw-bar-chart-track,
  .sw-dialog,
  .sw-accordion,
  .sw-select-list,
  .sw-action-menu-list,
  .sw-multi-select-panel,
  .sw-combobox-popup,
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

${cssFontMonoClasses()}

${cssButtonClasses()}

${cssCheckboxClasses()}

${cssRadioGroupClasses()}

${cssDataClasses()}

${cssSegmentedClasses()}

${cssTableClasses()}

${cssDateFieldClasses()}

${cssCalendarButtonClasses()}

${cssDateRangeClasses()}

${cssListClasses()}

${cssFileFieldClasses()}

${cssArticleClasses()}

${cssDocumentViewerClasses()}

${cssMarkdownClasses()}

${cssCountPillClasses()}

${cssBarChartClasses()}

${cssDataBarClasses()}

${cssChartToneClasses()}

${cssChartLegendClasses()}

${cssChartPlotClasses()}

${cssLineChartClasses()}

${cssPaginationClasses()}

${cssChromeClasses()}

${cssSectionNavClasses()}

${cssAppShellClasses()}

${cssDialogClasses()}

${cssDialogFrameClasses()}

${cssDialogBandedClasses()}

${cssDialogCanvasClasses()}

${cssDialogGrabberClasses()}

${cssAccordionClasses()}

${cssSelectClasses()}

${cssActionMenuClasses()}

${cssContextSwitcherClasses()}

${cssCommandPaletteClasses()}

${cssComboboxClasses()}
${cssMultiSelectClasses()}

${cssActionBarClasses()}

${cssSwitchClasses()}

${cssSpinnerClasses()}

${cssProgressClasses()}

${cssNoticeClasses()}

${cssGlyphTileClasses()}

${cssTooltipClasses()}

${cssInfoTipClasses()}

${cssSeparatorClasses()}

${cssStatTileClasses()}

${cssDescriptionListClasses()}

${cssTabsClasses()}

${cssFilterChipsClasses()}

${cssGridClasses()}
${cssGridSpanClasses()}
${cssDenominationGridClasses()}

${cssFieldClasses()}

${cssStepperClasses()}

${cssStepsClasses()}

${cssSplitClasses()}

${cssToastClasses()}

${cssToastCardClasses()}

${cssResponsiveClasses()}

${cssBoxBorderClasses()}

${reducedTransparencyRules()}`;
}
