import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function Contact() {
  const { items, total } = useCart();
  const priceFormat = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Kontakta oss</h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">Vi hör gärna från dig. Skicka ett meddelande så återkommer vi så snart vi kan.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Skicka ett meddelande</h2>
            {items.length > 0 && (
              <section className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-5" aria-labelledby="cart-summary-heading">
                <h3 id="cart-summary-heading" className="font-heading text-lg font-semibold">Det här finns i din kundvagn</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-4 border-b border-primary/15 pb-3 last:border-0 last:pb-0">
                      <span><strong>{item.productName}</strong><br />{item.quantity.toLocaleString("sv-SE")} st</span>
                      <span className="font-semibold">{priceFormat.format(item.totalPrice)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex justify-between border-t border-primary/20 pt-3 font-bold"><span>Totalt</span><span>{priceFormat.format(total)}</span></p>
                <p className="mt-3 text-sm text-muted-foreground">Den här sammanställningen följer med när du kontaktar oss.</p>
              </section>
            )}
            <form className="card-elevated space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Namn <span className="text-destructive">*</span></label>
                <input id="name" type="text" required className="w-full border-2 border-input rounded-lg px-4 py-3 text-foreground bg-background placeholder:text-muted-foreground focus:border-primary" placeholder="Ditt fullständiga namn" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">E-post <span className="text-destructive">*</span></label>
                <input id="email" type="email" required className="w-full border-2 border-input rounded-lg px-4 py-3 text-foreground bg-background placeholder:text-muted-foreground focus:border-primary" placeholder="du@exempel.se" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Meddelande <span className="text-destructive">*</span></label>
                <textarea id="message" required rows={4} className="w-full border-2 border-input rounded-lg px-4 py-3 text-foreground bg-background placeholder:text-muted-foreground focus:border-primary resize-y" placeholder="Hur kan vi hjälpa dig?" />
              </div>
              <Button type="submit" className="w-full">Skicka meddelande</Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
