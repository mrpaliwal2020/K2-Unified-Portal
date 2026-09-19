import { Wheat, ShoppingBag } from "lucide-react";
import { useStore } from "../StoreContext";
import { cn } from "../../lib/utils";

export function ModeSwitch() {
  const { state, dispatch } = useStore();
  const tabs = [
    { id: "bulk", label: "Bulk", sub: "Mandi-style", icon: Wheat },
    { id: "retail", label: "Retail", sub: "Packaged", icon: ShoppingBag },
  ];
  return (
    <div className="inline-flex rounded-full bg-muted p-1 shadow-[var(--shadow-card)]">
      {tabs.map((t) => {
        const active = state.mode === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => dispatch({ type: "setMode", mode: t.id })}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
              active
                ? t.id === "bulk"
                  ? "bg-gold text-gold-foreground shadow-[var(--shadow-soft)]"
                  : "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={active}
          >
            <Icon className="h-4 w-4" />
            <span className="leading-tight text-left">
              <span className="block">{t.label}</span>
              <span
                className={cn(
                  "block text-[10px] opacity-80",
                  !active && "hidden sm:block",
                )}
              >
                {t.sub}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
