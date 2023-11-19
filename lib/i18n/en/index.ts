import type { BaseTranslation } from '../i18n-types';

const en = {
  auth: {
    signIn: 'Sign in',
    signOut: 'Sign out',
    signInDescription: 'Please sign in or sign up below.',
    email: 'Email',
    continueWith: 'Continue with {provider:string}',
    signInWith: 'Sign in with {provider:string}',
    magicLinkSent: '✅ Magic link sent to {email:string}',
    failedMagicLink: 'Failed to send magic link to {email:string}',
  },
  loading: 'Loading {name:string}...',
  failedToLoad: 'Failed to load {name:string}',
  systemDemand: 'System demand',
  welcomeTo: 'Welcome to {name:string}',
} satisfies BaseTranslation;

export default en;
