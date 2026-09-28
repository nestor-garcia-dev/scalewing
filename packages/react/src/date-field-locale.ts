/** Used when neither the `locale` prop nor an ancestor `lang` names one. */
export const DEFAULT_DATE_LOCALE = 'en-US';

function supported(tag: string): boolean {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf([tag]).length > 0;
  } catch {
    return false;
  }
}

/**
 * The locale a date control formats with. An explicit `locale` must be a
 * valid BCP 47 tag, or this throws. Otherwise the nearest `lang` attribute
 * is used when the runtime supports it, then en-US.
 */
export function resolveDateLocale(
  locale: string | undefined,
  documentLang: string | null | undefined,
): string {
  if (locale !== undefined) {
    try {
      return Intl.getCanonicalLocales(locale)[0] ?? DEFAULT_DATE_LOCALE;
    } catch {
      throw new RangeError('locale must be a BCP 47 language tag');
    }
  }
  const lang = documentLang?.trim();
  return lang && supported(lang) ? lang : DEFAULT_DATE_LOCALE;
}
