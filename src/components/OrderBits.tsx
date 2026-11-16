import React from 'react';

import { STATUS_LABEL } from '../lib/orderStatus';
import type { OrderStatus } from '../store/types';
import { Pill } from './Layout';

export function StatusPill({ status }: { status: OrderStatus }) {
  const tone =
    status === 'cancelled'
      ? 'danger'
      : status === 'delivered' || status === 'completed'
        ? 'success'
        : status === 'accepted'
          ? 'neutral'
          : 'brand';
  return <Pill label={STATUS_LABEL[status]} tone={tone} />;
}
