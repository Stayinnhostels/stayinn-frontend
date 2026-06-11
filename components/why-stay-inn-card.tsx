import type { WhyStayInnReason } from "@/lib/why-stay-inn-data";

type Props = WhyStayInnReason & {
  index: number;
};

export function WhyStayInnCard({ icon: Icon, title, desc, index }: Props) {
  return (
    <article className="group relative rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/40 p-6 shadow-sm transition-shadow hover:shadow-[var(--shadow-soft)]">
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 text-3xl font-black leading-none text-primary/15 select-none"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative flex items-start gap-4 pr-10">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 space-y-2">
          <h3 className="text-lg font-extrabold leading-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      </div>
    </article>
  );
}
