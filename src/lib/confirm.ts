import { Alert, Platform } from 'react-native';

/** Native confirmation dialog (falls back to window.confirm on web). */
export function confirmAction(opts: {
  title: string;
  message: string;
  confirmText: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${opts.title}\n\n${opts.message}`)) opts.onConfirm();
    return;
  }
  Alert.alert(opts.title, opts.message, [
    { text: 'Отмена', style: 'cancel' },
    { text: opts.confirmText, style: opts.destructive ? 'destructive' : 'default', onPress: opts.onConfirm },
  ]);
}
