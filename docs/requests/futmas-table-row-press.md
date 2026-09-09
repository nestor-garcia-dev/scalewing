Status: in progress (react-native). Native-example demonstrates a
pressable compact match row.

Scalewing request from futmas.

Renderer: react-native
Missing surface: TableRow press (optional onPress on an existing Table row)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Match and standings rows already use Table. Wrapping TableRow in a product
Pressable would fork density, hairlines, and alignment. Button is a single
labeled action, not a three-cell score row.
Existing surface this might already be: TableRow (display only). Button.
Card press.
Workaround I almost used: Pressable around TableRow in FutMas, or a product
MatchRow kit.
Proposed API (reusable names only):
<TableRow
accessibilityLabel={string}
onPress={() => void}

>

…
</TableRow>
onPress is optional. Header rows stay inert. Do not name it MatchRow.
