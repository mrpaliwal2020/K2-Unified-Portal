import { Toaster } from "sonner";
import {
  StoreProvider,
  useStore,
} from "./agri-shop-fusion-main/store/StoreContext";
import { StoreHeader } from "./agri-shop-fusion-main/store/components/StoreHeader";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";
import { StoreHome } from "./agri-shop-fusion-main/store/views/StoreHome";
import { PLP } from "./agri-shop-fusion-main/store/views/PLP";
import { PDP } from "./agri-shop-fusion-main/store/views/PDP";
import { FpoStorefront } from "./agri-shop-fusion-main/store/views/FpoStorefront";

function StoreRouter() {
  const { state } = useStore();
  const v = state.view;
  if (v.name === "home") return <StoreHome />;
  if (v.name === "plp") return <PLP />;
  if (v.name === "pdp") return <PDP id={v.id} />;
  if (v.name === "fpo") return <FpoStorefront id={v.id} />;
  if (v.name === "search") return <PLP initialQuery={v.q} />;
  return null;
}

const K2Store = () => (
  <StoreProvider>
    <div className="k2store-root min-h-screen bg-background text-foreground">
      <Header />
      <StoreHeader />
      <main className="px-4 sm:px-6 lg:px-8">
        <StoreRouter />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  </StoreProvider>
);

export default K2Store;
