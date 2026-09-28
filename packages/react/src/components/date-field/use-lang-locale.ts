import { useLayoutEffect, useState, type RefObject } from 'react';

import { resolveDateLocale } from '../../date-field-locale.js';

/**
 * The `locale` prop when given; otherwise the `lang` of the nearest ancestor
 * of `ref`, read when the field mounts, then en-US. A product that switches
 * language without remounting passes `locale`.
 */
export function useLangLocale(
  locale: string | undefined,
  ref: RefObject<HTMLElement | null>,
): string {
  const [lang, setLang] = useState<string | null>(null);
  useLayoutEffect(() => {
    if (locale !== undefined) return;
    const nearest = ref.current?.closest('[lang]')?.getAttribute('lang');
    setLang(nearest ?? null);
  }, [locale, ref]);
  return resolveDateLocale(locale, lang);
}
