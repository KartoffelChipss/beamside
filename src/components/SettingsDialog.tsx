import { useId, type ReactNode } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

import type { Settings } from '@/lib/settings';
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
import { Label } from './ui/label';
import { Switch } from './ui/switch';

type Props = {
    settings: Settings;
    onChange: (settings: Settings) => void;
};

export const SettingsDialog = ({ settings, onChange }: Props) => {
    const toggle = (key: keyof Settings) => (checked: boolean) =>
        onChange({ ...settings, [key]: checked });

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button variant="secondary">
                        <SettingsIcon />
                        Settings
                    </Button>
                }
            />
            <DialogPopup className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Changes apply immediately and are saved in this browser.
                    </DialogDescription>
                </DialogHeader>
                <DialogPanel className="flex flex-col gap-6">
                    <SettingsSection title="Presenter view">
                        <SwitchRow
                            label="Current slide"
                            description="Show what the audience currently sees."
                            checked={settings.showCurrent}
                            onCheckedChange={toggle('showCurrent')}
                        />
                        <SwitchRow
                            label="Next slide"
                            description="Preview the upcoming slide."
                            checked={settings.showNext}
                            onCheckedChange={toggle('showNext')}
                        />
                    </SettingsSection>
                </DialogPanel>
            </DialogPopup>
        </Dialog>
    );
};

const SettingsSection = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
        </h3>
        <div className="divide-y rounded-lg border">{children}</div>
    </section>
);

const SwitchRow = ({
    label,
    description,
    checked,
    onCheckedChange,
}: {
    label: string;
    description?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) => {
    const id = useId();
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 flex-col gap-1">
                <Label htmlFor={id}>{label}</Label>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
};
