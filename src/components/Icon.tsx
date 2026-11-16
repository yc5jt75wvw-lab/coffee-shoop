import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

import { colors } from '../theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** One icon family (Ionicons outline) across the whole app. */
export function Icon({ name, size = 20, color = colors.ink }: { name: IconName; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}
