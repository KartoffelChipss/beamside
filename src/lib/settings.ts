import type { LanguagePreference } from '@/i18n';
import {
    DEFAULT_PRESENTER_LAYOUT,
    parsePresenterLayout,
    type PresenterLayout,
} from './presenter-layout';

export type Theme = 'system' | 'light' | 'dark';

export type Settings = {
    language: LanguagePreference;
    theme: Theme;
    presenterLayout: PresenterLayout;
    showTimer: boolean;
    laserPointer: boolean;
};

const DEFAULT_SETTINGS: Settings = {
    language: 'system',
    theme: 'system',
    presenterLayout: DEFAULT_PRESENTER_LAYOUT,
    showTimer: true,
    laserPointer: true,
};

const STORAGE_KEY = 'beamside-settings';
const LEGACY_STORAGE_KEY = 'beamerr-settings';

export const loadSettings = (): Settings => {
    try {
        const stored = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY) ?? '{}'
        );
        const presenterLayout = parsePresenterLayout(stored);
        delete stored.showCurrent;
        delete stored.showNext;
        return { ...DEFAULT_SETTINGS, ...stored, presenterLayout };
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
