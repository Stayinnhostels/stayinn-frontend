import { FacilityCard } from "@/components/facility-card";
import { fetchPublicFacilities } from "@/lib/facilities-api";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  limit?: number;
};

export async function FacilitiesGrid({ className, limit }: Props) {
  const fetched = await fetchPublicFacilities();
  const items = limit ? fetched.slice(0, limit) : fetched;

  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Facilities will appear here once added in the admin dashboard.
      </p>
    );
  }

  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((facility) => (
        <FacilityCard
          key={facility.id}
          title={facility.title}
          description={facility.description}
          icon={facility.icon}
        />
      ))}
    </div>
  );
}
