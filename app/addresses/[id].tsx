import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { AddressForm } from '../../src/components/AddressForm';
import { Button } from '../../src/components/Button';
import { goBack, Header } from '../../src/components/Header';
import { EmptyState } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { confirmAction } from '../../src/lib/confirm';
import { useStore } from '../../src/store/StoreProvider';

/** Screen 19 — Edit address (with delete). */
export default function EditAddressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = useStore();
  const toast = useToast();
  const address = state.addresses.find((a) => a.id === id);

  if (!address) {
    return (
      <Screen header={<Header title="Адрес" />}>
        <EmptyState
          icon="location-outline"
          title="Адрес не найден"
          text="Возможно, он уже удалён."
          action={<Button title="К списку адресов" onPress={() => router.replace('/addresses')} />}
        />
      </Screen>
    );
  }

  const remove = () =>
    confirmAction({
      title: 'Удалить адрес?',
      message: `«${address.label}: ${address.street}» будет удалён без возможности восстановления.`,
      confirmText: 'Удалить',
      destructive: true,
      onConfirm: () => {
        actions.deleteAddress(address.id);
        toast.show('Адрес удалён');
        goBack();
      },
    });

  const { id: _id, ...initial } = address;

  return (
    <Screen scroll keyboard header={<Header title="Изменить адрес" />} contentStyle={{ paddingTop: 4 }}>
      <AddressForm
        initial={initial}
        initialDefault={state.selectedAddressId === address.id}
        submitLabel="Сохранить изменения"
        onSubmit={(values, makeDefault) => {
          actions.saveAddress({ ...values, id: address.id }, makeDefault);
          toast.show('Изменения сохранены');
          goBack();
        }}
        footer={<Button title="Удалить адрес" variant="danger" icon="trash-outline" onPress={remove} />}
      />
    </Screen>
  );
}
