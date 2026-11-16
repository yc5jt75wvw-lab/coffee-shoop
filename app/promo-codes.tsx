import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Header } from '../src/components/Header';
import { Icon } from '../src/components/Icon';
import { Pill, SectionTitle } from '../src/components/Layout';
import { Screen } from '../src/components/Screen';
import { TextField } from '../src/components/TextField';
import { useToast } from '../src/components/Toast';
import { getPromo, PROMO_CODES } from '../src/data/options';
import { evaluatePromo, itemUnitPrice } from '../src/lib/pricing';
import { useStore } from '../src/store/StoreProvider';
import { colors, fonts, radius, spacing } from '../src/theme';

/** Screen 21 — Promo codes: enter a code or pick one of the demo offers. */
export default function PromoCodesScreen() {
  const params = useLocalSearchParams<{ code?: string }>();
  const { state, actions } = useStore();
  const toast = useToast();
  const [input, setInput] = useState(params.code ?? '');
  const [error, setError] = useState<string | null>(null);
  const applied = state.checkout.promoCode;

  const priced = useMemo(() => state.cart.map((i) => ({ price: itemUnitPrice(i), qty: i.qty })), [state.cart]);
  const check = (code: string) => evaluatePromo(code, priced, state.checkout.method);

  const apply = (raw: string) => {
    const promo = getPromo(raw);
    if (!promo) {
      setError('Такого промокода нет. Проверьте написание.');
      return;
    }
    setError(null);
    setInput('');
    actions.updateCheckout({ promoCode: promo.code });
    const result = check(promo.code);
    if (!state.cart.length) toast.show(`${promo.code} сохранён — сработает при оформлении заказа`);
    else if (result?.ok) toast.show(`Промокод ${promo.code} применён`);
    else toast.show(`${promo.code}: ${result?.reason}`, { tone: 'error' });
  };

  return (
    <Screen scroll keyboard header={<Header title="Промокоды" />}>
      <View style={styles.inputRow}>
        <TextField
          placeholder="Введите промокод"
          icon="pricetag-outline"
          autoCapitalize="characters"
          autoCorrect={false}
          value={input}
          onChangeText={(t) => {
            setInput(t.toUpperCase());
            setError(null);
          }}
          onSubmitEditing={() => apply(input)}
          error={error}
          containerStyle={{ flex: 1 }}
          returnKeyType="done"
        />
        <Button title="Применить" size="md" disabled={!input.trim()} onPress={() => apply(input)} style={{ height: 52 }} />
      </View>

      {applied ? (
        <View style={styles.applied}>
          <Icon name="checkmark-circle" size={22} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <AppText variant="bodyStrong">Выбран {applied}</AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {!state.cart.length
                ? 'Сработает, когда в корзине появятся напитки'
                : check(applied)?.ok
                  ? 'Скидка учтена в заказе'
                  : check(applied)?.reason}
            </AppText>
          </View>
          <Button title="Убрать" variant="ghost" size="sm" onPress={() => actions.updateCheckout({ promoCode: null })} />
        </View>
      ) : null}

      <SectionTitle title="Доступные предложения" style={{ marginTop: spacing.lg }} />
      <View style={{ gap: 12 }}>
        {PROMO_CODES.map((p) => {
          const isApplied = applied === p.code;
          const res = state.cart.length ? check(p.code) : null;
          return (
            <View key={p.code} style={[styles.ticket, isApplied && { borderColor: colors.primary }]}>
              <View style={styles.ticketHead}>
                <View style={styles.code}>
                  <AppText variant="bodyStrong" color={colors.primary} style={{ fontFamily: fonts.numSemibold, letterSpacing: 0.5 }}>
                    {p.code}
                  </AppText>
                </View>
                {res ? <Pill label={res.ok ? 'Подходит' : 'Условие не выполнено'} tone={res.ok ? 'success' : 'neutral'} /> : null}
              </View>
              <AppText variant="section" style={{ marginTop: 10 }}>
                {p.title}
              </AppText>
              <AppText variant="body" color={colors.textSecondary}>
                {p.description}
              </AppText>
              <View style={styles.ticketFoot}>
                <AppText variant="caption" color={colors.textSecondary} style={{ flex: 1 }}>
                  {res && !res.ok ? res.reason : p.condition}
                </AppText>
                <Button
                  title={isApplied ? 'Применён' : 'Применить'}
                  icon={isApplied ? 'checkmark' : undefined}
                  variant={isApplied ? 'primary' : 'secondary'}
                  size="sm"
                  onPress={() => (isApplied ? actions.updateCheckout({ promoCode: null }) : apply(p.code))}
                />
              </View>
            </View>
          );
        })}
      </View>
      <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
        В заказе действует один промокод. Предложения демонстрационные.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
  applied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.md,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  ticket: {
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primaryBorder,
    backgroundColor: colors.surface,
  },
  ticketHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  code: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: colors.primarySoft },
  ticketFoot: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
});
