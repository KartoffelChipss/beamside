import { useState, type ReactNode } from 'react';
import { Presentation, Upload } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from './ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from './ui/empty';
import { Kbd, KbdGroup } from './ui/kbd';
import { cn } from '@/lib/utils';

type Props = {
    onSelect: () => void;
    onFile: (file: File | undefined) => void;
};

const NOTES_OPTION = '\\setbeameroption{show notes on second screen=right}';

export const GetStarted = ({ onSelect, onFile }: Props) => {
    const { t } = useTranslation();
    const [dragging, setDragging] = useState(false);

    return (
        <Empty
            className={cn(
                'h-full justify-start overflow-y-auto rounded-xl border-2 border-dashed transition-colors',
                dragging && 'border-primary bg-muted'
            )}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                onFile(e.dataTransfer.files[0]);
            }}
        >
            <EmptyHeader className="mt-auto max-w-md">
                <EmptyMedia variant="icon">
                    <Presentation />
                </EmptyMedia>
                <EmptyTitle className="text-2xl">{t('getStarted.title')}</EmptyTitle>
                <EmptyDescription className="text-base">
                    {t('getStarted.description')}
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent className="mb-auto max-w-md gap-6">
                <Button size="xl" onClick={onSelect}>
                    <Upload />
                    {t('getStarted.selectPdf')}
                </Button>
                <p className="text-muted-foreground">{t('getStarted.dropHint')}</p>

                <ol className="w-full space-y-4 text-left mt-6">
                    <Step n={1} title={t('getStarted.step1Title')}>
                        <Trans i18nKey="getStarted.step1Intro" components={{ code: <code /> }} />
                        <pre className="my-2 overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs">
                            {NOTES_OPTION}
                        </pre>
                        <Trans i18nKey="getStarted.step1Outro" components={{ code: <code /> }} />
                    </Step>
                    <Step n={2} title={t('getStarted.step2Title')}>
                        {t('getStarted.step2Body')}
                    </Step>
                    <Step n={3} title={t('getStarted.step3Title')}>
                        <Trans
                            i18nKey="getStarted.step3Body"
                            components={{
                                arrows: (
                                    <KbdGroup>
                                        <Kbd>←</Kbd>
                                        <Kbd>→</Kbd>
                                    </KbdGroup>
                                ),
                                kbd: <Kbd />,
                            }}
                        />
                    </Step>
                </ol>
            </EmptyContent>
        </Empty>
    );
};

const Step = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
    <li className="flex gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {n}
        </span>
        <div className="min-w-0">
            <p className="font-medium">{title}</p>
            <div className="text-muted-foreground">{children}</div>
        </div>
    </li>
);
