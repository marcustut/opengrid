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
    realtime: 'realtime',
    daily: 'daily',
    message: 'Message',
    messageDescription: 'Custom message for the notification',
    messagePlaceholder: 'Enter custom message...',
    emailNotification: 'Email notifications',
    receiveEmailsForAlerts: 'Receive emails for {alertType:string} alerts',
    thisAlertIs: 'This alert is {name:string}',
    alert: 'Alert',
    active: 'Active',
    disabled: 'Disabled',
  },
  region: {
    republicOfIreland: 'Republic of Ireland',
    northernIreland: 'Northern Ireland',
    allIreland: 'All Ireland',
  },
  path: {
    dashboard: 'Dashboard',
    alert: 'Alert',
  },
  actual: 'Actual',
  forecast: 'Forecast',
  average: 'Average',
  optional: 'Optional',
  new: 'New',
  save: 'Save',
  chooseDate: 'Choose date',
  loading: 'Loading {name:string}...',
  failedToLoad: 'Failed to load {name:string}',
  netDemand: 'Net demand',
  netDemandDescription:
    'Net demand represents the electricity production by taking the actual and forecast system demand and deduct them with the current wind generation. The orange line represents the average value.',
  systemDemand: 'System demand',
  systemDemandDescription:
    'System demand represents the electricity production required to meet national consumption. Actual and forecast System Demand are shown in 15 minute intervals.',
  windGeneration: 'Wind generation',
  windGenerationDescription:
    'Wind Generation is an estimate of the total electrical output of all wind farms on the system. Actual and Forecast Wind Generation are shown in 15 minute intervals.',
  welcomeTo: 'Welcome to {name:string}',
} satisfies BaseTranslation;

export default en;
