import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Chip, Segmented } from '../src/components/Controls';
import { Header } from '../src/components/Header';
import { BottomBar, SectionTitle } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { categories, type CategoryId } from '../src/data/catalog';
import { drinksWord } from '../src/lib/format';
import { DEFAULT_FILTERS, PRICE_LABEL, searchCoffees, SORT_LABEL } from '../src/lib/search';
import { useStore } from '../src/store/StoreProvider';
import type { Filters } from '../src/store/types';
import { colors, spacing } from '../src/theme';

/** Screen 9 — Filters (modal): sort, category, temperature, price, rating. */
export default function FiltersScreen() {
  const params = useLocalSearchParams<{ q?: string; from?: string }>();
  const { filters, actions } = useStore();
  const [draft, setDraft] = useState<Filters>(filters);
  const count = useMemo(() => searchCoffees(params.q ?? '', draft).length, [draft, params.q]);
  const set = (p: Partial<Filters>) => setDraft((d) => ({ ...d, ...p }));

  const toggleCategory = (id: CategoryId) =>
    set({ categories: draft.categories.includes(id) ? draft.categories.filter((c) => c !== id) : [...draft.categories, id] });

  const apply = () => {
    actions.setFilters(draft);
    if (params.from === 'home') {
      router.back();
      router.push({ pathname: '/search-results', params: { q: '' } });
    } else {
      router.back();
    }
  };

  return (
    <Screen
      scroll
      edges={['top']}
      header={
        <Header
          title="Фильтры"
          backIcon="close"
          right={
            <Button title="Сбросить" variant="ghost" size="sm" onPress={() => setDraft(DEFAULT_FILTERS)} />
          }
        />
      }
      footer={
        <BottomBar>
          <Button
            title={count ? `Показать ${drinksWord(count)}` : 'Ничего не найдено'}
            disabled={!count}
            onPress={apply}
          />
        </BottomBar>
      }
    >
      <View style={styles.block}>
        <SectionTitle title="Сортировка" />
        <View style={styles.wrap}>
          {(Object.keys(SORT_LABEL) as Filters['sort'][]).map((s) => (
            <Chip key={s} label={SORT_LABEL[s]} selected={draft.sort === s} onPress={() => set({ sort: s })} />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <SectionTitle title="Категории" />
        <View style={styles.wrap}>
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} selected={draft.categories.includes(c.id)} onPress={() => toggleCategory(c.id)} />
          ))}
        </View>
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 8 }}>
          Можно выбрать несколько.
        </AppText>
      </View>

      <View style={styles.block}>
        <SectionTitle title="Температура" />
        <Segmented<Filters['temperature']>
          value={draft.temperature}
          onChange={(temperature) => set({ temperature })}
          options={[
            { value: 'any', label: 'Любая' },
            { value: 'hot', label: 'Горячие' },
            { value: 'iced', label: 'Холодные' },
          ]}
        />
      </View>

      <View style={styles.block}>
        <SectionTitle title="Цена за размер M" />
        <View style={styles.wrap}>
          {(Object.keys(PRICE_LABEL) as Filters['price'][]).map((p) => (
            <Chip key={p} label={PRICE_LABEL[p]} selected={draft.price === p} onPress={() => set({ price: p })} />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <SectionTitle title="Рейтинг" />
        <View style={styles.wrap}>
          {([0, 4.5, 4.7] as Filters['minRating'][]).map((r) => (
            <Chip
              key={r}
              label={r ? `от ${r}` : 'Любой'}
              icon={r ? 'star' : undefined}
              selected={draft.minRating === r}
              onPress={() => set({ minRating: r })}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: spacing.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
