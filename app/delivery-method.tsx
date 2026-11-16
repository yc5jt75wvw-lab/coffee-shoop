import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Chip, OptionBox } from '../src/components/Controls';
import { goBack, Header } from '../src/components/Header';
import { BottomBar, ListRow, SectionTitle } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { useToast } from '../src/components/Toast';
import { DELIVERY_OPTIONS, getStore, PICKUP_READY_MINUTES, type DeliverySpeed } from '../src/data/options';
import { formatPrice } from '../src/lib/format';
import { formatAddress, useSelectedAddress, useStore } from '../src/store/StoreProvider';
import type { Checkout } from '../src/store/types';
import { colors, spacing } from '../src/theme';

/** Next half-hour slots, starting at least 45 minutes from now. */
function timeSlots(now = new Date(), count = 8) {
  const start = new Date(now.getTime() + 45 * 60_000);
  start.setSeconds(0, 0);
  const m = start.getMinutes();
  start.setMinutes(m <= 30 ? 30 : 60);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start.getTime() + i * 30 * 60_000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
}

/** Screen 16 — Delivery method: courier or pickup, speed and time. */
export default function DeliveryMethodScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const address = useSelectedAddress();
  const [draft, setDraft] = useState<Pick<Checkout, 'method' | 'speed' | 'schedule'>>({
    method: state.checkout.method,
    speed: state.checkout.speed,
    schedule: state.checkout.schedule,
  });
  const slots = useMemo(() => timeSlots(), []);
  const store = getStore(state.checkout.storeId);
  const set = (p: Partial<typeof draft>) => setDraft((d) => ({ ...d, ...p }));

  const save = () => {
    actions.updateCheckout(draft);
    toast.show('Способ получения сохранён');
    goBack();
  };

  return (
    <Screen
      scroll
      header={<Header title="Способ получения" />}
      footer={
        <BottomBar>
          <Button title="Сохранить" onPress={save} />
        </BottomBar>
      }
    >
      <SectionTitle title="Как получить заказ" style={{ marginTop: 8 }} />
      <View style={{ gap: 12 }}>
        <OptionBox
          icon="bicycle-outline"
          title="Доставка курьером"
          subtitle={address ? formatAddress(address) : 'Нужно добавить адрес'}
          selected={draft.method === 'delivery'}
          onPress={() => set({ method: 'delivery' })}
        />
        <OptionBox
          icon="storefront-outline"
          title="Самовывоз"
          subtitle={`Бесплатно · готово через ${PICKUP_READY_MINUTES} мин`}
          selected={draft.method === 'pickup'}
          onPress={() => set({ method: 'pickup' })}
        />
      </View>

      {draft.method === 'delivery' ? (
        <>
          <SectionTitle title="Скорость" style={styles.section} />
          <View style={{ gap: 12 }}>
            {(Object.keys(DELIVERY_OPTIONS) as DeliverySpeed[]).map((s) => (
              <OptionBox
                key={s}
                title={`${DELIVERY_OPTIONS[s].title} · ${DELIVERY_OPTIONS[s].eta}`}
                subtitle={DELIVERY_OPTIONS[s].description}
                trailing={formatPrice(DELIVERY_OPTIONS[s].fee)}
                selected={draft.speed === s}
                onPress={() => set({ speed: s })}
              />
            ))}
          </View>
          {!address ? (
            <Button title="Добавить адрес" variant="secondary" icon="add" onPress={() => router.push('/addresses/new')} style={{ marginTop: 12 }} />
          ) : null}
        </>
      ) : (
        <>
          <SectionTitle title="Кофейня" style={styles.section} />
          <ListRow
            icon="cafe-outline"
            title={store?.name ?? 'Выберите кофейню'}
            subtitle={store ? `${store.address} · ${store.hours}` : undefined}
            onPress={() => router.push('/pickup-stores')}
            style={styles.storeRow}
          />
        </>
      )}

      <SectionTitle title="Когда" style={styles.section} />
      <View style={styles.wrap}>
        <Chip label="Как можно скорее" icon="flash-outline" tone="white" selected={draft.schedule === 'asap'} onPress={() => set({ schedule: 'asap' })} />
        {slots.map((t) => (
          <Chip key={t} label={t} tone="white" selected={draft.schedule === t} onPress={() => set({ schedule: t })} />
        ))}
      </View>
      <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: 8 }}>
        Время доставки демонстрационное: в демо заказ приезжает примерно за 4 минуты.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  storeRow: {
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
