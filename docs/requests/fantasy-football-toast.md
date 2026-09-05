Status: shipped (web React). Gallery section `toast`.

Scalewing request from fantasy-football.

Renderer: react
Missing surface: Toast (ephemeral confirmation that appears and auto-dismisses)
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Those primitives persist in layout. After a press (Draft stance Love = +3),
the product needs a short-lived +3 / −1 / −3 confirmation that appears,
then disappears, without staying in the table. Layout primitives cannot do
motion + overlay + timed dismiss without app CSS or a second overlay kit.
Existing surface this might already be: none in 0.2.0. Badge is persistent.
Dialog is a blocking modal. Button has no delta-pop slot. Roadmap already
lists Toast under Later; this file is the filled consumer request.
Workaround I almost used: app CSS animation, invented positioning, or a
Badge that never dismisses.
Proposed API (reusable names only):
<Toast open={open} onOpenChange={setOpen} timeoutMs={1200}>{children}</Toast>
Auto-dismiss. Does not trap focus (unlike Dialog). Web first.
Product copy (the +3) stays in the consumer. Do not name the primitive
DeltaPop or DraftStanceToast.
