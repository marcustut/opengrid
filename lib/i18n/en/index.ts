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
  alert: {
    newAlertForm: {
      subtitle:
        'By creating a new alert, you will receive notification once the specified condition was triggered.',
      name: {
        label: 'Name',
        description: 'Name of the alert',
      },
      description: {
        label: 'Description',
        description: 'Description of the alert',
      },
      threshold: {
        label: 'Threshold',
        description: 'Desired threshold (use in combination with comparator)',
      },
      comparator: {
        label: 'Comparator',
        description: 'To compare the threshold with the current value',
      },
      alertType: {
        label: 'Alert type',
        description: 'Type of alert',
      },
      message: {
        label: 'Message',
        description: 'Message to be sent when the alert is triggered',
      },
    },
    thisAlertIs: 'This alert is {name:string}',
    alert: 'Alert',
    active: 'Active',
    disabled: 'Disabled',
  },
  optional: 'Optional',
  new: 'New',
  save: 'Save',
  loading: 'Loading {name:string}...',
  failedToLoad: 'Failed to load {name:string}',
  systemDemand: 'System demand',
  welcomeTo: 'Welcome to {name:string}',
} satisfies BaseTranslation;

export default en;
