export const BrandMark = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
        <rect x="3" y="7" width="26" height="18" rx="3" stroke="currentColor" strokeWidth="2.5" />
        <rect x="5.5" y="9.5" width="10" height="13" rx="1" fill="currentColor" />
        <path
            d="M19 12.5h7M19 16h7M19 19.5h4.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
        />
    </svg>
);

export const AppBrand = () => (
    <div className="flex shrink-0 items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
            <BrandMark className="size-5.5" />
        </span>
        <h1 className="text-xl font-semibold">Beamside</h1>
    </div>
);
