import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { CoffeeCard } from '../../src/components/CoffeeCard';
import { Header } from '../../src/components/Header';
import { EmptyState } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { coffees } from '../../src/data/catalog';
import { drinksWord } from '../../src/lib/format';
import { useStore } from '../../src/store/StoreProvider';
import { colors, spacing } from '../../src/theme';

const GAP = 15;

/** Screen 13 — Favorites (persisted in AsyncStorage). */
export default function FavoritesScreen() {
  const { state } = useStore();
  const { width } = useWindowDimensions();
  const list = state.favorites.map((id) => coffees.find((c) => c.id === id)).filter((c) => !!c);
  const cardWidth = (width - spacing.gutter * 2 - GAP) / 2;

  return (
    <Screen scroll={list.length > 0} header={<Header title="Избранное" noBack />}>
      {list.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Пока пусто"
          text="Нажмите на сердечко на странице напитка, чтобы сохранить его здесь."
          action={<Button title="Перейти в меню" onPress={() => router.navigate('/home')} />}
        />
      ) : (
        <>
          <AppText variant="body" color={colors.textSecondary} style={{ marginBottom: 16 }}>
            {drinksWord(list.length)} в избранном
          </AppText>
          <View style={styles.grid}>
            {list.map((c) => (
              <CoffeeCard key={c.id} coffee={c} width={cardWidth} showFavorite />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
});
