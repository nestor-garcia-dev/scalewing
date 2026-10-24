# Teisoro: a drawn stand-in for an app's screen

Status: implemented, pending release, for the next `@scalewing/react` minor.

Scalewing request from Teisoro.

Renderer: react
Missing surface: `ScreenPreview` with `PreviewGroup`, `PreviewRow` and `PreviewTiles`, a drawn app screen on a public page, one image with alternative text
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Teisoro F-017 (owner-approved 2026-10-24) draws the product's screens on its public pages (a phone with the owner's cash on hand, a check's history, the vault by bill) until real screenshots from the demo store replace them. The story requires them to be images with alternative text, not live product code. A phone bezel, rows of figures with a total and an alert tint, and bill-count tiles have no Scalewing surface; `Box` takes only the background and surface fills and no device frame, and a product may not draw them with its own CSS.
Existing surface this might already be: `DescriptionList` `spread` (facts, read row by row), `Card` (a panel), `DenominationGrid` (a real count entry), `StatTile`
Workaround I almost used: a static screenshot image, which the owner has not supplied yet (Q-4)
Proposed API (reusable names only): `<ScreenPreview label frame="card | device" eyebrow title caption>` holding `<PreviewGroup>`, `<PreviewRow label value kind="plain | total | note | filled | alert">` and `<PreviewTiles items>`

## Behaviour

- A `figure`; the screen is one `role="img"` named by `label`; an optional visible `caption` is the `figcaption`.
- `card` (default): a surface card, groups parted by hairlines. `device`: from `md` a 20rem phone (a bezel in the text colour, a quiet screen, a surface header strip, each group a card); below `md` the card.
- Rows: label at the start, value at the end in tabular numerals; `total` bold past a hairline; `note` a small muted label over its words; `filled` on the quiet fill; `alert` on the danger tint with words that keep 4.5:1.
- Tiles: a label over its value, three to a row below `md`, six from it.
- Forced colours outline the screen and the bezel.
- A blank label, an unknown frame or kind, no tiles, or a blank or repeated tile id throws a `RangeError`.
- Consumer: the drawn screens on Teisoro's Home, Services, Cash and For owners pages (F-017 S03).
