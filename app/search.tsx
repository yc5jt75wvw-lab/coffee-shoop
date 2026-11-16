import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { CoffeeRow, openCoffee } from '../src/components/CoffeeCard';
import { Chip } from '../src/components/Controls';
import { Icon } from '../src/components/Icon';
import { IconButton } from '../src/components/IconButton';
import { SectionTitle } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { SearchBar } from '../src/components/SearchBar';
import { coffees, POPULAR_QUERIES } from '../src/data/catalog';
import { formatPrice } from '../src/lib/format';
import { DEFAULT_FILTERS, searchCoffees } from '../src/lib/search';
import { useStore } from '../src/store/StoreProvider';
import { colors, radius, spacing } from '../src/theme';

/** Screen 7 — Search: live suggestions, recent and popular queries. */
export default function SearchScreen() {
  const { state, actions } = useStore();
  const [query, setQuery] = useState('');
  const suggestions = useMemo(() => (query.trim() ? searchCoffees(query, DEFAULT_FILTERS).slice(0, 5) : []), [query]);
  const popular = useMemo(() => [...coffees].sort((a, b) => a.popularity - b.popularity).slice(0, 3), []);

  const submit = (q = query) => {
    const value = q.trim();
    if (!value) return;
    actions.addRecentSearch(value);
    router.push({ pathname: '/search-results', params: { q: value } });
  };

  return (
    <Screen scroll header={<SearchBar value={query} onChangeText={setQuery} onSubmit={() => submit()} autoFocus />}>
      {query.trim() ? (
        <View style={{ gap: 4, marginTop: 8 }}>
          {suggestions.length ? (
            suggestions.map((c) => (
              <Pressable
                key={c.id}
                accessibilityRole="button"
                accessibilityLabel={`${c.name}, ${formatPrice(c.price)}`}
                onPress={() => {
                  actions.addRecentSearch(c.name);
                  openCoffee(c.id);
                }}
                style={({ pressed }) => [styles.suggestion, pressed && { backgroundColor: colors.primarySoft }]}
              >
                <Image source={c.image} style={styles.thumb} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyStrong">{c.name}</AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {c.subtitle}
                  </AppText>
                </View>
                <AppText variant="priceS">{formatPrice(c.price)}</AppText>
              </Pressable>
            ))
          ) : (
            <AppText variant="body" color={colors.textSecondary} style={{ paddingVertical: 12 }}>
              Совпадений нет. Нажмите «Найти», чтобы посмотреть все результаты с фильтрами.
            </AppText>
          )}
          <Pressable accessibilityRole="button" onPress={() => submit()} style={styles.showAll}>
            <Icon name="search" size={18} color={colors.primary} />
            <AppText variant="bodyStrong" color={colors.primary}>
              Все результаты по «{query.trim()}»
            </AppText>
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: spacing.lg, marginTop: 8 }}>
          {state.recentSearches.length ? (
            <View>
              <SectionTitle title="Недавние" action="Очистить" onAction={actions.clearRecentSearches} />
              {state.recentSearches.map((r) => (
                <View key={r} style={styles.recent}>
                  <Pressable accessibilityRole="button" onPress={() => submit(r)} style={styles.recentLabel}>
                    <Icon name="time-outline" size={18} color={colors.textMuted} />
                    <AppText variant="body">{r}</AppText>
                  </Pressable>
                  <IconButton icon="close" size={32} iconSize={16} color={colors.textMuted} accessibilityLabel={`Удалить «${r}» из недавних`} onPress={() => actions.removeRecentSearch(r)} />
                </View>
              ))}
            </View>
          ) : null}

          <View>
            <SectionTitle title="Часто ищут" />
            <View style={styles.chips}>
              {POPULAR_QUERIES.map((q) => (
                <Chip key={q} label={q} tone="white" onPress={() => submit(q)} />
              ))}
            </View>
          </View>

          <View>
            <SectionTitle title="Популярное сегодня" action="Категории" onAction={() => router.push('/categories')} />
            <View style={{ gap: 12 }}>
              {popular.map((c) => (
                <CoffeeRow key={c.id} coffee={c} />
              ))}
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: radius.md },
  thumb: { width: 48, height: 48, borderRadius: radius.sm },
  showAll: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 8 },
  recent: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  recentLabel: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
