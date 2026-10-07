import { useEffect } from 'react';

import type { Theme } from '@/lib/settings';

export function useTheme(theme: Theme) {
    useEffect(() => {
        const root = document.documentElement;
        if (theme !== 'system') {
            root.classList.toggle('dark', theme === 'dark');
            return;
        }
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const apply = () => root.classList.toggle('dark', mq.matches);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, [theme]);
}
