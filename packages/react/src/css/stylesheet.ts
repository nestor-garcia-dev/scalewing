import {
  cardVariants,
  darkTheme,
  lightTheme,
  typographyVariants,
} from '@scalewing/tokens';

import { chartToneClassCatalog } from './chart-tones.js';
import { actionBarClassCatalog } from './css-action-bar.js';
import { actionMenuClassCatalog } from './css-action-menu.js';
import { commandPaletteClassCatalog } from './css-command-palette.js';
import { contextSwitcherClassCatalog } from './css-context-switcher.js';
import { accordionClassCatalog } from './css-accordion.js';
import { switchClassCatalog } from './css-switch.js';
import { dateFieldClassCatalog } from './css-date-field.js';
import { calendarButtonClassCatalog } from './css-calendar-button.js';
import { dateRangeClassCatalog } from './css-date-range.js';
import { fileFieldClassCatalog } from './css-file-field.js';
import { articleClassCatalog } from './css-article.js';
import { documentViewerClassCatalog } from './css-document-viewer.js';
import { fixtureClassCatalog } from './css-fixture.js';
import { listClassCatalog } from './css-list.js';
import { markdownClassCatalog } from './css-markdown.js';
import { countPillClassCatalog } from './css-count-pill.js';
import { checkboxClassCatalog } from './css-checkbox.js';
import { radioGroupClassCatalog } from './css-radio-group.js';
import { skeletonClassCatalog } from './css-skeleton.js';
import { spinnerClassCatalog } from './css-spinner.js';
import { progressClassCatalog } from './css-progress.js';
import { noticeClassCatalog } from './css-notice.js';
import { glyphTileClassCatalog } from './css-glyph-tile.js';
import { tooltipClassCatalog } from './css-tooltip.js';
import { infoTipClassCatalog } from './css-info-tip.js';
import { separatorClassCatalog } from './css-separator.js';
import { bandClassCatalog } from './css-band.js';
import { siteFooterClassCatalog } from './css-site-footer.js';
import { siteHeaderClassCatalog } from './css-site-header.js';
import { statTileClassCatalog } from './css-stat-tile.js';
import { descriptionListClassCatalog } from './css-description-list.js';
import { tabsClassCatalog } from './css-tabs.js';
import { responsiveClassCatalog } from './css-responsive.js';
import { filterChipsClassCatalog } from './css-filter-chips.js';
import { fontMonoClassCatalog } from './css-font-mono.js';
import { gridClassCatalog } from './css-grid.js';
import { gridSpanClassCatalog } from './css-grid-span.js';
import { denominationGridClassCatalog } from './css-denomination-grid.js';
import { scrollRegionClassCatalog } from './css-scroll-region.js';
import { fieldClassCatalog } from './css-field.js';
import { stepperClassCatalog } from './css-stepper.js';
import { stepsClassCatalog } from './css-steps.js';
import { boxBorderClassCatalog } from './css-box-border.js';
import { boxLinkClassCatalog } from './css-box-link.js';
import { cssComponentClasses } from './css-components.js';
import { buttonClassCatalog } from './css-button.js';
import { buttonLinkClassCatalog } from './css-button-link.js';
import { barChartClassCatalog } from './css-bar-chart.js';
import { chartLegendClassCatalog } from './css-chart-legend.js';
import { chartPlotClassCatalog } from './css-chart-plot.js';
import { lineChartClassCatalog } from './css-line-chart.js';
import { dataBarClassCatalog } from './css-data-bar.js';
import { paginationClassCatalog } from './css-pagination.js';
import { dataClassCatalog } from './css-data.js';
import { segmentedClassCatalog } from './css-segmented.js';
import { tableClassCatalog } from './css-table.js';
import { chromeClassCatalog } from './css-chrome.js';
import { sectionNavClassCatalog } from './css-section-nav.js';
import { appShellClassCatalog } from './css-app-shell.js';
import { dialogClassCatalog } from './css-dialog.js';
import { dialogBandedClassCatalog } from './css-dialog-banded.js';
import { dialogFrameClassCatalog } from './css-dialog-frame.js';
import { dialogCanvasClassCatalog } from './css-dialog-canvas.js';
import { dialogGrabberClassCatalog } from './css-dialog-grabber.js';
import { selectClassCatalog } from './css-select.js';
import { multiSelectClassCatalog } from './css-multi-select.js';
import { comboboxClassCatalog } from './css-combobox.js';
import { splitClassCatalog } from './css-split.js';
import { toastClassCatalog } from './css-toast.js';
import { toastCardClassCatalog } from './css-toast-card.js';
import { cssDocumentCanvas } from './css-document.js';
import { cssPaletteAttributes } from './css-palettes.js';
import { cssUtilities } from './css-utilities.js';
import { cssVariables } from './css-variables.js';
import {
  gapClassNames,
  layoutClassNames,
  paddingClassNames,
} from './spacing-classes.js';

