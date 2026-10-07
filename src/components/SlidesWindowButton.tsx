import type { Ref } from 'react';
import {
    ChevronDown,
    Expand,
    Maximize2,
    Minimize2,
    PictureInPicture,
    PictureInPicture2,
    Shrink,
    X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
    isFullscreen,
    isMaximized,
    maximize,
    restore,
    toggleFullscreen,
} from '@/lib/slides-window';
import { Button } from './ui/button';
import { Group, GroupSeparator } from './ui/group';
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuShortcut, MenuTrigger } from './ui/menu';

type Props = {
    isOpen: boolean;
    getWindow: () => Window | null;
    buttonRef?: Ref<HTMLButtonElement>;
    onOpen: () => void;
    onClose: () => void;
};

export const SlidesWindowButton = ({ isOpen, getWindow, buttonRef, onOpen, onClose }: Props) => {
    const { t } = useTranslation();
    const label = isOpen ? t('app.focusSlidesWindow') : t('app.openSlidesWindow');

    return (
        <Group>
            <Button ref={buttonRef} variant="secondary" aria-label={label} onClick={onOpen}>
                {isOpen ? <PictureInPicture /> : <PictureInPicture2 />}
                <span className="max-md:sr-only">{label}</span>
            </Button>
            {isOpen && (
                <>
                    <GroupSeparator />
                    <Menu>
                        <MenuTrigger
                            render={
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    aria-label={t('slidesWindow.menu')}
                                >
                                    <ChevronDown />
                                </Button>
                            }
                        />
                        <MenuPopup align="end">
                            <SlidesWindowMenuItems getWindow={getWindow} onClose={onClose} />
                        </MenuPopup>
                    </Menu>
                </>
            )}
        </Group>
    );
};

const SlidesWindowMenuItems = ({ getWindow, onClose }: Pick<Props, 'getWindow' | 'onClose'>) => {
    const { t } = useTranslation();
    const win = getWindow();
    if (!win || win.closed) return null;

    return (
        <>
            <MenuItem onClick={() => toggleFullscreen(win, t('slidesWindow.fullscreenPrompt'))}>
                {isFullscreen(win) ? <Shrink /> : <Expand />}
                {isFullscreen(win)
                    ? t('slidesWindow.exitFullscreen')
                    : t('slidesWindow.fullscreen')}
                <MenuShortcut>F</MenuShortcut>
            </MenuItem>
            {isMaximized(win) ? (
                <MenuItem onClick={() => restore(win)}>
                    <Minimize2 />
                    {t('slidesWindow.restore')}
                </MenuItem>
            ) : (
                <MenuItem onClick={() => maximize(win)}>
                    <Maximize2 />
                    {t('slidesWindow.maximize')}
                </MenuItem>
            )}
            <MenuSeparator />
            <MenuItem variant="destructive" onClick={onClose}>
                <X />
                {t('slidesWindow.close')}
            </MenuItem>
        </>
    );
};
