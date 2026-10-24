import { ActionMenuSection } from './sections/action-menu.js';
import { CommandPaletteSection } from './sections/command-palette.js';
import { BandSection } from './sections/band.js';
import { ContextSwitcherSection } from './sections/context-switcher.js';
import { FileFieldSection } from './sections/file-field.js';
import { DocumentViewerSection } from './sections/document-viewer.js';
import { SwitchSection } from './sections/switch.js';
import { ActionBarSection } from './sections/action-bar.js';
import { DateFieldSection } from './sections/date-field.js';
import { ButtonLinkSection } from './sections/button-link.js';
import { CalendarButtonSection } from './sections/calendar-button.js';
import { DateRangeButtonSection } from './sections/date-range-button.js';
import { CheckboxSection } from './sections/checkbox.js';
import { RadioGroupSection } from './sections/radio-group.js';
import { SpinnerSection } from './sections/spinner.js';
import { SkeletonSection } from './sections/skeleton.js';
import { ProgressSection } from './sections/progress.js';
import { NoticeSection } from './sections/notice.js';
import { GlyphTileSection } from './sections/glyph-tile.js';
import { TooltipSection } from './sections/tooltip.js';
import { InfoTipSection } from './sections/info-tip.js';
import { SeparatorSection } from './sections/separator.js';
import { ArticleSection } from './sections/article.js';
import { MarkdownViewSection } from './sections/markdown-view.js';
import { ResponsiveVisibilitySection } from './sections/responsive-visibility.js';
import { FilterChipsSection } from './sections/filter-chips.js';
import { FilterChipsRowSection } from './sections/filter-chips-row.js';
import { DenominationGridSection } from './sections/denomination-grid.js';
import { type ComponentType } from 'react';

import { AccordionSection } from './sections/accordion.js';
import { AppHeaderSection } from './sections/app-header.js';
import { AppShellSection } from './sections/app-shell.js';
import { BadgeSection } from './sections/badge.js';
import { BarChartSection } from './sections/bar-chart.js';
import { ChartLegendSection } from './sections/chart-legend.js';
import { ColumnChartSection } from './sections/column-chart.js';
import { LineChartSection } from './sections/line-chart.js';
import { DataBarSection } from './sections/data-bar.js';
import { ButtonGroupSection } from './sections/button-group.js';
import { ButtonSection } from './sections/button.js';
import { CanvasSection } from './sections/canvas.js';
import { CardSection } from './sections/card.js';
import { DialogSection } from './sections/dialog.js';
import { ToastSection } from './sections/toast.js';
import { FieldSection } from './sections/field.js';
import { StepperSection } from './sections/stepper.js';
import { StepsSection } from './sections/steps.js';
import { FoundationsSection } from './sections/foundations.js';
import { GridSection } from './sections/grid.js';
import { LayoutSection } from './sections/layout.js';
import { LinkSection } from './sections/link.js';
import { NavSection } from './sections/nav.js';
import { SectionNavSection } from './sections/section-nav.js';
import { PalettesSection } from './sections/palettes.js';
import { SegmentedControlSection } from './sections/segmented-control.js';
import { StatTileSection } from './sections/stat-tile.js';
import { DescriptionListSection } from './sections/description-list.js';
import { ListGroupSection } from './sections/list-group.js';
import { TabsSection } from './sections/tabs.js';
import { SelectSection } from './sections/select.js';
import { MultiSelectSection } from './sections/multi-select.js';
import { ComboboxSection } from './sections/combobox.js';
import { SplitSection } from './sections/split.js';
import { TableSection } from './sections/table.js';
import { PaginationSection } from './sections/pagination.js';
import { TextSection } from './sections/text.js';
import { ThemeProviderSection } from './sections/theme-provider.js';

export const catalogGroups = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'layout', label: 'Layout' },
  { id: 'content', label: 'Content' },
  { id: 'controls', label: 'Controls' },
  { id: 'data', label: 'Data' },
  { id: 'chrome', label: 'Chrome' },
] as const;

export type CatalogGroupId = (typeof catalogGroups)[number]['id'];

