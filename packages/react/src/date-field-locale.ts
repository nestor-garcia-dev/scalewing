/** Used when neither the `locale` prop nor an ancestor `lang` names one. */
export const DEFAULT_DATE_LOCALE = 'en-US';

function supported(tag: string): boolean {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf([tag]).length > 0;
  } catch {
    return false;
  }
}

/** The canonical form of an explicit tag; throws naming `prop` if malformed. */
function canonicalLocale(tag: string, prop: string): string {
  try {
    return Intl.getCanonicalLocales(tag)[0] ?? DEFAULT_DATE_LOCALE;
  } catch {
    throw new RangeError(`${prop} must be a BCP 47 language tag`);
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
  if (locale !== undefined) return canonicalLocale(locale, 'locale');
  const lang = documentLang?.trim();
  return lang && supported(lang) ? lang : DEFAULT_DATE_LOCALE;
}

/**
 * The locale for the typed entry only: its field order, separator,
 * placeholder and display text. An explicit `entryLocale` must be a valid
 * BCP 47 tag, or this throws; otherwise it is the resolved `locale`, so the
 * names and the typed order agree unless a product asks them not to.
 */
export function resolveDateEntryLocale(
  entryLocale: string | undefined,
  resolvedLocale: string,
): string {
  return entryLocale === undefined
    ? resolvedLocale
    : canonicalLocale(entryLocale, 'entryLocale');
}
