import { router } from 'expo-router';

/** Leave a finished flow (checkout, sign-out) and land on a clean Home tab. */
export function resetToHome() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/home');
}

/** Go back to Home, then open a screen on top of it (e.g. tracking after checkout). */
export function homeThen(open: () => void) {
  resetToHome();
  setTimeout(open, 0);
}
