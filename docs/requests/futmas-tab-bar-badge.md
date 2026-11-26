Status: implemented in `@scalewing/react-native` 1.19.0.

Scalewing request from FutMas.

Renderer: react-native
Missing surface: a `badge` count on a `TabBar` destination, and labels that
fit five destinations beside the trailing control on a phone.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas F-027
adds an Agenda tab whose badge counts the things that need the person.
`TabBar` takes any icon, so FutMas draws a red pill inside its icon slot,
but the tab's accessible name stays "Agenda": VoiceOver never hears the
count, and the pill's offset, size and `99+` cap are hand-placed in product
code. With Agenda the bar holds five destinations plus the round search
control, and on a 390-point iPhone "Following" ellipsizes to "Followi…"
(Spanish "Configuración" is worse) because labels never shrink.
Existing surface this might already be: `TabBar` (extend it), `NavCount`
(web only).
Workaround I almost used: a product `Box` with `theme.colors.danger`,
absolute offsets and hand-written `99+` inside the icon slot.
Proposed API (reusable names only):

```tsx
<TabBar
  items={[
    {
      badge: 3, // hidden at 0 or undefined; "99+" past 99
      badgeAccessibilityLabel: '3 pendientes', // default "3 items"
      icon: <Shirt {...glyph} />,
      key: 'agenda',
      label: 'Agenda',
      onPress,
      selected,
    },
  ]}
/>
```

The tab reads as "Agenda, 3 items" (label, then the badge as its
accessibility value), as iOS reads a `UITabBarItem` badge. Labels shrink to
70% of their size before they ellipsize, as iOS tab labels do. Measured SF
Pro widths at the 13-point caption size: "Following" 56.5 pt and
"Configuración" 83.8 pt, against a 62.8-pt column (390 pt less 12-pt bar
padding each side, the 44-pt trailing control and an 8-pt gap, over five):
"Following" fits at full size and "Configuración" at 75%.
