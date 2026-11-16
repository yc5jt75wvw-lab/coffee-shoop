import React, { forwardRef, useState } from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, TextInput, TextInputInstance, TextInputProps, View, ViewStyle } from 'react-native';

import { colors, fonts, radius } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: IconName;
  error?: string | null;
  hint?: string;
  /** Adds a show/hide toggle for passwords. */
  secureToggle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export const TextField = forwardRef<TextInputInstance, TextFieldProps>(function TextField(
  { label, icon, error, hint, secureToggle, containerStyle, multiline, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;
  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label ? <AppText variant="captionStrong">{label}</AppText> : null}
      <View style={[styles.field, multiline && styles.multiline, { borderColor }]}>
        {icon ? <Icon name={icon} size={18} color={focused ? colors.primary : colors.textMuted} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          maxFontSizeMultiplier={1.3}
          accessibilityLabel={label ?? rest.placeholder}
          secureTextEntry={secureToggle ? hidden : rest.secureTextEntry}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, multiline && { minHeight: 72 }, style]}
          {...rest}
        />
        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Показать пароль' : 'Скрыть пароль'}
            hitSlop={12}
            onPress={() => setHidden((h) => !h)}
          >
            <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textSecondary}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surface,
  },
  multiline: { alignItems: 'flex-start', paddingVertical: 12 },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 12,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
});
