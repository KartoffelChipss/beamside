import { useId, type ReactNode } from 'react';
import { Monitor, Moon, Settings as SettingsIcon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LANGUAGES, type LanguagePreference } from '@/i18n';
import type { Settings, Theme } from '@/lib/settings';
import { PresenterLayoutSettings } from './PresenterLayoutSettings';
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
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

type Props = {
    settings: Settings;
    onChange: (settings: Settings) => void;
};

export const SettingsDialog = ({ settings, onChange }: Props) => {
    const { t } = useTranslation();

    const languageItems: { value: LanguagePreference; label: string }[] = [
        { value: 'system', label: t('settings.languageSystem') },
        ...Object.entries(LANGUAGES).map(([value, label]) => ({
            value: value as LanguagePreference,
            label,
        })),
    ];
    const languageId = useId();
    const themeId = useId();

    const themeItems: { value: Theme; label: string; icon: ReactNode }[] = [
        { value: 'system', label: t('settings.themeSystem'), icon: <Monitor /> },
        { value: 'light', label: t('settings.themeLight'), icon: <Sun /> },
        { value: 'dark', label: t('settings.themeDark'), icon: <Moon /> },
    ];

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button variant="secondary" aria-label={t('settings.button')}>
                        <SettingsIcon />
                        <span className="max-md:sr-only">{t('settings.button')}</span>
                    </Button>
                }
            />
            <DialogPopup className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{t('settings.title')}</DialogTitle>
                    <DialogDescription>{t('settings.description')}</DialogDescription>
                </DialogHeader>
                <DialogPanel className="flex flex-col gap-6">
                    <SettingsSection title={t('settings.general')}>
                        <SettingRow
                            id={languageId}
                            label={t('settings.language')}
                            description={t('settings.languageDescription')}
                        >
                            <Select
                                items={languageItems}
                                value={settings.language}
                                onValueChange={(language) =>
                                    language && onChange({ ...settings, language })
                                }
                            >
                                <SelectTrigger id={languageId} className="w-44 shrink-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectPopup>
                                    {languageItems.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectPopup>
                            </Select>
                        </SettingRow>
                        <SettingRow
                            id={themeId}
                            label={t('settings.theme')}
                            description={t('settings.themeDescription')}
                        >
                            <ToggleGroup
                                id={themeId}
                                aria-label={t('settings.theme')}
                                variant="outline"
                                className="shrink-0"
                                value={[settings.theme]}
                                onValueChange={([theme]) =>
                                    theme && onChange({ ...settings, theme: theme as Theme })
                                }
                            >
                                {themeItems.map((item) => (
                                    <ToggleGroupItem
                                        key={item.value}
                                        value={item.value}
                                        aria-label={item.label}
                                        title={item.label}
                                    >
                                        {item.icon}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </SettingRow>
                    </SettingsSection>
                    <SettingsSection title={t('settings.presenterView')}>
                        <PresenterLayoutSettings
                            value={settings.presenterLayout}
                            onChange={(presenterLayout) =>
                                onChange({ ...settings, presenterLayout })
                            }
                        />
                        <SwitchRow
                            label={t('settings.timer')}
                            description={t('settings.timerDescription')}
                            checked={settings.showTimer}
                            onCheckedChange={(showTimer) => onChange({ ...settings, showTimer })}
                        />
                        <SwitchRow
                            label={t('settings.laserPointer')}
                            description={t('settings.laserPointerDescription')}
                            checked={settings.laserPointer}
                            onCheckedChange={(laserPointer) =>
                                onChange({ ...settings, laserPointer })
                            }
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

const SettingRow = ({
    id,
    label,
    description,
    children,
}: {
    id: string;
    label: string;
    description?: string;
    children: ReactNode;
}) => (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 flex-col gap-1">
            <Label htmlFor={id}>{label}</Label>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
    </div>
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
        <SettingRow id={id} label={label} description={description}>
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
        </SettingRow>
    );
};
