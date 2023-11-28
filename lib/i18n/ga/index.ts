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
  alert: {
    newAlertForm: {
      subtitle:
        'Trí foláireamh nua a chruthú, gheobhaidh tú fógra a luaithe a cuireadh an coinníoll sonraithe i bhfeidhm.',
      name: {
        label: 'Ainm',
        description: 'Ainm an fholaireamh',
      },
      description: {
        label: 'Cur síos',
        description: 'Cur síos ar an bhfoláireamh',
      },
      threshold: {
        label: 'Tairseach',
        description: 'Tairseach inmhianaithe (úsáid i gcomhar le comparadóir)',
      },
      comparator: {
        label: 'Comparadóir',
        description: 'Chun an tairseach a chur i gcomparáid leis an luach reatha',
      },
      alertType: {
        label: 'Cineál foláirimh',
        description: 'Cineál foláirimh',
      },
      message: {
        label: 'Teachtaireacht',
        description: 'Teachtaireacht le seoladh nuair a spreagtar an foláireamh',
      },
    },
    thisAlertIs: 'Tá an foláireamh {name}',
    alert: 'Airdeall',
    active: 'Gníomhach',
    disabled: 'Míchumasaithe',
  },
  optional: 'Roghnach',
  new: 'Nua',
  save: 'Sábháil',
  loading: 'Ag lódáil {name}...',
  failedToLoad: 'Theip ar luchtú {name}',
  systemDemand: 'éileamh córais',
  windGeneration: 'giniúint Gaoithe',
  welcomeTo: 'Fáilte go {name}',
} satisfies Translation;

export default ga;
