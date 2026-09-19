import { useStore } from "../StoreContext";
import { bulkProducts, retailProducts, fpos } from "../data";
import { BulkCard } from "../components/BulkCard";
import { RetailCard } from "../components/RetailCard";
import { ModeSwitch } from "../components/ModeSwitch";
import { FpoBadges, Rating } from "../components/Badges";
import { ArrowRight, Wheat, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";

export function StoreHome() {
  const { state, dispatch } = useStore();
  const isBulk = state.mode === "bulk";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.35),transparent_60%),radial-gradient(ellipse_at_bottom_left,hsl(var(--gold)/0.18),transparent_55%)]" />
        <div className="container grid gap-10 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> 218
              verified FPOs · 14 states
            </span>
            <h1 className="font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
              From the farm gate.
              <br />
              <span className="text-primary">Nothing in between.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Buy directly from Farmer Producer Organizations across India —
              bulk mandi lots or pantry-ready retail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ModeSwitch />
              <Button
                onClick={() =>
                  dispatch({ type: "setView", view: { name: "plp" } })
                }
                className="rounded-full"
              >
                Browse {isBulk ? "Bulk" : "Retail"}{" "}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
              {[
                ["8", "FPOs onboard"],
                ["32+", "Live SKUs"],
                ["4.4★", "Avg. trust"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-serif text-2xl text-primary">{n}</dt>
                  <dd className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-64 w-64 rounded-3xl bg-secondary/10" />
            <img
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1000&q=70"
              alt="Wheat field at golden hour"
              className="relative h-[420px] w-full rounded-3xl object-cover shadow-[var(--shadow-soft)]"
            />

            <div className="absolute -bottom-6 -left-6 hidden w-60 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] sm:block">
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                Featured Lot
              </div>
              <div className="font-serif text-base">Wheat – Sharbati</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Sehore · 1,200 kg · 2d old
              </div>
              <div className="mt-2 font-serif text-lg text-primary">
                ₹28–₹30/kg
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mode-specific featured */}
      <section className="container py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {isBulk ? "Mandi · Bulk lots" : "Pantry · Retail"}
            </div>
            <h2 className="mt-1 font-serif text-3xl">
              {isBulk ? "Fresh lots, near you" : "Best-loved by households"}
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: "setView", view: { name: "plp" } })}
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isBulk
            ? bulkProducts.slice(0, 4).map((p) => <BulkCard key={p.id} p={p} />)
            : retailProducts
                .slice(0, 4)
                .map((p) => <RetailCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Categories quick nav */}
      <section className="container pb-14">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {(isBulk
            ? ["Grains", "Pulses", "Fruits", "Vegetables"]
            : ["Staples", "Oils", "Pulses", "Spices"]
          ).map((c) => (
            <button
              key={c}
              onClick={() => {
                isBulk
                  ? dispatch({
                      type: "setBulkFilters",
                      filters: { categories: [c] },
                    })
                  : dispatch({
                      type: "setRetailFilters",
                      filters: { categories: [c] },
                    });
                dispatch({ type: "setView", view: { name: "plp" } });
              }}
              className="group flex items-center justify-between rounded-2xl bg-card p-5 text-left shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-soft)]"
            >
              <span className="font-serif text-lg">{c}</span>
              {isBulk ? (
                <Wheat className="h-5 w-5 text-primary/60 transition-transform group-hover:translate-x-1" />
              ) : (
                <ShoppingBag className="h-5 w-5 text-primary/60 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* FPOs */}
      <section className="border-t border-border/60 bg-muted/40">
        <div className="container py-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Trusted partners
              </div>
              <h2 className="mt-1 font-serif text-3xl">Featured FPOs</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fpos.slice(0, 4).map((f) => (
              <button
                key={f.id}
                onClick={() =>
                  dispatch({ type: "setView", view: { name: "fpo", id: f.id } })
                }
                className="group rounded-2xl bg-card p-5 text-left shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-soft)]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-serif text-xl text-primary">
                  {f.name.charAt(0)}
                </div>
                <div className="font-serif text-base leading-tight">
                  {f.name}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {f.location}, {f.state}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Rating value={f.rating} count={f.reviewCount} />
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <div className="mt-3">
                  <FpoBadges fpo={f} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
