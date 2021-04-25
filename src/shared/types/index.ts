import { ColorSchemes } from '~shared/enums';

export type UserOptions = {
  colorScheme: ColorSchemes | 'default';
  language: 'en' | 'ru' | 'default';
};
