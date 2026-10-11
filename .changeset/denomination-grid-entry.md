---
'@scalewing/react': minor
---

`DenominationGrid` count entry (`docs/requests/teisoro-denomination-grid-entry.md`, Teisoro F-011 release R1), with the new types `DenominationGridEntry` and `DenominationGridRowEmphasis`:

- `DenominationGridRow.entry` (`onChange(columnKey, value)`, `decrementLabel`, `incrementLabel`, `max?`, `errors?`, `placeholder?`) makes a strip row's `cells` editable, one full-width `Stepper` per column named by the row label and the column's label and caption. Entry counts are zero or more and unsigned, and every count's name is its own. A strip with an entry row centres its heads and read-only counts; a `cellTones` tone draws an entry count's border (`accent` is the `Stepper`'s changed look).
- `DenominationGridRow.caption` (a muted line under the label), `emphasis` (`'default' | 'quiet'`, the subtle fill) and `disabled` (faded, entry disabled, `aria-disabled`), both strip only.
- `DenominationGridColumn.caption`: a muted note after the column label, such as "× 100".
- Entry rows need the strip layout; bad caps, messages, button names, captions or emphasis throw a `RangeError`.
- `Stepper` is now `position: relative`, so its hidden label and empty error region never widen a scroll region's page.
- New generated classes `sw-denomination-entry`, `sw-denomination-strip-entry`, `sw-denomination-label-words`, `sw-denomination-label-caption`, `sw-denomination-head-caption`, `sw-denomination-row-quiet` and `sw-denomination-row-disabled`. No new tokens or dependencies.
