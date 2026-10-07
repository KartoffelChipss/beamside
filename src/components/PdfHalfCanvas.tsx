import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { NotesLayout } from '@/lib/notes-layout';

type Props = {
    doc: PDFDocumentProxy;
    pageNumber: number;
    layout: NotesLayout;
    part: 'slide' | 'notes';
    background?: string;
};

export const PdfHalfCanvas = ({ doc, pageNumber, layout, part, background = '#000' }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    // Track the container size
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const view = el.ownerDocument.defaultView ?? window;
        const ro = new view.ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            setSize({ width: rect.width, height: rect.height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || size.width === 0 || size.height === 0) return;

        let cancelled = false;
        let renderTask: {
            cancel: () => void;
            promise: Promise<unknown>;
        } | null = null;

        (async () => {
            const page = await doc.getPage(pageNumber);
            if (cancelled) return;

            const base = page.getViewport({ scale: 1 });
            const cols = layout === 'right' ? 2 : 1;
            const rows = layout === 'bottom' ? 2 : 1;

            const fit = Math.min(
                size.width / (base.width / cols),
                size.height / (base.height / rows)
            );
            const dpr = (canvas.ownerDocument.defaultView ?? window).devicePixelRatio || 1;
            const viewport = page.getViewport({ scale: fit * dpr });

            const width = Math.floor(viewport.width / cols);
            const height = Math.floor(viewport.height / rows);
            const offscreen = canvas.ownerDocument.createElement('canvas');
            offscreen.width = width;
            offscreen.height = height;

            const isNotes = part === 'notes';
            const offsetX = isNotes && layout === 'right' ? -width : 0;
            const offsetY = isNotes && layout === 'bottom' ? -height : 0;

            renderTask = page.render({
                canvas: offscreen,
                viewport,
                transform: [1, 0, 0, 1, offsetX, offsetY],
            });
            try {
                await renderTask.promise;
            } catch {
                return;
            }
            if (cancelled) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${width / dpr}px`;
            canvas.style.height = `${height / dpr}px`;
            ctx.drawImage(offscreen, 0, 0);

            // Warm up neighbour pages
            for (const n of [pageNumber + 1, pageNumber - 1]) {
                if (n >= 1 && n <= doc.numPages) {
                    doc.getPage(n)
                        .then((p) => p.getOperatorList())
                        .catch(() => {});
                }
            }
        })();

        return () => {
            cancelled = true;
            renderTask?.cancel();
        };
    }, [doc, pageNumber, layout, part, size]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background,
                overflow: 'hidden',
            }}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};
