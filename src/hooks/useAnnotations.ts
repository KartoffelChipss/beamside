import { useRef, useState } from 'react';

import { hitsStroke, type Point, type Stroke, type Tool } from '@/lib/annotations';

const LASER_IDLE_MS = 2500;
const MIN_POINT_DISTANCE = 0.001;

export type SlideAnnotations = {
    tool: Tool;
    strokes: Stroke[];
    laser: Point | null;
    onLaserMove: (point: Point | null) => void;
    onStrokeStart: (point: Point) => void;
    onStrokeMove: (point: Point) => void;
    onStrokeEnd: () => void;
    onErase: (point: Point, aspect: number) => void;
};

export const useAnnotations = (pen: { color: string; size: number }) => {
    const [tool, setTool] = useState<Tool>('none');
    const [drawings, setDrawings] = useState<Record<number, Stroke[]>>({});
    const [draft, setDraft] = useState<{ page: number; stroke: Stroke } | null>(null);
    const [laser, setLaser] = useState<Point | null>(null);
    const laserTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const moveLaser = (point: Point | null) => {
        clearTimeout(laserTimeoutRef.current);
        setLaser(point);
        if (point) laserTimeoutRef.current = setTimeout(() => setLaser(null), LASER_IDLE_MS);
    };

    const commitDraft = () => {
        if (!draft) return;
        setDrawings((all) => ({
            ...all,
            [draft.page]: [...(all[draft.page] ?? []), draft.stroke],
        }));
        setDraft(null);
    };

    const forPage = (page: number): SlideAnnotations => ({
        tool,
        strokes: [...(drawings[page] ?? []), ...(draft?.page === page ? [draft.stroke] : [])],
        laser: tool === 'laser' ? laser : null,
        onLaserMove: moveLaser,
        onStrokeStart: (point) =>
            setDraft({ page, stroke: { color: pen.color, size: pen.size, points: [point] } }),
        onStrokeMove: (point) =>
            setDraft((current) => {
                if (!current) return current;
                const last = current.stroke.points.at(-1)!;
                if (Math.hypot(point.x - last.x, point.y - last.y) < MIN_POINT_DISTANCE)
                    return current;
                return {
                    ...current,
                    stroke: { ...current.stroke, points: [...current.stroke.points, point] },
                };
            }),
        onStrokeEnd: commitDraft,
        onErase: (point, aspect) =>
            setDrawings((all) => {
                const strokes = all[page] ?? [];
                const kept = strokes.filter((stroke) => !hitsStroke(stroke, point, aspect));
                return kept.length === strokes.length ? all : { ...all, [page]: kept };
            }),
    });

    const selectTool = (next: Tool) => {
        setTool(next);
        moveLaser(null);
    };

    const clearAll = () => {
        setDrawings({});
        setDraft(null);
    };

    return { tool, selectTool, forPage, clearAll };
};
