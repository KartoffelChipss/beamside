import { useEffect, useRef, useState, type PointerEvent } from 'react';

import { ERASER_RADIUS, strokePath, type Point } from '@/lib/annotations';
import type { SlideAnnotations } from '@/hooks/useAnnotations';

const CURSORS = { none: undefined, laser: 'none', pen: 'crosshair', eraser: 'none' } as const;

export const SlideOverlay = ({
    tool,
    strokes,
    laser,
    onLaserMove,
    onStrokeStart,
    onStrokeMove,
    onStrokeEnd,
    onErase,
}: SlideAnnotations) => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [eraserAt, setEraserAt] = useState<Point | null>(null);
    const drawingRef = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const view = el.ownerDocument.defaultView ?? window;
        const ro = new view.ResizeObserver(([entry]) =>
            setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
        );
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const toPoint = (e: PointerEvent<HTMLDivElement>): Point => {
        const rect = e.currentTarget.getBoundingClientRect();
        return {
            x: Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1),
            y: Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1),
        };
    };
    const aspect = size.width ? size.height / size.width : 1;
    const pressed = (e: PointerEvent) => e.buttons === 1;

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        const point = toPoint(e);
        if (tool === 'pen') {
            e.currentTarget.setPointerCapture(e.pointerId);
            drawingRef.current = true;
            onStrokeStart(point);
        } else if (tool === 'eraser') {
            e.currentTarget.setPointerCapture(e.pointerId);
            onErase(point, aspect);
        }
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const point = toPoint(e);
        if (tool === 'laser') onLaserMove(point);
        else if (tool === 'pen' && drawingRef.current) onStrokeMove(point);
        else if (tool === 'eraser') {
            setEraserAt(point);
            if (pressed(e)) onErase(point, aspect);
        }
    };

    const endStroke = () => {
        if (!drawingRef.current) return;
        drawingRef.current = false;
        onStrokeEnd();
    };

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                inset: 0,
                cursor: CURSORS[tool],
                touchAction: tool === 'pen' || tool === 'eraser' ? 'none' : undefined,
            }}
            onPointerDown={tool === 'none' ? undefined : onPointerDown}
            onPointerMove={tool === 'none' ? undefined : onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onPointerLeave={() => {
                if (tool === 'laser') onLaserMove(null);
                setEraserAt(null);
            }}
        >
            {size.width > 0 && strokes.length > 0 && (
                <svg
                    width={size.width}
                    height={size.height}
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    aria-hidden
                >
                    {strokes.map((stroke, i) => (
                        <path
                            key={i}
                            d={strokePath(stroke, size.width, size.height)}
                            fill="none"
                            stroke={stroke.color}
                            strokeWidth={stroke.size * size.width}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
            )}
            {laser && <LaserDot position={laser} />}
            {tool === 'eraser' && eraserAt && (
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        left: `${eraserAt.x * 100}%`,
                        top: `${eraserAt.y * 100}%`,
                        width: `${ERASER_RADIUS * 200}%`,
                        aspectRatio: '1',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        border: '2px solid #fff',
                        boxShadow: '0 0 0 1px rgb(0 0 0 / 60%)',
                    }}
                />
            )}
        </div>
    );
};

const LaserDot = ({ position }: { position: Point }) => (
    <div
        aria-hidden
        style={{
            position: 'absolute',
            left: `${position.x * 100}%`,
            top: `${position.y * 100}%`,
            width: 'max(12px, 2.2%)',
            aspectRatio: '1',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            background: 'radial-gradient(circle, #fff 0%, #ff2a2a 35%, #e00000 70%)',
            boxShadow: '0 0 6px 2px rgb(255 30 30 / 70%), 0 0 18px 6px rgb(255 0 0 / 35%)',
        }}
    />
);
