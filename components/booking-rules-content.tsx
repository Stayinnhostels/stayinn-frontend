"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarClock, Clock, FileText, Moon, ScrollText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteSettings } from "@/components/site-settings-provider";
import {
  STAY_SECURITY_NOTICE_POLICY,
  cancellationPolicyDescription,
  cancellationPolicyTitle,
  formatTime24h,
  parseHouseRulesLines,
} from "@/lib/booking-rules";

function RuleRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4 py-3 border-b border-border/60 last:border-0">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground sm:text-right">{value}</span>
    </div>
  );
}

function YesNo({ allowed }: { allowed: boolean }) {
  return (
    <span className={allowed ? "text-emerald-600 font-semibold" : "text-muted-foreground"}>
      {allowed ? "Yes" : "No"}
    </span>
  );
}

export function BookingRulesContent() {
  const s = useSiteSettings();
  const houseRuleLines = parseHouseRulesLines(s.houseRules);

  return (
    <div className="space-y-8">
      <Card className="border-2 shadow-[var(--shadow-card)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Check-in &amp; check-out
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RuleRow label="Check-in from" value={formatTime24h(s.checkInTime)} />
          <RuleRow label="Check-out by" value={formatTime24h(s.checkOutTime)} />
          <RuleRow
            label="Quiet hours"
            value={`${formatTime24h(s.quietHoursStart)} – ${formatTime24h(s.quietHoursEnd)}`}
          />
        </CardContent>
      </Card>

      <Card className="border-2 shadow-[var(--shadow-card)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5 text-primary" />
            Stay duration &amp; booking window
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RuleRow
            label="Minimum stay"
            value={`${s.minStay} ${s.minStay === 1 ? "month" : "months"}`}
          />
          <RuleRow
            label="Maximum stay"
            value={`${s.maxStay} ${s.maxStay === 1 ? "month" : "months"}`}
          />
          <RuleRow
            label="Advance booking"
            value={`Up to ${s.advanceBookingDays} days before move-in`}
          />
          <RuleRow label="Deposit required" value={`${s.depositPercent}% of total rent`} />
        </CardContent>
      </Card>

      <Card className="border-2 shadow-[var(--shadow-card)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ScrollText className="h-5 w-5 text-primary" />
            {STAY_SECURITY_NOTICE_POLICY.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {STAY_SECURITY_NOTICE_POLICY.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="border-2 shadow-[var(--shadow-card)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Cancellation policy
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm font-bold text-primary">{cancellationPolicyTitle(s.cancellationPolicy)}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {cancellationPolicyDescription(s.cancellationPolicy, s.cancellationWindowHours)}
          </p>
          <RuleRow
            label="Free cancellation window"
            value={
              s.cancellationWindowHours >= 24
                ? `${Math.round(s.cancellationWindowHours / 24)} days (${s.cancellationWindowHours} hours)`
                : `${s.cancellationWindowHours} hours`
            }
          />
        </CardContent>
      </Card>

      <Card className="border-2 shadow-[var(--shadow-card)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Guest policies
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RuleRow label="Children welcome" value={<YesNo allowed={s.allowChildren} />} />
          <RuleRow label="Pets allowed" value={<YesNo allowed={s.allowPets} />} />
          <RuleRow
            label="Smoking"
            value={
              s.smokingAllowed ? (
                <span className="text-amber-600 font-semibold">Allowed in designated areas</span>
              ) : (
                <YesNo allowed={false} />
              )
            }
          />
        </CardContent>
      </Card>

      {houseRuleLines.length > 0 ? (
        <Card className="border-2 shadow-[var(--shadow-card)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Moon className="h-5 w-5 text-primary" />
              House rules
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3">
              {houseRuleLines.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-3xl border-2 bg-muted/40 p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-extrabold text-lg">Ready to book your seat?</p>
          <p className="text-sm text-muted-foreground mt-1">
            Review the rules above, then choose a room and complete your reservation.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full font-bold shrink-0">
          <Link href="/booking">Book a seat</Link>
        </Button>
      </div>
    </div>
  );
}
