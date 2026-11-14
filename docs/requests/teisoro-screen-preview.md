# Teisoro: a drawn stand-in for an app's screen

Status: released in `@scalewing/react` 1.50.0 (PR #251). Revision (the device frame at every width, a dark bezel in the dark scheme) released in `@scalewing/react` 1.68.0 for FutMas F-024 (PR #304).

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

## Revision: the device frame at every width (FutMas F-024)

FutMas's site shows two screenshots side by side as phones on a 390 px phone page, each about 150 px wide. They drew as bare cards, because the device frame dropped to the card below `md` (by design: the viewport was already a phone), and in the dark scheme the bezel, in the text colour, was a near-white ring.

- `device` draws the phone at every width: below `md` it takes its column's width with a thinner bezel (`space-2`), from `md` it is 20rem with the `space-3` bezel.
- The bezel is the inverse colour, near black in both schemes, with a hairline rim in the border colour so it stands apart from the black dark page; the screen sits on the grouped canvas (black in the dark scheme), its header and groups surface cards.
- A `PreviewImage` alone fills the screen edge to edge, with no quiet mat round it.
- Forced colours outline the bezel at every width.
