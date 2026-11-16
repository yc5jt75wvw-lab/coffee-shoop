import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Header } from '../src/components/Header';
import { Icon } from '../src/components/Icon';
import { Screen } from '../src/components/Screen';
import { categories, coffees, countInCategory, type Category } from '../src/data/catalog';
import { drinksWord } from '../src/lib/format';
import { useStore } from '../src/store/StoreProvider';
import { colors, radius, spacing } from '../src/theme';

const GAP = 15;

/** Screen 10 — Categories: the whole menu grouped by drink type. */
export default function CategoriesScreen() {
  const { width } = useWindowDimensions();
  const { actions } = useStore();
  const tileWidth = (width - spacing.gutter * 2 - GAP) / 2;

  const openAll = () => {
    actions.resetFilters();
    router.push({ pathname: '/search-results', params: { q: '' } });
  };

  const tile = (c: Category) => (
    <Pressable
      key={c.id}
      accessibilityRole="button"
      accessibilityLabel={`${c.name}, ${drinksWord(countInCategory(c.id))}`}
      onPress={() => router.push({ pathname: '/search-results', params: { category: c.id, q: '' } })}
      style={({ pressed }) => [styles.tile, { width: tileWidth }, pressed && { opacity: 0.9 }]}
    >
      <Image source={c.image} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={['rgba(17,17,17,0)', 'rgba(17,17,17,0.85)']} locations={[0.3, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.tileText}>
        <AppText variant="section" color={colors.white}>
          {c.name}
        </AppText>
        <AppText variant="caption" color="#E3E3E3" numberOfLines={1}>
          {drinksWord(countInCategory(c.id))} · {c.description.toLowerCase()}
        </AppText>
      </View>
    </Pressable>
  );

  return (
    <Screen scroll header={<Header title="Категории" />}>
      <Pressable accessibilityRole="button" onPress={openAll} style={({ pressed }) => [styles.all, pressed && { opacity: 0.9 }]}>
        <View style={styles.allIcon}>
          <Icon name="cafe" size={24} color={colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="section" color={colors.white}>
            Всё меню
          </AppText>
          <AppText variant="caption" color={colors.onDarkSecondary}>
            {drinksWord(coffees.length)} — горячие, холодные и без кофеина
          </AppText>
        </View>
        <Icon name="arrow-forward" size={20} color={colors.white} />
      </Pressable>

      <View style={styles.grid}>{categories.map(tile)}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  all: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.dark,
    marginTop: 4,
  },
  allIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, marginTop: spacing.md },
  tile: { height: 168, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.dark },
  tileText: { position: 'absolute', left: 12, right: 12, bottom: 12, gap: 2 },
});
