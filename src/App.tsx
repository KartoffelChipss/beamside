import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useTranslation } from 'react-i18next';

import { Button } from './components/ui/button';
import { AppBrand } from './components/AppBrand';
import { GetStarted } from './components/GetStarted';
import { PdfHalfCanvas } from './components/PdfHalfCanvas';
import { PresentationTimer } from './components/PresentationTimer';
import { SettingsDialog } from './components/SettingsDialog';
import { useTheme } from './hooks/useTheme';
import { applyLanguagePreference } from './i18n';
import { detectNotesLayout, type NotesLayout } from './lib/notes-layout';
import { loadSettings, saveSettings, type Settings } from './lib/settings';
import {
    ChevronLeft,
    ChevronRight,
    PictureInPicture,
    PictureInPicture2,
    Upload,
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type Popup = { win: Window; mount: HTMLDivElement };
type AppError = 'readFailed' | 'popupBlocked';

const setWindowTitle = (win: Window, title: string) => {
    win.document.title = title;
};

const App = () => {
    const { t } = useTranslation();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
    const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
    const [layout, setLayout] = useState<NotesLayout>('none');
    const [fileName, setFileName] = useState<string>('');
    const [page, setPage] = useState(1);
    const [popup, setPopup] = useState<Popup | null>(null);
    const [error, setError] = useState<AppError | null>(null);
    const [settings, setSettings] = useState<Settings>(loadSettings);
    useTheme(settings.theme);

    const updateSettings = (next: Settings) => {
        if (next.language !== settings.language) applyLanguagePreference(next.language);
        setSettings(next);
        saveSettings(next);
    };

    const pageCount = doc?.numPages ?? 0;

    const goTo = useCallback(
        (n: number) => setPage((_) => Math.min(Math.max(n, 1), Math.max(pageCount, 1))),
        [pageCount]
    );

    const handleFile = async (file: File | undefined) => {
        if (!file) return;
        setError(null);
        try {
            const data = new Uint8Array(await file.arrayBuffer());
            const task = pdfjsLib.getDocument({ data, disableFontFace: true });
            const loaded = await task.promise;
            const detectedLayout = await detectNotesLayout(loaded);
            const previousTask = loadingTaskRef.current;
            loadingTaskRef.current = task;
            setDoc(loaded);
            setLayout(detectedLayout);
            previousTask?.destroy();
            setFileName(file.name);
            setPage(1);
        } catch (e) {
            console.error(e);
            setError('readFailed');
        }
    };

    const openSlidesWindow = () => {
        if (popup && !popup.win.closed) {
            popup.win.focus();
            return;
        }
        // Must run inside a click handler, otherwise popup blockers will stop it
        const win = window.open('', 'beamerr-slides', 'popup,width=960,height=540');
        if (!win) {
            setError('popupBlocked');
            return;
        }
        document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
            win.document.head.appendChild(node.cloneNode(true));
        });
        win.document.body.style.margin = '0';
        win.document.body.style.background = '#000';

        const mount = win.document.createElement('div');
        mount.style.width = '100vw';
        mount.style.height = '100vh';
        win.document.body.appendChild(mount);

        win.addEventListener('pagehide', () => setPopup(null));
        setPopup({ win, mount });
    };

    useEffect(() => {
        if (popup) setWindowTitle(popup.win, t('app.slidesWindowTitle', { name: fileName }));
    }, [popup, fileName, t]);

    // Close the popup when the main window goes away
    useEffect(() => {
        const close = () => popup?.win.close();
        window.addEventListener('beforeunload', close);
        return () => window.removeEventListener('beforeunload', close);
    }, [popup]);

    // Keyboard navigation in both windows
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof Element && e.target.closest('[role=dialog]')) return;
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    setPage((p) => Math.min(p + 1, pageCount));
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    setPage((p) => Math.max(p - 1, 1));
                    break;
                case 'Home':
                    setPage(1);
                    break;
                case 'End':
                    setPage(pageCount);
                    break;
            }
        };
        window.addEventListener('keydown', onKey);
        popup?.win.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            popup?.win.removeEventListener('keydown', onKey);
        };
    }, [popup, pageCount]);

    return (
        <div className="flex h-screen flex-col gap-3 p-4">
            <header className="flex items-center gap-3">
                <AppBrand />
                {doc && (
                    <span className="min-w-0 truncate text-sm text-muted-foreground" title={fileName}>
                        {fileName}
                    </span>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <div className="ml-auto flex shrink-0 items-center gap-2">
                    {doc && (
                        <>
                            <Button
                                variant="secondary"
                                aria-label={t('app.changePdf')}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload />
                                <span className="max-md:sr-only">{t('app.changePdf')}</span>
                            </Button>
                            <Button
                                variant="secondary"
                                aria-label={popup ? t('app.focusSlidesWindow') : t('app.openSlidesWindow')}
                                onClick={openSlidesWindow}
                            >
                                {popup ? <PictureInPicture /> : <PictureInPicture2 />}
                                <span className="max-md:sr-only">
                                    {popup ? t('app.focusSlidesWindow') : t('app.openSlidesWindow')}
                                </span>
                            </Button>
                        </>
                    )}
                    <SettingsDialog settings={settings} onChange={updateSettings} />
                </div>
            </header>

            {error && <p className="text-sm text-red-500">{t(`errors.${error}`)}</p>}

            <main className="flex min-h-0 flex-1 gap-3">
                {doc ? (
                    <>
                        <section className="flex min-w-0 flex-2 flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide opacity-70">
                                {t('panels.notes')}
                            </span>
                            <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
                                {layout === 'none' ? (
                                    <div className="flex h-full items-center justify-center text-sm opacity-70">
                                        {t('panels.noNotes')}
                                    </div>
                                ) : (
                                    <PdfHalfCanvas
                                        doc={doc}
                                        pageNumber={page}
                                        layout={layout}
                                        part="notes"
                                        background="transparent"
                                    />
                                )}
                            </div>
                        </section>

                        {(settings.showCurrent || settings.showNext) && (
                            <aside className="flex min-w-0 flex-1 flex-col gap-3">
                                {settings.showCurrent && (
                                    <div className="flex min-h-0 flex-1 flex-col gap-1">
                                        <span className="text-xs uppercase tracking-wide opacity-70">
                                            {t('panels.current')}
                                        </span>
                                        <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
                                            <PdfHalfCanvas
                                                doc={doc}
                                                pageNumber={page}
                                                layout={layout}
                                                part="slide"
                                            />
                                        </div>
                                    </div>
                                )}
                                {settings.showNext && (
                                    <div className="flex min-h-0 flex-1 flex-col gap-1">
                                        <span className="text-xs uppercase tracking-wide opacity-70">
                                            {t('panels.next')}
                                        </span>
                                        <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
                                            {page < pageCount ? (
                                                <PdfHalfCanvas
                                                    doc={doc}
                                                    pageNumber={page + 1}
                                                    layout={layout}
                                                    part="slide"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-black text-sm text-white/70">
                                                    {t('panels.endOfPresentation')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </aside>
                        )}
                    </>
                ) : (
                    <GetStarted
                        onSelect={() => fileInputRef.current?.click()}
                        onFile={handleFile}
                    />
                )}
            </main>

            {doc && (
                <footer className="flex items-center justify-between gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr]">
                    <div className="flex min-w-0">{settings.showTimer && <PresentationTimer />}</div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label={t('app.previousSlide')}
                            onClick={() => goTo(page - 1)}
                            disabled={page <= 1}
                        >
                            <ChevronLeft />
                        </Button>
                        <span className="min-w-16 text-center font-mono text-sm">
                            {page} / {pageCount}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label={t('app.nextSlide')}
                            onClick={() => goTo(page + 1)}
                            disabled={page >= pageCount}
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </footer>
            )}

            {doc &&
                popup &&
                createPortal(
                    <PdfHalfCanvas doc={doc} pageNumber={page} layout={layout} part="slide" />,
                    popup.mount
                )}
        </div>
    );
};

export default App;
