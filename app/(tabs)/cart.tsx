import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { openCoffee } from '../../src/components/CoffeeCard';
import { QtyStepper } from '../../src/components/Controls';
import { Header } from '../../src/components/Header';
import { Icon } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { BottomBar, Card, EmptyState, SummaryRow } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { getCoffee } from '../../src/data/catalog';
import { confirmAction } from '../../src/lib/confirm';
import { drinksWord, formatPrice } from '../../src/lib/format';
import { itemUnitPrice, optionsSummary } from '../../src/lib/pricing';
import { useCartCount, useStore, useTotals } from '../../src/store/StoreProvider';
import type { CartItem } from '../../src/store/types';
import { colors, radius, spacing } from '../../src/theme';

/** Screen 14 — Cart (persisted in AsyncStorage). */
export default function CartScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const count = useCartCount();
  const totals = useTotals();

  const remove = (item: CartItem) => {
    actions.removeFromCart(item.key);
    toast.show(`${getCoffee(item.coffeeId)?.name ?? 'Напиток'} удалён`, {
      action: 'Вернуть',
      onAction: () => actions.addToCart(item.coffeeId, item, item.qty),
    });
  };

  const clear = () =>
    confirmAction({
      title: 'Очистить корзину?',
      message: 'Все напитки будут удалены из корзины.',
      confirmText: 'Очистить',
      destructive: true,
      onConfirm: actions.clearCart,
    });

  const header = (
    <Header
      title="Корзина"
      noBack
      right={
        state.cart.length ? <IconButton icon="trash-outline" accessibilityLabel="Очистить корзину" onPress={clear} /> : null
      }
    />
  );

  if (!state.cart.length) {
    return (
      <Screen header={header}>
        <EmptyState
          icon="bag-handle-outline"
          title="В корзине пусто"
          text="Добавьте напиток из меню — он сохранится, даже если закрыть приложение."
          action={<Button title="Выбрать кофе" onPress={() => router.navigate('/home')} />}
        />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      header={header}
      footer={
        <BottomBar inset={false}>
          <View style={styles.footerRow}>
            <View>
              <AppText variant="caption" color={colors.textSecondary}>
                {drinksWord(count)}
              </AppText>
              <AppText variant="priceL" color={colors.primary}>
                {formatPrice(totals.subtotal - totals.discount)}
              </AppText>
            </View>
            <Button title="Оформить заказ" onPress={() => router.push('/order')} style={{ flex: 1 }} />
          </View>
        </BottomBar>
      }
    >
      <View style={{ gap: 12 }}>
        {state.cart.map((item) => {
          const coffee = getCoffee(item.coffeeId);
          if (!coffee) return null;
          return (
            <View key={item.key} style={styles.item}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Открыть ${coffee.name}`} onPress={() => openCoffee(coffee.id)}>
                <Image source={coffee.image} style={styles.image} contentFit="cover" />
              </Pressable>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={styles.titleRow}>
                  <AppText variant="section" numberOfLines={1} style={{ flex: 1 }}>
                    {coffee.name}
                  </AppText>
                  <IconButton icon="close" size={28} iconSize={16} color={colors.textMuted} accessibilityLabel={`Удалить ${coffee.name}`} onPress={() => remove(item)} />
                </View>
                <AppText variant="caption" color={colors.textSecondary} numberOfLines={2}>
                  {optionsSummary(item)}
                </AppText>
                <View style={styles.priceRow}>
                  <AppText variant="priceM">{formatPrice(itemUnitPrice(item) * item.qty)}</AppText>
                  <QtyStepper
                    value={item.qty}
                    min={1}
                    onChange={(q) => actions.setQty(item.key, q)}
                    label={`Количество ${coffee.name}`}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <Card onPress={() => router.push('/promo-codes')} style={styles.promo} accessibilityLabel="Промокод">
        <Icon name="pricetag-outline" size={20} color={colors.primary} />
        <AppText variant="bodyStrong" style={{ flex: 1 }}>
          {state.checkout.promoCode ? `Промокод ${state.checkout.promoCode}` : 'Добавить промокод'}
        </AppText>
        {totals.promo && !totals.promo.ok ? (
          <AppText variant="caption" color={colors.warning}>
            не применён
          </AppText>
        ) : null}
        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
      </Card>

      <View style={styles.summary}>
        <SummaryRow label="Напитки" value={formatPrice(totals.subtotal)} />
        {totals.discount > 0 ? <SummaryRow label="Скидка" value={`− ${formatPrice(totals.discount)}`} valueColor={colors.success} /> : null}
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
          Стоимость доставки рассчитаем на следующем шаге.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: 80, height: 88, borderRadius: radius.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  promo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: spacing.lg },
  summary: { marginTop: spacing.md, gap: 2 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
});
