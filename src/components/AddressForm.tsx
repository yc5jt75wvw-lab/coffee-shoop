import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Address } from '../store/types';
import { colors, spacing } from '../theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Chip, Toggle } from './Controls';
import { TextField } from './TextField';

type Values = Omit<Address, 'id'>;

const LABELS = [
  { value: 'Дом', icon: 'home-outline' as const },
  { value: 'Работа', icon: 'briefcase-outline' as const },
  { value: 'Другое', icon: 'location-outline' as const },
];

export const EMPTY_ADDRESS: Values = {
  label: 'Дом',
  street: '',
  apartment: '',
  entrance: '',
  floor: '',
  intercom: '',
  comment: '',
};

/** Shared form for Add Address and Edit Address. */
export function AddressForm({
  initial,
  initialDefault,
  submitLabel,
  onSubmit,
  footer,
}: {
  initial: Values;
  initialDefault: boolean;
  submitLabel: string;
  onSubmit: (values: Values, makeDefault: boolean) => void;
  footer?: React.ReactNode;
}) {
  const [v, setV] = useState<Values>(initial);
  const [makeDefault, setMakeDefault] = useState(initialDefault);
  const [customLabel, setCustomLabel] = useState(LABELS.some((l) => l.value === initial.label) ? '' : initial.label);
  const [error, setError] = useState<string | null>(null);
  const isOther = !['Дом', 'Работа'].includes(v.label);
  const set = (k: keyof Values) => (text: string) => setV((s) => ({ ...s, [k]: text }));

  const submit = () => {
    const street = v.street.trim();
    if (street.length < 5 || !/\d/.test(street)) {
      setError('Укажите улицу и номер дома, например «ул. Тверская, 12»');
      return;
    }
    setError(null);
    const label = isOther ? customLabel.trim() || 'Другое' : v.label;
    onSubmit(
      {
        ...v,
        label,
        street,
        apartment: v.apartment.trim(),
        entrance: v.entrance.trim(),
        floor: v.floor.trim(),
        intercom: v.intercom.trim(),
        comment: v.comment.trim(),
      },
      makeDefault,
    );
  };

  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ gap: 8 }}>
        <AppText variant="captionStrong">Название</AppText>
        <View style={styles.row}>
          {LABELS.map((l) => (
            <Chip
              key={l.value}
              label={l.value}
              icon={l.icon}
              tone="white"
              selected={l.value === 'Другое' ? isOther : v.label === l.value}
              onPress={() => setV((s) => ({ ...s, label: l.value }))}
            />
          ))}
        </View>
        {isOther ? (
          <TextField placeholder="Например: Дача, Мама" value={customLabel} onChangeText={setCustomLabel} maxLength={24} />
        ) : null}
      </View>

      <TextField
        label="Улица и дом"
        icon="location-outline"
        placeholder="ул. Тверская, 12"
        value={v.street}
        onChangeText={set('street')}
        error={error}
        autoCapitalize="sentences"
        textContentType="streetAddressLine1"
      />
      <View style={styles.row}>
        <TextField label="Кв. / офис" placeholder="45" value={v.apartment} onChangeText={set('apartment')} containerStyle={styles.cell} />
        <TextField label="Подъезд" placeholder="2" keyboardType="number-pad" value={v.entrance} onChangeText={set('entrance')} containerStyle={styles.cell} />
      </View>
      <View style={styles.row}>
        <TextField label="Этаж" placeholder="5" keyboardType="number-pad" value={v.floor} onChangeText={set('floor')} containerStyle={styles.cell} />
        <TextField label="Домофон" placeholder="45К" value={v.intercom} onChangeText={set('intercom')} containerStyle={styles.cell} />
      </View>
      <TextField
        label="Комментарий курьеру"
        placeholder="Например: шлагбаум со двора"
        value={v.comment}
        onChangeText={set('comment')}
        multiline
        maxLength={160}
      />

      <View style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong">Основной адрес</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Будет выбран для доставки по умолчанию
          </AppText>
        </View>
        <Toggle value={makeDefault} onChange={setMakeDefault} label="Основной адрес" />
      </View>

      <Button title={submitLabel} onPress={submit} />
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  cell: { flex: 1, minWidth: 120 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
});
