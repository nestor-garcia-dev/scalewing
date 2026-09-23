Status: implemented for the next react-native release.

Scalewing request from FutMas.

Renderer: react-native
Change to an existing surface: native `Field` takes `rows` for a multi-line
text field.
Why: league owners add teams to a division one per line, or paste a list
from Notes or WhatsApp (approved FutMas setup redesign, 2026-09-22). A
single-line `Field` centers one line in a 44-point control; passing the React
Native `multiline` flag through kept that height and centering.
Existing surface this might already be: `Field` itself; this adds one prop.
Proposed API: `rows` (default 1). More than one makes the input multi-line,
starts it tall enough for that many lines of body text inside the frame's
padding, aligns text to the top, and lets it grow with its content. The
React Native `multiline` flag still passes through unchanged for existing
callers.
