import { router } from 'expo-router';

/** After a demo sign-in, drop the auth screens from history and land on Home. */
export function finishAuth() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/home');
}

export const nameFromEmail = (email: string) => {
  const local = email.split('@')[0] ?? '';
  const word = local.replace(/[._-]+/g, ' ').trim();
  return word ? word[0]!.toUpperCase() + word.slice(1) : 'Гость';
};

export const DEMO_ACCOUNT = { email: 'demo@coffee.app', password: 'coffee123', name: 'Анна Кофеева', phone: '+7 999 123-45-67' };
