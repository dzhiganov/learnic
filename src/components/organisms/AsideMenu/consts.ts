import { HOME_WORDS, HOME_WORDS_FOR_TODAY } from '~router/paths';

const keys = {
  ALL_WORDS: 'all-words',
  WORDS_FOR_TODAY: 'words-for-today',
};

const items = [
  {
    key: keys.ALL_WORDS,
    title: '📚 My words',
    to: HOME_WORDS,
  },
  {
    key: keys.WORDS_FOR_TODAY,
    title: '📖  Words for Today',
    to: HOME_WORDS_FOR_TODAY,
  },
];

export { keys, items };
