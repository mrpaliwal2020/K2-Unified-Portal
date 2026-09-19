import { useStore } from "../StoreContext";
import { fpos } from "../data";
import { Slider } from "../../components/ui/slider";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { RotateCcw } from "lucide-react";

function Section({ title, children }) {
  return (
    <div className="border-b border-border/60 py-5 last:border-0">
      <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

export function BulkFilters() {
  const { state, dispatch } = useStore();
  const f = state.bulk.filters;
  const set = (filters) => dispatch({ type: "setBulkFilters", filters });

  const toggle = (arr, v) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-serif text-lg">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "resetBulk" })}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      <Section title="📍 Location">
        <div className="flex flex-wrap gap-2">
          {[50, 100, 200, 9999].map((d) => (
            <Pill
              key={d}
              active={f.distance === d}
              onClick={() => set({ distance: d })}
            >
              {d === 9999 ? "Any" : `${d} km`}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="🌾 Category">
        <div className="flex flex-wrap gap-2">
          {["Grains", "Pulses", "Fruits", "Vegetables"].map((c) => (
            <Pill
              key={c}
              active={f.categories.includes(c)}
              onClick={() => set({ categories: toggle(f.categories, c) })}
            >
              {c}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="📦 Min Quantity">
        <div className="flex flex-wrap gap-2">
          {[0, 50, 100, 500, 1000].map((q) => (
            <Pill
              key={q}
              active={f.minQuantity === q}
              onClick={() => set({ minQuantity: q })}
            >
              {q === 0 ? "Any" : `${q}kg+`}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="💰 Max Price (₹/kg)">
        <Slider
          value={[f.priceMax]}
          max={100}
          min={10}
          step={5}
          onValueChange={(v) => set({ priceMax: v[0] })}
        />
        <div className="text-xs text-muted-foreground">
          Up to ₹{f.priceMax}/kg
        </div>
      </Section>

      <Section title="🏷️ Grade">
        <div className="flex gap-2">
          {["A", "B", "C"].map((g) => (
            <Pill
              key={g}
              active={f.grades.includes(g)}
              onClick={() => set({ grades: toggle(f.grades, g) })}
            >
              Grade {g}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="🗓️ Freshness">
        <div className="flex flex-wrap gap-2">
          {[
            ["any", "Any"],
            ["0-3", "0–3 days"],
            ["3-7", "3–7 days"],
            ["stored", "Stored"],
          ].map(([v, l]) => (
            <Pill
              key={v}
              active={f.freshness === v}
              onClick={() => set({ freshness: v })}
            >
              {l}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="🧑‍🌾 FPO">
        <div className="space-y-2">
          {fpos.slice(0, 6).map((fp) => (
            <label
              key={fp.id}
              className="flex cursor-pointer items-center gap-2 text-xs"
            >
              <Checkbox
                checked={f.fpoIds.includes(fp.id)}
                onCheckedChange={() => set({ fpoIds: toggle(f.fpoIds, fp.id) })}
              />

              <span className="line-clamp-1">{fp.name}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}

export function RetailFilters() {
  const { state, dispatch } = useStore();
  const f = state.retail.filters;
  const set = (filters) => dispatch({ type: "setRetailFilters", filters });
  const toggle = (arr, v) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-serif text-lg">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "resetRetail" })}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          {["Staples", "Oils", "Pulses", "Pickles", "Spices"].map((c) => (
            <Pill
              key={c}
              active={f.categories.includes(c)}
              onClick={() => set({ categories: toggle(f.categories, c) })}
            >
              {c}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Max Price (₹)">
        <Slider
          value={[f.priceMax]}
          max={500}
          min={50}
          step={10}
          onValueChange={(v) => set({ priceMax: v[0] })}
        />
        <div className="text-xs text-muted-foreground">Up to ₹{f.priceMax}</div>
      </Section>

      <Section title="Product Type">
        <div className="flex flex-wrap gap-2">
          {["Organic", "Natural", "Regular", "Handmade"].map((t) => (
            <Pill
              key={t}
              active={f.productTypes.includes(t)}
              onClick={() => set({ productTypes: toggle(f.productTypes, t) })}
            >
              {t}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="Brand (FPO)">
        <div className="space-y-2">
          {fpos.slice(0, 6).map((fp) => (
            <label
              key={fp.id}
              className="flex cursor-pointer items-center gap-2 text-xs"
            >
              <Checkbox
                checked={f.fpoIds.includes(fp.id)}
                onCheckedChange={() => set({ fpoIds: toggle(f.fpoIds, fp.id) })}
              />

              <span className="line-clamp-1">{fp.name}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Min Rating">
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <Pill
              key={r}
              active={f.minRating === r}
              onClick={() => set({ minRating: r })}
            >
              {r === 0 ? "Any" : `${r}★`}
            </Pill>
          ))}
        </div>
      </Section>
    </div>
  );
}
