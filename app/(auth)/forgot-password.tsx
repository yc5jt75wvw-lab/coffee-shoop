import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { goBack, Header } from '../../src/components/Header';
import { Icon } from '../../src/components/Icon';
import { InfoNote } from '../../src/components/Layout';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { isEmail } from '../../src/lib/format';
import { colors, spacing } from '../../src/theme';

const COOLDOWN = 30;

/** Screen 5 — Forgot password (demo: shows the confirmation, sends nothing). */
export default function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send = () => {
    if (!isEmail(email)) {
      setError('Введите e-mail, на который зарегистрирован аккаунт');
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSentTo(email.trim());
      setCooldown(COOLDOWN);
    }, 900);
  };

  return (
    <Screen scroll keyboard header={<Header title="Восстановление пароля" />}>
      {sentTo ? (
        <View style={styles.sent}>
          <View style={styles.badge}>
            <Icon name="mail-open-outline" size={40} color={colors.primary} />
          </View>
          <AppText variant="title" align="center" accessibilityRole="header">
            Проверьте почту
          </AppText>
          <AppText variant="body" color={colors.textSecondary} align="center">
            Ссылка для сброса пароля ушла бы на{' '}
            <AppText variant="bodyStrong">{sentTo}</AppText>. В демо-версии письма не отправляются — просто
            войдите с любым паролем от 6 символов.
          </AppText>
          <View style={{ alignSelf: 'stretch', gap: 12, marginTop: 16 }}>
            <Button title="Вернуться ко входу" onPress={() => (router.canGoBack() ? goBack() : router.replace('/login'))} />
            <Button
              title={cooldown > 0 ? `Отправить ещё раз через ${cooldown} с` : 'Отправить ещё раз'}
              variant="secondary"
              disabled={cooldown > 0}
              onPress={send}
            />
            <Button title="Изменить e-mail" variant="ghost" size="md" onPress={() => setSentTo(null)} />
          </View>
        </View>
      ) : (
        <View style={{ gap: spacing.lg, marginTop: 8 }}>
          <View style={{ gap: 6 }}>
            <AppText variant="display" style={{ fontSize: 28, lineHeight: 36 }} accessibilityRole="header">
              Забыли пароль?
            </AppText>
            <AppText variant="body" color={colors.textSecondary}>
              Укажите e-mail аккаунта — пришлём ссылку для создания нового пароля.
            </AppText>
          </View>
          <TextField
            label="E-mail"
            icon="mail-outline"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoFocus={!email}
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={send}
            error={error}
          />
          <Button title="Отправить ссылку" loading={loading} onPress={send} />
          <InfoNote text="Демо-режим: письма не отправляются, восстановление только имитируется." />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sent: { alignItems: 'center', gap: 10, paddingTop: 32 },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
