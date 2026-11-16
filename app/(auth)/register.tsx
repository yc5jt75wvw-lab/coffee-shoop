import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Checkbox } from '../../src/components/Controls';
import { Header } from '../../src/components/Header';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { useToast } from '../../src/components/Toast';
import { finishAuth } from '../../src/lib/auth';
import { formatPhone, isEmail, isPhone } from '../../src/lib/format';
import { useStore } from '../../src/store/StoreProvider';
import { colors, spacing } from '../../src/theme';

type Form = { name: string; email: string; phone: string; password: string; confirm: string };
type Errors = Partial<Record<keyof Form | 'terms', string>>;

/** Screen 4 — Register (creates a demo profile on the device). */
export default function RegisterScreen() {
  const { actions } = useStore();
  const toast = useToast();
  const [form, setForm] = useState<Form>({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: k === 'phone' ? formatPhone(v) : v }));

  const submit = () => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = 'Как к вам обращаться?';
    if (!isEmail(form.email)) e.email = 'Введите e-mail в формате name@example.com';
    if (!isPhone(form.phone)) e.phone = 'Номер из 11 цифр, например +7 999 123-45-67';
    if (form.password.length < 6) e.password = 'Пароль — минимум 6 символов';
    if (form.confirm !== form.password) e.confirm = 'Пароли не совпадают';
    if (!terms) e.terms = 'Нужно согласие с условиями';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      actions.signIn({ name: form.name.trim(), email: form.email.trim(), phone: form.phone });
      setLoading(false);
      toast.show('Демо-аккаунт создан');
      finishAuth();
    }, 800);
  };

  return (
    <Screen scroll keyboard header={<Header title="Регистрация" />}>
      <View style={styles.intro}>
        <AppText variant="display" style={{ fontSize: 28, lineHeight: 36 }} accessibilityRole="header">
          Создайте аккаунт
        </AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Сохраним адреса, избранное и историю заказов.
        </AppText>
      </View>

      <View style={{ gap: spacing.md }}>
        <TextField label="Имя" icon="person-outline" placeholder="Анна" autoComplete="name" textContentType="name" value={form.name} onChangeText={set('name')} error={errors.name} />
        <TextField
          label="E-mail"
          icon="mail-outline"
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={form.email}
          onChangeText={set('email')}
          error={errors.email}
        />
        <TextField
          label="Телефон"
          icon="call-outline"
          placeholder="+7 999 123-45-67"
          keyboardType="phone-pad"
          autoComplete="tel"
          value={form.phone}
          onChangeText={set('phone')}
          error={errors.phone}
        />
        <TextField label="Пароль" icon="lock-closed-outline" placeholder="Минимум 6 символов" secureToggle value={form.password} onChangeText={set('password')} error={errors.password} />
        <TextField label="Повторите пароль" icon="lock-closed-outline" placeholder="Ещё раз" secureToggle value={form.confirm} onChangeText={set('confirm')} error={errors.confirm} />
        <View>
          <Checkbox checked={terms} onChange={setTerms}>
            <AppText variant="caption" color={colors.textSecondary}>
              Я согласен с условиями демо-версии: данные хранятся только на этом устройстве и никуда не отправляются.
            </AppText>
          </Checkbox>
          {errors.terms ? (
            <AppText variant="caption" color={colors.danger}>
              {errors.terms}
            </AppText>
          ) : null}
        </View>
      </View>

      <Button title="Создать аккаунт" loading={loading} onPress={submit} style={{ marginTop: 24 }} />

      <View style={styles.footer}>
        <AppText variant="body" color={colors.textSecondary}>
          Уже есть аккаунт?
        </AppText>
        <Pressable accessibilityRole="link" hitSlop={10} onPress={() => router.replace('/login')}>
          <AppText variant="bodyStrong" color={colors.primary}>
            Войти
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 6, marginTop: 8, marginBottom: 24 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 },
});
