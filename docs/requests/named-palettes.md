Scalewing request from gallery / any web or native client.

Renderer: react | react-native
Missing surface: named palettes as ThemeProvider `palette`, `data-palette` on the generated canvas, and optional `@scalewing/react/palette/<id>.css` files
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Accent and canvas colors are tokens. Products were about to copy hex into ThemeProvider or global CSS to leave indigo. That forks the visual system.
Existing surface this might already be: ThemeProvider `colors` overlay (still works; too low-level for picking a reviewed theme)
Workaround I almost used: hex in JSX, copied CSS variables in the app global sheet, a second visual skin
Proposed API:
palettes in `@scalewing/tokens`
createTheme({ palette: 'cerulean' })
<ThemeProvider palette="cerulean">
[data-theme][data-palette='cerulean'] in styles.css
import '@scalewing/react/palette/cerulean.css'
