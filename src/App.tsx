import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { Button } from "./components/ui/button";
import { PdfHalfCanvas } from "./components/PdfHalfCanvas";
import { useSystemTheme } from "./hooks/useSystemTheme";
import {
    Eye,
    EyeOff,
    PictureInPicture,
    PictureInPicture2,
    Upload,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type Popup = { win: Window; mount: HTMLDivElement };

const App = () => {
    useSystemTheme();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
    const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [page, setPage] = useState(1);
    const [popup, setPopup] = useState<Popup | null>(null);
    const [error, setError] = useState<string>("");
    const [showPreviews, setShowPreviews] = useState(true);

    const pageCount = doc?.numPages ?? 0;

    const goTo = useCallback(
        (n: number) =>
            setPage((_) => Math.min(Math.max(n, 1), Math.max(pageCount, 1))),
        [pageCount],
    );

    const handleFile = async (file: File | undefined) => {
        if (!file) return;
        setError("");
        try {
            const data = new Uint8Array(await file.arrayBuffer());
            const task = pdfjsLib.getDocument({ data, disableFontFace: true });
            const loaded = await task.promise;
            const previousTask = loadingTaskRef.current;
            loadingTaskRef.current = task;
            setDoc(loaded);
            previousTask?.destroy();
            setFileName(file.name);
            setPage(1);
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Could not read that PDF.",
            );
        }
    };

    const openSlidesWindow = () => {
        if (popup && !popup.win.closed) {
            popup.win.focus();
            return;
        }
        // Must run inside a click handler, otherwise popup blockers will stop it
        const win = window.open(
            "",
            "beamerr-slides",
            "popup,width=960,height=540",
        );
        if (!win) {
            setError(
                "The slides window was blocked. Allow popups for this site and try again.",
            );
            return;
        }
        win.document.title = `Slides - ${fileName}`;

        document
            .querySelectorAll('link[rel="stylesheet"], style')
            .forEach((node) => {
                win.document.head.appendChild(node.cloneNode(true));
            });
        win.document.body.style.margin = "0";
        win.document.body.style.background = "#000";

        const mount = win.document.createElement("div");
        mount.style.width = "100vw";
        mount.style.height = "100vh";
        win.document.body.appendChild(mount);

        win.addEventListener("pagehide", () => setPopup(null));
        setPopup({ win, mount });
    };

    // Close the popup when the main window goes away
    useEffect(() => {
        const close = () => popup?.win.close();
        window.addEventListener("beforeunload", close);
        return () => window.removeEventListener("beforeunload", close);
    }, [popup]);

    // Keyboard navigation in both windows
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowRight":
                case "ArrowDown":
                case "PageDown":
                case " ":
                    e.preventDefault();
                    setPage((p) => Math.min(p + 1, pageCount));
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                case "PageUp":
                    e.preventDefault();
                    setPage((p) => Math.max(p - 1, 1));
                    break;
                case "Home":
                    setPage(1);
                    break;
                case "End":
                    setPage(pageCount);
                    break;
            }
        };
        window.addEventListener("keydown", onKey);
        popup?.win.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            popup?.win.removeEventListener("keydown", onKey);
        };
    }, [popup, pageCount]);

    return (
        <div className="flex h-screen flex-col gap-3 p-4">
            <header className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold">Beamerr</h1>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <Button
                    variant="default"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload />
                    {doc ? "Change PDF" : "Select PDF"}
                </Button>

                {doc && (
                    <>
                        <Button variant="secondary" onClick={openSlidesWindow}>
                            {popup ? (
                                <PictureInPicture />
                            ) : (
                                <PictureInPicture2 />
                            )}
                            {popup
                                ? "Focus slides window"
                                : "Open slides window"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setShowPreviews((v) => !v)}
                        >
                            {showPreviews ? <EyeOff /> : <Eye />}
                            {showPreviews ? "Hide previews" : "Show previews"}
                        </Button>
                        <div className="ml-auto flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => goTo(page - 1)}
                                disabled={page <= 1}
                            >
                                Prev
                            </Button>
                            <span className="text-sm tabular-nums">
                                {page} / {pageCount}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => goTo(page + 1)}
                                disabled={page >= pageCount}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </header>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <main className="flex min-h-0 flex-1 gap-3">
                {doc ? (
                    <>
                        <section className="flex min-w-0 flex-2 flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide opacity-70">
                                Notes
                            </span>
                            <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
                                <PdfHalfCanvas
                                    doc={doc}
                                    pageNumber={page}
                                    half="right"
                                    background="transparent"
                                />
                            </div>
                        </section>

                        {showPreviews && (
                            <aside className="flex min-w-0 flex-1 flex-col gap-3">
                                <div className="flex min-h-0 flex-1 flex-col gap-1">
                                    <span className="text-xs uppercase tracking-wide opacity-70">
                                        Current
                                    </span>
                                    <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
                                        <PdfHalfCanvas
                                            doc={doc}
                                            pageNumber={page}
                                            half="left"
                                        />
                                    </div>
                                </div>
                                <div className="flex min-h-0 flex-1 flex-col gap-1">
                                    <span className="text-xs uppercase tracking-wide opacity-70">
                                        Next
                                    </span>
                                    <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
                                        {page < pageCount ? (
                                            <PdfHalfCanvas
                                                doc={doc}
                                                pageNumber={page + 1}
                                                half="left"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-black text-sm text-white/70">
                                                End of presentation
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        )}
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-md border text-sm opacity-70">
                        Select a Beamer PDF with notes (slides on the left,
                        notes on the right).
                    </div>
                )}
            </main>

            {doc &&
                popup &&
                createPortal(
                    <PdfHalfCanvas doc={doc} pageNumber={page} half="left" />,
                    popup.mount,
                )}
        </div>
    );
};

export default App;
