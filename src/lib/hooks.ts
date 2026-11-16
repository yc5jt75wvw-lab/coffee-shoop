import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { useStore } from '../store/StoreProvider';

/** Re-renders every `intervalMs` so time-based demo statuses stay current. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Haptic feedback that respects the «Тактильный отклик» setting. */
export function useHaptics() {
  const { state } = useStore();
  const enabled = state.settings.haptics && Platform.OS !== 'web';
  return useMemo(
    () => ({
      tap: () => {
        if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      },
      select: () => {
        if (enabled) Haptics.selectionAsync().catch(() => {});
      },
      success: () => {
        if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      },
      warning: () => {
        if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      },
    }),
    [enabled],
  );
}
