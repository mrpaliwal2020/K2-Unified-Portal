import { createContext, useContext, useMemo, useReducer } from "react";
import { toast } from "sonner";
import { retailProducts } from "./data";

export const defaultBulkFilters = {
  distance: 9999,
  categories: [],
  minQuantity: 0,
  priceMax: 100,
  grades: [],
  freshness: "any",
  fpoIds: [],
};
export const defaultRetailFilters = {
  categories: [],
  priceMax: 500,
  productTypes: [],
  fpoIds: [],
  minRating: 0,
};

const initial = {
  mode: "bulk",
  view: { name: "home" },
  bulk: { filters: defaultBulkFilters, sort: "nearest", query: "" },
  retail: { filters: defaultRetailFilters, sort: "popularity", query: "" },
  cart: {},
};

function reducer(state, a) {
  switch (a.type) {
    case "setMode":
      if (a.mode === state.mode) return state;
      return { ...state, mode: a.mode, view: { name: "home" } };
    case "setView":
      return { ...state, view: a.view };
    case "setBulkFilters":
      return {
        ...state,
        bulk: {
          ...state.bulk,
          filters: { ...state.bulk.filters, ...a.filters },
        },
      };
    case "setBulkSort":
      return { ...state, bulk: { ...state.bulk, sort: a.sort } };
    case "setBulkQuery":
      return { ...state, bulk: { ...state.bulk, query: a.q } };
    case "resetBulk":
      return {
        ...state,
        bulk: { filters: defaultBulkFilters, sort: "nearest", query: "" },
      };
    case "setRetailFilters":
      return {
        ...state,
        retail: {
          ...state.retail,
          filters: { ...state.retail.filters, ...a.filters },
        },
      };
    case "setRetailSort":
      return { ...state, retail: { ...state.retail, sort: a.sort } };
    case "setRetailQuery":
      return { ...state, retail: { ...state.retail, query: a.q } };
    case "resetRetail":
      return {
        ...state,
        retail: {
          filters: defaultRetailFilters,
          sort: "popularity",
          query: "",
        },
      };
    case "addToCart": {
      const p = retailProducts.find((x) => x.id === a.id);
      if (!p) return state;
      const next = Math.min((state.cart[a.id] ?? 0) + a.qty, p.stock);
      return { ...state, cart: { ...state.cart, [a.id]: next } };
    }
    case "setCartQty": {
      const p = retailProducts.find((x) => x.id === a.id);
      if (!p) return state;
      const q = Math.max(0, Math.min(a.qty, p.stock));
      const cart = { ...state.cart };
      if (q === 0) delete cart[a.id];
      else cart[a.id] = q;
      return { ...state, cart };
    }
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}

export function useCart() {
  const { state, dispatch } = useStore();
  const count = Object.values(state.cart).reduce((a, b) => a + b, 0);
  const add = (id, qty = 1) => {
    const p = retailProducts.find((x) => x.id === id);
    if (!p) return;
    const current = state.cart[id] ?? 0;
    if (current + qty > p.stock) {
      toast.error(`Only ${p.stock} in stock`);
      return;
    }
    dispatch({ type: "addToCart", id, qty });
    toast.success(`Added to cart`, { description: p.name });
  };
  return {
    cart: state.cart,
    count,
    add,
    setQty: (id, qty) => dispatch({ type: "setCartQty", id, qty }),
  };
}
