import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowDown, ArrowRight, Image as ImageIcon, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { findProduct } from "@/components/ShopGrid";
import ProductCustomizer from "@/components/ProductCustomizer";

export default function Produkt() {
  const { slug } = useParams();
  const found = findProduct(slug);
  const customization = useRef<HTMLDivElement>(null);
  const customize = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    customization.current?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-10 flex-1">
        <Link to="/butik" className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
          <ArrowLeft className="h-4 w-4" /> Tillbaka till butiken
        </Link>
        {!found ? (
          <div className="py-16 text-center">
            <h1 className="font-heading text-3xl font-bold">Produkten hittades inte</h1>
            <p className="mt-3 text-muted-foreground">Den här produkten finns inte längre.</p>
            <Button variant="outline" className="mt-6" asChild><Link to="/butik">Till butiken</Link></Button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              {found.item.image ? (
                <img src={found.item.image} alt={found.item.name} className="aspect-[4/3] w-full object-contain" />
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-md bg-muted text-muted-foreground">
                  <ImageIcon className="h-10 w-10" strokeWidth={1.25} aria-hidden="true" />
                  <span className="text-sm">Ingen bild ännu</span>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-primary">{found.column.title}</p>
                <h1 className="mt-3 font-heading text-4xl font-extrabold">{found.item.name}</h1>
                <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{found.item.description ?? "Kontakta oss för information, pris och leveranstid på den här produkten."}</p>
                {found.item.options?.length ? (
                  <>
                    <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm">
                      <div><dt className="text-muted-foreground">Format</dt><dd className="mt-1 font-medium">{found.item.name === "Läppbalsam" ? "7 cm, diameter 1,9 cm" : found.item.name === "Tändsticksask" ? "53 × 36 × 12 mm" : found.item.name === "Vattenflaska" ? "500 ml" : <>40 x 10 x 35<br />38 x 10 x 42</>}</dd></div>
                      <div><dt className="text-muted-foreground">Grundfärger</dt><dd className="mt-1 font-medium">{found.item.name === "Läppbalsam" ? "17 alternativ" : found.item.name === "Tändsticksask" ? "8 alternativ" : found.item.name === "Vattenflaska" ? "7 alternativ" : "11 alternativ"}</dd></div>
                    </dl>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <Button size="lg" onClick={customize}>Anpassa <ArrowDown aria-hidden="true" /></Button>
                      <details className="group">
                        <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 [&::-webkit-details-marker]:hidden">
                          <Info className="h-4 w-4 text-primary" aria-hidden="true" /> Information
                        </summary>
                        <div className="mt-4 w-full max-w-2xl rounded-lg border border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground shadow-sm sm:p-6">
                          {found.item.name === "Tändsticksask" ? (
                            <>
                              <h2 className="font-heading text-xl font-semibold text-foreground">Information om tändsticksask</h2>
                              <ul className="mt-3 list-disc space-y-2 pl-5">
                                <li>Material: Kartong, trä</li>
                                <li>Storlek: 53 × 36 × 12 mm</li>
                                <li>Minsta antal: 2 500 st</li>
                                <li>Finns i 8 färger: svart, vit, grön, blå, röd, rosa, grå och gul</li>
                              </ul>
                            </>
                          ) : found.item.name === "Bomullskasse" ? (
                            <>
                              <h2 className="font-heading text-xl font-semibold text-foreground">Information om bomullskasse</h2>
                              <p className="mt-3">Den extra lätta bomullskvaliteten hos de OEKO-TEX®-certifierade shoppingkassarna gör dem till ett praktiskt litet köphjälpmedel: Snabbt och enkelt ihopfällda kan de tas med var som helst och dras ut direkt vid behov. Spontana köp stuvas undan på nolltid. Och vem har dina kunder att tacka för de praktiska väskorna? Det är bäst att trycka detta med stora bokstäver på det mjuka tyget.</p>
                              <ul className="mt-5 list-disc space-y-2 pl-5">
                                <li>Format: 38 x 10 x 42 cm, 40 x 10 x 35 cm</li>
                                <li>Med bälg</li>
                                <li>OEKO-TEX® certifierad</li>
                                <li>100 % bomull, 140 g/m²</li>
                                <li>Digitaltryck (CMYK) eller 1 till 4 färgscreentryck (Pantone C + vit)</li>
                                <li>Tryckbar fram- och/eller baksida (olika motiv möjliga)</li>
                                <li>Många grundfärger</li>
                              </ul>
                            </>
                          ) : found.item.name === "Vattenflaska" ? (
                            <>
                              <h2 className="font-heading text-xl font-semibold text-foreground">Information om vattenflaska</h2>
                              <p className="mt-3">Denna miljövänliga 500 ml vattenflaska har ett praktiskt bärhandtag, vilket gör den till en perfekt följeslagare för vätskeintag på språng. Den är tillverkad av RPET och är inte bara återanvändbar utan också ett hållbart val.</p>
                              <ul className="mt-5 list-disc space-y-2 pl-5">
                                <li>BPA-fritt material</li>
                                <li>Minst 50% återvunnet material</li>
                              </ul>
                              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div><dt className="text-muted-foreground">Material</dt><dd className="font-medium text-foreground">RPET (återvunna PET-flaskor)</dd></div>
                                <div><dt className="text-muted-foreground">Storlek</dt><dd className="font-medium text-foreground">20 x ⌀6.5 x 6.5 cm</dd></div>
                                <div><dt className="text-muted-foreground">Vikt</dt><dd className="font-medium text-foreground">80 gr.</dd></div>
                                <div><dt className="text-muted-foreground">Kapacitet</dt><dd className="font-medium text-foreground">500 ml</dd></div>
                              </dl>
                            </>
                          ) : (
                            <>
                              <h2 className="font-heading text-xl font-semibold text-foreground">Information om läppbalsam</h2>
                              <p className="mt-3">Dessa högkvalitativa läppbalsam trycks helst med din logotyp eller ditt företagsnamn. Du gör inte bara något gott för dina kunder, affärskontakter eller gäster – du ökar också medvetenheten om ditt märke. Läppbalsam med logotyp finns i många iögonfallande, kraftiga färger. Idealiska förutsättningar för att din reklamkampanj ska bli framgångsrik.</p>
                              <ul className="mt-5 list-disc space-y-2 pl-5">
                                <li>Rund läppbalsam att skruva ut</li>
                                <li>7 cm, diameter 1,9 cm</li>
                                <li>Yta för tryck på skaftet 1,1 x 4 cm eller 1,2 x 3,5 cm (transparenta varianter)</li>
                                <li>Upp till 3-färgs tampongtryck eller fotorealistiskt digitaltryck</li>
                                <li>Många olika grundfärger</li>
                                <li>Solfaktor 10 eller 15 (beroende på variant)</li>
                                <li>Hållbara minst 12 månader efter öppningen</li>
                                <li>Vikt: 14 eller 16 g</li>
                              </ul>
                            </>
                          )}
                        </div>
                      </details>
                    </div>
                  </>
                ) : <Button variant="outline" className="mt-7" asChild><Link to="/contact">Kontakta oss <ArrowRight aria-hidden="true" /></Link></Button>}
              </div>
            </div>
            {found.item.options?.length ? (
              <div ref={customization} className="scroll-mt-24">
                <ProductCustomizer key={slug} options={found.item.options} productName={found.item.name} minQuantity={found.item.minQuantity} />
              </div>
            ) : null}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
