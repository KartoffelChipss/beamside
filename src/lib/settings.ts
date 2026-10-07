import type { LanguagePreference } from '@/i18n';
import { PEN_COLORS, PEN_SIZES, type PenColor, type PenSize } from './annotations';
import {
    DEFAULT_PRESENTER_LAYOUT,
    parsePresenterLayout,
    type PresenterLayout,
} from './presenter-layout';

export type Theme = 'system' | 'light' | 'dark';

export const TOOLBAR_ITEMS = ['laser', 'pen', 'eraser', 'clear'] as const;
export type ToolbarItem = (typeof TOOLBAR_ITEMS)[number];

export type Settings = {
    language: LanguagePreference;
    theme: Theme;
    presenterLayout: PresenterLayout;
    showTimer: boolean;
    toolbar: Record<ToolbarItem, boolean>;
    pen: { color: PenColor; size: PenSize };
};

const DEFAULT_SETTINGS: Settings = {
    language: 'system',
    theme: 'system',
    presenterLayout: DEFAULT_PRESENTER_LAYOUT,
    showTimer: true,
    toolbar: { laser: true, pen: true, eraser: true, clear: true },
    pen: { color: 'red', size: 'medium' },
};

const STORAGE_KEY = 'beamside-settings';
const LEGACY_STORAGE_KEY = 'beamerr-settings';

export const loadSettings = (): Settings => {
    try {
        const stored = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY) ?? '{}'
        );
        const presenterLayout = parsePresenterLayout(stored);
        const toolbar = {
            ...DEFAULT_SETTINGS.toolbar,
            ...(stored.laserPointer === false && { laser: false }),
            ...stored.toolbar,
        };
        const pen = {
            color: stored.pen?.color in PEN_COLORS ? stored.pen.color : DEFAULT_SETTINGS.pen.color,
            size: stored.pen?.size in PEN_SIZES ? stored.pen.size : DEFAULT_SETTINGS.pen.size,
        };
        delete stored.showCurrent;
        delete stored.showNext;
        delete stored.laserPointer;
        return { ...DEFAULT_SETTINGS, ...stored, presenterLayout, toolbar, pen };
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
