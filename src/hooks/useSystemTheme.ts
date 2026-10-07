import { useEffect } from "react";

export function useSystemTheme() {
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = () => {
            if (localStorage.getItem("theme")) return;
            document.documentElement.classList.toggle("dark", mq.matches);
        };
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);
}
