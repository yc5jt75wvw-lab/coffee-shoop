import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Segmented } from '../../src/components/Controls';
import { Header } from '../../src/components/Header';
import { EmptyState } from '../../src/components/Layout';
import { StatusPill } from '../../src/components/OrderBits';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { getCoffee } from '../../src/data/catalog';
import { drinksWord, formatDateTime, formatPrice } from '../../src/lib/format';
import { useNow } from '../../src/lib/hooks';
import { getOrderStatus, isActive } from '../../src/lib/orderStatus';
import { useStore } from '../../src/store/StoreProvider';
import type { Order } from '../../src/store/types';
import { colors, radius, spacing } from '../../src/theme';

type Tab = 'active' | 'done';

/** Screen 26 — Order history (demo orders, persisted). */
export default function OrderHistoryScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const now = useNow(5000);
  const hasActive = state.orders.some((o) => isActive(o, now));
  const [tab, setTab] = useState<Tab>(hasActive ? 'active' : 'done');
  const list = state.orders.filter((o) => (tab === 'active' ? isActive(o, now) : !isActive(o, now)));

  const reorder = (o: Order) => {
    const n = actions.reorder(o.id);
    toast.show(`${drinksWord(n)} добавлено в корзину`, { action: 'Корзина', onAction: () => router.navigate('/cart') });
  };

  return (
    <Screen scroll header={<Header title="Мои заказы" />}>
      <Segmented<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'active', label: 'Активные' },
          { value: 'done', label: 'Завершённые' },
        ]}
        style={{ marginTop: 4, marginBottom: spacing.md }}
      />

      {list.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title={tab === 'active' ? 'Активных заказов нет' : 'История пуста'}
          text={tab === 'active' ? 'Оформите заказ — здесь можно будет следить за его статусом.' : 'Завершённые заказы появятся здесь.'}
          action={<Button title="Выбрать кофе" onPress={() => router.navigate('/home')} />}
        />
      ) : (
        <View style={{ gap: 12 }}>
          {list.map((o) => {
            const status = getOrderStatus(o, now);
            const units = o.lines.reduce((n, l) => n + l.qty, 0);
            return (
              <Pressable
                key={o.id}
                accessibilityRole="button"
                accessibilityLabel={`Заказ номер ${o.number}, ${formatPrice(o.totals.total)}`}
                onPress={() => router.push({ pathname: '/orders/[id]', params: { id: o.id } })}
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
              >
                <View style={styles.head}>
                  <View style={{ flex: 1 }}>
                    <AppText variant="section">Заказ №{o.number}</AppText>
                    <AppText variant="caption" color={colors.textSecondary}>
                      {formatDateTime(o.createdAt)} · {o.method === 'delivery' ? 'доставка' : 'самовывоз'}
                      {o.isSample ? ' · пример' : ''}
                    </AppText>
                  </View>
                  <StatusPill status={status} />
                </View>
                <View style={styles.thumbs}>
                  {o.lines.slice(0, 4).map((l) => {
                    const c = getCoffee(l.coffeeId);
                    return c ? <Image key={l.key} source={c.image} style={styles.thumb} contentFit="cover" /> : null;
                  })}
                  <AppText variant="caption" color={colors.textSecondary} style={{ flex: 1 }} numberOfLines={2}>
                    {o.lines.map((l) => `${l.name}${l.qty > 1 ? ` ×${l.qty}` : ''}`).join(', ')}
                  </AppText>
                </View>
                <View style={styles.foot}>
                  <View>
                    <AppText variant="caption" color={colors.textSecondary}>
                      {drinksWord(units)}
                    </AppText>
                    <AppText variant="priceM">{formatPrice(o.totals.total)}</AppText>
                  </View>
                  {tab === 'active' && o.method === 'delivery' && status !== 'cancelled' ? (
                    <Button
                      title="Отследить"
                      icon="navigate-outline"
                      size="sm"
                      onPress={() => router.push({ pathname: '/tracking/[id]', params: { id: o.id } })}
                    />
                  ) : tab === 'done' ? (
                    <Button title="Повторить" icon="refresh" size="sm" variant="secondary" onPress={() => reorder(o)} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 12,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  thumbs: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  thumb: { width: 40, height: 40, borderRadius: radius.sm },
  foot: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
});
