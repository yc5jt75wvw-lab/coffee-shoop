import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { goBack, Header } from '../src/components/Header';
import { Icon } from '../src/components/Icon';
import { InfoNote, Pill } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { useToast } from '../src/components/Toast';
import { isStoreOpen, PICKUP_READY_MINUTES, STORES } from '../src/data/options';
import { useNow } from '../src/lib/hooks';
import { useStore } from '../src/store/StoreProvider';
import { colors, radius, spacing } from '../src/theme';

/** Screen 20 — Pickup stores: choose where to collect the order. */
export default function PickupStoresScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const now = useNow(60_000);

  const choose = (id: string, name: string) => {
    actions.updateCheckout({ storeId: id, method: 'pickup' });
    toast.show(`Самовывоз: ${name}`);
    goBack();
  };

  return (
    <Screen scroll header={<Header title="Кофейни для самовывоза" />}>
      <InfoNote
        text={`Заказ будет готов примерно через ${PICKUP_READY_MINUTES} минут. Назовите номер заказа бариста на стойке выдачи.`}
        icon="time-outline"
      />
      <View style={{ gap: spacing.md, marginTop: spacing.md }}>
        {STORES.map((s) => {
          const selected = state.checkout.storeId === s.id;
          const open = isStoreOpen(s, new Date(now));
          return (
            <Pressable
              key={s.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${s.name}, ${s.address}, ${open ? 'открыто' : 'закрыто'}`}
              onPress={() => choose(s.id, s.name)}
              style={({ pressed }) => [styles.card, selected && styles.selected, pressed && { opacity: 0.92 }]}
            >
              <Image source={s.image} style={styles.image} contentFit="cover" />
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <AppText variant="section" style={{ flex: 1 }} numberOfLines={1}>
                    {s.name}
                  </AppText>
                  <Pill label={open ? 'Открыто' : 'Закрыто'} tone={open ? 'success' : 'neutral'} />
                </View>
                <View style={styles.meta}>
                  <Icon name="location-outline" size={14} color={colors.textSecondary} />
                  <AppText variant="caption" color={colors.textSecondary}>
                    {s.address} · {s.distanceKm.toString().replace('.', ',')} км
                  </AppText>
                </View>
                <View style={styles.meta}>
                  <Icon name="time-outline" size={14} color={colors.textSecondary} />
                  <AppText variant="caption" color={colors.textSecondary}>
                    Ежедневно {s.hours}
                    {open ? '' : ' · заказ приготовят к открытию'}
                  </AppText>
                </View>
                <Button
                  title={selected ? 'Выбрано' : 'Забрать здесь'}
                  icon={selected ? 'checkmark' : undefined}
                  variant={selected ? 'primary' : 'secondary'}
                  size="md"
                  onPress={() => choose(s.id, s.name)}
                  style={{ marginTop: 12 }}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  selected: { borderColor: colors.primary },
  image: { width: '100%', height: 128 },
  body: { padding: 14, gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
