import { HOME_WORDS, HOME_WORDS_FOR_TODAY } from '~router/paths';

const keys = {
  DICTIONARY: 'dictionary',
  TRAININGS: 'trainings',
  LOGOUT: 'logout',
};

const items = [
  {
    key: keys.DICTIONARY,
    title: 'ASIDE_MENU.DICTIONARY',
    prefix: '📚',
    to: HOME_WORDS,
  },
  {
    key: keys.TRAININGS,
    title: 'ASIDE_MENU.TRAININGS',
    prefix: '📖',
    to: HOME_WORDS_FOR_TODAY,
  },
];

export { keys, items };
