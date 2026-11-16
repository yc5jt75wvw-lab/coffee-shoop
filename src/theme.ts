import { Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * Design tokens taken from the five source Figma screens.
 * Every screen reads colours, type, spacing and radii from here.
 */
export const colors = {
  primary: '#C67C4E',
  primaryPressed: '#AE6A3F',
  primarySoft: '#F9F2ED',
  primaryBorder: '#E9C9B4',

  ink: '#242424',
  inkStrong: '#111111',
  dark: '#313131',
  darkField: '#2A2A2A',

  textSecondary: '#717171',
  textMuted: '#9B9B9B',
  onDarkSecondary: '#B7B7B7',

  background: '#F9F9F9',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F3F3',
  border: '#EAEAEA',
  borderStrong: '#DEDEDE',

  success: '#36C07E',
  successSoft: '#E7F7EF',
  danger: '#ED5151',
  dangerSoft: '#FDECEC',
  warning: '#E5A23C',
  star: '#FBBE21',

  overlay: 'rgba(17,17,17,0.45)',
  white: '#FFFFFF',
} as const;

export const fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  numRegular: 'Sora_400Regular',
  numSemibold: 'Sora_600SemiBold',
  numBold: 'Sora_700Bold',
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 24,
} as const;

type TypeToken = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'>;

export const type = {
  display: { fontFamily: fonts.semibold, fontSize: 32, lineHeight: 42, letterSpacing: -0.3 },
  title: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28 },
  headline: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 26 },
  section: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 21 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17 },
  captionStrong: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 17 },
  micro: { fontFamily: fonts.medium, fontSize: 10, lineHeight: 14 },
  priceL: { fontFamily: fonts.numSemibold, fontSize: 18, lineHeight: 24 },
  priceM: { fontFamily: fonts.numSemibold, fontSize: 16, lineHeight: 22 },
  priceS: { fontFamily: fonts.numSemibold, fontSize: 14, lineHeight: 20 },
  number: { fontFamily: fonts.numSemibold, fontSize: 16, lineHeight: 22 },
} satisfies Record<string, TypeToken>;

export type TypeVariant = keyof typeof type;

/** Soft, offset shadow used on floating controls and sheets. */
export const shadow = (level: 1 | 2 = 1): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1B1B1B',
      shadowOpacity: level === 1 ? 0.06 : 0.12,
      shadowRadius: level === 1 ? 10 : 18,
      shadowOffset: { width: 0, height: level === 1 ? 4 : 8 },
    },
    android: { elevation: level === 1 ? 2 : 6 },
    default: {
      shadowColor: '#1B1B1B',
      shadowOpacity: level === 1 ? 0.06 : 0.12,
      shadowRadius: level === 1 ? 10 : 18,
      shadowOffset: { width: 0, height: level === 1 ? 4 : 8 },
    },
  })!;

/** Minimum touch target (iOS 44pt / Android 48dp). */
export const HIT = 44;
