import { ColorSchemes } from '../enums';

export type ColorScheme = ColorSchemes | 'default';

export type Language = 'en' | 'ru' | 'default';

export type UserOptions = {
  colorScheme: ColorScheme;
  language: Language;
};
