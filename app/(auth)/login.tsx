import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInputInstance, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Header } from '../../src/components/Header';
import { InfoNote } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { useToast } from '../../src/components/Toast';
import { DEMO_ACCOUNT, finishAuth, nameFromEmail } from '../../src/lib/auth';
import { isEmail } from '../../src/lib/format';
import { useStore } from '../../src/store/StoreProvider';
import { colors, spacing } from '../../src/theme';

/** Screen 3 — Login (demo: any valid e-mail and a 6+ character password). */
export default function LoginScreen() {
  const { actions } = useStore();
  const toast = useToast();
  const passwordRef = useRef<TextInputInstance>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e = email, p = password, name?: string, phone = '') => {
    const next: typeof errors = {};
    if (!isEmail(e)) next.email = 'Введите e-mail в формате name@example.com';
    if (p.length < 6) next.password = 'Пароль — минимум 6 символов';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      actions.signIn({ name: name ?? nameFromEmail(e), email: e.trim(), phone });
      setLoading(false);
      toast.show('Вы вошли в демо-аккаунт');
      finishAuth();
    }, 700);
  };

  return (
    <Screen scroll keyboard header={<Header title="Вход" />}>
      <View style={styles.intro}>
        <AppText variant="display" style={{ fontSize: 28, lineHeight: 36 }} accessibilityRole="header">
          С возвращением
        </AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Войдите, чтобы видеть историю заказов и сохранённые адреса.
        </AppText>
      </View>

      <View style={{ gap: spacing.md }}>
        <TextField
          label="E-mail"
          icon="mail-outline"
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={errors.email}
        />
        <TextField
          ref={passwordRef}
          label="Пароль"
          icon="lock-closed-outline"
          placeholder="Минимум 6 символов"
          secureToggle
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={() => submit()}
          error={errors.password}
        />
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push({ pathname: '/forgot-password', params: { email } })}
          hitSlop={10}
          style={{ alignSelf: 'flex-end' }}
        >
          <AppText variant="bodyStrong" color={colors.primary}>
            Забыли пароль?
          </AppText>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Button title="Войти" loading={loading} onPress={() => submit()} />
        <Button
          title="Войти в демо-аккаунт"
          variant="secondary"
          icon="flash-outline"
          disabled={loading}
          onPress={() => {
            setEmail(DEMO_ACCOUNT.email);
            setPassword(DEMO_ACCOUNT.password);
            submit(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password, DEMO_ACCOUNT.name, DEMO_ACCOUNT.phone);
          }}
        />
        <InfoNote text="Демо-режим: сервера нет, подойдёт любой e-mail и пароль от 6 символов." />
      </View>

      <View style={styles.footer}>
        <AppText variant="body" color={colors.textSecondary}>
          Нет аккаунта?
        </AppText>
        <Pressable accessibilityRole="link" hitSlop={10} onPress={() => router.replace('/register')}>
          <AppText variant="bodyStrong" color={colors.primary}>
            Зарегистрироваться
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 6, marginTop: 8, marginBottom: 28 },
  actions: { gap: 12, marginTop: 28 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 28 },
});
