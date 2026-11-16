import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { useStore } from '../src/store/StoreProvider';
import { colors, spacing } from '../src/theme';

/** Screen 1 — Onboarding (Figma «High-Fidelity Onboarding»). */
export default function OnboardingScreen() {
  const { state, actions } = useStore();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  if (state.onboardingSeen) {
    return <Redirect href={state.user || state.guest ? '/home' : '/welcome'} />;
  }

  const imageHeight = Math.round(height * 0.66);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/onboarding.jpg')}
        style={[styles.image, { height: imageHeight }]}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)', '#000']}
        locations={[0, 0.55, 1]}
        style={[styles.fade, { top: imageHeight - 240, height: 240 }]}
      />
      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 16) + 24 }]}>
        <AppText variant="display" color={colors.white} align="center" accessibilityRole="header">
          Влюбитесь в кофе с первого глотка
        </AppText>
        <AppText variant="body" color={colors.onDarkSecondary} align="center" style={styles.lead}>
          Добро пожаловать в нашу уютную кофейню: здесь каждая чашка — маленькая радость для вас.
        </AppText>
        <Button
          title="Начать"
          onPress={() => {
            actions.completeOnboarding();
            router.replace('/welcome');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  image: { position: 'absolute', top: 0, left: 0, right: 0 },
  fade: { position: 'absolute', left: 0, right: 0 },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.gutter,
    gap: 8,
  },
  lead: { marginBottom: spacing.xl - 8, paddingHorizontal: 12 },
});
