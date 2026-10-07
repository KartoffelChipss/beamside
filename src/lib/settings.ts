import type { LanguagePreference } from '@/i18n';

export type Settings = {
    language: LanguagePreference;
    showCurrent: boolean;
    showNext: boolean;
};

const DEFAULT_SETTINGS: Settings = {
    language: 'system',
    showCurrent: true,
    showNext: true,
};

const STORAGE_KEY = 'beamerr-settings';

export const loadSettings = (): Settings => {
    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') };
    } catch {
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = (settings: Settings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        // Storage unavailable, keep the settings for this session only
    }
};
