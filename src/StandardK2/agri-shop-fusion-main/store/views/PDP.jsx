import { useState } from "react";
import { useStore, useCart } from "../StoreContext";
import { bulkProducts, retailProducts, fpoById, reviews } from "../data";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { FpoBadges, Rating } from "../components/Badges";
import {
  MapPin,
  Calendar,
  Package,
  Truck,
  Phone,
  MessageCircle,
  Send,
  Minus,
  Plus,
  AlertTriangle,
  Leaf,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export function PDP({ id }) {
  const { state, dispatch } = useStore();
  const isBulk = state.mode === "bulk";

  if (isBulk) {
    const p = bulkProducts.find((x) => x.id === id);
    if (!p) return <NotFound />;
    return <BulkPDP p={p} />;
  }
  const p = retailProducts.find((x) => x.id === id);
  if (!p) return <NotFound />;
  return <RetailPDP p={p} />;

  function NotFound() {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button
          onClick={() => dispatch({ type: "setView", view: { name: "home" } })}
          className="mt-4"
        >
          Back to Store
        </Button>
      </div>
    );
  }
}

function BulkPDP({ p }) {
  const fpo = fpoById(p.fpoId);
  const { dispatch } = useStore();
  const farAway = p.distanceKm > 200;
  return (
    <div className="container py-8 md:py-12">
      <button
        onClick={() => dispatch({ type: "setView", view: { name: "plp" } })}
        className="mb-4 text-xs text-muted-foreground hover:text-primary"
      >
        ← Back to Bulk
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img
            src={p.image}
            alt={p.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>{p.category}</span>
            <span>·</span>
            <span>Lot #{p.id.toUpperCase()}</span>
          </div>
          <h1 className="mt-2 font-serif text-4xl">{p.name}</h1>
          <button
            onClick={() =>
              dispatch({ type: "setView", view: { name: "fpo", id: fpo.id } })
            }
            className="mt-1 inline-block text-sm text-muted-foreground hover:text-primary"
          >
            by {fpo.name}
          </button>

          <div className="mt-5 flex items-baseline gap-3">
            <div className="font-serif text-4xl text-primary">
              ₹{p.priceMin}–₹{p.priceMax}
            </div>
            <span className="text-sm text-muted-foreground">
              per kg · negotiable
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
            <Spec
              icon={Package}
              label="Available"
              value={`${p.quantityKg.toLocaleString()} kg`}
            />
            <Spec
              icon={MapPin}
              label="Origin"
              value={`${p.location}, ${p.state}`}
            />
            <Spec
              icon={Calendar}
              label="Harvest"
              value={
                p.harvestDaysAgo === 0
                  ? "Today (fresh)"
                  : `${p.harvestDaysAgo} days ago`
              }
            />
            <Spec
              icon={Truck}
              label="Logistics"
              value={p.delivery ? "Delivery available" : "Pickup only"}
            />
          </dl>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            Grade {p.grade} · Lab-verified
          </div>

          {farAway && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 p-3 text-xs text-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-[hsl(var(--gold))]" />
              <div>
                <strong>Long distance ({p.distanceKm} km).</strong> Logistics
                cost may be significant — discuss with FPO.
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <EnquireDialog productName={p.name} fpoName={fpo.name} />
            <Button variant="outline" className="rounded-full">
              <Phone className="mr-2 h-4 w-4" /> Call FPO
            </Button>
            <Button variant="outline" className="rounded-full">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </Button>
          </div>

          <FpoMini fpo={fpo} />
        </div>
      </div>
    </div>
  );
}

function RetailPDP({ p }) {
  const fpo = fpoById(p.fpoId);
  const { dispatch } = useStore();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="container py-8 md:py-12">
      <button
        onClick={() => dispatch({ type: "setView", view: { name: "plp" } })}
        className="mb-4 text-xs text-muted-foreground hover:text-primary"
      >
        ← Back to Retail
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img
            src={p.image}
            alt={p.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <button
            onClick={() =>
              dispatch({ type: "setView", view: { name: "fpo", id: fpo.id } })
            }
            className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary"
          >
            {fpo.name}
          </button>
          <h1 className="mt-2 font-serif text-4xl">{p.name}</h1>
          <div className="mt-2">
            <Rating value={p.rating} count={p.reviewCount} />
          </div>

          <div className="mt-5 font-serif text-4xl text-primary">
            ₹{p.price}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {p.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border bg-card">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-primary"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty(Math.min(p.stock, qty + 1))}
                className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-primary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              {p.stock} in stock
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => add(p.id, qty)} className="rounded-full">
              Add to Cart
            </Button>
            <Button
              onClick={() => {
                add(p.id, qty);
                toast.success("Proceeding to checkout");
              }}
              variant="outline"
              className="rounded-full"
            >
              Buy Now
            </Button>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Spec icon={Leaf} label="Type" value={p.productType} />
            <Spec
              icon={ShieldCheck}
              label="Certifications"
              value={p.certifications.join(", ")}
            />
            <Spec icon={Clock} label="Shelf life" value={p.shelfLife} />
          </dl>

          <div className="mt-6 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Ingredients
            </h3>
            <p className="mt-2 text-sm">{p.ingredients}</p>
          </div>

          <FpoMini fpo={fpo} />

          <section className="mt-10">
            <h3 className="font-serif text-2xl">Reviews</h3>
            <div className="mt-4 space-y-3">
              {reviews.slice(0, 2).map((r) => (
                <ReviewItem key={r.id} r={r} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function FpoMini({ fpo }) {
  const { dispatch } = useStore();
  return (
    <button
      onClick={() =>
        dispatch({ type: "setView", view: { name: "fpo", id: fpo.id } })
      }
      className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 font-serif text-lg text-primary">
        {fpo.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="font-serif text-base">{fpo.name}</div>
        <div className="text-xs text-muted-foreground">
          {fpo.location}, {fpo.state} · {fpo.rating}★
        </div>
      </div>
      <FpoBadges fpo={fpo} />
    </button>
  );
}

function ReviewItem({ r }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{r.author}</span>
        <span>{r.category}</span>
      </div>
      <Rating value={r.rating} />
      <p className="mt-2 text-sm">{r.text}</p>
    </div>
  );
}

function EnquireDialog({ productName, fpoName }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90">
          <Send className="mr-2 h-4 w-4" /> Enquire Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            Enquire — {productName}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Enquiry sent to " + fpoName);
            setOpen(false);
          }}
          className="space-y-3"
        >
          <div>
            <Label>Your name</Label>
            <Input required placeholder="Ramesh Traders" />
          </div>
          <div>
            <Label>Phone / WhatsApp</Label>
            <Input required type="tel" placeholder="+91…" />
          </div>
          <div>
            <Label>Quantity (kg)</Label>
            <Input required type="number" min={50} placeholder="500" />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea placeholder="Required by next week, prefer delivery…" />
          </div>
          <Button type="submit" className="w-full rounded-full">
            Send enquiry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
