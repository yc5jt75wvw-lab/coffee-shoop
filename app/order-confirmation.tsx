import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Header } from '../src/components/Header';
import { Icon, IconName } from '../src/components/Icon';
import { BottomBar, Card, Divider, EmptyState, InfoNote, SummaryRow } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { useToast } from '../src/components/Toast';
import { DELIVERY_OPTIONS, getPaymentMethod, getStore } from '../src/data/options';
import { formatPrice } from '../src/lib/format';
import { useHaptics } from '../src/lib/hooks';
import { itemUnitPrice, optionsSummary } from '../src/lib/pricing';
import { getCoffee } from '../src/data/catalog';
import { formatAddress, useEta, useSelectedAddress, useStore, useTotals } from '../src/store/StoreProvider';
import { colors, spacing } from '../src/theme';

function InfoBlock({ icon, title, value, onEdit }: { icon: IconName; title: string; value: string; onEdit: () => void }) {
  return (
    <View style={styles.info}>
      <View style={styles.infoIcon}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="caption" color={colors.textSecondary}>
          {title}
        </AppText>
        <AppText variant="bodyStrong">{value}</AppText>
      </View>
      <Button title="Изменить" variant="ghost" size="sm" onPress={onEdit} />
    </View>
  );
}

/** Screen 23 — Order confirmation: review everything before the demo payment. */
export default function OrderConfirmationScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const haptics = useHaptics();
  const totals = useTotals();
  const address = useSelectedAddress();
  const eta = useEta();
  const [paying, setPaying] = useState(false);
  const c = state.checkout;
  const payment = getPaymentMethod(c.paymentMethod);
  const paymentTitle = c.paymentMethod === 'device-pay' ? (Platform.OS === 'ios' ? 'Apple Pay (демо)' : 'Google Pay (демо)') : payment.title;

  if (!state.cart.length && !paying) {
    return (
      <Screen header={<Header title="Подтверждение" />}>
        <EmptyState
          icon="bag-handle-outline"
          title="Нечего подтверждать"
          text="Корзина пуста — добавьте напитки и вернитесь сюда."
          action={<Button title="В меню" onPress={() => router.navigate('/home')} />}
        />
      </Screen>
    );
  }

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      const result = actions.placeOrder();
      if (!result.ok) {
        setPaying(false);
        haptics.warning();
        toast.show(result.error, { tone: 'error' });
        return;
      }
      haptics.success();
      router.replace({ pathname: '/order-success', params: { id: result.order.id } });
    }, 1200);
  };

  const store = getStore(c.storeId);
  const receive =
    c.method === 'delivery'
      ? `${DELIVERY_OPTIONS[c.speed].title} доставка · ${c.schedule === 'asap' ? eta : `к ${c.schedule}`}`
      : `Самовывоз · ${c.schedule === 'asap' ? eta : `к ${c.schedule}`}`;

  return (
    <Screen
      scroll
      header={<Header title="Подтверждение" />}
      footer={
        <BottomBar>
          <Button
            title={paying ? 'Проводим оплату…' : `Подтвердить и оплатить ${formatPrice(totals.total)}`}
            loading={paying}
            onPress={pay}
          />
        </BottomBar>
      }
    >
      <Card style={{ gap: 4, marginTop: 4 }}>
        <InfoBlock icon="time-outline" title="Получение" value={receive} onEdit={() => router.push('/delivery-method')} />
        <Divider />
        {c.method === 'delivery' ? (
          <InfoBlock
            icon="location-outline"
            title="Адрес"
            value={address ? formatAddress(address) : 'Не выбран'}
            onEdit={() => router.push({ pathname: '/addresses', params: { pick: '1' } })}
          />
        ) : (
          <InfoBlock icon="storefront-outline" title="Кофейня" value={store?.name ?? 'Не выбрана'} onEdit={() => router.push('/pickup-stores')} />
        )}
        <Divider />
        <InfoBlock icon={payment.icon} title="Оплата" value={paymentTitle} onEdit={() => router.push('/payment-methods')} />
      </Card>

      {c.note ? (
        <View style={styles.note}>
          <Icon name="document-text-outline" size={16} color={colors.textSecondary} />
          <AppText variant="caption" color={colors.textSecondary} style={{ flex: 1 }}>
            Заметка: {c.note}
          </AppText>
        </View>
      ) : null}

      <AppText variant="section" style={styles.h}>
        Состав заказа
      </AppText>
      <View style={{ gap: 10 }}>
        {state.cart.map((i) => (
          <View key={i.key} style={styles.line}>
            <AppText variant="bodyStrong" color={colors.primary} style={{ width: 28 }}>
              {i.qty}×
            </AppText>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{getCoffee(i.coffeeId)?.name}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {optionsSummary(i)}
              </AppText>
            </View>
            <AppText variant="priceS">{formatPrice(itemUnitPrice(i) * i.qty)}</AppText>
          </View>
        ))}
      </View>

      <Divider style={{ marginVertical: spacing.md }} />
      <SummaryRow label="Напитки" value={formatPrice(totals.subtotal)} />
      {c.method === 'delivery' ? (
        <SummaryRow
          label="Доставка"
          value={totals.deliveryFee ? formatPrice(totals.deliveryFee) : 'Бесплатно'}
          strike={totals.deliveryFee < totals.deliveryFeeOriginal ? formatPrice(totals.deliveryFeeOriginal) : undefined}
        />
      ) : null}
      {totals.discount > 0 ? <SummaryRow label="Скидка" value={`− ${formatPrice(totals.discount)}`} valueColor={colors.success} /> : null}
      {totals.promo && !totals.promo.ok ? (
        <AppText variant="caption" color={colors.warning}>
          Промокод {totals.promo.code} не применён: {totals.promo.reason}
        </AppText>
      ) : null}
      <SummaryRow label="К оплате" value={formatPrice(totals.total)} strong />

      <View style={{ marginTop: spacing.lg }}>
        <InfoNote text="Это демонстрационный заказ: деньги не списываются, курьер и бариста — виртуальные." />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  info: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: { flexDirection: 'row', gap: 6, marginTop: 12 },
  h: { marginTop: spacing.lg, marginBottom: spacing.sm },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
});
