---
'@scalewing/react': minor
---

`NavCount`: a count after a Nav destination's words, placed inside its link or Button (`<a href="/tasks">Tasks<NavCount count={8} /></a>`), such as the tasks waiting in an area. It is SectionNav's count pill, now one shared rule, and it is read in the destination's name ("Tasks 8"); `countLabel` is read in place of the bare number ("Tasks 8 tasks to do") with the pill hidden from assistive technology; a `count` of 0 shows nothing. A count that is not a whole number from 0 or a blank `countLabel` throws a `RangeError`. New exports `NavCount`, `NavCountProps`; new class `sw-nav-count`; no new tokens, no new dependency. Request: `docs/requests/teisoro-nav-count.md`.
