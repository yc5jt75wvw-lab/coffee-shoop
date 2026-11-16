import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';

type ScreenProps = {
  children: React.ReactNode;
  /** Wrap content in a ScrollView. */
  scroll?: boolean;
  /** Rendered above the content, outside the scroll area. */
  header?: React.ReactNode;
  /** Rendered below the content, outside the scroll area (e.g. a BottomBar). */
  footer?: React.ReactNode;
  edges?: Edge[];
  background?: string;
  statusBar?: 'dark' | 'light';
  padded?: boolean;
  keyboard?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  scrollProps?: ScrollViewProps;
};

export function Screen({
  children,
  scroll,
  header,
  footer,
  edges = ['top'],
  background = colors.background,
  statusBar = 'dark',
  padded = true,
  keyboard,
  contentStyle,
  scrollProps,
}: ScreenProps) {
  const pad = padded ? { paddingHorizontal: spacing.gutter } : null;
  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollProps}
      contentContainerStyle={[pad, styles.scrollContent, contentStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, pad, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.fill, { backgroundColor: background }]}>
      <StatusBar style={statusBar} />
      {header}
      {keyboard ? (
        <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {body}
          {footer}
        </KeyboardAvoidingView>
      ) : (
        <>
          {body}
          {footer}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },
});
