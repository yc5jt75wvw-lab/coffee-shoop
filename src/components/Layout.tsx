import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, shadow, spacing } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

// ——— Card: white rounded surface ———

export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && { backgroundColor: '#FCFAF8' }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

// ——— Section header ———

export function SectionTitle({
  title,
  action,
  onAction,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.section, style]}>
      <AppText variant="section" accessibilityRole="header">
        {title}
      </AppText>
      {action ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={12}>
          <AppText variant="bodyStrong" color={colors.primary}>
            {action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Divider({ thick, style }: { thick?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        thick
          ? { height: 4, backgroundColor: colors.primarySoft, marginHorizontal: -spacing.gutter }
          : { height: 1, backgroundColor: colors.border },
        style,
      ]}
    />
  );
}

// ——— List row (settings, profile, menus) ———

export function ListRow({
  icon,
  title,
  subtitle,
  right,
  onPress,
  danger,
  chevron = !!onPress,
  style,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
  chevron?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const content = (
    <>
      {icon ? (
        <View style={[styles.rowIcon, danger && { backgroundColor: colors.dangerSoft }]}>
          <Icon name={icon} size={20} color={danger ? colors.danger : colors.primary} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong" color={danger ? colors.danger : colors.ink}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
      {chevron ? <Icon name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </>
  );
  if (!onPress) return <View style={[styles.row, style]}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }, style]}
    >
      {content}
    </Pressable>
  );
}

// ——— Bottom action bar (Figma Detail/Order footer) ———

export function BottomBar({
  children,
  style,
  inset = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Pad for the home indicator. Off inside tabs, where the tab bar already does. */
  inset?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottom, { paddingBottom: inset ? Math.max(insets.bottom, 16) : 16 }, style]}>{children}</View>
  );
}

// ——— Empty state ———

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: IconName;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={36} color={colors.primary} />
      </View>
      <AppText variant="headline" align="center">
        {title}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} align="center" style={{ maxWidth: 280 }}>
        {text}
      </AppText>
      {action ? <View style={{ marginTop: 8, alignSelf: 'stretch' }}>{action}</View> : null}
    </View>
  );
}

// ——— Notes and pills ———

export function InfoNote({ text, icon = 'information-circle-outline', tone = 'brand' }: { text: string; icon?: IconName; tone?: 'brand' | 'danger' }) {
  const fg = tone === 'danger' ? colors.danger : colors.primary;
  return (
    <View style={[styles.note, tone === 'danger' && { backgroundColor: colors.dangerSoft }]}>
      <Icon name={icon} size={18} color={fg} />
      <AppText variant="caption" color={tone === 'danger' ? colors.danger : '#7A4A2C'} style={{ flex: 1 }}>
        {text}
      </AppText>
    </View>
  );
}

export function Pill({ label, tone }: { label: string; tone: 'brand' | 'success' | 'danger' | 'neutral' }) {
  const map = {
    brand: [colors.primarySoft, colors.primary],
    success: [colors.successSoft, '#1E8A57'],
    danger: [colors.dangerSoft, colors.danger],
    neutral: [colors.surfaceAlt, colors.textSecondary],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <AppText variant="captionStrong" color={fg}>
        {label}
      </AppText>
    </View>
  );
}

/** Figma Delivery: four segment bars, done segments in green. */
export function ProgressSegments({ total = 4, done, current }: { total?: number; done: number; current?: number }) {
  return (
    <View style={styles.segments} accessibilityLabel={`Этап ${Math.min(done + 1, total)} из ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i < done && { backgroundColor: colors.success },
            i === current && { backgroundColor: colors.primary },
          ]}
        />
      ))}
    </View>
  );
}

export function Avatar({ label, size = 56 }: { label: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size * 0.3 }]}>
      <AppText variant={size > 48 ? 'title' : 'bodyStrong'} color={colors.white}>
        {label}
      </AppText>
    </View>
  );
}

export function SummaryRow({
  label,
  value,
  strike,
  strong,
  valueColor,
}: {
  label: string;
  value: string;
  strike?: string;
  strong?: boolean;
  valueColor?: string;
}) {
  return (
    <View style={styles.summary}>
      <AppText variant={strong ? 'section' : 'body'}>{label}</AppText>
      <View style={styles.summaryValue}>
        {strike ? (
          <AppText variant="body" color={colors.textSecondary} style={{ textDecorationLine: 'line-through' }}>
            {strike}
          </AppText>
        ) : null}
        <AppText variant={strong ? 'priceM' : 'priceS'} color={valueColor ?? colors.ink}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    paddingVertical: 10,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    ...shadow(2),
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 48 },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  note: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  segments: { flexDirection: 'row', gap: 8 },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#DFDFDF' },
  avatar: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 30 },
  summaryValue: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

