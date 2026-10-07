import type { ReactNode } from 'react';
import { CircleDot, Eraser, MousePointer2, Pen, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PEN_COLORS, PEN_SIZES, type PenColor, type PenSize, type Tool } from '@/lib/annotations';
import type { Settings } from '@/lib/settings';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Popover, PopoverPopup, PopoverTrigger } from './ui/popover';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

type Props = {
    items: Settings['toolbar'];
    tool: Tool;
    onToolChange: (tool: Tool) => void;
    pen: Settings['pen'];
    onPenChange: (pen: Settings['pen']) => void;
    onClear: () => void;
};

const TOOL_ICONS: Record<Tool, ReactNode> = {
    none: <MousePointer2 />,
    laser: <CircleDot />,
    pen: <Pen />,
    eraser: <Eraser />,
};

export const AnnotationToolbar = ({
    items,
    tool,
    onToolChange,
    pen,
    onPenChange,
    onClear,
}: Props) => {
    const { t } = useTranslation();
    const tools = (['laser', 'pen', 'eraser'] as const).filter((item) => items[item]);
    if (tools.length === 0 && !items.clear) return null;

    return (
        <div
            role="toolbar"
            aria-label={t('toolbar.label')}
            className="flex items-center gap-1 rounded-lg border p-0.5"
        >
            {tools.length > 0 && (
                <ToggleGroup
                    size="sm"
                    value={[tool]}
                    onValueChange={([next]) => next && onToolChange(next as Tool)}
                >
                    {(['none', ...tools] as const).map((item) => (
                        <ToggleGroupItem
                            key={item}
                            value={item}
                            aria-label={t(`toolbar.${item}`)}
                            title={t(`toolbar.${item}`)}
                            className="border-transparent"
                        >
                            {TOOL_ICONS[item]}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            )}
            {items.pen && (
                <PenOptions
                    pen={pen}
                    onChange={(next) => {
                        onPenChange(next);
                        onToolChange('pen');
                    }}
                />
            )}
            {items.clear && (
                <>
                    {tools.length > 0 && <div className="mx-0.5 h-5 w-px bg-border" aria-hidden />}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('toolbar.clear')}
                        title={t('toolbar.clear')}
                        onClick={onClear}
                    >
                        <Trash2 />
                    </Button>
                </>
            )}
        </div>
    );
};

const PenOptions = ({
    pen,
    onChange,
}: {
    pen: Settings['pen'];
    onChange: (pen: Settings['pen']) => void;
}) => {
    const { t } = useTranslation();
    const maxSize = PEN_SIZES.large;

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('toolbar.penOptions')}
                        title={t('toolbar.penOptions')}
                    >
                        <span
                            className="size-4 rounded-full border border-foreground/30"
                            style={{ background: PEN_COLORS[pen.color] }}
                        />
                    </Button>
                }
            />
            <PopoverPopup side="top" align="end" className="w-auto">
                <div className="flex flex-col gap-3">
                    <OptionRow label={t('toolbar.color')}>
                        {(Object.keys(PEN_COLORS) as PenColor[]).map((color) => (
                            <button
                                key={color}
                                type="button"
                                aria-label={t(`toolbar.colors.${color}`)}
                                title={t(`toolbar.colors.${color}`)}
                                aria-pressed={pen.color === color}
                                onClick={() => onChange({ ...pen, color })}
                                className={cn(
                                    'size-7 rounded-full border border-foreground/20 outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    pen.color === color &&
                                        'ring-2 ring-primary ring-offset-2 ring-offset-popover'
                                )}
                                style={{ background: PEN_COLORS[color] }}
                            />
                        ))}
                    </OptionRow>
                    <OptionRow label={t('toolbar.size')}>
                        {(Object.keys(PEN_SIZES) as PenSize[]).map((size) => (
                            <button
                                key={size}
                                type="button"
                                aria-label={t(`toolbar.sizes.${size}`)}
                                title={t(`toolbar.sizes.${size}`)}
                                aria-pressed={pen.size === size}
                                onClick={() => onChange({ ...pen, size })}
                                className={cn(
                                    'flex size-8 items-center justify-center rounded-md border outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
                                    pen.size === size && 'border-primary ring-1 ring-primary'
                                )}
                            >
                                <span
                                    className="rounded-full bg-foreground"
                                    style={{
                                        width: `${4 + (PEN_SIZES[size] / maxSize) * 14}px`,
                                        aspectRatio: '1',
                                    }}
                                />
                            </button>
                        ))}
                    </OptionRow>
                </div>
            </PopoverPopup>
        </Popover>
    );
};

const OptionRow = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">{children}</div>
    </div>
);
