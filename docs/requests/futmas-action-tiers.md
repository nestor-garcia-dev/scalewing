Status: implemented for the tokens 1.3.0, react 1.7.0, and react-native
1.10.0 releases.

Scalewing request from FutMas.

Renderer: tokens, then react-native and react (Button only)
Missing surface: three solid action colours and a Button variant for the
third.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: Button has one
filled variant (`primary`); `secondary` is an outlined white pill, which on
FutMas's white screens reads like a row, a chip, or an information card,
and `ghost` is text only. A consumer cannot give `secondary` a fill or add a
third filled action without inventing hex values in JSX.
FutMas use: owner feedback on 2026-09-26 from a phone test ("it was a bit
difficult to know that those were clickable … I need all buttons to have a
filled in color"). The owner chose option D on FutMas canvas board 19: blue
primary, near-black secondary, light-purple tertiary, every button a solid
fill with white text, at most three on a screen.
Existing surface this might already be: named palettes (ADR 0007) and the
Button variants; both extend rather than duplicate.
Workaround I almost used: `colors` overlays with hex in FutMas, which its
rules forbid, and a consumer button.
Proposed API:

- Semantic colours `secondary`, `onSecondary`, `tertiary`, `onTertiary`,
  and `subtle` (a quiet neutral fill for information surfaces, used by a
  later Card variant). Base defaults keep today's look: `secondary` follows
  `surface` unless a palette or overlay sets it, so the secondary action
  stays an outlined pill for every existing consumer; `tertiary` defaults
  to a neutral dark grey apart from every accent.
- A `signal` palette (quiet family): cerulean accent, near-black secondary,
  violet tertiary, with dark-scheme pairs.
- Button `variant="tertiary"`, a solid fill on `tertiary` with
  `onTertiary`. `secondary` fills with `secondary` and draws its hairline
  only while that fill is the surface.

Behavior and failure boundary:

- Every palette keeps each action pair (`onSecondary` on `secondary`,
  `onTertiary` on `tertiary`) at 4.5:1, and `tertiary` apart from `accent`
  and `secondary`.
- Unknown keys and empty values still fail closed in `createTheme`.

Scalewing owns the colours, the palette, and the Button fills. FutMas owns
which action on a screen is primary, secondary, or tertiary.
