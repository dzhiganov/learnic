import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const defaultLang = 'en';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (value instanceof Date)
          return dayjs(value)
            .locale(lng || defaultLang)
            .format(format);
        return value;
      },
    },
  });

export default i18n;
