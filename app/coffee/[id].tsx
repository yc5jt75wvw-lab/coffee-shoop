import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { SizeSelector } from '../../src/components/Controls';
import { Header } from '../../src/components/Header';
import { Icon } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { BottomBar, Divider, EmptyState } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { featureMeta, getCoffee, SIZES, type Size } from '../../src/data/catalog';
import { formatPrice } from '../../src/lib/format';
import { DEFAULT_OPTIONS, unitPrice } from '../../src/lib/pricing';
import { useStore } from '../../src/store/StoreProvider';
import { colors, radius, spacing } from '../../src/theme';

const PREVIEW = 120;

/** Screen 11 — Coffee detail (Figma «High-Fidelity Detail Item»). */
export default function CoffeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const coffee = getCoffee(id);
  const { state, actions } = useStore();
  const toast = useToast();
  const [size, setSize] = useState<Size>('M');
  const [expanded, setExpanded] = useState(false);

  if (!coffee) {
    return (
      <Screen header={<Header title="Детали" />}>
        <EmptyState
          icon="cafe-outline"
          title="Напиток не найден"
          text="Возможно, его убрали из меню."
          action={<Button title="В меню" onPress={() => router.navigate('/home')} />}
        />
      </Screen>
    );
  }

  const fav = state.favorites.includes(coffee.id);
  const price = unitPrice(coffee, { ...DEFAULT_OPTIONS, size });
  const long = coffee.description.length > PREVIEW;
  const text = expanded || !long ? coffee.description : `${coffee.description.slice(0, PREVIEW).trimEnd()}…`;
  const volume = SIZES.find((s) => s.id === size)!.volume;

  const buy = () => {
    actions.addToCart(coffee.id, { ...DEFAULT_OPTIONS, size });
    router.push('/order');
  };

  return (
    <Screen
      scroll
      header={
        <Header
          title="Детали"
          right={
            <IconButton
              icon={fav ? 'heart' : 'heart-outline'}
              color={fav ? colors.danger : colors.ink}
              accessibilityLabel={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
              onPress={() => {
                actions.toggleFavorite(coffee.id);
                toast.show(fav ? 'Убрано из избранного' : 'Добавлено в избранное');
              }}
            />
          }
        />
      }
      footer={
        <BottomBar>
          <View style={styles.footer}>
            <View>
              <AppText variant="body" color={colors.textSecondary}>
                Цена
              </AppText>
              <AppText variant="priceL" color={colors.primary} accessibilityLiveRegion="polite">
                {formatPrice(price)}
              </AppText>
            </View>
            <Button title="Купить" onPress={buy} style={styles.buy} accessibilityHint="Добавит напиток в корзину и откроет оформление заказа" />
          </View>
        </BottomBar>
      }
    >
      <Image source={coffee.image} style={styles.image} contentFit="cover" transition={200} accessibilityLabel={coffee.name} />

      <View style={styles.titleRow}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="title" accessibilityRole="header">
            {coffee.name}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {coffee.temperature === 'iced' ? 'Холодный' : 'Горячий / холодный'}
          </AppText>
        </View>
        <View style={styles.features}>
          {coffee.features.slice(0, 3).map((f) => (
            <View key={f} style={styles.feature} accessible accessibilityLabel={featureMeta[f].label}>
              <Icon name={featureMeta[f].icon} size={20} color={colors.primary} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.rating}>
        <Icon name="star" size={20} color={colors.star} />
        <AppText variant="number">{coffee.rating.toFixed(1)}</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          ({coffee.reviews})
        </AppText>
      </View>

      <Divider style={{ marginVertical: spacing.md, marginHorizontal: 16 }} />

      <AppText variant="section" style={styles.h}>
        Описание
      </AppText>
      <AppText variant="body" color={colors.textSecondary}>
        {text}
        {long ? (
          <AppText variant="bodyStrong" color={colors.primary} onPress={() => setExpanded((e) => !e)} accessibilityRole="button">
            {expanded ? ' Свернуть' : ' Ещё'}
          </AppText>
        ) : null}
      </AppText>

      <View style={styles.sizeHead}>
        <AppText variant="section">Размер</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {volume} мл
        </AppText>
      </View>
      <SizeSelector value={size} onChange={setSize} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Настроить напиток: молоко, сироп, сахар"
        onPress={() => router.push({ pathname: '/customize/[id]', params: { id: coffee.id, size } })}
        style={({ pressed }) => [styles.customize, pressed && { backgroundColor: colors.primarySoft }]}
      >
        <View style={styles.customizeIcon}>
          <Icon name="color-wand-outline" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong">Настроить напиток</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Молоко, сироп, сахар, дополнительный шот
          </AppText>
        </View>
        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', aspectRatio: 327 / 202, borderRadius: radius.lg, marginTop: 4, backgroundColor: colors.surfaceAlt },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.md, gap: 12 },
  features: { flexDirection: 'row', gap: 12 },
  feature: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#F4F1EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  h: { marginBottom: 8 },
  sizeHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.sm },
  customize: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.lg,
    padding: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  customizeIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  buy: { flex: 1 },
});
