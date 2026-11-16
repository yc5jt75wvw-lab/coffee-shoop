import type { IconName } from '../components/Icon';
import type { ImageAsset } from './catalog';

export type MilkId = 'regular' | 'oat' | 'almond' | 'coconut' | 'none';
export type SyrupId = 'none' | 'caramel' | 'vanilla' | 'hazelnut';

export const MILKS: { id: MilkId; label: string; price: number }[] = [
  { id: 'regular', label: 'Обычное', price: 0 },
  { id: 'oat', label: 'Овсяное', price: 0.5 },
  { id: 'almond', label: 'Миндальное', price: 0.5 },
  { id: 'coconut', label: 'Кокосовое', price: 0.6 },
  { id: 'none', label: 'Без молока', price: 0 },
];

export const SYRUPS: { id: SyrupId; label: string; price: number }[] = [
  { id: 'none', label: 'Без сиропа', price: 0 },
  { id: 'caramel', label: 'Карамель', price: 0.4 },
  { id: 'vanilla', label: 'Ваниль', price: 0.4 },
  { id: 'hazelnut', label: 'Лесной орех', price: 0.4 },
];

export const EXTRA_SHOT_PRICE = 0.7;
export const MAX_SUGAR = 4;
export const MAX_QTY = 20;

// ——— Delivery ———

export type DeliverySpeed = 'standard' | 'express';

export const DELIVERY_OPTIONS: Record<
  DeliverySpeed,
  { title: string; eta: string; minutes: number; fee: number; description: string }
> = {
  standard: {
    title: 'Стандартная',
    eta: '25–35 мин',
    minutes: 30,
    fee: 2,
    description: 'Курьер заберёт заказ вместе с другими по пути',
  },
  express: {
    title: 'Экспресс',
    eta: '15–20 мин',
    minutes: 18,
    fee: 3.5,
    description: 'Отдельный курьер, едет только к вам',
  },
};

export const PICKUP_READY_MINUTES = 10;

// ——— Pickup stores (demo) ———

export type Store = {
  id: string;
  name: string;
  address: string;
  hours: string;
  distanceKm: number;
  opensAt: number;
  closesAt: number;
  image: ImageAsset;
};

export const STORES: Store[] = [
  {
    id: 'tverskaya',
    name: 'Кофейня на Тверской',
    address: 'ул. Тверская, 18, стр. 1',
    hours: '07:00–23:00',
    opensAt: 7,
    closesAt: 23,
    distanceKm: 0.4,
    image: require('../../assets/images/stores/store-1.jpg'),
  },
  {
    id: 'patriarshie',
    name: 'Кофейня у Патриарших',
    address: 'Малая Бронная ул., 24',
    hours: '08:00–22:00',
    opensAt: 8,
    closesAt: 22,
    distanceKm: 1.2,
    image: require('../../assets/images/stores/store-2.jpg'),
  },
  {
    id: 'kitay-gorod',
    name: 'Кофейня на Маросейке',
    address: 'ул. Маросейка, 6/8',
    hours: '09:00–21:00',
    opensAt: 9,
    closesAt: 21,
    distanceKm: 2.7,
    image: require('../../assets/images/stores/store-3.jpg'),
  },
];

export const getStore = (id: string | undefined) => STORES.find((s) => s.id === id);

export const isStoreOpen = (store: Store, date = new Date()) => {
  const h = date.getHours() + date.getMinutes() / 60;
  return h >= store.opensAt && h < store.closesAt;
};

// ——— Promo codes (demo) ———

export type PromoCode = {
  code: string;
  title: string;
  description: string;
  condition: string;
};

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'DELIVERY50',
    title: '−50% на доставку',
    description: 'Платите только половину стоимости доставки курьером.',
    condition: 'Только для доставки',
  },
  {
    code: 'TWOFORONE',
    title: 'Второй напиток в подарок',
    description: 'Самый недорогой напиток в заказе — бесплатно.',
    condition: 'От 2 напитков в заказе',
  },
  {
    code: 'COFFEE10',
    title: '−10% на весь заказ',
    description: 'Скидка на напитки, без учёта доставки.',
    condition: 'Сумма напитков от $8',
  },
  {
    code: 'FREESHIP',
    title: 'Бесплатная доставка',
    description: 'Доставка курьером за наш счёт.',
    condition: 'Сумма напитков от $12',
  },
];

export const getPromo = (code: string | undefined | null) =>
  PROMO_CODES.find((p) => p.code === (code ?? '').trim().toUpperCase());

// ——— Payment methods (demo only, no real card data) ———

export type PaymentMethodId = 'cash' | 'wallet' | 'device-pay' | 'demo-card';

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  title: string;
  subtitle: string;
  icon: IconName;
}[] = [
  { id: 'cash', title: 'Наличные', subtitle: 'Оплата при получении', icon: 'cash-outline' },
  { id: 'wallet', title: 'Демо-кошелёк', subtitle: 'Баланс', icon: 'wallet-outline' },
  { id: 'device-pay', title: 'Оплата телефоном', subtitle: 'Имитация Apple Pay / Google Pay', icon: 'phone-portrait-outline' },
  { id: 'demo-card', title: 'Демо-карта •••• 4242', subtitle: 'Тестовая карта, не настоящая', icon: 'card-outline' },
];

export const WALLET_START_BALANCE = 50;

export const getPaymentMethod = (id: PaymentMethodId) =>
  PAYMENT_METHODS.find((m) => m.id === id) ?? PAYMENT_METHODS[0];

// ——— Courier (demo character) ———

export const COURIER = {
  name: 'Алексей Смирнов',
  role: 'Ваш курьер',
  photo: require('../../assets/images/courier.jpg') as ImageAsset,
};
