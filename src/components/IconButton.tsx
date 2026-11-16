import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useHaptics } from '../lib/hooks';
import { colors, HIT, radius, shadow } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

type Variant = 'plain' | 'outline' | 'filled' | 'floating' | 'soft';

type IconButtonProps = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: Variant;
  size?: number;
  iconSize?: number;
  color?: string;
  badge?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'plain',
  size = HIT,
  iconSize,
  color,
  badge,
  disabled,
  style,
}: IconButtonProps) {
  const haptics = useHaptics();
  const v = VARIANTS[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={size < HIT ? (HIT - size) / 2 : 0}
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: variant === 'plain' ? size / 2 : radius.md },
        v,
        variant === 'floating' && shadow(1),
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.35 },
        style,
      ]}
    >
      <Icon name={icon} size={iconSize ?? Math.round(size * 0.5)} color={color ?? (variant === 'filled' ? colors.white : colors.ink)} />
      {badge ? (
        <View style={styles.badge}>
          <AppText variant="micro" color={colors.white} style={styles.badgeText}>
            {badge > 9 ? '9+' : badge}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const VARIANTS: Record<Variant, ViewStyle> = {
  plain: {},
  outline: { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  filled: { backgroundColor: colors.primary },
  floating: { backgroundColor: colors.surface },
  soft: { backgroundColor: colors.surfaceAlt },
};

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { lineHeight: 12 },
});
