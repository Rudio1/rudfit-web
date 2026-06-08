import { cn } from "@/lib/utils";

interface MealPhotoScanOverlayProps {
  imageUrl: string;
  message?: string;
  className?: string;
}

function ScanCorner({
  className,
}: {
  className: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute size-7 border-primary",
        className,
      )}
      aria-hidden
    />
  );
}

export function MealPhotoScanOverlay({
  imageUrl,
  message = "Analisando foto…",
  className,
}: MealPhotoScanOverlayProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full max-h-[min(70vh,28rem)] overflow-hidden rounded-xl bg-black",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0 bg-linear-to-b from-black/35 via-black/10 to-black/35"
        aria-hidden
      />

      <div className="absolute inset-4 rounded-2xl border border-primary/50 shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_25%,transparent)]">
        <ScanCorner className="left-0 top-0 rounded-tl-2xl border-l-4 border-t-4" />
        <ScanCorner className="right-0 top-0 rounded-tr-2xl border-r-4 border-t-4" />
        <ScanCorner className="bottom-0 left-0 rounded-bl-2xl border-b-4 border-l-4" />
        <ScanCorner className="bottom-0 right-0 rounded-br-2xl border-b-4 border-r-4" />
      </div>

      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="meal-scan-beam absolute inset-x-0 h-28 will-change-[top]">
          <div className="relative h-full w-full">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary/90 shadow-[0_0_12px_var(--primary)]" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/25 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-transparent to-primary/10" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-transparent to-primary/10" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-6 pb-6 pt-16">
        <div className="mx-auto h-0.5 w-36 overflow-hidden rounded-full bg-white/20">
          <div className="meal-scan-progress h-full w-1/3 rounded-full bg-primary" />
        </div>
        <p className="mt-3.5 text-center text-sm font-semibold tracking-wide text-white/90">
          {message}
        </p>
      </div>
    </div>
  );
}
