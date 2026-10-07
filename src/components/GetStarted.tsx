import { useState, type ReactNode } from 'react';
import { Presentation, Upload } from 'lucide-react';

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
                <EmptyTitle className="text-2xl">Present Beamer slides with your notes</EmptyTitle>
                <EmptyDescription className="text-base">
                    Your audience sees the slides, and you see your notes and the next slide.
                    Everything runs in your browser and your PDF never leaves your computer.
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent className="mb-auto max-w-md gap-6">
                <Button size="xl" onClick={onSelect}>
                    <Upload />
                    Select a PDF to get started
                </Button>
                <p className="text-muted-foreground">or drop it anywhere in this box</p>

                <ol className="w-full space-y-4 text-left mt-6">
                    <Step n={1} title="Add notes to your slides (optional)">
                        Put this in your preamble, then use <code>\note{'{…}'}</code> in your
                        frames:
                        <pre className="mt-2 overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs">
                            {NOTES_OPTION}
                        </pre>
                        Notes at the bottom (<code>=bottom</code>) or no notes at all work too.
                    </Step>
                    <Step n={2} title="Select the compiled PDF">
                        Beamerr detects where your notes are.
                    </Step>
                    <Step n={3} title="Open the slides window">
                        Move it to the projector and make it fullscreen. Use{' '}
                        <KbdGroup>
                            <Kbd>←</Kbd>
                            <Kbd>→</Kbd>
                        </KbdGroup>{' '}
                        or <Kbd>Space</Kbd> to move between slides.
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
