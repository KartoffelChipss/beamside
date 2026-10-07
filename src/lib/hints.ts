export type Hint = 'slidesWindow';

const STORAGE_KEY = 'beamside-dismissed-hints';

const loadDismissed = (): Hint[] => {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const isHintDismissed = (hint: Hint) => loadDismissed().includes(hint);

export const dismissHint = (hint: Hint) => {
    const dismissed = loadDismissed();
    if (dismissed.includes(hint)) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed, hint]));
    } catch {
        // Storage unavailable
    }
};
