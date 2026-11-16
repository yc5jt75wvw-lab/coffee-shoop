import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, shadow } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

type ToastOptions = { action?: string; onAction?: () => void; tone?: 'default' | 'error' };
type ToastState = { message: string } & ToastOptions;

const ToastContext = createContext<{ show: (message: string, opts?: ToastOptions) => void } | null>(null);

/** Snackbar-style transient feedback, raised above the tab bar. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setToast(null));
  }, [anim]);

  const show = useCallback(
    (message: string, opts?: ToastOptions) => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, ...opts });
      AccessibilityInfo.announceForAccessibility(message);
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      timer.current = setTimeout(hide, opts?.action ? 3800 : 2400);
    },
    [anim, hide],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.wrap,
            {
              bottom: insets.bottom + 96,
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            },
          ]}
        >
          <View style={styles.toast} accessibilityLiveRegion="polite">
            <Icon
              name={toast.tone === 'error' ? 'alert-circle' : 'checkmark-circle'}
              size={18}
              color={toast.tone === 'error' ? '#FF8A8A' : '#7FD8A8'}
            />
            <AppText variant="bodyMedium" color={colors.white} style={{ flex: 1 }} numberOfLines={2}>
              {toast.message}
            </AppText>
            {toast.action ? (
              <Pressable
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => {
                  hide();
                  toast.onAction?.();
                }}
              >
                <AppText variant="bodyStrong" color={colors.primaryBorder}>
                  {toast.action}
                </AppText>
              </Pressable>
            ) : null}
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.dark,
    ...shadow(2),
  },
});
