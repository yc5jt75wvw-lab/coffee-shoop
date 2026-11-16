import { categories, coffees, type Coffee } from '../data/catalog';
import type { Filters } from '../store/types';

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  temperature: 'any',
  price: 'any',
  minRating: 0,
  sort: 'popular',
};

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').trim();

function matches(c: Coffee, q: string) {
  if (!q) return true;
  const query = norm(q);
  if (query.includes('без молока')) return c.features.includes('vegan');
  if (query.includes('со льдом') || query.includes('холод')) return c.temperature === 'iced';
  const categoryName = categories.find((x) => x.id === c.category)?.name ?? '';
  const haystack = norm([c.name, c.subtitle, categoryName].join(' '));
  return query.split(/\s+/).every((word) => haystack.includes(word));
}

export function searchCoffees(q: string, f: Filters) {
  const list = coffees.filter((c) => {
    if (!matches(c, q)) return false;
    if (f.categories.length && !f.categories.includes(c.category)) return false;
    if (f.temperature !== 'any' && c.temperature !== f.temperature) return false;
    if (f.price === 'lt3' && c.price >= 3) return false;
    if (f.price === '3to4' && (c.price < 3 || c.price > 4)) return false;
    if (f.price === 'gt4' && c.price <= 4) return false;
    if (c.rating < f.minRating) return false;
    return true;
  });
  const sorted = [...list];
  switch (f.sort) {
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    case 'priceAsc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    default:
      sorted.sort((a, b) => a.popularity - b.popularity);
  }
  return sorted;
}

export const activeFilterCount = (f: Filters) =>
  f.categories.length +
  (f.temperature !== 'any' ? 1 : 0) +
  (f.price !== 'any' ? 1 : 0) +
  (f.minRating ? 1 : 0) +
  (f.sort !== 'popular' ? 1 : 0);

export const SORT_LABEL: Record<Filters['sort'], string> = {
  popular: 'Популярные',
  rating: 'По рейтингу',
  priceAsc: 'Сначала дешевле',
  priceDesc: 'Сначала дороже',
};

export const PRICE_LABEL: Record<Filters['price'], string> = {
  any: 'Любая',
  lt3: 'До $ 3',
  '3to4': '$ 3 – 4',
  gt4: 'От $ 4',
};
