import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccountPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto max-w-4xl", className)}>{children}</div>;
}

export function AccountPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-9 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[1.85rem] font-semibold tracking-[-0.03em] sm:text-[2.1rem]">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function AccountSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-9", className)}>
      {title ? (
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em]">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function AccountCard({
  children,
  className,
  interactive,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6",
        interactive &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AccountStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <AccountCard className="flex items-center gap-4">
      {icon ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-xl font-semibold tracking-tight tabular-nums">{value}</p>
      </div>
    </AccountCard>
  );
}

export function AccountEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <AccountCard className="border-dashed py-14 text-center shadow-none">
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </AccountCard>
  );
}

export function AccountBookingCard({
  title,
  dates,
  meta,
  amount,
  status,
}: {
  title: string;
  dates: string;
  meta: string;
  amount: string;
  status: ReactNode;
}) {
  return (
    <AccountCard interactive className="h-full">
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-semibold tracking-tight">{title}</p>
        {status}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {dates}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {meta}
        </span>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-lg font-semibold tracking-tight">{amount}</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </AccountCard>
  );
}

export function AccountError({ message }: { message: string }) {
  return <p className="mb-6 text-sm text-destructive">{message}</p>;
}

export function AccountField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-2xl bg-muted/50 px-3.5 py-3">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}
