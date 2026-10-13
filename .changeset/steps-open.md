---
'@scalewing/react': minor
---

`Steps` `open` shows every step's fields at once (`docs/requests/teisoro-steps-open.md`, Teisoro F-011 task 2210): each step is a region named by its title, its marker still following its status (a number to fill, a check when done, "!" in error, a grey ring when greyed), every title at the open size, no step `aria-current` and no focus moved when a status changes. Off by default; a list without `open` is unchanged. New generated classes `sw-steps-open` and `sw-steps-region`. No new tokens, no new dependency.
