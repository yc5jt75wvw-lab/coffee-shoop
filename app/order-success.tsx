import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, BackHandler, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Card, EmptyState, SummaryRow } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { getPaymentMethod, getStore, PICKUP_READY_MINUTES, DELIVERY_OPTIONS } from '../src/data/options';
import { formatPrice, formatTime } from '../src/lib/format';
import { homeThen, resetToHome } from '../src/lib/nav';
import { useStore } from '../src/store/StoreProvider';
import { colors, spacing } from '../src/theme';

function SuccessMark() {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) {
        scale.setValue(1);
        opacity.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 520, easing: Easing.out(Easing.exp), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  }, [scale, opacity]);
  return (
    <Animated.View style={{ transform: [{ scale }], opacity }} accessible accessibilityLabel="Заказ оформлен">
      <Svg width={168} height={168} viewBox="0 0 168 168">
        <Circle cx={84} cy={84} r={84} fill={colors.primarySoft} />
        <Circle cx={84} cy={84} r={62} fill="#F2DFD2" />
        <Circle cx={84} cy={84} r={42} fill={colors.primary} />
        <Path d="M66 85 L79 98 L103 72" stroke={colors.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    </Animated.View>
  );
}

/** Screen 24 — Order success. */
export default function OrderSuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useStore();
  const order = state.orders.find((o) => o.id === id);

  // Android back from here should not return to the paid checkout.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        resetToHome();
        return true;
      });
      return () => sub.remove();
    }, []),
  );

  if (!order) {
    return (
      <Screen>
        <EmptyState
          icon="receipt-outline"
          title="Заказ не найден"
          text="Откройте историю заказов, чтобы найти его."
          action={<Button title="На главную" onPress={resetToHome} />}
        />
      </Screen>
    );
  }

  const delivery = order.method === 'delivery';
  const minutes = delivery ? DELIVERY_OPTIONS[order.speed].minutes : PICKUP_READY_MINUTES;
  const readyAt = order.schedule !== 'asap' ? order.schedule : formatTime(order.createdAt + minutes * 60_000);

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.root}>
      <View style={styles.hero}>
        <SuccessMark />
        <AppText variant="title" align="center" accessibilityRole="header" style={{ marginTop: 24 }}>
          Заказ оформлен!
        </AppText>
        <AppText variant="body" color={colors.textSecondary} align="center" style={{ maxWidth: 300 }}>
          {delivery
            ? `Заказ №${order.number} уже готовят. Курьер привезёт его примерно к ${readyAt}.`
            : `Заказ №${order.number} будет ждать вас в «${getStore(order.storeId)?.name}» к ${readyAt}.`}
        </AppText>
      </View>

      <Card style={{ gap: 2 }}>
        <SummaryRow label="Номер заказа" value={`№${order.number}`} />
        <SummaryRow label="Оплата" value={getPaymentMethod(order.paymentMethod).title} />
        <SummaryRow label="Итого" value={formatPrice(order.totals.total)} strong />
      </Card>

      <View style={styles.actions}>
        {delivery ? (
          <Button
            title="Отследить заказ"
            icon="navigate-outline"
            onPress={() => homeThen(() => router.push({ pathname: '/tracking/[id]', params: { id: order.id } }))}
          />
        ) : (
          <Button
            title="Детали заказа"
            icon="receipt-outline"
            onPress={() => homeThen(() => router.push({ pathname: '/orders/[id]', params: { id: order.id } }))}
          />
        )}
        <Button title="На главную" variant="secondary" onPress={resetToHome} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { justifyContent: 'space-between', paddingVertical: spacing.lg },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  actions: { gap: 12, marginTop: spacing.lg },
});
