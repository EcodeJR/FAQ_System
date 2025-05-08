import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import es from './es.json';

const i18nConfig = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator']
    },
    debug: import.meta.env.VITE_ENV === 'development',
    interpolation: {
      escapeValue: false
    }
  });

export default i18nConfig;