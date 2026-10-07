import type { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from './ui/button';
import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogPanel,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Kbd } from './ui/kbd';

const NOTES_RIGHT = '\\setbeameroption{show notes on second screen=right}';
const NOTES_BOTTOM = '\\setbeameroption{show notes on second screen=bottom}';

const richText = {
    code: <code />,
    b: <strong className="font-medium text-foreground" />,
    kbd: <Kbd />,
};

const SHORTCUTS: { keys: string[]; label: string }[] = [
    { keys: ['→', '↓', 'Space', 'PgDn'], label: 'help.shortcuts.next' },
    { keys: ['←', '↑', 'PgUp'], label: 'help.shortcuts.previous' },
    { keys: ['Home', 'End'], label: 'help.shortcuts.firstLast' },
    { keys: ['F'], label: 'help.shortcuts.fullscreen' },
];

export const HelpDialog = () => {
    const { t } = useTranslation();

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button
                        variant="secondary"
                        size="icon"
                        aria-label={t('help.button')}
                        title={t('help.button')}
                    >
                        <CircleHelp />
                    </Button>
                }
            />
            <DialogPopup className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{t('help.title')}</DialogTitle>
                    <DialogDescription>{t('help.description')}</DialogDescription>
                </DialogHeader>
                <DialogPanel className="flex flex-col gap-6 text-sm">
                    <HelpSection title={t('help.withNotes.title')}>
                        <p>
                            <Trans i18nKey="help.withNotes.setup" components={richText} />
                        </p>
                        <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs text-foreground">
                            {NOTES_RIGHT}
                        </pre>
                        <p>
                            <Trans i18nKey="help.withNotes.bottom" components={richText} />
                        </p>
                        <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs text-foreground">
                            {NOTES_BOTTOM}
                        </pre>
                        <p>
                            <Trans i18nKey="help.withNotes.write" components={richText} />
                        </p>
                    </HelpSection>

                    <HelpSection title={t('help.withoutNotes.title')}>
                        <p>
                            <Trans i18nKey="help.withoutNotes.body" components={richText} />
                        </p>
                    </HelpSection>

                    <HelpSection title={t('help.presenting.title')}>
                        <ol className="list-decimal space-y-1 ps-5">
                            {(['select', 'open', 'presenter'] as const).map((step) => (
                                <li key={step}>
                                    <Trans
                                        i18nKey={`help.presenting.${step}`}
                                        components={richText}
                                    />
                                </li>
                            ))}
                        </ol>
                    </HelpSection>

                    <HelpSection title={t('help.shortcuts.title')}>
                        <dl className="divide-y rounded-lg border">
                            {SHORTCUTS.map(({ keys, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between gap-4 px-3 py-2"
                                >
                                    <dt className="text-foreground">
                                        {t(label as 'help.shortcuts.next')}
                                    </dt>
                                    <dd className="flex flex-wrap justify-end gap-1">
                                        {keys.map((key) => (
                                            <Kbd key={key}>{key}</Kbd>
                                        ))}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </HelpSection>

                    <HelpSection title={t('help.tools.title')}>
                        <ul className="space-y-2">
                            {(['laser', 'draw', 'timer', 'layout'] as const).map((tool) => (
                                <li key={tool}>
                                    <Trans i18nKey={`help.tools.${tool}`} components={richText} />
                                </li>
                            ))}
                        </ul>
                    </HelpSection>
                </DialogPanel>
            </DialogPopup>
        </Dialog>
    );
};

const HelpSection = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-2 text-muted-foreground">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        {children}
    </section>
);
