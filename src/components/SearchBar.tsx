import React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../theme';
import { goBack } from './Header';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

/** Search header used on Search and Search Results: back + field + clear. */
export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  autoFocus,
  right,
}: {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.wrap}>
      <IconButton icon="chevron-back" accessibilityLabel="Назад" onPress={goBack} />
      <View style={styles.field}>
        <Icon name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
          placeholder="Найти кофе"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          returnKeyType="search"
          accessibilityLabel="Поиск напитков"
          maxFontSizeMultiplier={1.3}
          style={styles.input}
        />
        {value ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Очистить поиск" hitSlop={12} onPress={() => onChangeText('')}>
            <Icon name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: spacing.gutter - 12,
    paddingRight: spacing.gutter,
    paddingVertical: 8,
  },
  field: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
});
