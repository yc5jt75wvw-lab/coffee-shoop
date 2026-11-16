import { getCoffee } from '../data/catalog';
import { WALLET_START_BALANCE } from '../data/options';
import { itemKey, round2, unitPrice, DEFAULT_OPTIONS } from '../lib/pricing';
import type { DrinkOptions, Order, OrderLine, PersistedState } from './types';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function line(coffeeId: string, qty: number, o: Partial<DrinkOptions> = {}): OrderLine {
  const opts = { ...DEFAULT_OPTIONS, ...o };
  const coffee = getCoffee(coffeeId)!;
  return { ...opts, key: itemKey(coffeeId, opts), coffeeId, qty, name: coffee.name, unitPrice: unitPrice(coffee, opts) };
}

function sampleOrder(
  id: string,
  number: number,
  createdAt: number,
  lines: OrderLine[],
  method: Order['method'],
): Order {
  const subtotal = round2(lines.reduce((s, l) => s + l.unitPrice * l.qty, 0));
  const fee = method === 'delivery' ? 1 : 0;
  return {
    id,
    number,
    createdAt,
    timeline: { preparingAt: createdAt + 60_000, dispatchedAt: createdAt + 8 * 60_000, doneAt: createdAt + 31 * 60_000 },
    method,
    speed: 'standard',
    schedule: 'asap',
    addressText: 'ул. Тверская, 12, кв. 45',
    storeId: 'tverskaya',
    paymentMethod: 'cash',
    promoCode: method === 'delivery' ? 'DELIVERY50' : null,
    note: '',
    lines,
    totals: {
      subtotal,
      deliveryFeeOriginal: method === 'delivery' ? 2 : 0,
      deliveryFee: fee,
      discount: 0,
      total: round2(subtotal + fee),
    },
    cancelled: false,
    notifiedStatus: method === 'delivery' ? 'delivered' : 'completed',
    isSample: true,
  };
}

export function createInitialState(now = Date.now()): PersistedState {
  return {
    version: 1,
    onboardingSeen: false,
    user: null,
    guest: false,
    cart: [],
    favorites: ['caffe-mocha', 'flat-white'],
    addresses: [
      {
        id: 'home',
        label: 'Дом',
        street: 'ул. Тверская, 12',
        apartment: '45',
        entrance: '2',
        floor: '5',
        intercom: '45К',
        comment: '',
      },
      {
        id: 'work',
        label: 'Работа',
        street: 'Пресненская наб., 10',
        apartment: 'офис 1204',
        entrance: '',
        floor: '12',
        intercom: '',
        comment: 'Пропуск на ресепшене',
      },
    ],
    selectedAddressId: 'home',
    checkout: {
      method: 'delivery',
      speed: 'standard',
      schedule: 'asap',
      storeId: 'tverskaya',
      promoCode: 'DELIVERY50',
      paymentMethod: 'cash',
      note: '',
    },
    settings: {
      orderNotifications: true,
      promoNotifications: true,
      haptics: true,
      saveSearchHistory: true,
    },
    orders: [
      sampleOrder('sample-2', 1041, now - 2 * DAY - 3 * HOUR, [line('caffe-mocha', 1), line('flat-white', 1, { milk: 'oat' })], 'delivery'),
      sampleOrder('sample-1', 1040, now - 6 * DAY - 5 * HOUR, [line('cappuccino', 2, { syrup: 'caramel' })], 'pickup'),
    ],
    notifications: [
      {
        id: 'n-promo-2for1',
        kind: 'promo',
        title: 'Второй напиток в подарок',
        body: 'Промокод TWOFORONE: самый недорогой напиток в заказе — бесплатно.',
        createdAt: now - 20 * 60_000,
        read: false,
        promoCode: 'TWOFORONE',
      },
      {
        id: 'n-promo-coffee10',
        kind: 'promo',
        title: '−10% на весь заказ',
        body: 'Промокод COFFEE10 для заказа от $ 8.',
        createdAt: now - DAY - 2 * HOUR,
        read: false,
        promoCode: 'COFFEE10',
      },
      {
        id: 'n-sample-2',
        kind: 'order',
        title: 'Заказ №1041 доставлен',
        body: 'Приятного кофе! Это пример заказа из демо-данных.',
        createdAt: now - 2 * DAY - 2 * HOUR,
        read: true,
        orderId: 'sample-2',
      },
      {
        id: 'n-welcome',
        kind: 'system',
        title: 'Добро пожаловать',
        body: 'Это демо-версия: оплата и доставка имитируются, реальные деньги не списываются.',
        createdAt: now - 3 * DAY,
        read: true,
      },
    ],
    recentSearches: ['Флэт уайт', 'Колд брю'],
    walletBalance: WALLET_START_BALANCE,
    nextOrderNumber: 1042,
  };
}
