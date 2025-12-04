import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, es, gal } from './translations';

const resources = {
    en: {
        translation: en,
    },
    es: {
        translation: es,
    },
    gal: {
        translation: gal,
    },

}

export const setLocale = (locale: string) => {
    i18next.changeLanguage(locale);
};

i18next.use(initReactI18next).init({
    debug: true,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
        escapeValue: false,
    },
    resources,
});

export default i18next;