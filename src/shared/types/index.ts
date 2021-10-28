import { ColorSchemes } from '../enums';

export type ColorScheme = ColorSchemes | 'default';

export type Language = 'en' | 'ru' | 'default';

export type UserOptions = {
  colorScheme: ColorScheme;
  language: Language;
};

export type Word = {
  id: string;
  word: string;
  translate: string;
  date: string | null;
  repeat: string | null;
  step: number;
  examples?: { id: string; text: string }[];
  transcription?: string;
  audio: string;
  tags: Tags;
};

export type Words = Word[];

export type User = {
  uid: string;
  words: Words;
};

export type GetWordsQueryResult = {
  user: {
    uid: string;
    words: Words;
  };
};

export type GetTrainingWordsQueryResult = {
  user: {
    uid: string;
    trainingWords: Words;
  };
};

export type Tag = {
  id: string;
  name: string;
  color: string;
  isUserTag?: boolean;
};

export type Tags = Tag[];

export type GetTagQuerySelector = {
  user: {
    uid: string;
    tags: Tags;
  };
};

export enum TrainingTypes {
  Repeat = 'repeat',
  Last = 'last',
  All = 'all',
}
