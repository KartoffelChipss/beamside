export const PANES = ['notes', 'current', 'next'] as const;
export type Pane = (typeof PANES)[number];

type LayoutDef = { areas: readonly string[]; columns: string; rows: string };

const layouts = {
    single: { areas: ['a'], columns: '1fr', rows: '1fr' },
    split: { areas: ['a b'], columns: '1fr 1fr', rows: '1fr' },
    mainSide: { areas: ['a b'], columns: '2fr 1fr', rows: '1fr' },
    mainStack: { areas: ['a b', 'a c'], columns: '2fr 1fr', rows: '1fr 1fr' },
    mainRow: { areas: ['a a', 'b c'], columns: '1fr 1fr', rows: '2fr 1fr' },
} satisfies Record<string, LayoutDef>;

export type LayoutId = keyof typeof layouts;
export const LAYOUTS: Record<LayoutId, LayoutDef> = layouts;
export const LAYOUT_IDS = Object.keys(LAYOUTS) as LayoutId[];

export const SLOT_AREAS = ['a', 'b', 'c'] as const;

export const slotCount = (layout: LayoutId) =>
    new Set(LAYOUTS[layout].areas.join(' ').split(' ')).size;

export type PresenterLayout = { layout: LayoutId; slots: Pane[] };

type PresetDef = { layout: LayoutId; slots: readonly Pane[] };

const presets = {
    notesFocus: { layout: 'mainStack', slots: ['notes', 'current', 'next'] },
    notesAndNext: { layout: 'mainSide', slots: ['notes', 'next'] },
    slidesFocus: { layout: 'mainStack', slots: ['current', 'notes', 'next'] },
    sideBySide: { layout: 'split', slots: ['current', 'next'] },
    notesOnly: { layout: 'single', slots: ['notes'] },
} satisfies Record<string, PresetDef>;

export type PresetId = keyof typeof presets;
export const PRESETS: Record<PresetId, PresetDef> = presets;
export const PRESET_IDS = Object.keys(PRESETS) as PresetId[];

export const DEFAULT_PRESENTER_LAYOUT: PresenterLayout = {
    layout: PRESETS.notesFocus.layout,
    slots: [...PRESETS.notesFocus.slots],
};

export const matchPreset = ({ layout, slots }: PresenterLayout): PresetId | null =>
    PRESET_IDS.find((id) => {
        const preset = PRESETS[id];
        return preset.layout === layout && preset.slots.every((pane, i) => slots[i] === pane);
    }) ?? null;

export const changeLayout = ({ slots }: PresenterLayout, layout: LayoutId): PresenterLayout => {
    const count = slotCount(layout);
    const kept = slots.slice(0, count);
    const unused = PANES.filter((pane) => !kept.includes(pane));
    while (kept.length < count) kept.push(unused.shift() ?? 'notes');
    return { layout, slots: kept };
};

export const fromLegacySwitches = (showCurrent = true, showNext = true): PresenterLayout => {
    if (showCurrent && showNext) return DEFAULT_PRESENTER_LAYOUT;
    if (showCurrent) return { layout: 'mainSide', slots: ['notes', 'current'] };
    if (showNext) return { layout: 'mainSide', slots: ['notes', 'next'] };
    return { layout: 'single', slots: ['notes'] };
};

const isValid = (value: unknown): value is PresenterLayout => {
    if (!value || typeof value !== 'object') return false;
    const { layout, slots } = value as PresenterLayout;
    return (
        layout in LAYOUTS &&
        Array.isArray(slots) &&
        slots.length === slotCount(layout) &&
        slots.every((pane) => PANES.includes(pane))
    );
};

export const parsePresenterLayout = (stored: {
    presenterLayout?: unknown;
    showCurrent?: boolean;
    showNext?: boolean;
}): PresenterLayout =>
    isValid(stored.presenterLayout)
        ? stored.presenterLayout
        : fromLegacySwitches(stored.showCurrent, stored.showNext);
