import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Segmented } from '../../src/components/Controls';
import { Header } from '../../src/components/Header';
import { Icon, IconName } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { EmptyState, InfoNote } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { isSameDay, relativeTime } from '../../src/lib/format';
import { useNow } from '../../src/lib/hooks';
import { useStore } from '../../src/store/StoreProvider';
import type { NotificationItem } from '../../src/store/types';
import { colors, radius, spacing } from '../../src/theme';

type FilterId = 'all' | 'order' | 'promo';

const KIND_ICON: Record<NotificationItem['kind'], IconName> = {
  order: 'bag-handle-outline',
  promo: 'pricetag-outline',
  system: 'information-circle-outline',
};

/** Screen 28 — Notifications: order status updates and offers. */
export default function NotificationsScreen() {
  const { state, actions } = useStore();
  const now = useNow(30_000);
  const [filter, setFilter] = useState<FilterId>('all');
  const promosOff = !state.settings.promoNotifications;

  const items = useMemo(
    () =>
      state.notifications
        .filter((n) => !(promosOff && n.kind === 'promo'))
        .filter((n) => filter === 'all' || n.kind === filter),
    [state.notifications, filter, promosOff],
  );
  const today = items.filter((n) => isSameDay(n.createdAt, now));
  const earlier = items.filter((n) => !isSameDay(n.createdAt, now));
  const unread = state.notifications.some((n) => !n.read);

  const open = (n: NotificationItem) => {
    actions.markRead(n.id);
    if (n.orderId && state.orders.some((o) => o.id === n.orderId)) {
      router.push({ pathname: '/orders/[id]', params: { id: n.orderId } });
    } else if (n.kind === 'promo') {
      router.push({ pathname: '/promo-codes', params: n.promoCode ? { code: n.promoCode } : {} });
    }
  };

  const renderGroup = (title: string, list: NotificationItem[]) =>
    list.length ? (
      <View style={{ gap: 4 }}>
        <AppText variant="bodyStrong" color={colors.textSecondary} style={styles.groupTitle}>
          {title}
        </AppText>
        {list.map((n) => (
          <Pressable
            key={n.id}
            accessibilityRole="button"
            accessibilityLabel={`${n.read ? '' : 'Новое. '}${n.title}. ${n.body}`}
            onPress={() => open(n)}
            style={({ pressed }) => [styles.item, !n.read && styles.unread, pressed && { opacity: 0.8 }]}
          >
            <View style={[styles.icon, n.kind === 'promo' && { backgroundColor: colors.dangerSoft }]}>
              <Icon name={KIND_ICON[n.kind]} size={20} color={n.kind === 'promo' ? colors.danger : colors.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={styles.titleRow}>
                <AppText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
                  {n.title}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {relativeTime(n.createdAt, now)}
                </AppText>
              </View>
              <AppText variant="caption" color={colors.textSecondary}>
                {n.body}
              </AppText>
            </View>
            {!n.read ? <View style={styles.dot} /> : null}
          </Pressable>
        ))}
      </View>
    ) : null;

  return (
    <Screen
      scroll
      header={
        <Header
          title="Уведомления"
          noBack
          right={
            unread ? <IconButton icon="checkmark-done-outline" accessibilityLabel="Отметить все прочитанными" onPress={actions.markAllRead} /> : null
          }
        />
      }
    >
      <Segmented<FilterId>
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'Все' },
          { value: 'order', label: 'Заказы' },
          { value: 'promo', label: 'Акции' },
        ]}
        style={{ marginBottom: spacing.md }}
      />
      {promosOff && filter !== 'order' ? (
        <Pressable onPress={() => router.push('/settings')} accessibilityRole="button" style={{ marginBottom: spacing.md }}>
          <InfoNote text="Уведомления об акциях отключены в настройках. Нажмите, чтобы изменить." icon="notifications-off-outline" />
        </Pressable>
      ) : null}
      {items.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title="Уведомлений нет"
          text="Здесь появятся статусы заказов и персональные предложения."
          action={<Button title="Сделать заказ" variant="secondary" onPress={() => router.navigate('/home')} />}
        />
      ) : (
        <View style={{ gap: spacing.md }}>
          {renderGroup('Сегодня', today)}
          {renderGroup('Ранее', earlier)}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  groupTitle: { marginBottom: 4 },
  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  unread: { borderColor: colors.primaryBorder, backgroundColor: '#FFFCFA' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
});
