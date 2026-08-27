"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, Loader2, Plus, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createMyBookingRequest,
  fetchMyBookingRequests,
  withdrawMyBookingRequest,
  type GuestBooking,
  type GuestBookingRequest,
  type GuestBookingRequestType,
} from "@/lib/guest-api";
import { formatStayDate } from "@/lib/guest-format";
import { fetchRooms, formatMarketingRoomTitle, isRoomListedOnSite } from "@/lib/rooms-api";
import { cn } from "@/lib/utils";

const REQUESTABLE = new Set(["pending", "confirmed", "checked_in"]);

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  withdrawn: "bg-muted text-muted-foreground border-border",
};

function dateKey(value: string | null | undefined) {
  return String(value ?? "").slice(0, 10);
}

function addOneDay(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(y, m - 1, d + 1);
  const yy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, "0");
  const dd = String(next.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function BookingActionsPanel({ booking }: { booking: GuestBooking }) {
  const queryClient = useQueryClient();
  const canRequest = REQUESTABLE.has(booking.status);
  const [openAction, setOpenAction] = useState<GuestBookingRequestType | null>(null);
  const [reason, setReason] = useState("");
  const [roomId, setRoomId] = useState("");
  const [extraSeats, setExtraSeats] = useState("1");
  const currentCheckOut = dateKey(booking.check_out);
  const minExtendDate = currentCheckOut ? addOneDay(currentCheckOut) : "";
  const [checkOut, setCheckOut] = useState(minExtendDate);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["guest-booking-requests", booking.id],
    queryFn: () => fetchMyBookingRequests(booking.id),
    enabled: Boolean(booking.id),
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms-for-request", booking.room_id],
    queryFn: async () => {
      const list = await fetchRooms({ limit: 100 });
      return list.filter((room) => isRoomListedOnSite(room) && room.id !== booking.room_id);
    },
    enabled: openAction === "room_change",
  });

  const pendingByType = useMemo(
    () => new Set(requests.filter((r) => r.status === "pending").map((r) => r.type)),
    [requests],
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!openAction) throw new Error("No action selected");
      if (openAction === "room_change" && !roomId) {
        throw new Error("Select a room");
      }
      if (openAction === "extend_stay" && !checkOut) {
        throw new Error("Choose a new checkout date");
      }
      return createMyBookingRequest(booking.id, {
        type: openAction,
        reason: reason.trim() || undefined,
        requested_room_id: openAction === "room_change" ? roomId : undefined,
        additional_seats: openAction === "additional_seat" ? Number(extraSeats) : undefined,
        requested_check_out: openAction === "extend_stay" ? checkOut : undefined,
      });
    },
    onSuccess: () => {
      toast.success("Request submitted — the property team will review it");
      queryClient.invalidateQueries({ queryKey: ["guest-booking-requests", booking.id] });
      closeDialog();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not submit request"),
  });

  const withdrawMutation = useMutation({
    mutationFn: (requestId: string) => withdrawMyBookingRequest(booking.id, requestId),
    onSuccess: () => {
      toast.success("Request withdrawn");
      queryClient.invalidateQueries({ queryKey: ["guest-booking-requests", booking.id] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not withdraw request"),
  });

  const closeDialog = () => {
    setOpenAction(null);
    setReason("");
    setRoomId("");
    setExtraSeats("1");
    setCheckOut(minExtendDate);
  };

  const dialogTitle =
    openAction === "cancel"
      ? "Request cancellation"
      : openAction === "room_change"
        ? "Request room change"
        : openAction === "extend_stay"
          ? "Request stay extension"
          : "Request additional seat";

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Requests</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Changes apply only after the hostel approves.
        </p>
      </div>

      {canRequest ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ActionButton
            icon={<XCircle className="h-4 w-4" />}
            title="Cancel"
            disabled={pendingByType.has("cancel") || createMutation.isPending}
            onClick={() => setOpenAction("cancel")}
          />
          <ActionButton
            icon={<RefreshCw className="h-4 w-4" />}
            title="Change room"
            disabled={pendingByType.has("room_change") || createMutation.isPending}
            onClick={() => setOpenAction("room_change")}
          />
          <ActionButton
            icon={<Plus className="h-4 w-4" />}
            title="Add seat"
            disabled={pendingByType.has("additional_seat") || createMutation.isPending}
            onClick={() => setOpenAction("additional_seat")}
          />
          <ActionButton
            icon={<CalendarPlus className="h-4 w-4" />}
            title="Extend stay"
            disabled={pendingByType.has("extend_stay") || createMutation.isPending || !minExtendDate}
            onClick={() => {
              setCheckOut(minExtendDate);
              setOpenAction("extend_stay");
            }}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card px-5 py-6 text-sm text-muted-foreground">
          Requests are only available while the stay is pending, confirmed, or checked in.
        </div>
      )}

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading requests…</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests yet.</p>
        ) : (
          <ul className="space-y-2">
            {requests.map((request) => (
              <RequestRow
                key={request.id}
                request={request}
                withdrawing={withdrawMutation.isPending}
                onWithdraw={() => withdrawMutation.mutate(request.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <Dialog open={openAction != null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              The property team will review this and update your booking if approved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {openAction === "room_change" ? (
              <div className="space-y-2">
                <Label>Preferred room</Label>
                <Select value={roomId} onValueChange={setRoomId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {formatMarketingRoomTitle(room)} · {room.beds_available} free
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {openAction === "additional_seat" ? (
              <div className="space-y-2">
                <Label>Seats to add</Label>
                <Select value={extraSeats} onValueChange={setExtraSeats}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "seat" : "seats"} (new total {booking.seats_booked + n})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {openAction === "extend_stay" ? (
              <div className="space-y-2">
                <Label htmlFor="extend-checkout">New checkout date</Label>
                <Input
                  id="extend-checkout"
                  type="date"
                  min={minExtendDate}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Current checkout: {formatStayDate(booking.check_out)}. Pick a later date — the team
                  must approve before your stay is extended.
                </p>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="request-reason">Note (optional)</Label>
              <Textarea
                id="request-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell the team why you need this change"
                rows={3}
                maxLength={500}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Close
            </Button>
            <Button type="button" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ActionButton({
  icon,
  title,
  onClick,
  disabled,
}: {
  icon: ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 text-left shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-soft)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="font-medium">{title}</span>
    </button>
  );
}

function RequestRow({
  request,
  onWithdraw,
  withdrawing,
}: {
  request: GuestBookingRequest;
  onWithdraw: () => void;
  withdrawing: boolean;
}) {
  const detail =
    request.type === "room_change" && request.payload.requested_room_title
      ? `Preferred: ${request.payload.requested_room_title}`
      : request.type === "additional_seat" && request.payload.additional_seats
        ? `Add ${request.payload.additional_seats} seat(s)`
        : request.type === "extend_stay" && request.payload.requested_check_out
          ? `New checkout: ${formatStayDate(request.payload.requested_check_out)}${
              request.payload.target_months
                ? ` · ${request.payload.current_months ?? "?"} → ${request.payload.target_months} months`
                : request.payload.target_nights
                  ? ` · ${request.payload.current_nights ?? "?"} → ${request.payload.target_nights} nights`
                  : ""
            }`
          : request.reason || "No note provided";

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card px-4 py-3.5 shadow-[var(--shadow-card)]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{request.type_label}</p>
          <Badge variant="outline" className={cn("rounded-full capitalize", STATUS_CLASS[request.status])}>
            {request.status}
          </Badge>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>
        {request.admin_note ? (
          <p className="mt-1 text-sm text-muted-foreground">Staff note: {request.admin_note}</p>
        ) : null}
      </div>
      {request.status === "pending" ? (
        <Button type="button" variant="ghost" size="sm" disabled={withdrawing} onClick={onWithdraw}>
          {withdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Withdraw
        </Button>
      ) : null}
    </li>
  );
}
