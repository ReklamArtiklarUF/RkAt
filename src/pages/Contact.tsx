import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatCartSummary } from "@/lib/contact-email";

export default function Contact() {
  const { items, total } = useCart();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const priceFormat = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 });
  const cartSummary = formatCartSummary(items, total);

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setStatus(null);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          cartSummary,
        }),
      });
      const result: { success?: boolean; error?: string } = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error ?? "Meddelandet kunde inte skickas.");
      setStatus({ type: "success", message: "Tack! Ditt meddelande har skickats till oss." });
      event.currentTarget.reset();
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Meddelandet kunde inte skickas just nu." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="w-full px-4 md:px-6 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Kontakta oss</h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">Vi hör gärna från dig. Skicka ett meddelande så återkommer vi så snart vi kan.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="w-full px-4 md:px-6 max-w-2xl">
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
            {status && <p role="status" className={`mb-6 rounded-lg border p-4 text-sm font-medium ${status.type === "success" ? "border-success/30 bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>{status.message}</p>}
            <form className="card-elevated space-y-5" onSubmit={submitContact}>
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
              <Button type="submit" className="w-full" disabled={sending}>{sending ? "Skickar..." : "Skicka meddelande"}</Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
