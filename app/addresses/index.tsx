import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { RadioDot } from '../../src/components/Controls';
import { goBack, Header } from '../../src/components/Header';
import { Icon, IconName } from '../../src/components/Icon';
import { IconButton } from '../../src/components/IconButton';
import { BottomBar, EmptyState } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { addressDetails, formatAddress, useStore } from '../../src/store/StoreProvider';
import { colors, radius } from '../../src/theme';

const labelIcon = (label: string): IconName =>
  label === 'Дом' ? 'home-outline' : label === 'Работа' ? 'briefcase-outline' : 'location-outline';

/** Screen 17 — My addresses: pick the delivery address, edit or add. */
export default function AddressesScreen() {
  const { pick } = useLocalSearchParams<{ pick?: string }>();
  const { state, actions } = useStore();
  const toast = useToast();

  const select = (id: string) => {
    actions.selectAddress(id);
    if (state.checkout.method !== 'delivery') actions.updateCheckout({ method: 'delivery' });
    if (pick) {
      toast.show('Адрес доставки изменён');
      goBack();
    }
  };

  return (
    <Screen
      scroll
      header={
        <Header
          title="Мои адреса"
          right={<IconButton icon="add" accessibilityLabel="Добавить адрес" onPress={() => router.push('/addresses/new')} />}
        />
      }
      footer={
        state.addresses.length ? (
          <BottomBar>
            <Button title="Добавить адрес" icon="add" variant="secondary" onPress={() => router.push('/addresses/new')} />
          </BottomBar>
        ) : null
      }
    >
      {state.addresses.length === 0 ? (
        <EmptyState
          icon="location-outline"
          title="Адресов пока нет"
          text="Добавьте адрес, чтобы курьер знал, куда привезти кофе."
          action={<Button title="Добавить адрес" onPress={() => router.push('/addresses/new')} />}
        />
      ) : (
        <View style={{ gap: 12, marginTop: 4 }}>
          <AppText variant="body" color={colors.textSecondary}>
            {pick ? 'Выберите, куда доставить заказ.' : 'Выбранный адрес используется для доставки.'}
          </AppText>
          {state.addresses.map((a) => {
            const selected = a.id === state.selectedAddressId;
            return (
              <Pressable
                key={a.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${a.label}: ${formatAddress(a)}`}
                onPress={() => select(a.id)}
                style={({ pressed }) => [styles.card, selected && styles.selected, pressed && { opacity: 0.9 }]}
              >
                <View style={[styles.icon, selected && { backgroundColor: colors.white }]}>
                  <Icon name={labelIcon(a.label)} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={styles.titleRow}>
                    <AppText variant="bodyStrong">{a.label}</AppText>
                    {selected ? (
                      <AppText variant="captionStrong" color={colors.primary}>
                        · для доставки
                      </AppText>
                    ) : null}
                  </View>
                  <AppText variant="body">{formatAddress(a)}</AppText>
                  {addressDetails(a) || a.comment ? (
                    <AppText variant="caption" color={colors.textSecondary} numberOfLines={2}>
                      {[addressDetails(a), a.comment].filter(Boolean).join(' · ')}
                    </AppText>
                  ) : null}
                </View>
                <View style={styles.side}>
                  <RadioDot selected={selected} />
                  <IconButton
                    icon="create-outline"
                    size={36}
                    iconSize={18}
                    color={colors.textSecondary}
                    accessibilityLabel={`Изменить адрес ${a.label}`}
                    onPress={() => router.push({ pathname: '/addresses/[id]', params: { id: a.id } })}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  side: { alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 2 },
});
