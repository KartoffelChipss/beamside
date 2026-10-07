import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from './ui/button';

const format = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mmss = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return h ? `${h}:${mmss}` : mmss;
};

export const PresentationTimer = () => {
    const { t } = useTranslation();
    const [elapsed, setElapsed] = useState(0);
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [now, setNow] = useState(() => Date.now());

    const running = startedAt !== null;
    const total = elapsed + (running ? now - startedAt : 0);

    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(id);
    }, [running]);

    const toggle = () => {
        const current = Date.now();
        setNow(current);
        if (running) {
            setElapsed(elapsed + current - startedAt);
            setStartedAt(null);
        } else {
            setStartedAt(current);
        }
    };

    const reset = () => {
        setElapsed(0);
        setStartedAt(running ? Date.now() : null);
        setNow(Date.now());
    };

    return (
        <div className="flex items-center gap-1 rounded-lg border py-0.5 ps-2.5 pe-0.5">
            <Timer className="size-4 opacity-70" aria-hidden />
            <span
                className="min-w-12 text-center font-mono text-sm"
                role="timer"
                aria-label={t('timer.label')}
            >
                {format(total)}
            </span>
            <Button
                variant="ghost"
                size="icon-sm"
                aria-label={running ? t('timer.pause') : t('timer.start')}
                title={running ? t('timer.pause') : t('timer.start')}
                onClick={toggle}
            >
                {running ? <Pause /> : <Play />}
            </Button>
            <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t('timer.reset')}
                title={t('timer.reset')}
                onClick={reset}
                disabled={total === 0}
            >
                <RotateCcw />
            </Button>
        </div>
    );
};
