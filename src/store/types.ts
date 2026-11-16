import type { CategoryId, Size, Temperature } from '../data/catalog';
import type { DeliverySpeed, MilkId, PaymentMethodId, SyrupId } from '../data/options';

export type DrinkOptions = {
  size: Size;
  milk: MilkId;
  syrup: SyrupId;
  sugar: number;
  extraShot: boolean;
};

export type CartItem = DrinkOptions & {
  /** Stable key built from coffee id + options, so equal drinks merge. */
  key: string;
  coffeeId: string;
  qty: number;
};

export type Address = {
  id: string;
  label: string;
  street: string;
  apartment: string;
  entrance: string;
  floor: string;
  intercom: string;
  comment: string;
};

export type DeliveryMethod = 'delivery' | 'pickup';

export type Checkout = {
  method: DeliveryMethod;
  speed: DeliverySpeed;
  /** 'asap' or a time slot like '14:30'. */
  schedule: string;
  storeId: string;
  promoCode: string | null;
  paymentMethod: PaymentMethodId;
  note: string;
};

export type Settings = {
  orderNotifications: boolean;
  promoNotifications: boolean;
  haptics: boolean;
  saveSearchHistory: boolean;
};

export type User = {
  name: string;
  email: string;
  phone: string;
};

export type OrderStatus =
  | 'accepted'
  | 'preparing'
  | 'on_the_way'
  | 'ready'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type OrderLine = CartItem & { name: string; unitPrice: number };

export type Totals = {
  subtotal: number;
  deliveryFeeOriginal: number;
  deliveryFee: number;
  discount: number;
  total: number;
};

export type Order = {
  id: string;
  number: number;
  createdAt: number;
  /** Demo timeline: when each stage starts (ms since epoch). */
  timeline: { preparingAt: number; dispatchedAt: number; doneAt: number };
  method: DeliveryMethod;
  speed: DeliverySpeed;
  schedule: string;
  addressText: string;
  storeId: string;
  paymentMethod: PaymentMethodId;
  promoCode: string | null;
  note: string;
  lines: OrderLine[];
  totals: Totals;
  cancelled: boolean;
  /** Last status we raised a notification for. */
  notifiedStatus: OrderStatus;
  isSample?: boolean;
};

export type NotificationItem = {
  id: string;
  kind: 'order' | 'promo' | 'system';
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  orderId?: string;
  promoCode?: string;
};

export type Filters = {
  categories: CategoryId[];
  temperature: 'any' | Temperature;
  price: 'any' | 'lt3' | '3to4' | 'gt4';
  minRating: 0 | 4.5 | 4.7;
  sort: 'popular' | 'rating' | 'priceAsc' | 'priceDesc';
};

export type PersistedState = {
  version: 1;
  onboardingSeen: boolean;
  user: User | null;
  guest: boolean;
  cart: CartItem[];
  favorites: string[];
  addresses: Address[];
  selectedAddressId: string | null;
  checkout: Checkout;
  settings: Settings;
  orders: Order[];
  notifications: NotificationItem[];
  recentSearches: string[];
  walletBalance: number;
  nextOrderNumber: number;
};
