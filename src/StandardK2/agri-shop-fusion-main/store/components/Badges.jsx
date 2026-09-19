import { Star, BadgeCheck, Sprout } from "lucide-react";

export function FpoBadges({ fpo, size = "sm" }) {
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
      {fpo.verified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
          <BadgeCheck className={cls} /> Verified
        </span>
      )}
      {fpo.organic && (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-secondary">
          <Sprout className={cls} /> Organic
        </span>
      )}
      {fpo.govtRegistered && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[hsl(var(--gold))]">
          Govt Reg.
        </span>
      )}
    </div>
  );
}

export function Rating({ value, count, compact }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      {count !== undefined && !compact && <span>({count})</span>}
    </span>
  );
}
