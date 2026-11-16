import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../../src/components/AppText';
import { Icon, IconName } from '../../src/components/Icon';
import { useHaptics } from '../../src/lib/hooks';
import { useCartCount, useStore } from '../../src/store/StoreProvider';
import { colors, shadow } from '../../src/theme';

type BottomTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const TABS: Record<string, { icon: IconName; active: IconName; label: string }> = {
  home: { icon: 'home-outline', active: 'home', label: 'Главная' },
  favorites: { icon: 'heart-outline', active: 'heart', label: 'Избранное' },
  cart: { icon: 'bag-handle-outline', active: 'bag-handle', label: 'Корзина' },
  notifications: { icon: 'notifications-outline', active: 'notifications', label: 'Уведомления' },
};

/** Figma tab bar: white, rounded top, icon-only with a short caramel marker under the active tab. */
function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const cartCount = useCartCount();
  const unread = useStore().state.notifications.filter((n) => !n.read).length;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, index) => {
        const meta = TABS[route.name];
        if (!meta) return null;
        const focused = state.index === index;
        const badge = route.name === 'cart' ? cartCount : route.name === 'notifications' ? unread : 0;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={badge ? `${meta.label}, ${badge}` : meta.label}
            onPress={() => {
              if (focused) return;
              haptics.select();
              navigateToTab(route.key);
            }}
            style={styles.item}
          >
            <View>
              <Icon name={focused ? meta.active : meta.icon} size={24} color={focused ? colors.primary : '#A2A2A2'} />
              {badge ? (
                <View style={styles.badge}>
                  <AppText variant="micro" color={colors.white} style={styles.badgeText}>
                    {badge > 9 ? '9+' : badge}
                  </AppText>
                </View>
              ) : null}
            </View>
            <View style={[styles.marker, focused && { backgroundColor: colors.primary }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="notifications" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    ...shadow(2),
  },
  item: { flex: 1, alignItems: 'center', gap: 6, minHeight: 44 },
  marker: { width: 10, height: 5, borderRadius: 18, backgroundColor: 'transparent' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 9, lineHeight: 11 },
});
