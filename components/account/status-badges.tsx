import { Badge } from "@/components/ui/badge";
import {
  BOOKING_STATUS_CLASS,
  BOOKING_STATUS_LABELS,
  RENT_STATUS_CLASS,
  RENT_STATUS_LABELS,
  SECURITY_STATUS_LABELS,
} from "@/lib/guest-format";
import type { GuestBookingStatus } from "@/lib/guest-api";
import { cn } from "@/lib/utils";

export function BookingStatusBadge({ status }: { status: string }) {
  const key = status as GuestBookingStatus;
  return (
    <Badge variant="outline" className={cn("rounded-full capitalize", BOOKING_STATUS_CLASS[key])}>
      {BOOKING_STATUS_LABELS[key] ?? status.replace(/_/g, " ")}
    </Badge>
  );
}

export function RentStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-full", RENT_STATUS_CLASS[status] ?? "")}>
      {RENT_STATUS_LABELS[status] ?? status.replace(/_/g, " ")}
    </Badge>
  );
}

export function SecurityStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className="rounded-full capitalize">
      {SECURITY_STATUS_LABELS[status] ?? status.replace(/_/g, " ")}
    </Badge>
  );
}
