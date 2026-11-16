import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { OptionBox } from '../src/components/Controls';
import { goBack, Header } from '../src/components/Header';
import { BottomBar, InfoNote, SectionTitle } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { useToast } from '../src/components/Toast';
import { PAYMENT_METHODS } from '../src/data/options';
import { formatPrice } from '../src/lib/format';
import { useStore, useTotals } from '../src/store/StoreProvider';
import { colors, radius, spacing } from '../src/theme';

const TOP_UP = 20;

/** Screen 22 — Payment methods. Demo only: never asks for real card data. */
export default function PaymentMethodsScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const totals = useTotals();
  const selected = state.checkout.paymentMethod;
  const devicePay = Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay';

  const subtitle = (id: (typeof PAYMENT_METHODS)[number]['id'], fallback: string) => {
    if (id === 'wallet') return `Баланс ${formatPrice(state.walletBalance)}`;
    if (id === 'device-pay') return `Имитация ${devicePay}, без списания`;
    return fallback;
  };

  return (
    <Screen
      scroll
      header={<Header title="Способ оплаты" />}
      footer={
        <BottomBar>
          <Button title="Готово" onPress={goBack} />
        </BottomBar>
      }
    >
      <InfoNote
        icon="shield-checkmark-outline"
        text="Это демо-версия: оплата имитируется, деньги не списываются, а данные банковских карт не запрашиваются и не хранятся."
      />

      {state.cart.length ? (
        <View style={styles.total}>
          <AppText variant="body" color={colors.textSecondary}>
            К оплате за текущий заказ
          </AppText>
          <AppText variant="priceL" color={colors.primary}>
            {formatPrice(totals.total)}
          </AppText>
        </View>
      ) : null}

      <SectionTitle title="Выберите способ" style={{ marginTop: spacing.lg }} />
      <View style={{ gap: 12 }}>
        {PAYMENT_METHODS.map((m) => (
          <OptionBox
            key={m.id}
            icon={m.icon}
            title={m.id === 'device-pay' ? devicePay : m.title}
            subtitle={subtitle(m.id, m.subtitle)}
            selected={selected === m.id}
            onPress={() => {
              actions.updateCheckout({ paymentMethod: m.id });
              toast.show(`Оплата: ${m.id === 'device-pay' ? devicePay : m.title}`);
            }}
          />
        ))}
      </View>

      <View style={styles.wallet}>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong">Демо-кошелёк</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {state.cart.length && state.walletBalance < totals.total
              ? `Не хватает ${formatPrice(totals.total - state.walletBalance)} для оплаты заказа`
              : 'Пополнение условное, без настоящих денег'}
          </AppText>
        </View>
        <Button
          title={`+ ${formatPrice(TOP_UP)}`}
          size="sm"
          variant="secondary"
          onPress={() => {
            actions.topUpWallet(TOP_UP);
            toast.show(`Демо-кошелёк пополнен на ${formatPrice(TOP_UP)}`);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingVertical: 4,
  },
  wallet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.lg,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
