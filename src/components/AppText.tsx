import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

import { colors, fonts, type as typeScale, TypeVariant } from '../theme';

export type AppTextProps = TextProps & {
  variant?: TypeVariant;
  color?: string;
  align?: TextStyle['textAlign'];
};

/** Sora (prices, numerals) has no Cyrillic glyphs or «№». */
const NEEDS_TEXT_FACE = /[Ѐ-ӿ№]/;

const flatText = (children: React.ReactNode): string =>
  React.Children.toArray(children)
    .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : ''))
    .join('');

/** Text with the app's type scale. Caps system font scaling so layouts hold. */
export function AppText({ variant = 'body', color = colors.ink, align, style, children, ...rest }: AppTextProps) {
  const token = typeScale[variant];
  const isNumeric = token.fontFamily.startsWith('Sora');
  const fallback = isNumeric && NEEDS_TEXT_FACE.test(flatText(children)) ? { fontFamily: fonts.bold } : null;
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[token, { color }, fallback, align ? { textAlign: align } : null, style]}
    >
      {children}
    </Text>
  );
}
