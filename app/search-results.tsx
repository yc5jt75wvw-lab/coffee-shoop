import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { CoffeeRow } from '../src/components/CoffeeCard';
import { Chip } from '../src/components/Controls';
import { IconButton } from '../src/components/IconButton';
import { EmptyState } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { SearchBar } from '../src/components/SearchBar';
import { getCategory, type CategoryId } from '../src/data/catalog';
import { drinksWord } from '../src/lib/format';
import { activeFilterCount, DEFAULT_FILTERS, PRICE_LABEL, searchCoffees, SORT_LABEL } from '../src/lib/search';
import { useStore } from '../src/store/StoreProvider';
import { colors, spacing } from '../src/theme';

/** Screen 8 — Search results with active filter chips. */
export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const { filters, actions } = useStore();
  const [query, setQuery] = useState(params.q ?? '');
  const [applied, setApplied] = useState(params.q ?? '');

  // Opening a category from the Categories screen preselects it as a filter.
  useEffect(() => {
    if (params.category && getCategory(params.category)) {
      actions.setFilters({ ...DEFAULT_FILTERS, categories: [params.category as CategoryId] });
    }
  }, [params.category, actions]);

  const results = useMemo(() => searchCoffees(applied, filters), [applied, filters]);
  const count = activeFilterCount(filters);

  const submit = () => {
    setApplied(query.trim());
    if (query.trim()) actions.addRecentSearch(query.trim());
    router.setParams({ q: query.trim() });
  };

  const chips: { key: string; label: string; clear: () => void }[] = [
    ...filters.categories.map((id) => ({
      key: id,
      label: getCategory(id)?.name ?? id,
      clear: () => actions.setFilters({ ...filters, categories: filters.categories.filter((c) => c !== id) }),
    })),
    ...(filters.temperature !== 'any'
      ? [{ key: 't', label: filters.temperature === 'hot' ? 'Горячие' : 'Холодные', clear: () => actions.setFilters({ ...filters, temperature: 'any' }) }]
      : []),
    ...(filters.price !== 'any'
      ? [{ key: 'p', label: PRICE_LABEL[filters.price], clear: () => actions.setFilters({ ...filters, price: 'any' }) }]
      : []),
    ...(filters.minRating
      ? [{ key: 'r', label: `★ ${filters.minRating}+`, clear: () => actions.setFilters({ ...filters, minRating: 0 }) }]
      : []),
    ...(filters.sort !== 'popular'
      ? [{ key: 's', label: SORT_LABEL[filters.sort], clear: () => actions.setFilters({ ...filters, sort: 'popular' }) }]
      : []),
  ];

  return (
    <Screen
      scroll
      header={
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={submit}
          right={
            <IconButton
              icon="options-outline"
              variant="filled"
              size={48}
              iconSize={22}
              badge={count}
              accessibilityLabel={count ? `Фильтры, выбрано ${count}` : 'Фильтры'}
              onPress={() => router.push({ pathname: '/filters', params: { q: applied } })}
            />
          }
        />
      }
    >
      <AppText variant="body" color={colors.textSecondary} style={{ marginTop: 4 }} accessibilityLiveRegion="polite">
        {applied ? `«${applied}»: ` : ''}
        {results.length ? `найдено ${drinksWord(results.length)}` : 'ничего не найдено'}
      </AppText>

      {chips.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chips}>
          {chips.map((c) => (
            <Chip key={c.key} label={c.label} icon="close" selected onPress={c.clear} />
          ))}
          <Chip label="Сбросить всё" tone="white" onPress={actions.resetFilters} />
        </ScrollView>
      ) : null}

      {results.length ? (
        <View style={{ gap: 12, marginTop: spacing.md }}>
          {results.map((c) => (
            <CoffeeRow key={c.id} coffee={c} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="search-outline"
          title="Ничего не нашлось"
          text="Попробуйте другое название или ослабьте фильтры."
          action={
            <View style={{ gap: 10 }}>
              {count ? <Button title="Сбросить фильтры" onPress={actions.resetFilters} /> : null}
              <Button title="Смотреть всё меню" variant="secondary" onPress={() => router.push('/categories')} />
            </View>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipsScroll: { marginTop: 12, marginHorizontal: -spacing.gutter },
  chips: { paddingHorizontal: spacing.gutter, gap: 8 },
});
