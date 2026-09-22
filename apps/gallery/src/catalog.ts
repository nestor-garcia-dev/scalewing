import { ActionMenuSection } from './sections/action-menu.js';
import { SwitchSection } from './sections/switch.js';
import { DateFieldSection } from './sections/date-field.js';
import { CheckboxSection } from './sections/checkbox.js';
import { RadioGroupSection } from './sections/radio-group.js';
import { SpinnerSection } from './sections/spinner.js';
import { ProgressSection } from './sections/progress.js';
import { TooltipSection } from './sections/tooltip.js';
import { SeparatorSection } from './sections/separator.js';
import { ResponsiveVisibilitySection } from './sections/responsive-visibility.js';
import { FilterChipsSection } from './sections/filter-chips.js';
import { type ComponentType } from 'react';

import { AccordionSection } from './sections/accordion.js';
import { AppHeaderSection } from './sections/app-header.js';
import { BadgeSection } from './sections/badge.js';
import { BarChartSection } from './sections/bar-chart.js';
import { ButtonSection } from './sections/button.js';
import { CanvasSection } from './sections/canvas.js';
import { CardSection } from './sections/card.js';
import { DialogSection } from './sections/dialog.js';
import { ToastSection } from './sections/toast.js';
import { FieldSection } from './sections/field.js';
import { FoundationsSection } from './sections/foundations.js';
import { GridSection } from './sections/grid.js';
import { LayoutSection } from './sections/layout.js';
import { LinkSection } from './sections/link.js';
import { NavSection } from './sections/nav.js';
import { PalettesSection } from './sections/palettes.js';
import { SegmentedControlSection } from './sections/segmented-control.js';
import { SelectSection } from './sections/select.js';
import { SplitSection } from './sections/split.js';
import { TableSection } from './sections/table.js';
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
  { id: 'badge', label: 'Badge', group: 'controls', Section: BadgeSection },
  {
    id: 'segmented-control',
    label: 'SegmentedControl',
    group: 'controls',
    Section: SegmentedControlSection,
  },
  { id: 'field', label: 'Field', group: 'controls', Section: FieldSection },
  { id: 'select', label: 'Select', group: 'controls', Section: SelectSection },
  {
    id: 'action-menu',
    label: 'ActionMenu',
    group: 'controls',
    Section: ActionMenuSection,
  },
  { id: 'switch', label: 'Switch', group: 'controls', Section: SwitchSection },
  {
    id: 'spinner',
    label: 'Spinner',
    group: 'controls',
    Section: SpinnerSection,
  },
  {
    id: 'progress',
    label: 'Progress',
    group: 'controls',
    Section: ProgressSection,
  },
  {
    id: 'filter-chips',
    label: 'FilterChips',
    group: 'controls',
    Section: FilterChipsSection,
  },
  {
    id: 'separator',
    label: 'Separator',
    group: 'content',
    Section: SeparatorSection,
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
  { id: 'dialog', label: 'Dialog', group: 'controls', Section: DialogSection },
  { id: 'toast', label: 'Toast', group: 'controls', Section: ToastSection },
  { id: 'table', label: 'Table', group: 'data', Section: TableSection },
  {
    id: 'bar-chart',
    label: 'BarChart',
    group: 'data',
    Section: BarChartSection,
  },
  {
    id: 'app-header',
    label: 'AppHeader',
    group: 'chrome',
    Section: AppHeaderSection,
  },
  { id: 'nav', label: 'Nav', group: 'chrome', Section: NavSection },
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
