import { MapPin, Package, Calendar, Truck } from "lucide-react";
import { fpoById } from "../data";
import { useStore } from "../StoreContext";
import { Button } from "../../components/ui/button";

const gradeStyles = {
  A: "bg-primary text-primary-foreground",
  B: "bg-gold text-gold-foreground",
  C: "bg-muted text-muted-foreground border border-border",
};

function freshness(days) {
  if (days === 0) return "Fresh today";
  if (days <= 3) return `${days}d ago`;
  if (days <= 7) return `${days}d ago`;
  return "Stored";
}

export function BulkCard({ p }) {
  const fpo = fpoById(p.fpoId);
  const { dispatch } = useStore();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${gradeStyles[p.grade]}`}
        >
          Grade {p.grade}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
          {p.quantityKg.toLocaleString()} kg
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-serif text-lg leading-tight">{p.name}</h3>
          <button
            onClick={() =>
              dispatch({ type: "setView", view: { name: "fpo", id: fpo.id } })
            }
            className="mt-0.5 text-xs text-muted-foreground hover:text-primary"
          >
            {fpo.name}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {p.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {freshness(p.harvestDaysAgo)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" />
            {p.distanceKm} km
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            {p.delivery ? "Delivery" : "Pickup"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Price range
            </div>
            <div className="font-serif text-xl text-primary">
              ₹{p.priceMin}–₹{p.priceMax}
              <span className="ml-1 text-xs font-sans text-muted-foreground">
                /kg
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() =>
              dispatch({ type: "setView", view: { name: "pdp", id: p.id } })
            }
            variant="outline"
            className="flex-1 rounded-full"
          >
            Details
          </Button>
          <Button
            onClick={() =>
              dispatch({ type: "setView", view: { name: "pdp", id: p.id } })
            }
            className="flex-1 rounded-full bg-gold text-gold-foreground hover:bg-gold/90"
          >
            Enquire
          </Button>
        </div>
      </div>
    </article>
  );
}
