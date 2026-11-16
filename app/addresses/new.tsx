import React from 'react';

import { AddressForm, EMPTY_ADDRESS } from '../../src/components/AddressForm';
import { goBack, Header } from '../../src/components/Header';
import { InfoNote } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { useToast } from '../../src/components/Toast';
import { useStore } from '../../src/store/StoreProvider';

/** Screen 18 — Add address. */
export default function AddAddressScreen() {
  const { state, actions } = useStore();
  const toast = useToast();

  return (
    <Screen scroll keyboard header={<Header title="Новый адрес" />} contentStyle={{ gap: 16, paddingTop: 4 }}>
      <InfoNote text="Доставляем в пределах Садового кольца и Пресни. Адрес сохраняется только на этом устройстве." icon="map-outline" />
      <AddressForm
        initial={EMPTY_ADDRESS}
        initialDefault={state.addresses.length === 0}
        submitLabel="Сохранить адрес"
        onSubmit={(values, makeDefault) => {
          actions.saveAddress(values, makeDefault);
          if (makeDefault) actions.updateCheckout({ method: 'delivery' });
          toast.show('Адрес сохранён');
          goBack();
        }}
      />
    </Screen>
  );
}
