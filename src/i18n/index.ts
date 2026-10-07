import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { loadSettings } from '@/lib/settings';
import { de } from './locales/de';
import { en } from './locales/en';

export const LANGUAGES = {
    en: 'English',
    de: 'Deutsch',
} as const;

export type Language = keyof typeof LANGUAGES;
export type LanguagePreference = Language | 'system';

export const resources = {
    en: { translation: en },
    de: { translation: de },
} as const;

const toLng = (preference: LanguagePreference) =>
    preference === 'system' ? undefined : preference;

export const applyLanguagePreference = (preference: LanguagePreference) =>
    i18n.changeLanguage(toLng(preference));

i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = i18n.resolvedLanguage ?? lng;
});

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: toLng(loadSettings().language),
        fallbackLng: 'en',
        supportedLngs: Object.keys(LANGUAGES),
        load: 'languageOnly',
        initAsync: false,
        interpolation: { escapeValue: false },
        // The override lives in our settings, so only ever detect from the browser
        detection: { order: ['navigator'], caches: [] },
    });

export default i18n;
