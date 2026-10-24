# Teisoro: a public site's footer

Status: implemented, pending release, for the next `@scalewing/react` minor.

Scalewing request from Teisoro.

Renderer: react
Missing surface: `SiteFooter`, a public site's footer on the dark band
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) builds a public site whose every page ends with the same footer: the white logo and a tagline on a navy band, three named groups of links (Product, the company, Legal), and a bottom row with the copyright and the language switch. `Band` gives the dark fill, but the groups' labels, the quiet link lists with their current page, the two-column phone layout and the bottom hairline would be product CSS, which Teisoro does not allow.
Existing surface this might already be: `Band tone="inverse"` (the fill only), `SectionNav` (one area's sections, not a footer's groups)
Workaround I almost used: a Band with hand-placed Stacks, Grids and links, which still leaves the link and label styles to the product
Proposed API (reusable names only): `<SiteFooter brand tagline groups={[{ id, label, links: [{ id, label, href, current, lang, hrefLang }] }]} legal end>`

## Behaviour

- The footer is `Band tone="inverse"` as a `footer` element: a brand overlay of `inverse` moves it.
- Each group is a `nav` named by its label, which shows above its links and is hidden from assistive technology (the `nav` carries it).
- Links are the band's muted words in label size, the current page (`aria-current="page"`) in its words at label weight, underlined on hover and focus; 44 px on a coarse pointer; link colours in forced colours.
- Below `md` the brand takes the full width and the groups two columns; from `md` the brand and the groups share one row, spread apart.
- `legal` and `end` fill a bottom row past a hairline; either may be left out, and the row with them.
- Invalid groups or links throw a `RangeError`.
- Consumer: every page of Teisoro's public site.
