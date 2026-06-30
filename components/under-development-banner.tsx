import { Construction } from "lucide-react";

export function UnderDevelopmentBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-[60] border-b border-primary/40 bg-primary px-4 py-3 text-center text-primary-foreground shadow-sm"
    >
      <p className="flex flex-wrap items-center justify-center gap-2 text-sm font-extrabold tracking-wide sm:text-base">
        <Construction className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
        <span>
          This website is still under construction. All rooms shown are mock for now — features and
          listings may change.
        </span>
      </p>
    </div>
  );
}
