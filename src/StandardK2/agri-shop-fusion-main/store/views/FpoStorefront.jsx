import { useState } from "react";
import { useStore } from "../StoreContext";
import { fpoById, bulkProducts, retailProducts, reviews } from "../data";
import { FpoBadges, Rating } from "../components/Badges";
import { BulkCard } from "../components/BulkCard";
import { RetailCard } from "../components/RetailCard";
import { Button } from "../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { ChevronDown, MapPin, Phone } from "lucide-react";

export function FpoStorefront({ id }) {
  const fpo = fpoById(id);
  const { dispatch } = useStore();
  const [tab, setTab] = useState("retail");
  const [aboutOpen, setAboutOpen] = useState(false);
  const fpoBulk = bulkProducts.filter((p) => p.fpoId === id);
  const fpoRetail = retailProducts.filter((p) => p.fpoId === id);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-secondary/8 to-transparent">
        <div className="container py-12 md:py-16">
          <button
            onClick={() =>
              dispatch({ type: "setView", view: { name: "home" } })
            }
            className="text-xs text-muted-foreground hover:text-primary"
          >
            ← Store
          </button>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <FpoBadges fpo={fpo} size="md" />
              <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-6xl">
                {fpo.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {fpo.location}, {fpo.state}
                </span>
                <Rating value={fpo.rating} count={fpo.reviewCount} />
              </div>
            </div>
            <Button className="rounded-full">
              <Phone className="mr-2 h-4 w-4" /> Contact FPO
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-10">
        {/* About */}
        <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  About
                </div>
                <p className="mt-2 max-w-2xl font-serif text-lg leading-snug">
                  {fpo.story}
                </p>
              </div>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${aboutOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-5 grid gap-5 border-t border-border/60 pt-5 md:grid-cols-2">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Farming practices
                </div>
                <p className="mt-2 text-sm">{fpo.practices}</p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Certifications
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {fpo.certifications.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-border bg-background px-2.5 py-1 text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Tabs */}
        <div className="mt-10 mb-6 flex items-center justify-between">
          <div className="inline-flex rounded-full bg-muted p-1">
            {["retail", "bulk"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-card text-foreground shadow-[var(--shadow-card)]"
                    : "text-muted-foreground"
                }`}
              >
                {t === "retail" ? "Retail Products" : "Bulk Products"}
              </button>
            ))}
          </div>
        </div>

        {tab === "retail" ? (
          fpoRetail.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {fpoRetail.map((p) => (
                <RetailCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <Empty label="No retail products yet." />
          )
        ) : fpoBulk.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fpoBulk.map((p) => (
              <BulkCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <Empty label="No bulk lots available right now." />
        )}

        {/* Reviews */}
        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Reviews
              </div>
              <h2 className="mt-1 font-serif text-3xl">
                {fpo.rating}★{" "}
                <span className="text-base font-sans text-muted-foreground">
                  · {fpo.reviewCount} reviews
                </span>
              </h2>
            </div>
            <Button variant="ghost">View all</Button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {["Product Quality", "Delivery Experience", "Communication"].map(
              (c, i) => (
                <div
                  key={c}
                  className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {c}
                  </div>
                  <div className="mt-1 font-serif text-2xl">
                    {[4.7, 4.4, 4.6][i]}★
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <Rating value={r.rating} />
                <p className="mt-2 text-sm">{r.text}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  — {r.author} · {r.category}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Empty({ label }) {
  return (
    <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground">
      {label}
    </div>
  );
}
