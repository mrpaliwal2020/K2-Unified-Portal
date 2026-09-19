import { fpoById } from "../data";
import { useStore, useCart } from "../StoreContext";
import { Rating } from "./Badges";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";

export function RetailCard({ p }) {
  const fpo = fpoById(p.fpoId);
  const { dispatch } = useStore();
  const { add } = useCart();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-soft)]">
      <button
        onClick={() =>
          dispatch({ type: "setView", view: { name: "pdp", id: p.id } })
        }
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {p.productType === "Organic" && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground backdrop-blur">
            Organic
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <button
          onClick={() =>
            dispatch({ type: "setView", view: { name: "fpo", id: fpo.id } })
          }
          className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary"
        >
          {fpo.name}
        </button>
        <h3 className="font-serif text-base leading-tight">{p.name}</h3>
        <Rating value={p.rating} count={p.reviewCount} />

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="font-serif text-xl text-primary">₹{p.price}</div>
          <Button
            onClick={() => add(p.id, 1)}
            size="sm"
            className="rounded-full"
          >
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}
