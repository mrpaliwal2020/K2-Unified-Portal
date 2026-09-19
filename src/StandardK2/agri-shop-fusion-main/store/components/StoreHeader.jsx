import { Search, ShoppingCart, ArrowLeft } from "lucide-react";
import { useStore, useCart } from "../StoreContext";
import { ModeSwitch } from "./ModeSwitch";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export function StoreHeader() {
  const { state, dispatch } = useStore();
  const { count } = useCart();
  const isBulk = state.mode === "bulk";
  const query = isBulk ? state.bulk.query : state.retail.query;

  const setQuery = (q) =>
    dispatch(
      isBulk ? { type: "setBulkQuery", q } : { type: "setRetailQuery", q },
    );

  const onSubmit = (e) => {
    e.preventDefault();
    if (query.trim())
      dispatch({ type: "setView", view: { name: "search", q: query.trim() } });
  };

  const onHome = () => dispatch({ type: "setView", view: { name: "home" } });

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container px-4 sm:px-6 lg:px-8 flex flex-col gap-3 py-3 md:flex-row md:items-center md:gap-6 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          <button onClick={onHome} className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-serif text-lg leading-none">क</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-serif text-lg leading-tight tracking-tight">
                Krishi Bazaar
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                FPO Marketplace
              </div>
            </div>
          </button>
          <div className="md:hidden">
            <ModeSwitch />
          </div>
        </div>

        <form onSubmit={onSubmit} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isBulk
                ? "Search wheat, soybean, FPOs…"
                : "Search atta, oil, spices…"
            }
            className="h-11 rounded-full border-border/70 bg-card pl-10 pr-4 shadow-[var(--shadow-card)]"
          />
        </form>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ModeSwitch />
          </div>
          {!isBulk && (
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground">
                  {count}
                </span>
              )}
            </Button>
          )}
          {state.view.name !== "home" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onHome}
              className="hidden md:inline-flex"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Store
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
