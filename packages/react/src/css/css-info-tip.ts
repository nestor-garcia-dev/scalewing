import { iconButtonRules } from './css-icon-button.js';

/* InfoTip's glyph button; its bubble is the generated `.sw-tooltip`. */
export function cssInfoTipClasses(): string {
  return iconButtonRules('sw-info-tip');
}

export function infoTipClassCatalog(): string[] {
  return ['sw-info-tip'];
}
