import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Coffee } from '../data/catalog';
import { formatPrice } from '../lib/format';
import { DEFAULT_OPTIONS } from '../lib/pricing';
import { useStore } from '../store/StoreProvider';
import { colors, radius, shadow } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { useToast } from './Toast';

export const openCoffee = (id: string) => router.push({ pathname: '/coffee/[id]', params: { id } });

function RatingBadge({ rating }: { rating: number }) {
  return (
    <View style={styles.badge}>
      <Icon name="star" size={10} color={colors.star} />
      <AppText variant="micro" color={colors.white} style={styles.badgeText}>
        {rating.toFixed(1)}
      </AppText>
    </View>
  );
}

/** Figma Home grid card: photo, rating badge, name, subtitle, price and «+». */
export function CoffeeCard({ coffee, width, showFavorite }: { coffee: Coffee; width: number; showFavorite?: boolean }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const fav = state.favorites.includes(coffee.id);
  const add = () => {
    actions.addToCart(coffee.id, DEFAULT_OPTIONS);
    toast.show(`${coffee.name} (M) в корзине`, { action: 'Корзина', onAction: () => router.navigate('/cart') });
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${coffee.name}, ${coffee.subtitle}, ${formatPrice(coffee.price)}`}
      onPress={() => openCoffee(coffee.id)}
      style={({ pressed }) => [styles.card, { width }, pressed && { opacity: 0.92 }]}
    >
      <View>
        <Image source={coffee.image} style={styles.image} contentFit="cover" transition={150} />
        <RatingBadge rating={coffee.rating} />
        {showFavorite ? (
          <IconButton
            icon={fav ? 'heart' : 'heart-outline'}
            color={fav ? colors.danger : colors.ink}
            variant="floating"
            size={32}
            iconSize={16}
            accessibilityLabel={fav ? 'Убрать из избранного' : 'В избранное'}
            onPress={() => actions.toggleFavorite(coffee.id)}
            style={styles.fav}
          />
        ) : null}
      </View>
      <View style={styles.body}>
        <AppText variant="section" numberOfLines={1}>
          {coffee.name}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
          {coffee.subtitle}
        </AppText>
        <View style={styles.footer}>
          <AppText variant="priceL" color={colors.dark}>
            {formatPrice(coffee.price)}
          </AppText>
          <IconButton
            icon="add"
            variant="filled"
            size={32}
            iconSize={18}
            accessibilityLabel={`Добавить ${coffee.name} в корзину`}
            onPress={add}
            style={{ borderRadius: radius.sm }}
          />
        </View>
      </View>
    </Pressable>
  );
}

/** Horizontal list variant used in search results. */
export function CoffeeRow({ coffee }: { coffee: Coffee }) {
  const { actions } = useStore();
  const toast = useToast();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${coffee.name}, ${formatPrice(coffee.price)}`}
      onPress={() => openCoffee(coffee.id)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}
    >
      <Image source={coffee.image} style={styles.rowImage} contentFit="cover" />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="section" numberOfLines={1}>
          {coffee.name}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
          {coffee.subtitle} · {coffee.temperature === 'iced' ? 'холодный' : 'горячий'}
        </AppText>
        <View style={styles.rowRating}>
          <Icon name="star" size={12} color={colors.star} />
          <AppText variant="captionStrong">{coffee.rating.toFixed(1)}</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            ({coffee.reviews})
          </AppText>
        </View>
      </View>
      <View style={styles.rowRight}>
        <AppText variant="priceM" color={colors.dark}>
          {formatPrice(coffee.price)}
        </AppText>
        <IconButton
          icon="add"
          variant="filled"
          size={32}
          iconSize={18}
          accessibilityLabel={`Добавить ${coffee.name} в корзину`}
          onPress={() => {
            actions.addToCart(coffee.id, DEFAULT_OPTIONS);
            toast.show(`${coffee.name} (M) в корзине`, { action: 'Корзина', onAction: () => router.navigate('/cart') });
          }}
          style={{ borderRadius: radius.sm }}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 8,
    ...shadow(1),
  },
  image: { width: '100%', aspectRatio: 1.1, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: radius.md,
    borderBottomLeftRadius: radius.xl,
    backgroundColor: 'rgba(17,17,17,0.45)',
  },
  badgeText: { fontSize: 9, lineHeight: 12 },
  fav: { position: 'absolute', top: 6, left: 6 },
  body: { paddingHorizontal: 4, paddingTop: 8, gap: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow(1),
  },
  rowImage: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: colors.surfaceAlt },
  rowRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rowRight: { alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch', gap: 8 },
});
