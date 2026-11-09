import { useRef, useState } from "react";
import { Check, Image as ImageIcon, ArrowRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ProductOption } from "@/components/ShopGrid";
import { availableChoices, configurationPrice, selectProductChoice } from "@/lib/product-configuration";
import type { ProductSelections } from "@/lib/product-configuration";
import { selectionsForCart, useCart } from "@/context/CartContext";

const priceFormat = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 });

export default function ProductCustomizer({ options, productName, minQuantity = 1 }: { options: ProductOption[]; productName: string; minQuantity?: number }) {
  const [selected, setSelected] = useState<ProductSelections>({});
  const [addedMessage, setAddedMessage] = useState(false);
  const { addItem } = useCart();
  const [quantityText, setQuantityText] = useState("");
  const quantity = Number(quantityText);
  const validQuantity = Number.isInteger(quantity) && quantity >= minQuantity;
  const price = validQuantity ? configurationPrice(options, selected, quantity) : null;
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  const quantityRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const isBottleLayout = options.some((option) => option.id === "trycktyp");

  const scrollToStep = (target?: HTMLElement | null) => {
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  };

  return (
    <section id="anpassa" aria-labelledby="anpassa-rubrik" className="mt-16 scroll-mt-24 border-t border-border pt-10">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="anpassa-rubrik" className="font-heading text-3xl font-bold">Anpassa din {productName.toLowerCase()}</h2>
        <span className="text-sm text-muted-foreground">{options.filter((option) => selected[option.id] !== undefined).length} av {options.length} val klara</span>
      </div>
      <div className="max-w-4xl">
        {options.map((option, step) => {
          const choices = availableChoices(option, options, selected);
          const isBottlePrintOption = isBottleLayout && option.id === "trycktyp";
          const isBottleColorCount = isBottleLayout && option.id === "antal-farger";
          return (
            <fieldset key={option.id} ref={(element) => { stepRefs.current[step] = element; }} className={`min-w-0 scroll-mt-24 border-b border-border pb-8 mb-8 ${isBottlePrintOption ? "border-b-0 pt-0 pb-0 mb-8" : ""} ${isBottleColorCount ? "border-b-0 pb-0 mb-0" : ""}`}>
              <legend className={isBottlePrintOption ? "sr-only" : "mb-5 flex items-center gap-3 font-heading text-xl font-semibold"}>
                <span className={isBottlePrintOption ? "sr-only" : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm text-primary"}>{step + 1}</span>
                {option.label}
              </legend>
              {choices.length === 0 ? <p className="text-sm text-muted-foreground">Välj tryck först.</p> : (
                <div className={option.kind === "image" ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" : "flex flex-wrap gap-3"}>
                  {choices.map(({ choice, index }) => {
                    const active = selected[option.id] === index;
                    return (
                      <Button
                        key={choice.label}
                        type="button"
                        variant="secondary"
                        aria-label={`${option.label}: ${choice.label}`}
                        aria-pressed={active}
                        onClick={() => {
                          const wasActive = selected[option.id] === index;
                          setSelected((previous) => selectProductChoice(options, previous, option.id, index));
                          if (!wasActive) scrollToStep(stepRefs.current[step + 1] ?? quantityRef.current);
                        }}
                        className={`relative border bg-card whitespace-normal transition-colors duration-200 hover:border-primary hover:bg-primary/5 ${active ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" : "border-border text-foreground"} ${option.kind === "image" ? "h-auto w-full flex-col justify-start overflow-hidden p-0" : "h-11 px-5"}`}
                      >
                        {option.kind === "image" && (
                          choice.image ? <img src={choice.image} alt={choice.label} className="aspect-[4/3] w-full object-contain" style={choice.scale ? { transform: `scale(${choice.scale})`, transformOrigin: "bottom center" } : undefined} /> : choice.swatch ?
                            <span className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
                              <span className="h-8 w-16 rounded-sm border border-black/10 shadow-sm" style={{ background: choice.swatch }} aria-hidden="true" />
                            </span> :
                            <span className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                              <ImageIcon className="!h-7 !w-7" strokeWidth={1.25} aria-hidden="true" />
                              <span className="text-xs font-normal">Bild saknas</span>
                            </span>
                        )}
                        <span className={option.kind === "image" ? "flex min-h-16 w-full items-center justify-center px-3 py-3 text-center leading-snug" : ""}>{choice.label}</span>
                        {active && <Check aria-hidden="true" className={option.kind === "image" ? "absolute right-2 top-2 rounded-full bg-primary text-primary-foreground p-0.5 !h-5 !w-5" : "shrink-0"} />}
                      </Button>
                    );
                  })}
                </div>
              )}
            </fieldset>
          );
        })}
        <div ref={quantityRef} className="min-w-0 mb-10 scroll-mt-24">
          <fieldset className="min-w-0">
            <legend className="mb-5 flex items-center gap-3 font-heading text-xl font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm text-primary">{options.length + 1}</span>Antal {productName.toLowerCase()}
            </legend>
            {minQuantity > 1 && <p className="mb-4 text-sm font-medium text-muted-foreground">Minsta antal {minQuantity.toLocaleString("sv-SE")} st.</p>}
            <label htmlFor="product-quantity" className="block text-sm font-medium mb-2">Antal {productName.toLowerCase()}</label>
            <input id="product-quantity" type="number" min={minQuantity} step="1" inputMode="numeric" value={quantityText} onChange={(event) => setQuantityText(event.target.value)} className="h-11 w-40 rounded-md border border-input bg-background px-3 text-foreground" placeholder={`Minst ${minQuantity.toLocaleString("sv-SE")}`} aria-invalid={quantityText !== "" && !validQuantity} />
            {quantityText !== "" && !validQuantity && <p className="mt-2 text-sm text-destructive">Ange minst {minQuantity.toLocaleString("sv-SE")} st.</p>}
          </fieldset>
        </div>
        <div ref={priceRef} className="border-t-2 border-primary pt-6 scroll-mt-24" aria-live="polite" aria-atomic="true">
          <h3 className="font-heading text-xl font-semibold">Estimerat pris</h3>
          {price ? <>
            <p className="mt-3 font-heading text-4xl font-bold">{priceFormat.format(price.total)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{priceFormat.format(price.unit)} per st × {quantity} st</p>
            <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">{options.map((option) => <div key={option.id}><dt className="text-muted-foreground">{option.label}</dt><dd className="font-medium">{option.choices[selected[option.id]]?.label}</dd></div>)}</dl>
          </> : <p className="mt-3 text-muted-foreground">Välj alla alternativ och antal för att se priset.</p>}
          <p className="mt-4 text-sm text-muted-foreground">Preliminärt exempelpris, inte en offert. Som UF företag är vi moms befriade, så alla priser är inkl moms och frakt.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button disabled={!price} onClick={() => {
              if (!price) return;
              addItem({ productName, quantity, unitPrice: price.unit, totalPrice: price.total, selections: selectionsForCart(options, selected) });
              setAddedMessage(true);
            }}><ShoppingCart aria-hidden="true" /> Lägg i kundvagn</Button>
            <Button variant="outline" asChild><Link to="/contact">Kontakta oss <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
          {addedMessage && <p className="mt-3 text-sm font-medium text-success">Produkten har lagts i kundvagnen.</p>}
        </div>
      </div>
    </section>
  );
}