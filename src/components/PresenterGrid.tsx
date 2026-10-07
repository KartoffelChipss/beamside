import type { CSSProperties, ReactNode } from 'react';

import { LAYOUTS, SLOT_AREAS, slotCount, type LayoutId, type Pane } from '@/lib/presenter-layout';
import { cn } from '@/lib/utils';

const gridStyle = (layout: LayoutId): CSSProperties => {
    const { areas, columns, rows } = LAYOUTS[layout];
    const tracks = (value: string) =>
        value
            .split(' ')
            .map((size) => `minmax(0, ${size})`)
            .join(' ');
    return {
        gridTemplateAreas: areas.map((row) => `"${row}"`).join(' '),
        gridTemplateColumns: tracks(columns),
        gridTemplateRows: tracks(rows),
    };
};

type GridProps = {
    layout: LayoutId;
    slots: Pane[];
    renderPane: (pane: Pane) => ReactNode;
    className?: string;
};

export const PresenterGrid = ({ layout, slots, renderPane, className }: GridProps) => (
    <div className={cn('grid gap-3', className)} style={gridStyle(layout)}>
        {slots.map((pane, i) => (
            <div
                key={i}
                className="flex min-h-0 min-w-0 flex-col gap-1"
                style={{ gridArea: SLOT_AREAS[i] }}
            >
                {renderPane(pane)}
            </div>
        ))}
    </div>
);

type ThumbnailProps = {
    layout: LayoutId;
    labels?: ReactNode[];
    className?: string;
};

export const LayoutThumbnail = ({ layout, labels, className }: ThumbnailProps) => (
    <div
        className={cn('grid aspect-video w-full gap-0.5 rounded-sm', className)}
        style={gridStyle(layout)}
        aria-hidden
    >
        {Array.from({ length: slotCount(layout) }, (_, i) => (
            <div
                key={i}
                className="flex min-w-0 items-center justify-center overflow-hidden rounded-[3px] bg-muted-foreground/20 px-0.5 text-[10px] font-medium leading-none text-muted-foreground"
                style={{ gridArea: SLOT_AREAS[i] }}
            >
                <span className="truncate">{labels?.[i] ?? i + 1}</span>
            </div>
        ))}
    </div>
);
