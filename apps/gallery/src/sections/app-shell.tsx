import { Stack, Text } from '@scalewing/react';

import { appShellFrameQuery } from '../frames/app-shell-frame.js';
import { Section } from '../layout/Section.js';

const frames = [
  {
    id: 'laptop',
    title: 'Full sidebar, a 1366 by 680 laptop window',
    caption: 'From 75rem: the full sidebar, 1366 × 680',
  },
  {
    id: 'landscape',
    title: 'Icon rail, an iPad in landscape',
    caption: 'From lg to 75rem: the rail, 1180 × 820',
  },
  {
    id: 'portrait',
    title: 'Top bar and menu drawer, an iPad in portrait',
    caption: 'Below lg: the bar and its drawer, 820 × 1180',
  },
] as const;

export function AppShellSection() {
  const src = `?${appShellFrameQuery}`;
  return (
    <Section
      id="app-shell"
      purpose="AppShell is a web workspace's frame: a pinned side navigation of grouped destinations beside the page, which is main and scrolls with the document. From 75rem the sidebar is full: the header (a workspace switcher), the groups under muted captions, each destination's glyph, label and count pill, and the footer (the account), sticky at the window's height with only the list scrolling; the current destination takes a quiet fill. From lg to 75rem it is a rail of glyphs: labels hidden but still each link's name and shown in a tooltip, a count as the pill on the glyph, groups split by hairlines, railHeader and railFooter in place of the header and footer. Below lg a sticky top bar holds the menu button, the title and barEnd; the menu opens the same header, navigation and footer in a modal drawer from the inline start that Escape, a press outside, its close button or choosing a destination closes, focus returning to the menu button. onNavigate takes a plain press for a client router. pageBar is a band at the top of main on every layout (the census and its status here), on the solid surface with a hairline under it, sticky under the top bar below lg and at the window's top from lg. menuCount puts the shared count pill on the menu button, read in its name (Open menu, 5 need you), in menuCountTone's colour. skipLink puts a Skip to main content link first in the shell, in the consumer's words: hidden until it has focus, then a pill fixed at the window's top start over the sidebar and the bars, and a press moves focus to main (named by the shell, focusable with tabindex -1, no ring) without changing the address, so a keyboard user passes the destinations. header and railHeader may hold a switcher's trigger (the station ContextSwitcher, a glyph alone in the rail); its popup opens on the top layer, unclipped by the sidebar or the drawer. Each frame below is the shell alone in an iframe at a device's window size, drawn at two fifths."
      title="AppShell"
      usage={`<AppShell
  navLabel="Field station"
  groups={[
    { id: 'field', items: [{ id: 'today', label: 'Today', href: '/today', icon: <CalendarIcon />, current: 'page' }] },
    { id: 'reserves', label: 'Reserves', items: [
      { id: 'wetlands', label: 'Wetlands', href: '/wetlands', icon: <WavesIcon />, count: 3, countLabel: '3 sightings to check' },
    ] },
  ]}
  onNavigate={(item) => navigate(item.href)}
  header={<StationSwitcher />}
  railHeader={<StationSwitcher compact />}
  footer={<AccountMenu />}
  pageBar={<CensusBar />}
  barTitle={<Text variant="label">Heron Marsh</Text>}
  menuIcon={<MenuIcon />}
  menuCount={5}
  menuCountLabel="5 need you"
  menuCountTone="warning"
  labels={{ openMenu: 'Open menu', closeMenu: 'Close menu' }}
  skipLink={{ label: 'Skip to main content' }}
>
  {page}
</AppShell>`}
    >
      <Stack gap={3}>
        <div className="gallery-shell-frames">
          {frames.map((frame) => (
            <Stack gap={2} key={frame.id}>
              <div
                className={`gallery-shell-frame gallery-shell-frame-${frame.id}`}
              >
                <iframe loading="lazy" src={src} title={frame.title} />
              </div>
              <Text color="muted" variant="caption">
                {frame.caption}
              </Text>
            </Stack>
          ))}
        </div>
        <Text color="muted" variant="caption">
          Open the gallery with {src} after its address to see the field station
          full size, and resize the window.
        </Text>
      </Stack>
    </Section>
  );
}
