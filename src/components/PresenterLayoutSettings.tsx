import { useId, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import {
    LAYOUT_IDS,
    PANES,
    PRESET_IDS,
    PRESETS,
    changeLayout,
    matchPreset,
    type Pane,
    type PresenterLayout,
} from '@/lib/presenter-layout';
import { cn } from '@/lib/utils';
import { LayoutThumbnail } from './PresenterGrid';
import { Label } from './ui/label';
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from './ui/select';

type Props = {
    value: PresenterLayout;
    onChange: (value: PresenterLayout) => void;
};

export const PresenterLayoutSettings = ({ value, onChange }: Props) => {
    const { t } = useTranslation();
    const activePreset = matchPreset(value);
    const layoutId = useId();

    const paneItems = PANES.map((pane) => ({ value: pane, label: t(`settings.panes.${pane}`) }));
    const shortLabels = (slots: readonly Pane[]) => slots.map((pane) => t(`panels.${pane}`));

    return (
        <>
            <div className="flex flex-col gap-3 px-4 py-3">
                <div className="flex items-baseline justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <Label>{t('settings.preset')}</Label>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.presetDescription')}
                        </p>
                    </div>
                    {!activePreset && (
                        <span className="shrink-0 text-sm text-muted-foreground">
                            {t('settings.custom')}
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {PRESET_IDS.map((id) => {
                        const preset = PRESETS[id];
                        return (
                            <OptionCard
                                key={id}
                                active={activePreset === id}
                                onClick={() =>
                                    onChange({ layout: preset.layout, slots: [...preset.slots] })
                                }
                                className="gap-2 p-2"
                            >
                                <LayoutThumbnail
                                    layout={preset.layout}
                                    labels={shortLabels(preset.slots)}
                                />
                                <span className="font-medium">{t(`settings.presets.${id}`)}</span>
                            </OptionCard>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-3 px-4 py-3">
                <div className="flex flex-col gap-1">
                    <Label id={layoutId}>{t('settings.layout')}</Label>
                    <p className="text-sm text-muted-foreground">
                        {t('settings.layoutDescription')}
                    </p>
                </div>
                <div role="group" aria-labelledby={layoutId} className="grid grid-cols-5 gap-2">
                    {LAYOUT_IDS.map((id) => (
                        <OptionCard
                            key={id}
                            active={value.layout === id}
                            aria-label={t(`settings.layouts.${id}`)}
                            title={t(`settings.layouts.${id}`)}
                            onClick={() => onChange(changeLayout(value, id))}
                            className="p-1.5"
                        >
                            <LayoutThumbnail layout={id} />
                        </OptionCard>
                    ))}
                </div>
            </div>

            {value.slots.map((pane, i) => (
                <AreaRow
                    key={i}
                    index={i}
                    pane={pane}
                    items={paneItems}
                    onChange={(next) =>
                        onChange({
                            ...value,
                            slots: value.slots.map((p, j) => (j === i ? next : p)),
                        })
                    }
                />
            ))}
        </>
    );
};

const OptionCard = ({
    active,
    className,
    ...props
}: ComponentProps<'button'> & { active: boolean }) => (
    <button
        type="button"
        aria-pressed={active}
        className={cn(
            'flex flex-col rounded-lg border text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
            active && 'border-primary ring-1 ring-primary',
            className
        )}
        {...props}
    />
);

const AreaRow = ({
    index,
    pane,
    items,
    onChange,
}: {
    index: number;
    pane: Pane;
    items: { value: Pane; label: string }[];
    onChange: (pane: Pane) => void;
}) => {
    const { t } = useTranslation();
    const id = useId();
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 flex-col gap-1">
                <Label htmlFor={id}>{t('settings.area', { n: index + 1 })}</Label>
                {index === 0 && (
                    <p className="text-sm text-muted-foreground">{t('settings.areaLargest')}</p>
                )}
            </div>
            <Select items={items} value={pane} onValueChange={(next) => next && onChange(next)}>
                <SelectTrigger id={id} className="w-44 shrink-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectPopup>
            </Select>
        </div>
    );
};
