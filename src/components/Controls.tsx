import React from 'react';
import { Pressable, StyleProp, StyleSheet, Switch, View, ViewStyle } from 'react-native';

import { SIZES, type Size } from '../data/catalog';
import { useHaptics } from '../lib/hooks';
import { colors, fonts, HIT, radius } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

// ——— Chip (Figma category chips) ———

export function Chip({
  label,
  selected,
  onPress,
  icon,
  tone = 'grey',
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  tone?: 'grey' | 'white';
  style?: StyleProp<ViewStyle>;
}) {
  const haptics = useHaptics();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      onPress={() => {
        haptics.select();
        onPress?.();
      }}
      hitSlop={{ top: 6, bottom: 6 }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: selected ? colors.primary : tone === 'white' ? colors.surface : '#EDEDED' },
        tone === 'white' && !selected && styles.chipBorder,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={14} color={selected ? colors.white : colors.ink} /> : null}
      <AppText variant={selected ? 'bodyStrong' : 'body'} color={selected ? colors.white : colors.ink}>
        {label}
      </AppText>
    </Pressable>
  );
}

// ——— Segmented control (Figma «Deliver / Pick Up») ———

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const haptics = useHaptics();
  return (
    <View style={[styles.segment, style]} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (!active) haptics.select();
              onChange(o.value);
            }}
            style={[styles.segmentItem, active && styles.segmentActive]}
          >
            <AppText
              variant="section"
              color={active ? colors.white : colors.ink}
              style={{ fontFamily: active ? fonts.semibold : fonts.regular }}
            >
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

// ——— Size selector (Figma S / M / L) ———

export function SizeSelector({ value, onChange }: { value: Size; onChange: (s: Size) => void }) {
  const haptics = useHaptics();
  return (
    <View style={styles.sizes} accessibilityRole="radiogroup">
      {SIZES.map((s) => {
        const active = s.id === value;
        return (
          <Pressable
            key={s.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={`Размер ${s.label}, ${s.volume} мл`}
            onPress={() => {
              haptics.select();
              onChange(s.id);
            }}
            style={[styles.size, active && styles.sizeActive]}
          >
            <AppText variant="body" color={active ? colors.primary : colors.ink}>
              {s.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

// ——— Option box (wider radio tiles: milk, syrup, delivery speed) ———

export function OptionBox({
  title,
  subtitle,
  trailing,
  selected,
  onPress,
  icon,
  style,
}: {
  title: string;
  subtitle?: string;
  trailing?: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  const haptics = useHaptics();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={[title, subtitle, trailing].filter(Boolean).join(', ')}
      onPress={() => {
        haptics.select();
        onPress();
      }}
      style={({ pressed }) => [styles.option, selected && styles.sizeActive, pressed && { opacity: 0.85 }, style]}
    >
      {icon ? (
        <View style={[styles.optionIcon, selected && { backgroundColor: colors.white }]}>
          <Icon name={icon} size={20} color={colors.primary} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong" color={selected ? colors.primary : colors.ink}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textSecondary}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing ? (
        <AppText variant="priceS" color={selected ? colors.primary : colors.ink}>
          {trailing}
        </AppText>
      ) : null}
      <RadioDot selected={selected} />
    </Pressable>
  );
}

export function RadioDot({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected && { borderColor: colors.primary }]}>
      {selected ? <View style={styles.radioInner} /> : null}
    </View>
  );
}

// ——— Quantity stepper (Figma Order «− 1 +») ———

export function QtyStepper({
  value,
  onChange,
  min = 0,
  max = 20,
  size = 28,
  label = 'Количество',
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: number;
  label?: string;
}) {
  const haptics = useHaptics();
  const btn = (icon: IconName, next: number, a11y: string, disabled: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={(HIT - size) / 2}
      onPress={() => {
        haptics.select();
        onChange(next);
      }}
      style={({ pressed }) => [
        styles.stepBtn,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && { backgroundColor: colors.primarySoft },
        disabled && { opacity: 0.35 },
      ]}
    >
      <Icon name={icon} size={size * 0.55} color={colors.ink} />
    </Pressable>
  );
  return (
    <View style={styles.stepper} accessibilityLabel={`${label}: ${value}`}>
      {btn('remove', value - 1, 'Уменьшить', value <= min)}
      <AppText variant="bodyStrong" style={styles.stepValue}>
        {value}
      </AppText>
      {btn('add', value + 1, 'Увеличить', value >= max)}
    </View>
  );
}

// ——— Switch row helper ———

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  const haptics = useHaptics();
  return (
    <Switch
      accessibilityLabel={label}
      value={value}
      onValueChange={(v) => {
        haptics.select();
        onChange(v);
      }}
      trackColor={{ false: colors.borderStrong, true: colors.primary }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.borderStrong}
    />
  );
}

// ——— Checkbox ———

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.checkRow}
      hitSlop={6}
    >
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>
        {checked ? <Icon name="checkmark" size={14} color={colors.white} /> : null}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
  },
  chipBorder: { borderWidth: 1, borderColor: colors.border },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
    borderRadius: radius.md,
    padding: 4,
    height: 48,
  },
  segmentItem: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm },
  segmentActive: { backgroundColor: colors.primary },
  sizes: { flexDirection: 'row', gap: 16 },
  size: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: { minWidth: 16, textAlign: 'center' },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, minHeight: HIT, paddingVertical: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: colors.surface,
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
