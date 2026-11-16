import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { DeliveryMap } from '../../src/components/DeliveryMap';
import { goBack, Header } from '../../src/components/Header';
import { Icon, IconName } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { EmptyState, ProgressSegments } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { COURIER } from '../../src/data/options';
import { useNow } from '../../src/lib/hooks';
import { getOrderStatus, isFinal, stageIndex, travelProgress } from '../../src/lib/orderStatus';
import { useStore } from '../../src/store/StoreProvider';
import type { OrderStatus } from '../../src/store/types';
import { colors, radius, shadow, spacing } from '../../src/theme';

const COPY: Partial<Record<OrderStatus, { icon: IconName; title: string; text: string }>> = {
  accepted: { icon: 'receipt-outline', title: 'Заказ принят', text: 'Передаём заказ бариста. Отменить можно в деталях заказа.' },
  preparing: { icon: 'cafe-outline', title: 'Готовим напитки', text: 'Бариста варит кофе. Курьер заберёт заказ, как только он будет готов.' },
  on_the_way: { icon: 'bicycle-outline', title: 'Курьер везёт заказ', text: 'Мы доставим заказ в кратчайшие сроки.' },
  delivered: { icon: 'checkmark-done-outline', title: 'Заказ доставлен', text: 'Приятного кофе! Будем рады видеть вас снова.' },
  cancelled: { icon: 'close-circle-outline', title: 'Заказ отменён', text: 'Этот заказ был отменён и не будет доставлен.' },
};

/** Screen 25 — Delivery tracking (Figma «High-Fidelity Delivery»). */
export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const now = useNow(1000);
  const [focused, setFocused] = useState(false);
  const order = state.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Screen header={<Header title="Отслеживание" />}>
        <EmptyState
          icon="map-outline"
          title="Заказ не найден"
          text="Откройте историю заказов, чтобы выбрать другой."
          action={<Button title="Мои заказы" onPress={() => router.replace('/orders')} />}
        />
      </Screen>
    );
  }
  if (order.method === 'pickup') {
    return <Redirect href={{ pathname: '/orders/[id]', params: { id: order.id } }} />;
  }

  const status = getOrderStatus(order, now);
  const copy = COPY[status] ?? COPY.on_the_way!;
  const progress = travelProgress(order, now);
  const minutesLeft = Math.max(1, Math.ceil((order.timeline.doneAt - now) / 60_000));
  const stage = stageIndex(order, now);
  const done = isFinal(status) ? (status === 'cancelled' ? 0 : 4) : stage + 1;
  const title =
    status === 'on_the_way'
      ? `Осталось ${minutesLeft} мин`
      : status === 'delivered'
        ? 'Заказ у вас'
        : status === 'cancelled'
          ? 'Заказ отменён'
          : `Будет примерно через ${minutesLeft} мин`;
  const courierAssigned = status === 'on_the_way' || status === 'delivered';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.map}>
        <DeliveryMap progress={status === 'cancelled' ? 0 : progress} focused={focused} />
        <View style={[styles.mapButtons, { top: insets.top + 12 }]}>
          <IconButton icon="chevron-back" variant="floating" accessibilityLabel="Назад" onPress={goBack} />
          <IconButton
            icon={focused ? 'contract-outline' : 'locate-outline'}
            variant="floating"
            accessibilityLabel={focused ? 'Показать весь маршрут' : 'Приблизить к курьеру'}
            onPress={() => setFocused((f) => !f)}
          />
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={styles.handle} />
        <AppText variant="section" align="center" accessibilityLiveRegion="polite">
          {title}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} align="center" numberOfLines={1}>
          Доставка по адресу <AppText variant="captionStrong">{order.addressText}</AppText>
        </AppText>

        <View style={{ marginTop: spacing.md }}>
          <ProgressSegments done={done} />
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Icon name={copy.icon} size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyStrong">{copy.title}</AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {copy.text}
            </AppText>
          </View>
        </View>

        {courierAssigned ? (
          <View style={styles.courier}>
            <Image source={COURIER.photo} style={styles.photo} contentFit="cover" accessibilityLabel={COURIER.name} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{COURIER.name}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {COURIER.role}
              </AppText>
            </View>
            <IconButton
              icon="call-outline"
              variant="outline"
              accessibilityLabel="Позвонить курьеру"
              onPress={() => toast.show('Демо-режим: звонок курьеру не совершается')}
            />
          </View>
        ) : null}

        <Button
          title="Детали заказа"
          variant={status === 'delivered' ? 'primary' : 'ghost'}
          size="md"
          onPress={() => router.push({ pathname: '/orders/[id]', params: { id: order.id } })}
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F3F3' },
  map: { flex: 1 },
  mapButtons: {
    position: 'absolute',
    left: spacing.gutter,
    right: spacing.gutter,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.gutter,
    paddingTop: 12,
    gap: 4,
    marginTop: -24,
    ...shadow(2),
  },
  handle: { width: 45, height: 5, borderRadius: 3, backgroundColor: '#E3E3E3', alignSelf: 'center', marginBottom: 12 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.md,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courier: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: spacing.md },
  photo: { width: 56, height: 56, borderRadius: radius.md },
});
