import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Header } from '../../src/components/Header';
import { Icon } from '../../src/components/Icon';
import { Card, Divider, EmptyState, InfoNote, SummaryRow } from '../../src/components/Layout';
import { StatusPill } from '../../src/components/OrderBits';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { getCoffee } from '../../src/data/catalog';
import { DELIVERY_OPTIONS, getPaymentMethod, getStore } from '../../src/data/options';
import { confirmAction } from '../../src/lib/confirm';
import { drinksWord, formatDateTime, formatPrice, formatTime } from '../../src/lib/format';
import { useNow } from '../../src/lib/hooks';
import { canCancel, getOrderStatus, getSteps, isFinal } from '../../src/lib/orderStatus';
import { optionsSummary } from '../../src/lib/pricing';
import { useStore } from '../../src/store/StoreProvider';
import { colors, radius, spacing } from '../../src/theme';

/** Screen 27 — Order details: status timeline, contents, totals, actions. */
export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = useStore();
  const toast = useToast();
  const now = useNow(1000);
  const order = state.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Screen header={<Header title="Заказ" />}>
        <EmptyState
          icon="receipt-outline"
          title="Заказ не найден"
          text="Возможно, демо-данные были сброшены."
          action={<Button title="Мои заказы" onPress={() => router.replace('/orders')} />}
        />
      </Screen>
    );
  }

  const status = getOrderStatus(order, now);
  const steps = getSteps(order);
  const currentIndex = steps.findIndex((s) => s.key === status);
  const payment = getPaymentMethod(order.paymentMethod);
  const store = getStore(order.storeId);

  const cancel = () =>
    confirmAction({
      title: 'Отменить заказ?',
      message: 'Бариста ещё не начал готовить. Если оплата была с демо-кошелька, деньги вернутся.',
      confirmText: 'Отменить заказ',
      destructive: true,
      onConfirm: () => {
        actions.cancelOrder(order.id);
        toast.show(`Заказ №${order.number} отменён`);
      },
    });

  const reorder = () => {
    const n = actions.reorder(order.id);
    toast.show(`${drinksWord(n)} добавлено в корзину`, { action: 'Корзина', onAction: () => router.navigate('/cart') });
  };

  return (
    <Screen scroll header={<Header title={`Заказ №${order.number}`} />}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={colors.textSecondary}>
            {formatDateTime(order.createdAt)}
          </AppText>
          <AppText variant="title">{formatPrice(order.totals.total)}</AppText>
        </View>
        <StatusPill status={status} />
      </View>
      {order.isSample ? (
        <View style={{ marginTop: 12 }}>
          <InfoNote text="Пример заказа из демо-данных — так выглядит история после нескольких покупок." />
        </View>
      ) : null}

      <Card style={{ marginTop: spacing.md }}>
        {status === 'cancelled' ? (
          <View style={styles.step}>
            <Icon name="close-circle" size={22} color={colors.danger} />
            <AppText variant="bodyStrong" color={colors.danger}>
              Заказ отменён
            </AppText>
          </View>
        ) : (
          steps.map((s, i) => {
            const reached = isFinal(status) || i <= currentIndex;
            const current = i === currentIndex && !isFinal(status);
            return (
              <View key={s.key} style={styles.stepRow}>
                <View style={styles.rail}>
                  <View style={[styles.dot, reached && styles.dotDone, current && styles.dotCurrent]}>
                    {reached && !current ? <Icon name="checkmark" size={12} color={colors.white} /> : null}
                  </View>
                  {i < steps.length - 1 ? <View style={[styles.line, reached && i < currentIndex && styles.lineDone, isFinal(status) && styles.lineDone]} /> : null}
                </View>
                <View style={styles.stepText}>
                  <AppText variant={current ? 'bodyStrong' : 'body'} color={reached ? colors.ink : colors.textMuted}>
                    {s.title}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {reached ? formatTime(s.at) : `≈ ${formatTime(s.at)}`}
                  </AppText>
                </View>
              </View>
            );
          })
        )}
      </Card>

      <AppText variant="section" style={styles.h}>
        Получение
      </AppText>
      <View style={styles.infoRow}>
        <Icon name={order.method === 'delivery' ? 'bicycle-outline' : 'storefront-outline'} size={20} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong">
            {order.method === 'delivery' ? `${DELIVERY_OPTIONS[order.speed].title} доставка` : `Самовывоз · ${store?.name ?? ''}`}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {order.method === 'delivery' ? order.addressText : store?.address}
            {order.schedule !== 'asap' ? ` · ко времени ${order.schedule}` : ''}
          </AppText>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Icon name={payment.icon} size={20} color={colors.primary} />
        <AppText variant="bodyStrong" style={{ flex: 1 }}>
          {order.paymentMethod === 'device-pay' ? (Platform.OS === 'ios' ? 'Apple Pay (демо)' : 'Google Pay (демо)') : payment.title}
        </AppText>
      </View>
      {order.note ? (
        <View style={styles.infoRow}>
          <Icon name="document-text-outline" size={20} color={colors.primary} />
          <AppText variant="body" style={{ flex: 1 }}>
            {order.note}
          </AppText>
        </View>
      ) : null}

      <AppText variant="section" style={styles.h}>
        Состав
      </AppText>
      <View style={{ gap: 12 }}>
        {order.lines.map((l) => {
          const c = getCoffee(l.coffeeId);
          return (
            <View key={l.key} style={styles.line2}>
              {c ? <Image source={c.image} style={styles.thumb} contentFit="cover" /> : null}
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">
                  {l.name} {l.qty > 1 ? `×${l.qty}` : ''}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {optionsSummary(l)}
                </AppText>
              </View>
              <AppText variant="priceS">{formatPrice(l.unitPrice * l.qty)}</AppText>
            </View>
          );
        })}
      </View>

      <Divider style={{ marginVertical: spacing.md }} />
      <SummaryRow label="Напитки" value={formatPrice(order.totals.subtotal)} />
      {order.method === 'delivery' ? (
        <SummaryRow
          label="Доставка"
          value={order.totals.deliveryFee ? formatPrice(order.totals.deliveryFee) : 'Бесплатно'}
          strike={order.totals.deliveryFee < order.totals.deliveryFeeOriginal ? formatPrice(order.totals.deliveryFeeOriginal) : undefined}
        />
      ) : null}
      {order.totals.discount > 0 ? (
        <SummaryRow label={`Скидка ${order.promoCode ?? ''}`} value={`− ${formatPrice(order.totals.discount)}`} valueColor={colors.success} />
      ) : null}
      <SummaryRow label="Итого" value={formatPrice(order.totals.total)} strong />

      <View style={{ gap: 12, marginTop: spacing.lg }}>
        {order.method === 'delivery' && !isFinal(status) ? (
          <Button title="Отследить на карте" icon="navigate-outline" onPress={() => router.push({ pathname: '/tracking/[id]', params: { id: order.id } })} />
        ) : null}
        {canCancel(order, now) ? <Button title="Отменить заказ" variant="danger" onPress={cancel} /> : null}
        {isFinal(status) ? <Button title="Повторить заказ" icon="refresh" onPress={reorder} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepRow: { flexDirection: 'row', gap: 12 },
  rail: { alignItems: 'center', width: 22 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotCurrent: { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 6 },
  line: { width: 2, flex: 1, minHeight: 18, backgroundColor: colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: colors.success },
  stepText: { flex: 1, paddingBottom: 14 },
  h: { marginTop: spacing.lg, marginBottom: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  line2: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 48, height: 48, borderRadius: radius.md },
});
