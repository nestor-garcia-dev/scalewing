import { type ComponentType } from 'react';

import { ButtonSection } from './sections/button.js';
import { CanvasSection } from './sections/canvas.js';
import { CardSection } from './sections/card.js';
import { FieldSection } from './sections/field.js';
import { FoundationsSection } from './sections/foundations.js';
import { LayoutSection } from './sections/layout.js';
import { LinkSection } from './sections/link.js';
import { TextSection } from './sections/text.js';
import { ThemeProviderSection } from './sections/theme-provider.js';

export const catalog = [
  { id: 'foundations', label: 'Foundations', Section: FoundationsSection },
  { id: 'canvas', label: 'Canvas', Section: CanvasSection },
  { id: 'layout', label: 'Layout', Section: LayoutSection },
  { id: 'text', label: 'Text', Section: TextSection },
  { id: 'card', label: 'Card', Section: CardSection },
  { id: 'button', label: 'Button', Section: ButtonSection },
  { id: 'field', label: 'Field', Section: FieldSection },
  { id: 'link', label: 'Link', Section: LinkSection },
  {
    id: 'theme-provider',
    label: 'ThemeProvider',
    Section: ThemeProviderSection,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  Section: ComponentType;
}>;

export type CatalogEntry = (typeof catalog)[number];
