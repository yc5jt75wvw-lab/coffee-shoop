import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Chip, QtyStepper, SizeSelector, Toggle } from '../../src/components/Controls';
import { goBack, Header } from '../../src/components/Header';
import { BottomBar, EmptyState, SectionTitle } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { getCoffee, SIZES, type Size } from '../../src/data/catalog';
import { EXTRA_SHOT_PRICE, MAX_QTY, MAX_SUGAR, MILKS, SYRUPS } from '../../src/data/options';
import { formatPrice } from '../../src/lib/format';
import { DEFAULT_OPTIONS, optionsSummary, unitPrice } from '../../src/lib/pricing';
import { useStore } from '../../src/store/StoreProvider';
import type { DrinkOptions } from '../../src/store/types';
import { colors, radius, spacing } from '../../src/theme';

const extra = (p: number) => (p > 0 ? ` +$${p.toFixed(2)}` : '');

/** Screen 12 — Customize coffee: size, milk, syrup, sugar, extra shot, quantity. */
export default function CustomizeScreen() {
  const params = useLocalSearchParams<{ id: string; size?: string }>();
  const coffee = getCoffee(params.id);
  const { actions } = useStore();
  const toast = useToast();
  const initialSize = SIZES.some((s) => s.id === params.size) ? (params.size as Size) : 'M';
  const [opts, setOpts] = useState<DrinkOptions>({
    ...DEFAULT_OPTIONS,
    size: initialSize,
    milk: coffee?.features.includes('milk') ? 'regular' : 'none',
  });
  const [qty, setQty] = useState(1);
  const set = (p: Partial<DrinkOptions>) => setOpts((o) => ({ ...o, ...p }));

  if (!coffee) {
    return (
      <Screen header={<Header title="Настройка" />}>
        <EmptyState icon="cafe-outline" title="Напиток не найден" text="Вернитесь в меню и выберите другой." />
      </Screen>
    );
  }

  const price = unitPrice(coffee, opts);

  const add = () => {
    actions.addToCart(coffee.id, opts, qty);
    toast.show(`${coffee.name} ×${qty} в корзине`, { action: 'Корзина', onAction: () => router.navigate('/cart') });
    goBack();
  };

  return (
    <Screen
      scroll
      header={<Header title="Настройка напитка" />}
      footer={
        <BottomBar>
          <View style={styles.footer}>
            <View>
              <AppText variant="body" color={colors.textSecondary}>
                Итого
              </AppText>
              <AppText variant="priceL" color={colors.primary} accessibilityLiveRegion="polite">
                {formatPrice(price * qty)}
              </AppText>
            </View>
            <Button title="В корзину" icon="bag-add-outline" onPress={add} style={{ flex: 1 }} />
          </View>
        </BottomBar>
      }
    >
      <View style={styles.summary}>
        <Image source={coffee.image} style={styles.thumb} contentFit="cover" />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="headline">{coffee.name}</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {optionsSummary(opts)}
          </AppText>
          <AppText variant="priceS" color={colors.primary}>
            {formatPrice(price)} за штуку
          </AppText>
        </View>
      </View>

      <View style={styles.block}>
        <SectionTitle title="Размер" />
        <SizeSelector value={opts.size} onChange={(size) => set({ size })} />
        <View style={styles.volumes}>
          {SIZES.map((s) => (
            <AppText key={s.id} variant="caption" color={colors.textSecondary} style={{ flex: 1, textAlign: 'center' }}>
              {s.volume} мл
            </AppText>
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <SectionTitle title="Молоко" />
        <View style={styles.wrap}>
          {MILKS.map((m) => (
            <Chip key={m.id} label={`${m.label}${extra(m.price)}`} selected={opts.milk === m.id} onPress={() => set({ milk: m.id })} tone="white" />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <SectionTitle title="Сироп" />
        <View style={styles.wrap}>
          {SYRUPS.map((s) => (
            <Chip key={s.id} label={`${s.label}${extra(s.price)}`} selected={opts.syrup === s.id} onPress={() => set({ syrup: s.id })} tone="white" />
          ))}
        </View>
      </View>

      <View style={[styles.block, styles.row]}>
        <View style={{ flex: 1 }}>
          <AppText variant="section">Сахар</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {opts.sugar ? `${opts.sugar} ч. л.` : 'Без сахара'}
          </AppText>
        </View>
        <QtyStepper value={opts.sugar} min={0} max={MAX_SUGAR} onChange={(sugar) => set({ sugar })} label="Ложек сахара" />
      </View>

      <View style={[styles.block, styles.row]}>
        <View style={{ flex: 1 }}>
          <AppText variant="section">Дополнительный шот</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Крепче на один эспрессо, +{formatPrice(EXTRA_SHOT_PRICE)}
          </AppText>
        </View>
        <Toggle value={opts.extraShot} onChange={(extraShot) => set({ extraShot })} label="Дополнительный шот" />
      </View>

      <View style={[styles.block, styles.row]}>
        <View style={{ flex: 1 }}>
          <AppText variant="section">Количество</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Одинаковые напитки
          </AppText>
        </View>
        <QtyStepper value={qty} min={1} max={MAX_QTY} onChange={setQty} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
  },
  thumb: { width: 72, height: 72, borderRadius: radius.md },
  block: { marginTop: spacing.lg },
  volumes: { flexDirection: 'row', gap: 16, marginTop: 6 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 24 },
});
