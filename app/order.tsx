import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { QtyStepper, Segmented } from '../src/components/Controls';
import { Header } from '../src/components/Header';
import { Icon } from '../src/components/Icon';
import { BottomBar, Card, Divider, EmptyState, SummaryRow } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { TextField } from '../src/components/TextField';
import { getCoffee } from '../src/data/catalog';
import { DELIVERY_OPTIONS, getPaymentMethod, getStore } from '../src/data/options';
import { formatPrice } from '../src/lib/format';
import { optionsSummary } from '../src/lib/pricing';
import { addressDetails, formatAddress, useEta, useSelectedAddress, useStore, useTotals } from '../src/store/StoreProvider';
import type { DeliveryMethod } from '../src/store/types';
import { colors, radius, spacing } from '../src/theme';

/** Screen 15 — Order (Figma «High-Fidelity Order»). */
export default function OrderScreen() {
  const { state, actions } = useStore();
  const totals = useTotals();
  const address = useSelectedAddress();
  const eta = useEta();
  const c = state.checkout;
  const store = getStore(c.storeId);
  const payment = getPaymentMethod(c.paymentMethod);
  const [noteOpen, setNoteOpen] = useState(!!c.note);

  const blocked = !state.cart.length || (c.method === 'delivery' && !address);
  const discounts = (totals.promo?.ok ? 1 : 0);

  return (
    <Screen
      scroll
      keyboard
      header={<Header title="Заказ" />}
      footer={
        state.cart.length ? (
          <BottomBar>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Способ оплаты: ${payment.title}. Изменить`}
              onPress={() => router.push('/payment-methods')}
              style={styles.payRow}
            >
              <Icon name={payment.icon} size={22} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{payment.title}</AppText>
                <AppText variant="priceS" color={colors.primary} style={{ fontSize: 12, lineHeight: 16 }}>
                  {formatPrice(totals.total)}
                </AppText>
              </View>
              <Icon name="chevron-down" size={20} color={colors.ink} />
            </Pressable>
            <Button
              title="Заказать"
              disabled={blocked}
              onPress={() => router.push('/order-confirmation')}
              accessibilityHint="Откроет подтверждение заказа"
            />
          </BottomBar>
        ) : null
      }
    >
      <Segmented<DeliveryMethod>
        value={c.method}
        onChange={(method) => actions.updateCheckout({ method })}
        options={[
          { value: 'delivery', label: 'Доставка' },
          { value: 'pickup', label: 'Самовывоз' },
        ]}
        style={{ marginTop: 8 }}
      />

      {c.method === 'delivery' ? (
        <View style={styles.block}>
          <AppText variant="section" style={styles.h}>
            Адрес доставки
          </AppText>
          {address ? (
            <>
              <AppText variant="bodyStrong">{formatAddress(address)}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Москва{addressDetails(address) ? `, ${addressDetails(address)}` : ''}
              </AppText>
            </>
          ) : (
            <AppText variant="body" color={colors.danger}>
              Адрес не выбран — добавьте его, чтобы оформить доставку.
            </AppText>
          )}
          <View style={styles.pills}>
            <Button
              title={address ? 'Изменить адрес' : 'Добавить адрес'}
              icon="create-outline"
              variant="secondary"
              size="sm"
              onPress={() => router.push(address ? { pathname: '/addresses', params: { pick: '1' } } : '/addresses/new')}
            />
            <Button
              title={noteOpen ? 'Скрыть заметку' : c.note ? 'Заметка добавлена' : 'Добавить заметку'}
              icon="document-text-outline"
              variant="secondary"
              size="sm"
              onPress={() => setNoteOpen((v) => !v)}
            />
          </View>
        </View>
      ) : (
        <View style={styles.block}>
          <AppText variant="section" style={styles.h}>
            Точка самовывоза
          </AppText>
          <AppText variant="bodyStrong">{store?.name ?? 'Кофейня не выбрана'}</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {store ? `${store.address} · ${store.hours}` : ''}
          </AppText>
          <View style={styles.pills}>
            <Button title="Сменить кофейню" icon="storefront-outline" variant="secondary" size="sm" onPress={() => router.push('/pickup-stores')} />
            <Button
              title={noteOpen ? 'Скрыть заметку' : c.note ? 'Заметка добавлена' : 'Добавить заметку'}
              icon="document-text-outline"
              variant="secondary"
              size="sm"
              onPress={() => setNoteOpen((v) => !v)}
            />
          </View>
        </View>
      )}

      {noteOpen ? (
        <TextField
          placeholder={c.method === 'delivery' ? 'Например: позвоните, когда подъедете' : 'Например: без крышки'}
          value={c.note}
          onChangeText={(note) => actions.updateCheckout({ note: note.slice(0, 200) })}
          multiline
          hint={`${c.note.length}/200`}
          containerStyle={{ marginTop: 12 }}
        />
      ) : null}

      <Pressable accessibilityRole="button" onPress={() => router.push('/delivery-method')} style={styles.timeRow}>
        <Icon name="time-outline" size={20} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong">
            {c.method === 'delivery' ? `${DELIVERY_OPTIONS[c.speed].title} доставка` : 'Самовывоз'}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {c.schedule === 'asap' ? `Как можно скорее · ${eta}` : `Ко времени: ${c.schedule}`}
          </AppText>
        </View>
        <AppText variant="bodyStrong" color={colors.primary}>
          Изменить
        </AppText>
      </Pressable>

      <Divider style={{ marginVertical: spacing.md, marginHorizontal: 16 }} />

      {state.cart.length === 0 ? (
        <EmptyState
          icon="bag-handle-outline"
          title="Корзина пуста"
          text="Добавьте напитки, чтобы оформить заказ."
          action={<Button title="В меню" onPress={() => router.navigate('/home')} />}
        />
      ) : (
        <View style={{ gap: 16 }}>
          {state.cart.map((item) => {
            const coffee = getCoffee(item.coffeeId);
            if (!coffee) return null;
            return (
              <View key={item.key} style={styles.item}>
                <Image source={coffee.image} style={styles.thumb} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <AppText variant="section" numberOfLines={1}>
                    {coffee.name}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                    {optionsSummary(item)}
                  </AppText>
                </View>
                <QtyStepper value={item.qty} onChange={(q) => actions.setQty(item.key, q)} label={`Количество ${coffee.name}`} />
              </View>
            );
          })}
        </View>
      )}

      {state.cart.length ? (
        <>
          <Divider thick style={{ marginVertical: spacing.md }} />

          <Card onPress={() => router.push('/promo-codes')} style={styles.discount} accessibilityLabel="Скидки и промокоды">
            <Icon name="pricetags-outline" size={20} color={colors.primary} />
            <AppText variant="bodyStrong" style={{ flex: 1 }}>
              {discounts
                ? `Применена 1 скидка · ${totals.promo!.code}`
                : totals.promo
                  ? `${totals.promo.code}: ${totals.promo.reason}`
                  : 'Добавить промокод'}
            </AppText>
            <Icon name="chevron-forward" size={18} color={colors.ink} />
          </Card>

          <AppText variant="section" style={[styles.h, { marginTop: spacing.lg }]}>
            Детали оплаты
          </AppText>
          <SummaryRow label="Цена" value={formatPrice(totals.subtotal)} />
          {c.method === 'delivery' ? (
            <SummaryRow
              label="Доставка"
              value={totals.deliveryFee ? formatPrice(totals.deliveryFee) : 'Бесплатно'}
              strike={totals.deliveryFee < totals.deliveryFeeOriginal ? formatPrice(totals.deliveryFeeOriginal) : undefined}
            />
          ) : (
            <SummaryRow label="Самовывоз" value="Бесплатно" />
          )}
          {totals.discount > 0 ? <SummaryRow label="Скидка" value={`− ${formatPrice(totals.discount)}`} valueColor={colors.success} /> : null}
          <Divider style={{ marginVertical: 8 }} />
          <SummaryRow label="Итого" value={formatPrice(totals.total)} strong />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: spacing.lg },
  h: { marginBottom: spacing.sm },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.md,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 54, height: 54, borderRadius: radius.md },
  discount: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, minHeight: 44 },
});
