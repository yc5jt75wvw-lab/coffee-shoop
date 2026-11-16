import Constants from 'expo-constants';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Toggle } from '../src/components/Controls';
import { Header } from '../src/components/Header';
import { Divider, ListRow } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { useToast } from '../src/components/Toast';
import { getPaymentMethod } from '../src/data/options';
import { confirmAction } from '../src/lib/confirm';
import { formatAddress, useSelectedAddress, useStore } from '../src/store/StoreProvider';
import { colors, radius, spacing } from '../src/theme';

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <AppText variant="bodyStrong" color={colors.textSecondary} style={{ marginBottom: 8 }} accessibilityRole="header">
        {title}
      </AppText>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

/** Screen 30 — Settings (persisted in AsyncStorage). */
export default function SettingsScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const address = useSelectedAddress();
  const s = state.settings;
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const reset = () =>
    confirmAction({
      title: 'Сбросить демо-данные?',
      message: 'Корзина, избранное, адреса, заказы, уведомления и настройки вернутся к исходному состоянию.',
      confirmText: 'Сбросить',
      destructive: true,
      onConfirm: async () => {
        await actions.resetDemo();
        if (router.canDismiss()) router.dismissAll();
        router.replace('/');
      },
    });

  return (
    <Screen scroll header={<Header title="Настройки" />}>
      <Group title="Уведомления">
        <ListRow
          icon="bag-check-outline"
          title="Статусы заказов"
          subtitle="Принят, готовится, в пути, доставлен"
          right={<Toggle value={s.orderNotifications} onChange={(v) => actions.updateSettings({ orderNotifications: v })} label="Статусы заказов" />}
        />
        <Divider />
        <ListRow
          icon="pricetag-outline"
          title="Акции и предложения"
          subtitle="Промокоды и новинки меню"
          right={<Toggle value={s.promoNotifications} onChange={(v) => actions.updateSettings({ promoNotifications: v })} label="Акции и предложения" />}
        />
      </Group>

      <Group title="Приложение">
        <ListRow
          icon="phone-portrait-outline"
          title="Тактильный отклик"
          subtitle="Лёгкая вибрация при нажатиях"
          right={<Toggle value={s.haptics} onChange={(v) => actions.updateSettings({ haptics: v })} label="Тактильный отклик" />}
        />
        <Divider />
        <ListRow
          icon="time-outline"
          title="История поиска"
          subtitle={s.saveSearchHistory ? `Сохранено запросов: ${state.recentSearches.length}` : 'Не сохраняется'}
          right={<Toggle value={s.saveSearchHistory} onChange={(v) => actions.updateSettings({ saveSearchHistory: v })} label="Сохранять историю поиска" />}
        />
        <Divider />
        <ListRow icon="language-outline" title="Язык" right={<AppText variant="body" color={colors.textSecondary}>Русский</AppText>} />
        <Divider />
        <ListRow icon="cash-outline" title="Валюта" right={<AppText variant="body" color={colors.textSecondary}>USD ($)</AppText>} />
      </Group>

      <Group title="Заказ по умолчанию">
        <ListRow
          icon={state.checkout.method === 'delivery' ? 'bicycle-outline' : 'storefront-outline'}
          title="Способ получения"
          subtitle={state.checkout.method === 'delivery' ? 'Доставка курьером' : 'Самовывоз'}
          onPress={() => router.push('/delivery-method')}
        />
        <Divider />
        <ListRow icon="location-outline" title="Адрес доставки" subtitle={address ? formatAddress(address) : 'Не выбран'} onPress={() => router.push('/addresses')} />
        <Divider />
        <ListRow icon="card-outline" title="Оплата" subtitle={getPaymentMethod(state.checkout.paymentMethod).title} onPress={() => router.push('/payment-methods')} />
      </Group>

      <Group title="Данные">
        <ListRow
          icon="trash-outline"
          title="Очистить историю поиска"
          chevron={false}
          onPress={() => {
            actions.clearRecentSearches();
            toast.show('История поиска очищена');
          }}
        />
        <Divider />
        <ListRow icon="refresh-circle-outline" title="Сбросить демо-данные" danger chevron={false} onPress={reset} />
      </Group>

      <AppText variant="caption" color={colors.textSecondary} align="center" style={{ marginTop: spacing.lg }}>
        Кофейня {version} · демо-версия без сервера.{'\n'}Все данные хранятся только на этом устройстве.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
