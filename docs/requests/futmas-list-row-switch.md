Status: implemented for the react-native 1.17.0 release.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: a `ListRow` with an on/off switch on its end side that
saves in place, like a row in iOS Settings → Notifications.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas F-026
adds Settings → Notifications, one row per kind of push with a switch. Its
rows live in `ListGroup`s beside the other Settings rows, and FutMas's
mobile rules (`docs/MOBILE_UX.md`) keep one button per screen, so the
setting cannot be a Button or a chip. `ListRow` only navigates (chevron),
picks a choice (check) or shows a value; a consumer switch in a row would
leave two touch targets and two accessible elements per setting.
Existing surface this might already be: `ListRow` with `selected` (a check
reads as one choice among several, not on/off), `MultiSelect
variant="list"` (a checkbox group, not settings that save as they change).
Workaround I almost used: a consumer `Switch` beside a read-only `ListRow`.
Proposed API (reusable names only):

```tsx
<ListGroup>
  <ListRow
    accessory="switch"
    detail="When your league posts a score"
    onSwitchChange={setScores}
    switchValue={scores}
    title="Scores"
  />
</ListGroup>
```

Behavior and failure boundary: the row is one `switch` element named by its
title and detail, announcing checked and disabled; a tap anywhere on it calls
`onSwitchChange` once with the opposite value, and it never navigates (no
chevron, no `onPress`, typed apart from navigation rows). On is the theme's
`success` green and off its `border` grey in both schemes; `disabled` dims
and blocks the whole row. The row keeps the 44-point control height.

Scalewing owns the accessory, its colours and semantics, tests, docs, and the
native example. FutMas owns the copy, the saved settings, and any error
handling when a save fails.
