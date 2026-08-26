"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { fetchRooms, formatMarketingRoomTitle, isRoomListedOnSite } from "@/lib/rooms-api";
import { cn } from "@/lib/utils";

const REQUESTABLE = new Set(["pending", "confirmed", "checked_in"]);

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  withdrawn: "bg-muted text-muted-foreground border-border",
};

export function BookingActionsPanel({ booking }: { booking: GuestBooking }) {
  const queryClient = useQueryClient();
  const canRequest = REQUESTABLE.has(booking.status);
  const [openAction, setOpenAction] = useState<GuestBookingRequestType | null>(null);
  const [reason, setReason] = useState("");
  const [roomId, setRoomId] = useState("");
  const [extraSeats, setExtraSeats] = useState("1");

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
      return createMyBookingRequest(booking.id, {
        type: openAction,
        reason: reason.trim() || undefined,
        requested_room_id: openAction === "room_change" ? roomId : undefined,
        additional_seats: openAction === "additional_seat" ? Number(extraSeats) : undefined,
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
  };

  const dialogTitle =
    openAction === "cancel"
      ? "Request cancellation"
      : openAction === "room_change"
        ? "Request room change"
        : "Request additional seat";

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold tracking-tight">Booking actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Send a request to the property team. Changes apply only after they approve.
        </p>
      </div>

      {canRequest ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <ActionCard
            icon={<XCircle className="h-5 w-5" />}
            title="Cancel booking"
            description="Ask to cancel this reservation."
            disabled={pendingByType.has("cancel") || createMutation.isPending}
            onClick={() => setOpenAction("cancel")}
            tone="rose"
          />
          <ActionCard
            icon={<RefreshCw className="h-5 w-5" />}
            title="Change room"
            description="Request a move to another room."
            disabled={pendingByType.has("room_change") || createMutation.isPending}
            onClick={() => setOpenAction("room_change")}
            tone="sky"
          />
          <ActionCard
            icon={<Plus className="h-5 w-5" />}
            title="Add seat"
            description="Request one or more extra seats."
            disabled={pendingByType.has("additional_seat") || createMutation.isPending}
            onClick={() => setOpenAction("additional_seat")}
            tone="violet"
          />
        </div>
      ) : (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="p-5 text-sm text-muted-foreground">
            Booking actions are only available while the stay is pending, confirmed, or checked in.
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Your requests
        </h3>
        {isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading requests…</p>
        ) : requests.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No requests yet for this booking.</p>
        ) : (
          <ul className="mt-3 space-y-2">
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

function ActionCard({
  icon,
  title,
  description,
  onClick,
  disabled,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  tone: "rose" | "sky" | "violet";
}) {
  const toneClass = {
    rose: "border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/[0.04]",
    sky: "border-sky-500/20 hover:border-sky-500/40 hover:bg-sky-500/[0.04]",
    violet: "border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/[0.04]",
  }[tone];
  const iconClass = {
    rose: "bg-rose-500/15 text-rose-700",
    sky: "bg-sky-500/15 text-sky-700",
    violet: "bg-violet-500/15 text-violet-700",
  }[tone];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-2xl border bg-card p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        toneClass,
      )}
    >
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", iconClass)}>
        {icon}
      </div>
      <p className="font-extrabold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {disabled ? (
        <p className="mt-2 text-xs font-semibold text-amber-700">Pending request already open</p>
      ) : null}
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
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold">{request.type_label}</p>
          <Badge variant="outline" className={cn("rounded-full capitalize", STATUS_CLASS[request.status])}>
            {request.status}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {request.type === "room_change" && request.payload.requested_room_title
            ? `Preferred: ${request.payload.requested_room_title}`
            : request.type === "additional_seat" && request.payload.additional_seats
              ? `Add ${request.payload.additional_seats} seat(s)`
              : request.reason || "No note provided"}
        </p>
        {request.admin_note ? (
          <p className="mt-1 text-xs text-muted-foreground">Staff note: {request.admin_note}</p>
        ) : null}
      </div>
      {request.status === "pending" ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full font-bold"
          disabled={withdrawing}
          onClick={onWithdraw}
        >
          {withdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Withdraw
        </Button>
      ) : null}
    </li>
  );
}
