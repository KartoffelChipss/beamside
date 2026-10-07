import type { en } from './en';

export const de: typeof en = {
    app: {
        changePdf: 'PDF wechseln',
        openSlidesWindow: 'Folienfenster öffnen',
        focusSlidesWindow: 'Zum Folienfenster',
        slidesWindowTitle: 'Folien - {{name}}',
        previousSlide: 'Vorherige Folie',
        nextSlide: 'Nächste Folie',
    },
    panels: {
        notes: 'Notizen',
        current: 'Aktuell',
        next: 'Nächste',
        noNotes: 'Diese PDF enthält keine Notizen.',
        endOfPresentation: 'Ende der Präsentation',
    },
    errors: {
        readFailed: 'Diese PDF konnte nicht gelesen werden.',
        popupBlocked:
            'Das Folienfenster wurde blockiert. Erlaube Pop-ups für diese Seite und versuche es erneut.',
    },
    getStarted: {
        title: 'Beamer-Folien mit deinen Notizen präsentieren',
        description:
            'Dein Publikum sieht die Folien, du siehst deine Notizen und die nächste Folie. Alles läuft in deinem Browser und deine PDF verlässt nie deinen Computer.',
        selectPdf: 'PDF auswählen und loslegen',
        dropHint: 'oder irgendwo in diesem Feld ablegen',
        step1Title: 'Notizen zu deinen Folien hinzufügen (optional)',
        step1Intro:
            'Füge dies in deine Präambel ein und nutze dann <code>\\note{…}</code> in deinen Frames:',
        step1Outro:
            'Notizen unten (<code>=bottom</code>) oder gar keine Notizen funktionieren auch.',
        step2Title: 'Die kompilierte PDF auswählen',
        step2Body: 'Beamside erkennt, wo deine Notizen sind.',
        step3Title: 'Das Folienfenster öffnen',
        step3Body:
            'Schiebe es auf den Beamer und schalte es in den Vollbildmodus. Mit <arrows/> oder <kbd>Leertaste</kbd> wechselst du die Folien.',
    },
    timer: {
        label: 'Präsentationszeit',
        start: 'Timer starten',
        pause: 'Timer pausieren',
        reset: 'Timer zurücksetzen',
    },
    settings: {
        button: 'Einstellungen',
        title: 'Einstellungen',
        description: 'Änderungen gelten sofort und werden in diesem Browser gespeichert.',
        general: 'Allgemein',
        language: 'Sprache',
        languageDescription: 'Standardmäßig wird die Sprache deines Browsers verwendet.',
        languageSystem: 'Browser-Standard',
        theme: 'Design',
        themeDescription: 'Folgt standardmäßig dem Erscheinungsbild deines Systems.',
        themeSystem: 'System',
        themeLight: 'Hell',
        themeDark: 'Dunkel',
        presenterView: 'Referentenansicht',
        currentSlide: 'Aktuelle Folie',
        currentSlideDescription: 'Zeigt, was das Publikum gerade sieht.',
        nextSlide: 'Nächste Folie',
        nextSlideDescription: 'Vorschau der kommenden Folie.',
        timer: 'Timer',
        timerDescription: 'Misst, wie lange deine Präsentation dauert.',
    },
};
