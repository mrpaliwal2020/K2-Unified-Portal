import { useMemo, useState } from "react";
import { useStore } from "../StoreContext";
import { bulkProducts, retailProducts, fpos } from "../data";
import { BulkCard } from "../components/BulkCard";
import { RetailCard } from "../components/RetailCard";
import { BulkFilters, RetailFilters } from "../components/Filters";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { SlidersHorizontal, ArrowDownAZ } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function PLP({ initialQuery }) {
  const { state, dispatch } = useStore();
  const isBulk = state.mode === "bulk";
  const [openFilters, setOpenFilters] = useState(false);

  const list = useMemo(() => {
    const q = (initialQuery ?? (isBulk ? state.bulk.query : state.retail.query))
      .toLowerCase()
      .trim();

    if (isBulk) {
      const f = state.bulk.filters;
      let r = bulkProducts.filter((p) => {
        if (
          q &&
          !`${p.name} ${p.location} ${p.category}`.toLowerCase().includes(q)
        )
          return false;
        if (p.distanceKm > f.distance) return false;
        if (f.categories.length && !f.categories.includes(p.category))
          return false;
        if (p.quantityKg < f.minQuantity) return false;
        if (p.priceMax > f.priceMax) return false;
        if (f.grades.length && !f.grades.includes(p.grade)) return false;
        if (f.freshness === "0-3" && p.harvestDaysAgo > 3) return false;
        if (
          f.freshness === "3-7" &&
          (p.harvestDaysAgo <= 3 || p.harvestDaysAgo > 7)
        )
          return false;
        if (f.freshness === "stored" && p.harvestDaysAgo <= 7) return false;
        if (f.fpoIds.length && !f.fpoIds.includes(p.fpoId)) return false;
        return true;
      });
      const s = state.bulk.sort;
      r = [...r].sort((a, b) => {
        if (s === "nearest") return a.distanceKm - b.distanceKm;
        if (s === "price") return a.priceMin - b.priceMin;
        if (s === "freshness") return a.harvestDaysAgo - b.harvestDaysAgo;
        return b.quantityKg - a.quantityKg;
      });
      return r;
    } else {
      const f = state.retail.filters;
      let r = retailProducts.filter((p) => {
        if (q && !p.name.toLowerCase().includes(q)) return false;
        if (f.categories.length && !f.categories.includes(p.category))
          return false;
        if (p.price > f.priceMax) return false;
        if (f.productTypes.length && !f.productTypes.includes(p.productType))
          return false;
        if (f.fpoIds.length && !f.fpoIds.includes(p.fpoId)) return false;
        if (p.rating < f.minRating) return false;
        return true;
      });
      const s = state.retail.sort;
      r = [...r].sort((a, b) => {
        if (s === "price-asc") return a.price - b.price;
        if (s === "price-desc") return b.price - a.price;
        if (s === "rating") return b.rating - a.rating;
        if (s === "new") return a.id < b.id ? 1 : -1;
        return b.reviewCount - a.reviewCount;
      });
      return r;
    }
  }, [state, isBulk, initialQuery]);

  const matchedFpos = useMemo(() => {
    const q = (initialQuery ?? "").toLowerCase().trim();
    if (!q) return [];
    return fpos.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q),
    );
  }, [initialQuery]);

  return (
    <div className="container py-6 md:py-10">
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <h1 className="font-serif text-2xl md:text-3xl">
          {initialQuery ? (
            <>
              Results for <span className="text-primary">"{initialQuery}"</span>
            </>
          ) : isBulk ? (
            "Bulk Mandi"
          ) : (
            "Retail Shelf"
          )}
        </h1>
        <span className="text-xs text-muted-foreground">
          {list.length} products
        </span>
      </div>

      {matchedFpos.length > 0 && (
        <div className="mb-6 rounded-2xl border border-border/60 bg-card p-4">
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            FPOs matched
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedFpos.map((f) => (
              <button
                key={f.id}
                onClick={() =>
                  dispatch({ type: "setView", view: { name: "fpo", id: f.id } })
                }
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm hover:border-primary"
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
            {isBulk ? <BulkFilters /> : <RetailFilters />}
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Sheet open={openFilters} onOpenChange={setOpenFilters}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden rounded-full"
                >
                  <SlidersHorizontal className="mr-1 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="max-h-[85vh] overflow-y-auto rounded-t-3xl"
              >
                {isBulk ? <BulkFilters /> : <RetailFilters />}
                <Button
                  onClick={() => setOpenFilters(false)}
                  className="mt-4 w-full rounded-full"
                >
                  Apply
                </Button>
              </SheetContent>
            </Sheet>

            <div className="ml-auto flex items-center gap-2">
              <ArrowDownAZ className="h-4 w-4 text-muted-foreground" />
              {isBulk ? (
                <Select
                  value={state.bulk.sort}
                  onValueChange={(v) =>
                    dispatch({ type: "setBulkSort", sort: v })
                  }
                >
                  <SelectTrigger className="h-9 w-[160px] rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nearest">Nearest first</SelectItem>
                    <SelectItem value="price">Price low → high</SelectItem>
                    <SelectItem value="freshness">Freshness</SelectItem>
                    <SelectItem value="quantity">Quantity</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={state.retail.sort}
                  onValueChange={(v) =>
                    dispatch({ type: "setRetailSort", sort: v })
                  }
                >
                  <SelectTrigger className="h-9 w-[160px] rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-asc">Price low → high</SelectItem>
                    <SelectItem value="price-desc">Price high → low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="new">New arrivals</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl bg-card p-12 text-center text-muted-foreground">
              No products match. Try adjusting filters.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {isBulk
                ? list.map((p) => <BulkCard key={p.id} p={p} />)
                : list.map((p) => <RetailCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
