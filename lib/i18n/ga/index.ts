import type { Translation } from '../i18n-types';

const ga = {
  auth: {
    signIn: 'Sínigh isteach',
    signOut: 'Logáil Amach',
    signInDescription: 'Sínigh isteach nó cláraigh thíos.',
    email: 'Ríomhphost',
    continueWith: 'Ar aghaidh le {provider:string}',
    signInWith: 'Sínigh isteach le {provider:string}',
    magicLinkSent: '✅ Nasc draíochta seolta chuig {email:string}',
    failedMagicLink: 'Theip ar an nasc draíochta a sheoladh chuig {email:string}',
  },
  welcomeTo: 'Fáilte go {name:string}',
} satisfies Translation;

export default ga;
