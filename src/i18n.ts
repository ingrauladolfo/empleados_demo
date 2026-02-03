import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
i18n.use(initReactI18next).init({
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
export const i18nInstance = i18n;