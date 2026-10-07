type Bounds = { x: number; y: number; width: number; height: number };

type ScreenWithOffset = Screen & { availLeft?: number; availTop?: number };

const DEFAULT_SIZE = { width: 960, height: 540 };

const restoreBounds = new WeakMap<Window, Bounds>();

export const openPopup = () =>
    window.open(
        '',
        `beamside-slides-${Date.now()}`,
        `popup,width=${DEFAULT_SIZE.width},height=${DEFAULT_SIZE.height}`
    );

export const isMaximized = (win: Window) => {
    const screen = win.screen;
    return win.outerWidth >= screen.availWidth - 2 && win.outerHeight >= screen.availHeight - 2;
};

export const maximize = (win: Window) => {
    restoreBounds.set(win, {
        x: win.screenX,
        y: win.screenY,
        width: win.outerWidth,
        height: win.outerHeight,
    });
    const screen = win.screen as ScreenWithOffset;
    win.moveTo(screen.availLeft ?? 0, screen.availTop ?? 0);
    win.resizeTo(screen.availWidth, screen.availHeight);
    win.focus();
};

export const restore = (win: Window) => {
    const screen = win.screen as ScreenWithOffset;
    const bounds = restoreBounds.get(win) ?? {
        ...DEFAULT_SIZE,
        x: (screen.availLeft ?? 0) + (screen.availWidth - DEFAULT_SIZE.width) / 2,
        y: (screen.availTop ?? 0) + (screen.availHeight - DEFAULT_SIZE.height) / 2,
    };
    win.resizeTo(bounds.width, bounds.height);
    win.moveTo(bounds.x, bounds.y);
    win.focus();
};

const PROMPT_ID = 'beamside-fullscreen-prompt';

export const isFullscreen = (win: Window) => !!win.document.fullscreenElement;

const requestFullscreen = (win: Window) => win.document.documentElement.requestFullscreen();

const showFullscreenPrompt = (win: Window, text: string) => {
    const doc = win.document;
    if (doc.getElementById(PROMPT_ID)) return;
    const prompt = doc.createElement('div');
    prompt.id = PROMPT_ID;
    prompt.textContent = text;
    Object.assign(prompt.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(0 0 0 / 60%)',
        color: '#fff',
        font: '500 20px system-ui, sans-serif',
        cursor: 'pointer',
    });
    prompt.addEventListener(
        'click',
        () => {
            prompt.remove();
            requestFullscreen(win).catch(() => {});
        },
        { once: true }
    );
    doc.body.appendChild(prompt);
};

export const toggleFullscreen = async (win: Window, promptText: string) => {
    if (isFullscreen(win)) {
        await win.document.exitFullscreen();
        return;
    }
    try {
        await requestFullscreen(win);
    } catch {
        win.focus();
        showFullscreenPrompt(win, promptText);
    }
};

export const addFullscreenShortcuts = (win: Window) => {
    const doc = win.document;
    const toggle = () => {
        if (doc.fullscreenElement) doc.exitFullscreen();
        else requestFullscreen(win).catch(() => {});
    };
    win.addEventListener('dblclick', toggle);
    win.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) toggle();
    });
    doc.addEventListener('fullscreenchange', () => {
        if (doc.fullscreenElement) doc.getElementById(PROMPT_ID)?.remove();
    });
};
