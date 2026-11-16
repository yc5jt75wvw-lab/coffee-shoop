import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../../src/components/AppText';
import { CoffeeCard } from '../../src/components/CoffeeCard';
import { Chip } from '../../src/components/Controls';
import { Icon } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { Avatar } from '../../src/components/Layout';
import { categories, coffees, type CategoryId } from '../../src/data/catalog';
import { initials } from '../../src/lib/format';
import { useNow } from '../../src/lib/hooks';
import { getOrderStatus, isActive, STATUS_LABEL } from '../../src/lib/orderStatus';
import { useSelectedAddress, useStore } from '../../src/store/StoreProvider';
import { colors, radius, shadow, spacing } from '../../src/theme';

const GAP = 15;

/** Screen 6 — Home (Figma «High-Fidelity Home»). */
export default function HomeScreen() {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const address = useSelectedAddress();
  const now = useNow(5000);
  const [category, setCategory] = useState<CategoryId | 'all'>('all');

  const list = useMemo(
    () => (category === 'all' ? coffees : coffees.filter((c) => c.category === category)),
    [category],
  );
  const activeOrder = state.orders.find((o) => isActive(o, now));
  const cardWidth = (width - spacing.gutter * 2 - GAP) / 2;
  const location = address ? `Москва, ${address.street}` : 'Добавьте адрес доставки';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <LinearGradient
          colors={['#111111', '#313131']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.locationRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Адрес доставки: ${location}. Изменить`}
              onPress={() => router.push('/addresses')}
              style={{ flex: 1 }}
              hitSlop={8}
            >
              <AppText variant="caption" color="#A2A2A2">
                Местоположение
              </AppText>
              <View style={styles.locationValue}>
                <AppText variant="bodyStrong" color="#D8D8D8" numberOfLines={1} style={{ flexShrink: 1 }}>
                  {location}
                </AppText>
                <Icon name="chevron-down" size={14} color="#D8D8D8" />
              </View>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Профиль" onPress={() => router.push('/profile')} hitSlop={6}>
              <Avatar label={state.user ? initials(state.user.name) : 'Г'} size={44} />
            </Pressable>
          </View>

          <View style={styles.searchRow}>
            <Pressable
              accessibilityRole="search"
              accessibilityLabel="Найти кофе"
              onPress={() => router.push('/search')}
              style={styles.search}
            >
              <Icon name="search-outline" size={20} color={colors.white} />
              <AppText variant="body" color="#A2A2A2">
                Найти кофе
              </AppText>
            </Pressable>
            <IconButton
              icon="options-outline"
              variant="filled"
              size={52}
              iconSize={22}
              accessibilityLabel="Фильтры"
              onPress={() => router.push({ pathname: '/filters', params: { from: 'home' } })}
            />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Акция: второй кофе в подарок. Открыть промокоды"
            onPress={() => router.push('/promo-codes')}
            style={styles.banner}
          >
            <Image source={require('../../assets/images/promo.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(84,52,30,0.92)', 'rgba(84,52,30,0.55)', 'rgba(84,52,30,0)']}
              locations={[0, 0.55, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.promoTag}>
              <AppText variant="bodyStrong" color={colors.white}>
                Акция
              </AppText>
            </View>
            {['Второй кофе', 'в подарок'].map((line) => (
              <View key={line} style={styles.promoLine}>
                <View style={styles.promoHighlight} />
                <AppText variant="display" color={colors.white} style={styles.promoText}>
                  {line}
                </AppText>
              </View>
            ))}
          </Pressable>

          {activeOrder ? (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push(
                  activeOrder.method === 'delivery'
                    ? { pathname: '/tracking/[id]', params: { id: activeOrder.id } }
                    : { pathname: '/orders/[id]', params: { id: activeOrder.id } },
                )
              }
              style={styles.active}
            >
              <View style={styles.activeIcon}>
                <Icon name={activeOrder.method === 'delivery' ? 'bicycle' : 'cafe'} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">
                  Заказ №{activeOrder.number} · {STATUS_LABEL[getOrderStatus(activeOrder, now)]}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {activeOrder.method === 'delivery' ? 'Следить на карте' : 'Открыть детали заказа'}
                </AppText>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chips}
          >
            <Chip label="Все" selected={category === 'all'} onPress={() => setCategory('all')} />
            {categories.map((c) => (
              <Chip key={c.id} label={c.name} selected={category === c.id} onPress={() => setCategory(c.id)} />
            ))}
            <Chip label="Все категории" icon="grid-outline" tone="white" onPress={() => router.push('/categories')} />
          </ScrollView>

          <View style={styles.grid}>
            {list.map((c) => (
              <CoffeeCard key={c.id} coffee={c} width={cardWidth} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { paddingHorizontal: spacing.gutter, paddingBottom: 92 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  locationValue: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  searchRow: { flexDirection: 'row', gap: 16, marginTop: 24 },
  search: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.darkField,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  content: { paddingHorizontal: spacing.gutter, marginTop: -68 },
  banner: {
    height: 140,
    borderRadius: radius.lg,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 13,
    backgroundColor: '#8B5A3C',
  },
  promoTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginBottom: 8,
  },
  promoLine: { alignSelf: 'flex-start', justifyContent: 'center' },
  promoHighlight: {
    position: 'absolute',
    left: -2,
    right: -2,
    bottom: 5,
    height: 22,
    backgroundColor: '#1C1C1C',
  },
  promoText: { fontSize: 28, lineHeight: 37 },
  active: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    ...shadow(1),
  },
  activeIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: { marginTop: 24, marginHorizontal: -spacing.gutter },
  chips: { paddingHorizontal: spacing.gutter, gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, marginTop: 16 },
});
