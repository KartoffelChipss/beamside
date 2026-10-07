import type { RefObject } from 'react';
import { PictureInPicture2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from './ui/button';
import { Popover, PopoverDescription, PopoverPopup, PopoverTitle } from './ui/popover';

type Props = {
    open: boolean;
    anchor: RefObject<HTMLElement | null>;
    onOpenSlidesWindow: () => void;
    onDismiss: () => void;
};

export const SlidesWindowHint = ({ open, anchor, onOpenSlidesWindow, onDismiss }: Props) => {
    const { t } = useTranslation();

    return (
        <Popover open={open}>
            <PopoverPopup
                anchor={anchor}
                side="bottom"
                align="end"
                sideOffset={8}
                className="w-80"
                initialFocus={false}
                finalFocus={false}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <PopoverTitle className="text-base">
                            {t('hints.slidesWindow.title')}
                        </PopoverTitle>
                        <PopoverDescription>
                            {t('hints.slidesWindow.description')}
                        </PopoverDescription>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={onDismiss}>
                            {t('hints.dismiss')}
                        </Button>
                        <Button size="sm" onClick={onOpenSlidesWindow}>
                            <PictureInPicture2 />
                            {t('app.openSlidesWindow')}
                        </Button>
                    </div>
                </div>
            </PopoverPopup>
        </Popover>
    );
};
