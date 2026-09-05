Scalewing request from fantasy-football.

Status: implemented in this checkout (gallery + changeset; not yet published).

Renderer: react
Missing surface: Split (resizable start pane with a collapse threshold)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Inline lays out two columns at content width. Box has no drag handle, no
max-width token for a sidebar, and no collapse-when-too-small behavior.
Button is a press control, not a window splitter. Native CSS resize is a
corner grip without a labeled separator, keyboard values, or hide-at-min.
Existing surface this might already be: none. Card is always expanded.
Accordion discloses a block in flow; it does not change column width.
Workaround I almost used: hardcoded aside width, app CSS resize, or a raw
div handle with invented cursor and hex.
Proposed API:
<Split label="Watch list">{children}</Split>
Optional controlled collapsed. Width uses --sw-split-min/size/max. Web only.
