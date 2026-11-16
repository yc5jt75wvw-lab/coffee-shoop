import { getCoffee, SIZES, type Coffee } from '../data/catalog';
import {
  DELIVERY_OPTIONS,
  EXTRA_SHOT_PRICE,
  getPromo,
  MILKS,
  SYRUPS,
} from '../data/options';
import type { CartItem, Checkout, DrinkOptions, Totals } from '../store/types';

export const round2 = (n: number) => Math.round(n * 100) / 100;

export const DEFAULT_OPTIONS: DrinkOptions = {
  size: 'M',
  milk: 'regular',
  syrup: 'none',
  sugar: 0,
  extraShot: false,
};

export function unitPrice(coffee: Coffee, o: DrinkOptions) {
  const size = SIZES.find((s) => s.id === o.size)?.delta ?? 0;
  const milk = MILKS.find((m) => m.id === o.milk)?.price ?? 0;
  const syrup = SYRUPS.find((s) => s.id === o.syrup)?.price ?? 0;
  return round2(coffee.price + size + milk + syrup + (o.extraShot ? EXTRA_SHOT_PRICE : 0));
}

export function itemUnitPrice(item: CartItem) {
  const coffee = getCoffee(item.coffeeId);
  return coffee ? unitPrice(coffee, item) : 0;
}

export const itemKey = (coffeeId: string, o: DrinkOptions) =>
  [coffeeId, o.size, o.milk, o.syrup, o.sugar, o.extraShot ? 1 : 0].join('|');

/** Human summary of non-default options, e.g. «M · овсяное · карамель». */
export function optionsSummary(o: DrinkOptions) {
  const parts: string[] = [`Размер ${o.size}`];
  if (o.milk !== 'regular') parts.push(MILKS.find((m) => m.id === o.milk)!.label.toLowerCase());
  if (o.syrup !== 'none') parts.push(SYRUPS.find((s) => s.id === o.syrup)!.label.toLowerCase());
  if (o.sugar > 0) parts.push(`сахар ×${o.sugar}`);
  if (o.extraShot) parts.push('+ шот');
  return parts.join(' · ');
}

export type PromoResult = { code: string; ok: boolean; reason?: string } | null;

export function evaluatePromo(
  code: string | null,
  items: { price: number; qty: number }[],
  method: Checkout['method'],
): PromoResult {
  if (!code) return null;
  const promo = getPromo(code);
  if (!promo) return { code, ok: false, reason: 'Такого промокода нет' };
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const units = items.reduce((s, i) => s + i.qty, 0);
  switch (promo.code) {
    case 'DELIVERY50':
      return method === 'delivery'
        ? { code: promo.code, ok: true }
        : { code: promo.code, ok: false, reason: 'Действует только при доставке' };
    case 'FREESHIP':
      if (method !== 'delivery') return { code: promo.code, ok: false, reason: 'Действует только при доставке' };
      return subtotal >= 12
        ? { code: promo.code, ok: true }
        : { code: promo.code, ok: false, reason: `Добавьте напитков ещё на $ ${(12 - subtotal).toFixed(2)}` };
    case 'COFFEE10':
      return subtotal >= 8
        ? { code: promo.code, ok: true }
        : { code: promo.code, ok: false, reason: `Добавьте напитков ещё на $ ${(8 - subtotal).toFixed(2)}` };
    case 'TWOFORONE':
      return units >= 2
        ? { code: promo.code, ok: true }
        : { code: promo.code, ok: false, reason: 'Нужно минимум 2 напитка' };
    default:
      return { code: promo.code, ok: false, reason: 'Промокод недоступен' };
  }
}

export function computeTotals(
  cart: CartItem[],
  checkout: Pick<Checkout, 'method' | 'speed' | 'promoCode'>,
): Totals & { promo: PromoResult } {
  const priced = cart.map((i) => ({ price: itemUnitPrice(i), qty: i.qty }));
  const subtotal = round2(priced.reduce((s, i) => s + i.price * i.qty, 0));
  const deliveryFeeOriginal =
    checkout.method === 'delivery' && cart.length > 0 ? DELIVERY_OPTIONS[checkout.speed].fee : 0;
  const promo = cart.length ? evaluatePromo(checkout.promoCode, priced, checkout.method) : null;

  let deliveryFee = deliveryFeeOriginal;
  let discount = 0;
  if (promo?.ok) {
    if (promo.code === 'DELIVERY50') deliveryFee = round2(deliveryFeeOriginal / 2);
    if (promo.code === 'FREESHIP') deliveryFee = 0;
    if (promo.code === 'COFFEE10') discount = round2(subtotal * 0.1);
    if (promo.code === 'TWOFORONE') discount = Math.min(...priced.map((i) => i.price));
  }
  const total = round2(Math.max(0, subtotal - discount + deliveryFee));
  return { subtotal, deliveryFeeOriginal, deliveryFee, discount: round2(discount), total, promo };
}
