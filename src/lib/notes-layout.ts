import type { PDFDocumentProxy } from 'pdfjs-dist';

export type NotesLayout = 'right' | 'bottom' | 'none';

export const detectNotesLayout = async (doc: PDFDocumentProxy): Promise<NotesLayout> => {
    const page = await doc.getPage(1);
    const { width, height } = page.getViewport({ scale: 1 });
    const ratio = width / height;

    if (ratio > 2.2) return 'right';
    if (ratio < 1) return 'bottom';
    return 'none';
};
