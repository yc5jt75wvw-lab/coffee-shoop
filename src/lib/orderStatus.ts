import type { Order, OrderStatus } from '../store/types';

/**
 * Demo timeline. Real delivery takes 25–35 minutes; the demo compresses it so the
 * whole flow can be watched in about four minutes.
 */
export const DEMO_TIMELINE = {
  preparingAfter: 20_000,
  dispatchedAfter: 60_000,
  doneAfter: 240_000,
};

export function getOrderStatus(order: Order, now = Date.now()): OrderStatus {
  if (order.cancelled) return 'cancelled';
  const { preparingAt, dispatchedAt, doneAt } = order.timeline;
  const delivery = order.method === 'delivery';
  if (now >= doneAt) return delivery ? 'delivered' : 'completed';
  if (now >= dispatchedAt) return delivery ? 'on_the_way' : 'ready';
  if (now >= preparingAt) return 'preparing';
  return 'accepted';
}

export const isFinal = (s: OrderStatus) => s === 'delivered' || s === 'completed' || s === 'cancelled';
export const isActive = (order: Order, now = Date.now()) => !isFinal(getOrderStatus(order, now));
export const canCancel = (order: Order, now = Date.now()) => getOrderStatus(order, now) === 'accepted';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  accepted: 'Принят',
  preparing: 'Готовится',
  on_the_way: 'В пути',
  ready: 'Готов к выдаче',
  delivered: 'Доставлен',
  completed: 'Выдан',
  cancelled: 'Отменён',
};

export type Step = { key: OrderStatus; title: string; at: number };

export function getSteps(order: Order): Step[] {
  const delivery = order.method === 'delivery';
  return [
    { key: 'accepted', title: 'Заказ принят', at: order.createdAt },
    { key: 'preparing', title: 'Бариста готовит напитки', at: order.timeline.preparingAt },
    delivery
      ? { key: 'on_the_way', title: 'Курьер в пути', at: order.timeline.dispatchedAt }
      : { key: 'ready', title: 'Готов, ждёт на стойке', at: order.timeline.dispatchedAt },
    delivery
      ? { key: 'delivered', title: 'Доставлен', at: order.timeline.doneAt }
      : { key: 'completed', title: 'Выдан', at: order.timeline.doneAt },
  ];
}

/** 0..1 progress of the delivery leg (used by the map courier marker). */
export function travelProgress(order: Order, now = Date.now()) {
  const { dispatchedAt, doneAt } = order.timeline;
  if (now <= dispatchedAt) return 0;
  if (now >= doneAt) return 1;
  return (now - dispatchedAt) / (doneAt - dispatchedAt);
}

/** Index of the current stage (0..3) for segmented progress bars. */
export function stageIndex(order: Order, now = Date.now()) {
  const s = getOrderStatus(order, now);
  switch (s) {
    case 'accepted':
      return 0;
    case 'preparing':
      return 1;
    case 'on_the_way':
    case 'ready':
      return 2;
    default:
      return 3;
  }
}

export const notificationFor = (order: Order, status: OrderStatus) => {
  const n = `№${order.number}`;
  switch (status) {
    case 'accepted':
      return { title: `Заказ ${n} принят`, body: 'Мы получили заказ и скоро начнём готовить.' };
    case 'preparing':
      return { title: `Готовим заказ ${n}`, body: 'Бариста уже работает над вашими напитками.' };
    case 'on_the_way':
      return { title: `Заказ ${n} в пути`, body: 'Курьер забрал заказ и едет к вам.' };
    case 'ready':
      return { title: `Заказ ${n} готов`, body: 'Можно забирать на стойке выдачи.' };
    case 'delivered':
      return { title: `Заказ ${n} доставлен`, body: 'Приятного кофе! Оцените заказ в истории.' };
    case 'completed':
      return { title: `Заказ ${n} выдан`, body: 'Спасибо, что заглянули к нам.' };
    case 'cancelled':
      return { title: `Заказ ${n} отменён`, body: 'Если оплата уже прошла, деньги вернутся в демо-кошелёк.' };
  }
};
