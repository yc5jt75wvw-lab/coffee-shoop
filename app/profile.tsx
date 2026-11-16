import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Header } from '../src/components/Header';
import { IconButton } from '../src/components/IconButton';
import { Avatar, Divider, ListRow } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { TextField } from '../src/components/TextField';
import { useToast } from '../src/components/Toast';
import { confirmAction } from '../src/lib/confirm';
import { formatPhone, formatPrice, initials, isPhone } from '../src/lib/format';
import { useNow } from '../src/lib/hooks';
import { isActive } from '../src/lib/orderStatus';
import { useStore } from '../src/store/StoreProvider';
import { colors, radius, spacing } from '../src/theme';

/** Screen 29 — Profile: account, stats and shortcuts. */
export default function ProfileScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const now = useNow(10_000);
  const user = state.user;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [error, setError] = useState<string | null>(null);
  const active = state.orders.filter((o) => isActive(o, now)).length;

  const save = () => {
    if (name.trim().length < 2) return setError('Имя — минимум 2 символа');
    if (phone && !isPhone(phone)) return setError('Телефон из 11 цифр, например +7 999 123-45-67');
    actions.updateProfile({ name: name.trim(), phone });
    setError(null);
    setEditing(false);
    toast.show('Профиль обновлён');
  };

  const signOut = () =>
    confirmAction({
      title: 'Выйти из аккаунта?',
      message: 'Корзина, адреса и история заказов останутся на устройстве.',
      confirmText: 'Выйти',
      destructive: true,
      onConfirm: () => {
        actions.signOut();
        if (router.canDismiss()) router.dismissAll();
        router.replace('/welcome');
      },
    });

  return (
    <Screen
      scroll
      keyboard
      header={
        <Header title="Профиль" right={<IconButton icon="settings-outline" accessibilityLabel="Настройки" onPress={() => router.push('/settings')} />} />
      }
    >
      <View style={styles.card}>
        <View style={styles.identity}>
          <Avatar label={user ? initials(user.name) : 'Г'} size={64} />
          <View style={{ flex: 1 }}>
            <AppText variant="title" color={colors.white} numberOfLines={1}>
              {user?.name ?? 'Гость'}
            </AppText>
            <AppText variant="caption" color={colors.onDarkSecondary} numberOfLines={1}>
              {user ? [user.email, user.phone].filter(Boolean).join(' · ') : 'Войдите, чтобы сохранить профиль'}
            </AppText>
          </View>
          {user && !editing ? (
            <IconButton icon="create-outline" color={colors.white} accessibilityLabel="Изменить профиль" onPress={() => setEditing(true)} />
          ) : null}
        </View>
        <View style={styles.stats}>
          {[
            { label: 'Заказов', value: String(state.orders.length) },
            { label: 'В избранном', value: String(state.favorites.length) },
            { label: 'Демо-кошелёк', value: formatPrice(state.walletBalance) },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <AppText variant="number" color={colors.white}>
                {s.value}
              </AppText>
              <AppText variant="caption" color={colors.onDarkSecondary}>
                {s.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {!user ? (
        <Button title="Войти или зарегистрироваться" onPress={() => router.push('/login')} style={{ marginTop: spacing.md }} />
      ) : null}

      {editing ? (
        <View style={styles.edit}>
          <TextField label="Имя" value={name} onChangeText={setName} autoComplete="name" />
          <TextField label="Телефон" value={phone} onChangeText={(t) => setPhone(formatPhone(t))} keyboardType="phone-pad" placeholder="+7 999 123-45-67" />
          {error ? (
            <AppText variant="caption" color={colors.danger}>
              {error}
            </AppText>
          ) : null}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button title="Отмена" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setEditing(false)} />
            <Button title="Сохранить" size="md" style={{ flex: 1 }} onPress={save} />
          </View>
        </View>
      ) : null}

      <View style={styles.menu}>
        <ListRow icon="receipt-outline" title="Мои заказы" subtitle={active ? `Активных: ${active}` : 'История и повтор заказа'} onPress={() => router.push('/orders')} />
        <Divider />
        <ListRow icon="location-outline" title="Мои адреса" subtitle={`Сохранено: ${state.addresses.length}`} onPress={() => router.push('/addresses')} />
        <Divider />
        <ListRow icon="card-outline" title="Способы оплаты" subtitle="Демо-оплата без реальных карт" onPress={() => router.push('/payment-methods')} />
        <Divider />
        <ListRow icon="pricetags-outline" title="Промокоды" onPress={() => router.push('/promo-codes')} />
        <Divider />
        <ListRow icon="heart-outline" title="Избранное" onPress={() => router.navigate('/favorites')} />
        <Divider />
        <ListRow icon="notifications-outline" title="Уведомления" onPress={() => router.navigate('/notifications')} />
        <Divider />
        <ListRow icon="settings-outline" title="Настройки" onPress={() => router.push('/settings')} />
      </View>

      {user ? (
        <View style={[styles.menu, { marginTop: spacing.md }]}>
          <ListRow icon="log-out-outline" title="Выйти" danger chevron={false} onPress={signOut} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.dark, borderRadius: radius.lg, padding: 16, marginTop: 4, gap: 16 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, padding: 10, borderRadius: radius.md, backgroundColor: '#3C3C3C' },
  edit: { gap: 12, marginTop: spacing.md },
  menu: {
    marginTop: spacing.lg,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
