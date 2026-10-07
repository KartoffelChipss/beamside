import { Settings as SettingsIcon } from 'lucide-react';

import type { Settings } from '@/lib/settings';
import { Button } from './ui/button';
import {
    Menu,
    MenuCheckboxItem,
    MenuGroup,
    MenuGroupLabel,
    MenuPopup,
    MenuTrigger,
} from './ui/menu';

type Props = {
    settings: Settings;
    onChange: (settings: Settings) => void;
};

export const SettingsMenu = ({ settings, onChange }: Props) => {
    const toggle = (key: keyof Settings) => (checked: boolean) =>
        onChange({ ...settings, [key]: checked });

    return (
        <Menu>
            <MenuTrigger
                render={
                    <Button variant="secondary">
                        <SettingsIcon />
                        Settings
                    </Button>
                }
            />
            <MenuPopup align="end" className="w-52">
                <MenuGroup>
                    <MenuGroupLabel>Previews</MenuGroupLabel>
                    <MenuCheckboxItem
                        variant="switch"
                        checked={settings.showCurrent}
                        onCheckedChange={toggle('showCurrent')}
                    >
                        Current slide
                    </MenuCheckboxItem>
                    <MenuCheckboxItem
                        variant="switch"
                        checked={settings.showNext}
                        onCheckedChange={toggle('showNext')}
                    >
                        Next slide
                    </MenuCheckboxItem>
                </MenuGroup>
            </MenuPopup>
        </Menu>
    );
};
