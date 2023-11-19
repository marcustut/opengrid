import type { Translation } from '../i18n-types';

const ga = {
  auth: {
    signIn: 'Sínigh isteach',
    signOut: 'Logáil Amach',
    signInDescription: 'Sínigh isteach nó cláraigh thíos.',
    email: 'Ríomhphost',
    continueWith: 'Ar aghaidh le {provider}',
    signInWith: 'Sínigh isteach le {provider}',
    magicLinkSent: '✅ Nasc draíochta seolta chuig {email}',
    failedMagicLink: 'Theip ar an nasc draíochta a sheoladh chuig {email}',
  },
  welcomeTo: 'Fáilte go {name}',
} satisfies Translation;

export default ga;
