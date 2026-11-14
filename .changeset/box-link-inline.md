---
'@scalewing/react': minor
---

`Box as="a" link="inline"` (`sw-link-inline`) is a link inside a sentence: the accent colour, always underlined, so it never depends on colour alone and passes axe's `link-in-text-block` where the accent is under 3:1 against the text around it. The line is 1px, 0.18em below the baseline, in the accent at 60 %; hover and keyboard focus draw it in the full accent at the focus ring's width, and the words stay in the accent. Focus keeps the canvas ring, forced colours paint it as any link, and `external` keeps its arrow. Requested by FutMas for its docs' body text (`docs/requests/futmas-box-link-inline.md`).
