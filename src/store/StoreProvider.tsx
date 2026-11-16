import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { getCoffee } from '../data/catalog';
import { DELIVERY_OPTIONS, getStore, PICKUP_READY_MINUTES } from '../data/options';
import { DEMO_TIMELINE, getOrderStatus, isFinal, notificationFor } from '../lib/orderStatus';
import { computeTotals, itemKey, itemUnitPrice, round2 } from '../lib/pricing';
import { DEFAULT_FILTERS } from '../lib/search';
import { createInitialState } from './initialState';
import type {
  Address,
  CartItem,
  Checkout,
  DrinkOptions,
  Filters,
  NotificationItem,
  Order,
  PersistedState,
  Settings,
  User,
} from './types';

export const STORAGE_KEY = 'coffee-shop/state/v1';
const MAX_RECENT = 6;

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; error: string };

function buildActions(
  set: React.Dispatch<React.SetStateAction<PersistedState>>,
  get: () => PersistedState,
  setFilters: React.Dispatch<React.SetStateAction<Filters>>,
) {
  const patch = (p: Partial<PersistedState>) => set((s) => ({ ...s, ...p }));

  const pushNotification = (s: PersistedState, n: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => ({
    ...s,
    notifications: [{ ...n, id: uid('n'), read: false, createdAt: Date.now() }, ...s.notifications].slice(0, 60),
  });

  return {
    completeOnboarding: () => patch({ onboardingSeen: true }),

    // ——— Demo auth: no server, profile lives on the device ———
    signIn: (user: User) => patch({ user, guest: false }),
    continueAsGuest: () => patch({ user: null, guest: true }),
    signOut: () => patch({ user: null, guest: false }),
    updateProfile: (p: Partial<User>) => set((s) => (s.user ? { ...s, user: { ...s.user, ...p } } : s)),

    // ——— Cart ———
    addToCart: (coffeeId: string, options: DrinkOptions, qty = 1) =>
      set((s) => {
        const key = itemKey(coffeeId, options);
        const existing = s.cart.find((i) => i.key === key);
        const cart: CartItem[] = existing
          ? s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(20, i.qty + qty) } : i))
          : [...s.cart, { ...options, key, coffeeId, qty }];
        return { ...s, cart };
      }),
    setQty: (key: string, qty: number) =>
      set((s) => ({
        ...s,
        cart: qty <= 0 ? s.cart.filter((i) => i.key !== key) : s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(20, qty) } : i)),
      })),
    removeFromCart: (key: string) => set((s) => ({ ...s, cart: s.cart.filter((i) => i.key !== key) })),
    clearCart: () => patch({ cart: [] }),

    // ——— Favourites ———
    toggleFavorite: (id: string) =>
      set((s) => ({
        ...s,
        favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [id, ...s.favorites],
      })),

    // ——— Addresses ———
    saveAddress: (a: Omit<Address, 'id'> & { id?: string }, makeDefault: boolean) => {
      const id = a.id ?? uid('addr');
      set((s) => {
        const exists = s.addresses.some((x) => x.id === id);
        const address: Address = { ...a, id };
        const addresses = exists ? s.addresses.map((x) => (x.id === id ? address : x)) : [...s.addresses, address];
        return { ...s, addresses, selectedAddressId: makeDefault || !s.selectedAddressId ? id : s.selectedAddressId };
      });
      return id;
    },
    deleteAddress: (id: string) =>
      set((s) => {
        const addresses = s.addresses.filter((a) => a.id !== id);
        const selectedAddressId = s.selectedAddressId === id ? (addresses[0]?.id ?? null) : s.selectedAddressId;
        return { ...s, addresses, selectedAddressId };
      }),
    selectAddress: (id: string) => patch({ selectedAddressId: id }),

    // ——— Checkout ———
    updateCheckout: (p: Partial<Checkout>) => set((s) => ({ ...s, checkout: { ...s.checkout, ...p } })),

    placeOrder: (): PlaceOrderResult => {
      const s = get();
      if (!s.cart.length) return { ok: false, error: 'Корзина пуста' };
      const c = s.checkout;
      const address = s.addresses.find((a) => a.id === s.selectedAddressId);
      if (c.method === 'delivery' && !address) return { ok: false, error: 'Добавьте адрес доставки' };
      const totals = computeTotals(s.cart, c);
      if (c.paymentMethod === 'wallet' && s.walletBalance < totals.total) {
        return { ok: false, error: 'На демо-кошельке недостаточно средств. Выберите другой способ оплаты.' };
      }
      const now = Date.now();
      const order: Order = {
        id: uid('order'),
        number: s.nextOrderNumber,
        createdAt: now,
        timeline: {
          preparingAt: now + DEMO_TIMELINE.preparingAfter,
          dispatchedAt: now + DEMO_TIMELINE.dispatchedAfter,
          doneAt: now + DEMO_TIMELINE.doneAfter,
        },
        method: c.method,
        speed: c.speed,
        schedule: c.schedule,
        addressText: address ? formatAddress(address) : '',
        storeId: c.storeId,
        paymentMethod: c.paymentMethod,
        promoCode: totals.promo?.ok ? totals.promo.code : null,
        note: c.note,
        lines: s.cart.map((i) => ({ ...i, name: getCoffee(i.coffeeId)?.name ?? 'Напиток', unitPrice: itemUnitPrice(i) })),
        totals: {
          subtotal: totals.subtotal,
          deliveryFeeOriginal: totals.deliveryFeeOriginal,
          deliveryFee: totals.deliveryFee,
          discount: totals.discount,
          total: totals.total,
        },
        cancelled: false,
        notifiedStatus: 'accepted',
      };
      set((prev) => {
        let next: PersistedState = {
          ...prev,
          orders: [order, ...prev.orders],
          cart: [],
          nextOrderNumber: prev.nextOrderNumber + 1,
          walletBalance: c.paymentMethod === 'wallet' ? round2(prev.walletBalance - totals.total) : prev.walletBalance,
          checkout: { ...prev.checkout, promoCode: null, note: '' },
        };
        if (prev.settings.orderNotifications) {
          next = pushNotification(next, { kind: 'order', orderId: order.id, ...notificationFor(order, 'accepted') });
        }
        return next;
      });
      return { ok: true, order };
    },

    cancelOrder: (id: string) =>
      set((s) => {
        const order = s.orders.find((o) => o.id === id);
        if (!order || getOrderStatus(order) !== 'accepted') return s;
        let next: PersistedState = {
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, cancelled: true, notifiedStatus: 'cancelled' } : o)),
          walletBalance: order.paymentMethod === 'wallet' ? round2(s.walletBalance + order.totals.total) : s.walletBalance,
        };
        if (s.settings.orderNotifications) {
          next = pushNotification(next, { kind: 'order', orderId: id, ...notificationFor(order, 'cancelled') });
        }
        return next;
      }),

    reorder: (id: string) => {
      const order = get().orders.find((o) => o.id === id);
      if (!order) return 0;
      set((s) => {
        let cart = [...s.cart];
        for (const l of order.lines) {
          if (!getCoffee(l.coffeeId)) continue;
          const existing = cart.find((i) => i.key === l.key);
          cart = existing
            ? cart.map((i) => (i.key === l.key ? { ...i, qty: Math.min(20, i.qty + l.qty) } : i))
            : [...cart, { key: l.key, coffeeId: l.coffeeId, qty: l.qty, size: l.size, milk: l.milk, syrup: l.syrup, sugar: l.sugar, extraShot: l.extraShot }];
        }
        return { ...s, cart };
      });
      return order.lines.reduce((n, l) => n + l.qty, 0);
    },

    /** Demo wallet top-up: no real money involved. */
    topUpWallet: (amount: number) => set((s) => ({ ...s, walletBalance: round2(s.walletBalance + amount) })),

    // ——— Notifications ———
    markRead: (id: string) =>
      set((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
    markAllRead: () => set((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    clearNotifications: () => patch({ notifications: [] }),

    // ——— Settings & search ———
    updateSettings: (p: Partial<Settings>) =>
      set((s) => ({
        ...s,
        settings: { ...s.settings, ...p },
        recentSearches: p.saveSearchHistory === false ? [] : s.recentSearches,
      })),
    addRecentSearch: (q: string) =>
      set((s) => {
        const query = q.trim();
        if (!query || !s.settings.saveSearchHistory) return s;
        const rest = s.recentSearches.filter((r) => r.toLowerCase() !== query.toLowerCase());
        return { ...s, recentSearches: [query, ...rest].slice(0, MAX_RECENT) };
      }),
    removeRecentSearch: (q: string) => set((s) => ({ ...s, recentSearches: s.recentSearches.filter((r) => r !== q) })),
    clearRecentSearches: () => patch({ recentSearches: [] }),

    setFilters,
    resetFilters: () => setFilters(DEFAULT_FILTERS),

    resetDemo: async () => {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set(createInitialState());
      setFilters(DEFAULT_FILTERS);
    },
  };
}

export type Actions = ReturnType<typeof buildActions>;

type StoreValue = {
  state: PersistedState;
  hydrated: boolean;
  filters: Filters;
  actions: Actions;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => createInitialState());
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const actions = useMemo(() => buildActions(setState, () => stateRef.current, setFilters), []);

  // Hydrate once from AsyncStorage.
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        const saved = JSON.parse(raw) as Partial<PersistedState>;
        if (saved.version !== 1) return;
        const base = createInitialState();
        setState({
          ...base,
          ...saved,
          checkout: { ...base.checkout, ...saved.checkout },
          settings: { ...base.settings, ...saved.settings },
        });
      })
      .catch(() => {
        // Corrupt or unavailable storage: start from the demo defaults.
      })
      .finally(() => alive && setHydrated(true));
    return () => {
      alive = false;
    };
  }, []);

  // Persist on every change after hydration (debounced).
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state, hydrated]);

  // Advance demo orders and raise a notification at each status change.
  useEffect(() => {
    if (!hydrated) return;
    const tick = () =>
      setState((s) => {
        const now = Date.now();
        let changed = false;
        let next = s;
        const orders = s.orders.map((o) => {
          if (o.cancelled || isFinal(o.notifiedStatus)) return o;
          const status = getOrderStatus(o, now);
          if (status === o.notifiedStatus) return o;
          changed = true;
          if (s.settings.orderNotifications) {
            next = {
              ...next,
              notifications: [
                { id: uid('n'), kind: 'order' as const, orderId: o.id, read: false, createdAt: now, ...notificationFor(o, status) },
                ...next.notifications,
              ].slice(0, 60),
            };
          }
          return { ...o, notifiedStatus: status };
        });
        return changed ? { ...next, orders } : s;
      });
    tick();
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, [hydrated]);

  const value = useMemo(() => ({ state, hydrated, filters, actions }), [state, hydrated, filters, actions]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

// ——— Selectors ———

export const formatAddress = (a: Address) =>
  [a.street, a.apartment && (/^\d/.test(a.apartment) ? `кв. ${a.apartment}` : a.apartment)].filter(Boolean).join(', ');

export const addressDetails = (a: Address) =>
  [a.entrance && `подъезд ${a.entrance}`, a.floor && `этаж ${a.floor}`, a.intercom && `домофон ${a.intercom}`]
    .filter(Boolean)
    .join(', ');

export function useSelectedAddress() {
  const { state } = useStore();
  return state.addresses.find((a) => a.id === state.selectedAddressId) ?? null;
}

export function useCartCount() {
  const { state } = useStore();
  return state.cart.reduce((n, i) => n + i.qty, 0);
}

export function useTotals() {
  const { state } = useStore();
  return useMemo(() => computeTotals(state.cart, state.checkout), [state.cart, state.checkout]);
}

export function useEta() {
  const { state } = useStore();
  const c = state.checkout;
  if (c.schedule !== 'asap') return `к ${c.schedule}`;
  if (c.method === 'pickup') return `через ${PICKUP_READY_MINUTES} мин`;
  return DELIVERY_OPTIONS[c.speed].eta;
}

export const storeName = (id: string) => getStore(id)?.name ?? 'Кофейня';