type CatalogItem = {
  id: string;
  label: string;
  group: CatalogGroupId;
  Section: ComponentType;
};

export const catalog = [
  {
    id: 'theme-provider',
    label: 'ThemeProvider',
    group: 'foundations',
    Section: ThemeProviderSection,
  },
  {
    id: 'canvas',
    label: 'Canvas',
    group: 'foundations',
    Section: CanvasSection,
  },
  {
    id: 'palettes',
    label: 'Palettes',
    group: 'foundations',
    Section: PalettesSection,
  },
  {
    id: 'foundations',
    label: 'Foundations',
    group: 'foundations',
    Section: FoundationsSection,
  },
  { id: 'layout', label: 'Layout', group: 'layout', Section: LayoutSection },
  { id: 'grid', label: 'Grid', group: 'layout', Section: GridSection },
  { id: 'split', label: 'Split', group: 'layout', Section: SplitSection },
  { id: 'text', label: 'Text', group: 'content', Section: TextSection },
  { id: 'card', label: 'Card', group: 'content', Section: CardSection },
  {
    id: 'accordion',
    label: 'Accordion',
    group: 'content',
    Section: AccordionSection,
  },
  { id: 'button', label: 'Button', group: 'controls', Section: ButtonSection },
  {
    id: 'button-link',
    label: 'ButtonLink',
    group: 'controls',
    Section: ButtonLinkSection,
  },
  {
    id: 'button-group',
    label: 'ButtonGroup',
    group: 'controls',
    Section: ButtonGroupSection,
  },
  {
    id: 'action-bar',
    label: 'ActionBar',
    group: 'controls',
    Section: ActionBarSection,
  },
  { id: 'badge', label: 'Badge', group: 'controls', Section: BadgeSection },
  {
    id: 'segmented-control',
    label: 'SegmentedControl',
    group: 'controls',
    Section: SegmentedControlSection,
  },
  { id: 'tabs', label: 'Tabs', group: 'controls', Section: TabsSection },
  { id: 'field', label: 'Field', group: 'controls', Section: FieldSection },
  {
    id: 'file-field',
    label: 'FileField',
    group: 'controls',
    Section: FileFieldSection,
  },
  {
    id: 'stepper',
    label: 'Stepper',
    group: 'controls',
    Section: StepperSection,
  },
  { id: 'steps', label: 'Steps', group: 'controls', Section: StepsSection },
  { id: 'select', label: 'Select', group: 'controls', Section: SelectSection },
  {
    id: 'combobox',
    label: 'Combobox',
    group: 'controls',
    Section: ComboboxSection,
  },
  {
    id: 'multi-select',
    label: 'MultiSelect',
    group: 'controls',
    Section: MultiSelectSection,
  },
  {
    id: 'action-menu',
    label: 'ActionMenu',
    group: 'controls',
    Section: ActionMenuSection,
  },
  {
    id: 'context-switcher',
    label: 'ContextSwitcher',
    group: 'controls',
    Section: ContextSwitcherSection,
  },
  {
    id: 'command-palette',
    label: 'CommandPalette',
    group: 'controls',
    Section: CommandPaletteSection,
  },
  { id: 'switch', label: 'Switch', group: 'controls', Section: SwitchSection },
  {
    id: 'spinner',
    label: 'Spinner',
    group: 'controls',
    Section: SpinnerSection,
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    group: 'controls',
    Section: SkeletonSection,
  },
  {
    id: 'progress',
    label: 'Progress',
    group: 'controls',
    Section: ProgressSection,
  },
  {
    id: 'glyph-tile',
    label: 'GlyphTile',
    group: 'content',
    Section: GlyphTileSection,
  },
  {
    id: 'notice',
    label: 'Notice',
    group: 'content',
    Section: NoticeSection,
  },
  {
    id: 'filter-chips',
    label: 'FilterChips',
    group: 'controls',
    Section: FilterChipsSection,
  },
  {
    id: 'filter-chips-row',
    label: 'FilterChipsRow',
    group: 'controls',
    Section: FilterChipsRowSection,
  },
  { id: 'band', label: 'Band', group: 'layout', Section: BandSection },
  {
    id: 'separator',
    label: 'Separator',
    group: 'content',
    Section: SeparatorSection,
  },
  {
    id: 'article',
    label: 'Article',
    group: 'content',
    Section: ArticleSection,
  },
  {
    id: 'markdown-view',
    label: 'MarkdownView',
    group: 'content',
    Section: MarkdownViewSection,
  },
  {
    id: 'responsive-visibility',
    label: 'Responsive visibility',
    group: 'layout',
    Section: ResponsiveVisibilitySection,
  },
  {
    id: 'tooltip',
    label: 'Tooltip',
    group: 'controls',
    Section: TooltipSection,
  },
  {
    id: 'info-tip',
    label: 'InfoTip',
    group: 'controls',
    Section: InfoTipSection,
  },
  {
    id: 'radio-group',
    label: 'RadioGroup',
    group: 'controls',
    Section: RadioGroupSection,
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    group: 'controls',
    Section: CheckboxSection,
  },
  {
    id: 'date-field',
    label: 'DateField',
    group: 'controls',
    Section: DateFieldSection,
  },
  {
    id: 'calendar-button',
    label: 'CalendarButton',
    group: 'controls',
    Section: CalendarButtonSection,
  },
  {
    id: 'date-range-button',
    label: 'DateRangeButton',
    group: 'controls',
    Section: DateRangeButtonSection,
  },
  { id: 'dialog', label: 'Dialog', group: 'controls', Section: DialogSection },
  { id: 'toast', label: 'Toast', group: 'controls', Section: ToastSection },
  {
    id: 'stat-tile',
    label: 'StatTile',
    group: 'data',
    Section: StatTileSection,
  },
  {
    id: 'list-group',
    label: 'ListGroup',
    group: 'data',
    Section: ListGroupSection,
  },
  {
    id: 'document-viewer',
    label: 'DocumentViewer',
    group: 'data',
    Section: DocumentViewerSection,
  },
  {
    id: 'description-list',
    label: 'DescriptionList',
    group: 'data',
    Section: DescriptionListSection,
  },
  { id: 'table', label: 'Table', group: 'data', Section: TableSection },
  {
    id: 'pagination',
    label: 'Pagination',
    group: 'data',
    Section: PaginationSection,
  },
  {
    id: 'denomination-grid',
    label: 'DenominationGrid',
    group: 'data',
    Section: DenominationGridSection,
  },
  {
    id: 'bar-chart',
    label: 'BarChart',
    group: 'data',
    Section: BarChartSection,
  },
  {
    id: 'data-bar',
    label: 'DataBar',
    group: 'data',
    Section: DataBarSection,
  },
  {
    id: 'chart-legend',
    label: 'ChartLegend',
    group: 'data',
    Section: ChartLegendSection,
  },
  {
    id: 'column-chart',
    label: 'ColumnChart',
    group: 'data',
    Section: ColumnChartSection,
  },
  {
    id: 'line-chart',
    label: 'LineChart',
    group: 'data',
    Section: LineChartSection,
  },
  {
    id: 'app-header',
    label: 'AppHeader',
    group: 'chrome',
    Section: AppHeaderSection,
  },
  { id: 'nav', label: 'Nav', group: 'chrome', Section: NavSection },
  {
    id: 'section-nav',
    label: 'SectionNav',
    group: 'chrome',
    Section: SectionNavSection,
  },
  {
    id: 'app-shell',
    label: 'AppShell',
    group: 'chrome',
    Section: AppShellSection,
  },
  { id: 'link', label: 'Link', group: 'chrome', Section: LinkSection },
] as const satisfies ReadonlyArray<CatalogItem>;

export type CatalogEntry = (typeof catalog)[number];

export function groupedCatalog(): ReadonlyArray<{
  id: CatalogGroupId;
  label: string;
  entries: ReadonlyArray<CatalogEntry>;
}> {
  return catalogGroups.map((group) => ({
    id: group.id,
    label: group.label,
    entries: catalog.filter((entry) => entry.group === group.id),
  }));
}
