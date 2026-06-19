"use client";

import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type RoomsFiltersSidebarProps = {
  formatPrice: (amount: number) => string;
  price: [number, number];
  priceBounds: [number, number];
  onPriceChange: (value: [number, number]) => void;
  onPriceCommit?: () => void;
  roomTypes: readonly string[];
  types: string[];
  onToggleType: (type: string) => void;
  capacityOptions: readonly number[];
  capacity: number[];
  onToggleCapacity: (value: number) => void;
  amenities: readonly string[];
  selectedAmenities: string[];
  onToggleAmenity: (amenity: string) => void;
  onReset: () => void;
  activeFilterCount: number;
};

function FilterSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3.5 rounded-2xl border border-border/50 bg-gradient-to-b from-muted/20 to-muted/40 p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
  className,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-xs font-bold transition-colors duration-200 touch-manipulation",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)] ring-2 ring-primary/20"
          : "border-border/70 bg-background/90 text-muted-foreground hover:border-primary/35 hover:bg-primary/5 hover:text-foreground",
        className,
      )}
    >
      {label}
    </button>
  );
}

export function RoomsFiltersSidebar({
  formatPrice,
  price,
  priceBounds,
  onPriceChange,
  onPriceCommit,
  roomTypes,
  types,
  onToggleType,
  capacityOptions,
  capacity,
  onToggleCapacity,
  amenities,
  selectedAmenities,
  onToggleAmenity,
  onReset,
  activeFilterCount,
}: RoomsFiltersSidebarProps) {
  const [minBound, maxBound] = priceBounds;
  const sliderMax = Math.max(maxBound, minBound + 500);

  return (
    <aside className="relative h-fit self-start rounded-3xl border border-border/60 bg-card/95 shadow-[var(--shadow-card)] backdrop-blur-xl lg:sticky lg:top-20">
      <div className="h-1.5 w-full bg-[image:var(--gradient-hero)]" />

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight">Refine results</p>
              <p className="text-xs text-muted-foreground">Narrow by price, type & perks</p>
            </div>
          </div>
          <div
            className={cn(
              "shrink-0 rounded-full border-0 px-2.5 py-0.5 text-[10px] font-extrabold transition-opacity duration-200",
              activeFilterCount > 0
                ? "bg-primary/15 text-primary opacity-100"
                : "pointer-events-none bg-transparent text-transparent opacity-0",
            )}
            aria-hidden={activeFilterCount === 0}
          >
            {activeFilterCount > 0 ? `${activeFilterCount} active` : "0 active"}
          </div>
        </div>

        <FilterSection icon={Wallet} title="Price / seat / month">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/60 bg-background/80 px-3 py-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Min</p>
              <p className="mt-0.5 text-sm font-extrabold text-primary">{formatPrice(price[0])}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/80 px-3 py-2.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Max</p>
              <p className="mt-0.5 text-sm font-extrabold text-primary">{formatPrice(price[1])}</p>
            </div>
          </div>
          <Slider
            min={minBound}
            max={sliderMax}
            step={500}
            value={price}
            onValueChange={(v) => onPriceChange([v[0], v[1]] as [number, number])}
            onValueCommit={(v) => {
              onPriceChange([v[0], v[1]] as [number, number]);
              onPriceCommit?.();
            }}
            className="py-1"
          />
        </FilterSection>

        <FilterSection icon={BedDouble} title="Room type">
          <div className="flex flex-wrap gap-2">
            {roomTypes.map((t) => (
              <FilterChip
                key={t}
                label={t}
                selected={types.includes(t)}
                onClick={() => onToggleType(t)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection icon={Users} title="Capacity">
          <div className="grid grid-cols-4 gap-2">
            {capacityOptions.map((c) => (
              <FilterChip
                key={c}
                label={String(c)}
                selected={capacity.includes(c)}
                onClick={() => onToggleCapacity(c)}
                className="px-0"
              />
            ))}
          </div>
          <p className="text-center text-[10px] font-medium text-muted-foreground">seats per room</p>
        </FilterSection>

        <FilterSection icon={Sparkles} title="Amenities">
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <FilterChip
                key={a}
                label={a}
                selected={selectedAmenities.includes(a)}
                onClick={() => onToggleAmenity(a)}
                className="text-left"
              />
            ))}
          </div>
        </FilterSection>

        <Button
          type="button"
          variant="outline"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onReset}
          disabled={activeFilterCount === 0}
          className="w-full rounded-2xl border-dashed font-bold"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear all filters
        </Button>
      </div>
    </aside>
  );
}
