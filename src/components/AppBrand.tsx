import { Presentation } from 'lucide-react';

export const AppBrand = () => (
    <div className="flex shrink-0 items-center gap-2">
        <span
            className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            aria-hidden
        >
            <Presentation className="size-4.5" />
        </span>
        <h1 className="text-xl font-semibold">Beamerr</h1>
    </div>
);
