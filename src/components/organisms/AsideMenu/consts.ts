import { HOME_WORDS, HOME_CARDS } from '~router/paths';

const keys = {
  DICTIONARY: 'dictionary',
  TRAININGS: 'trainings',
  LOGOUT: 'logout',
  CARDS: 'cards',
};

const items = [
  {
    key: keys.DICTIONARY,
    title: 'ASIDE_MENU.DICTIONARY',
    to: HOME_WORDS,
  },
  {
    key: keys.CARDS,
    title: 'ASIDE_MENU.CARDS',
    to: HOME_CARDS,
  },
];

export { keys, items };
