import { WhyStayInnCard } from "@/components/why-stay-inn-card";
import { WHY_STAY_INN_REASONS } from "@/lib/why-stay-inn-data";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function WhyStayInnGrid({ className }: Props) {
  return (
    <div className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-4", className)}>
      {WHY_STAY_INN_REASONS.map((reason, index) => (
        <WhyStayInnCard key={reason.title} index={index} {...reason} />
      ))}
    </div>
  );
}
