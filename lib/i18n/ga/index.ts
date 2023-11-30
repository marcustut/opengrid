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
    realtime: 'fíor-am',
    daily: 'laethúil',
    message: 'Teachtaireacht',
    messageDescription: 'Teachtaireacht shaincheaptha don fhógra',
    messagePlaceholder: 'Cuir isteach teachtaireacht shaincheaptha...',
    emailNotification: 'Fógraí ríomhphoist',
    receiveEmailsForAlerts: 'Faigh ríomhphoist le haghaidh foláirimh {alertType}',
    thisAlertIs: 'Tá an foláireamh {name}',
    alert: 'Airdeall',
    active: 'Gníomhach',
    disabled: 'Míchumasaithe',
  },
  region: {
    republicOfIreland: 'Poblacht na hÉireann',
    northernIreland: 'Tuaisceart Éireann',
    allIreland: 'Éire uile',
  },
  path: {
    dashboard: 'Deais',
    alert: 'Airdeall',
  },
  actual: 'Iarbhír',
  forecast: 'Réamhaisnéis',
  average: 'Meán',
  optional: 'Roghnach',
  new: 'Nua',
  save: 'Sábháil',
  chooseDate: 'Roghnaigh dáta',
  loading: 'Ag lódáil {name}...',
  failedToLoad: 'Theip ar luchtú {name}',
  netDemand: 'éileamh glan',
  netDemandDescription:
    'Léiríonn an t-éileamh glan an táirgeadh leictreachais trí éileamh an chórais iarbhír agus réamhaisnéise a ghlacadh agus iad a asbhaint leis an nginiúint reatha gaoithe. Seasann an líne oráiste don mheánluach.',
  systemDemand: 'éileamh córais',
  systemDemandDescription:
    'Is ionann éileamh an chórais agus an táirgeadh leictreachais a theastaíonn chun freastal ar thomhaltas náisiúnta. Léirítear Éileamh an Chórais iarbhír agus réamhaisnéise i dtréimhsí 15 nóiméad.',
  windGeneration: 'giniúint Gaoithe',
  windGenerationDescription:
    'Is meastachán é Giniúint Gaoithe ar aschur leictreach iomlán na bhfeirmeacha gaoithe ar fad ar an gcóras. Taispeántar Giniúint Gaoithe Iarbhír agus Réamhaisnéise i gceann tréimhsí 15 nóiméad.',
  welcomeTo: 'Fáilte go {name}',
} satisfies Translation;

export default ga;