export function utilityClassCatalog(): string[] {
  return [
    ...paddingClassNames(),
    ...gapClassNames(),
    ...layoutClassNames,
    'sw-card',
    ...cardVariants.map((variant) => `sw-card-${variant}`),
    'sw-truncate',
    'sw-text-align-start',
    'sw-text-align-center',
    'sw-text-align-end',
    'sw-tabular',
    ...Object.keys(typographyVariants).map((name) => `sw-text-${name}`),
    ...buttonClassCatalog(),
    ...buttonLinkClassCatalog(),
    ...dataClassCatalog(),
    ...segmentedClassCatalog(),
    ...tableClassCatalog(),
    ...scrollRegionClassCatalog(),
    ...barChartClassCatalog(),
    ...dataBarClassCatalog(),
    ...chartToneClassCatalog(),
    ...chartLegendClassCatalog(),
    ...chartPlotClassCatalog(),
    ...lineChartClassCatalog(),
    ...paginationClassCatalog(),
    ...chromeClassCatalog(),
    ...sectionNavClassCatalog(),
    ...appShellClassCatalog(),
    ...dialogClassCatalog(),
    ...dialogFrameClassCatalog(),
    ...dialogBandedClassCatalog(),
    ...dialogCanvasClassCatalog(),
    ...dialogGrabberClassCatalog(),
    ...accordionClassCatalog(),
    ...selectClassCatalog(),
    ...actionMenuClassCatalog(),
    ...contextSwitcherClassCatalog(),
    ...commandPaletteClassCatalog(),
    ...multiSelectClassCatalog(),
    ...comboboxClassCatalog(),
    ...actionBarClassCatalog(),
    ...switchClassCatalog(),
    ...dateFieldClassCatalog(),
    ...calendarButtonClassCatalog(),
    ...dateRangeClassCatalog(),
    ...listClassCatalog(),
    ...fixtureClassCatalog(),
    ...fileFieldClassCatalog(),
    ...articleClassCatalog(),
    ...documentViewerClassCatalog(),
    ...markdownClassCatalog(),
    ...countPillClassCatalog(),
    ...checkboxClassCatalog(),
    ...radioGroupClassCatalog(),
    ...spinnerClassCatalog(),
    ...skeletonClassCatalog(),
    ...progressClassCatalog(),
    ...noticeClassCatalog(),
    ...glyphTileClassCatalog(),
    ...tooltipClassCatalog(),
    ...infoTipClassCatalog(),
    ...separatorClassCatalog(),
    ...bandClassCatalog(),
    ...siteFooterClassCatalog(),
    ...siteHeaderClassCatalog(),
    ...statTileClassCatalog(),
    ...descriptionListClassCatalog(),
    ...tabsClassCatalog(),
    ...filterChipsClassCatalog(),
    ...fontMonoClassCatalog(),
    ...gridClassCatalog(),
    ...gridSpanClassCatalog(),
    ...denominationGridClassCatalog(),
    ...fieldClassCatalog(),
    ...stepperClassCatalog(),
    ...stepsClassCatalog(),
    ...splitClassCatalog(),
    ...toastClassCatalog(),
    ...toastCardClassCatalog(),
    ...responsiveClassCatalog(),
    ...boxBorderClassCatalog(),
    ...boxLinkClassCatalog(),
  ];
}

export {
  generatePaletteStylesheet,
  paletteStylesheetIds,
} from './css-palettes.js';

export function generateStylesheet(): string {
  return `/* Generated by @scalewing/tokens. Do not edit by hand. */
${cssVariables(lightTheme, darkTheme)}

${cssPaletteAttributes()}

${cssDocumentCanvas()}

${cssUtilities()}

${cssComponentClasses()}
`;
}
