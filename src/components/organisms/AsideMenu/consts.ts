import { HOME_WORDS, HOME_CARDS, HOME_PROFILE } from '~router/paths';

const keys = {
  DICTIONARY: 'dictionary',
  TRAININGS: 'trainings',
  LOGOUT: 'logout',
  CARDS: 'cards',
  PROFILE: 'profile',
};

const desktopItems = [
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

const mobileItems = [
  ...desktopItems,
  {
    key: keys.PROFILE,
    title: 'ASIDE_MENU.PROFILE',
    to: HOME_PROFILE,
    showOn: 'mobile',
  },
];

export { keys, desktopItems, mobileItems };
