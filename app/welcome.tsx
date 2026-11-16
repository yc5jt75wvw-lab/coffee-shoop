import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Icon, IconName } from '../src/components/Icon';
import { useStore } from '../src/store/StoreProvider';
import { colors, radius, spacing } from '../src/theme';

const PERKS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'bicycle-outline', title: 'Доставка за 30 минут', text: 'Горячим довезём в пределах трёх километров' },
  { icon: 'storefront-outline', title: 'Самовывоз без очереди', text: 'Закажите заранее — заберёте на стойке' },
  { icon: 'pricetag-outline', title: 'Промокоды и подарки', text: 'Второй напиток в подарок по TWOFORONE' },
];

/** Screen 2 — Welcome: choose sign in, sign up or guest mode. */
export default function WelcomeScreen() {
  const { actions } = useStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#111111', '#313131']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 24 }]}>
          <Image source={require('../assets/images/beans.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={['rgba(17,17,17,0.55)', 'rgba(17,17,17,0.95)']} style={StyleSheet.absoluteFill} />
          <View style={styles.mark}>
            <Icon name="cafe" size={28} color={colors.white} />
          </View>
          <AppText variant="display" color={colors.white} style={{ marginTop: 20 }} accessibilityRole="header">
            Кофейня
          </AppText>
          <AppText variant="body" color={colors.onDarkSecondary} style={{ marginTop: 4, maxWidth: 260 }}>
            Свежая обжарка, рисунок на пене и доставка до двери.
          </AppText>
        </LinearGradient>

        <View style={styles.body}>
          {PERKS.map((p) => (
            <View key={p.title} style={styles.perk}>
              <View style={styles.perkIcon}>
                <Icon name={p.icon} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{p.title}</AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {p.text}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <Button title="Войти" onPress={() => router.push('/login')} />
          <Button title="Создать аккаунт" variant="secondary" onPress={() => router.push('/register')} />
          <Button
            title="Продолжить без входа"
            variant="ghost"
            size="md"
            onPress={() => {
              actions.continueAsGuest();
              router.replace('/home');
            }}
          />
          <AppText variant="caption" color={colors.textSecondary} align="center">
            Демо-версия: аккаунт хранится только на этом устройстве.
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    minHeight: 300,
    justifyContent: 'flex-end',
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: spacing.gutter, paddingTop: 28, gap: 18, flexGrow: 1 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  perkIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { paddingHorizontal: spacing.gutter, paddingTop: 28, gap: 12 },
});
