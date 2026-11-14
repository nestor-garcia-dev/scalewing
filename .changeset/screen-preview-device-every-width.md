---
'@scalewing/react': minor
---

`ScreenPreview frame="device"`, from FutMas's F-024 review (`teisoro-screen-preview.md`):

- The bezel is near black in both schemes: the inverse colour (was the text colour, a near-white ring in the dark scheme), with a hairline rim in the border colour so it stands apart from the black dark page. The phone's screen sits on the grouped canvas (black in the dark scheme). A theme overlay of `inverse` recolours the bezel along with the dark band.
- The phone is drawn at every width. Below `md` it was the card (by design, the viewport being a phone already), so two screenshots side by side on a phone page drew as bare cards; it now takes its column's width with a thinner `space-2` bezel there, and stays 20rem with the `space-3` bezel from `md`.
- A `PreviewImage` alone fills the phone's screen edge to edge, with no quiet mat round it.
