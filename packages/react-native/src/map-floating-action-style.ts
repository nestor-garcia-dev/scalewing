import { parseHexColor, type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

/** The page colour at zero alpha, so the fade starts from clear page. */
function clearBackground(theme: Theme): string {
  const [red, green, blue] = parseHexColor(theme.colors.background);
  return `rgba(${red}, ${green}, ${blue}, 0)`;
}

/**
 * The band the capsule sits in: a fade from clear to the page colour, so
 * content scrolling under it fades out instead of cutting off.
 */
export function mapFloatingActionBandStyle(theme: Theme): ViewStyle {
  return {
    experimental_backgroundImage: `linear-gradient(to bottom, ${clearBackground(
      theme,
    )}, ${theme.colors.background} 40%)`,
    paddingBottom: theme.space[3],
    paddingHorizontal: theme.space[6],
    paddingTop: theme.space[5],
  };
}

/** The capsule: the primary action as a lifted pill in thumb reach. */
export function mapFloatingActionCapsuleStyle(
  theme: Theme,
  options: { disabled: boolean; pressed: boolean },
): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    elevation: 4,
    justifyContent: 'center',
    minHeight: theme.control.md.minHeight + theme.space[1],
    opacity: options.disabled
      ? theme.disabledOpacity
      : options.pressed
        ? 0.85
        : 1,
    paddingHorizontal: theme.control.md.paddingInline,
    shadowColor: theme.colors.accent,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: options.disabled ? 0 : 0.28,
    shadowRadius: 18,
  };
}
