import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

type HeaderProps = {
  title: string;
  /** Hide the back button (e.g. on tab roots). */
  noBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  dark?: boolean;
  /** «close» for modals. */
  backIcon?: 'chevron-back' | 'close';
};

export const goBack = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/home');
};

/** Figma «Detail» header: back chevron, centred title, optional right action. */
export function Header({ title, noBack, onBack, right, dark, backIcon = 'chevron-back' }: HeaderProps) {
  const fg = dark ? colors.white : colors.ink;
  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        {noBack ? null : (
          <IconButton icon={backIcon} color={fg} accessibilityLabel={backIcon === 'close' ? 'Закрыть' : 'Назад'} onPress={onBack ?? goBack} />
        )}
      </View>
      <AppText variant="section" color={fg} numberOfLines={1} style={styles.title} accessibilityRole="header">
        {title}
      </AppText>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter - 10,
  },
  side: { minWidth: 64, flexDirection: 'row' },
  right: { justifyContent: 'flex-end' },
  title: { flex: 1, textAlign: 'center' },
});
