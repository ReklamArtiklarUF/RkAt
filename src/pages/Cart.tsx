import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const priceFormat = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 });

export default function Cart() {
  const { items, total, removeItem, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="w-full flex-1 px-4 py-10 md:px-6">
        <Link to="/butik" className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
          <ArrowLeft className="h-4 w-4" /> Tillbaka till butiken
        </Link>
        <div className="mt-8 flex items-center gap-3">
          <ShoppingCart className="h-7 w-7 text-primary" aria-hidden="true" />
          <h1 className="font-heading text-4xl font-extrabold">Kundvagn</h1>
        </div>
        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-lg font-medium">Kundvagnen är tom</p>
            <p className="mt-2 text-muted-foreground">Välj en produkt i butiken för att lägga till den här.</p>
            <Button className="mt-6" asChild><Link to="/butik">Till butiken</Link></Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-xl font-semibold">{item.productName}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{item.quantity.toLocaleString("sv-SE")} st · {priceFormat.format(item.unitPrice)} per st</p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label={`Ta bort ${item.productName} från kundvagnen`}>
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <dl className="mt-4 grid gap-2 border-t border-border pt-4 text-sm sm:grid-cols-2">
                    {item.selections.map((selection) => (
                      <div key={`${item.id}-${selection.label}`}><dt className="text-muted-foreground">{selection.label}</dt><dd className="font-medium">{selection.value}</dd></div>
                    ))}
                  </dl>
                  <p className="mt-5 text-right font-heading text-xl font-bold">{priceFormat.format(item.totalPrice)}</p>
                </article>
              ))}
              <button type="button" onClick={clearCart} className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-destructive">Töm kundvagn</button>
            </div>
            <aside className="h-fit rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h2 className="font-heading text-xl font-semibold">Sammanfattning</h2>
              <div className="mt-5 flex items-center justify-between border-t border-primary/20 pt-4 text-lg font-bold">
                <span>Totalt</span>
                <span>{priceFormat.format(total)}</span>
              </div>
              <p className="mt-4 text-sm font-bold leading-relaxed text-foreground">Preliminärt exempelpris, inte en offert. Som UF företag är vi moms befriade, så alla priser är inkl moms och frakt.</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Vi kan även skicka en exempelbild på hur produkten kan se ut.</p>
              <Button className="mt-6 w-full" asChild><Link to="/contact">Kontakta oss om beställningen</Link></Button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
