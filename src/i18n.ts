import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      LANG_PICKER: {
        RU: 'Russian',
        ENG: 'English',
      },
      TOP_BAR: {
        LOGOUT: 'Log out',
      },
    },
  },
  ru: {
    translation: {
      LANG_PICKER: {
        RU: 'Русский',
        ENG: 'Английский',
      },
      TOP_BAR: {
        LOGOUT: 'Выйти',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',

  keySeparator: '.',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
