import { Link } from "react-router-dom";
import { ArrowRight, Search, Scale, ThumbsUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Ni berättar vad ni behöver",
    text: "Produkt, antal och när ni vill ha det. Resten lämnar ni till oss.",
  },
  {
    icon: Scale,
    title: "Vi jämför leverantörerna",
    text: "Bakom varje produkt ligger minst 3–6 timmars research. Vi analyserar priser, fraktkostnader, kvalitet och miljöcertifieringar från olika leverantörer så att du får den bästa lösningen presenterad för dig.",
  },
  {
    icon: ThumbsUp,
    title: "Ni får ett bra pris",
    text: "Ni stöttar ett UF-företag samtidigt som ni sparar både tid och pengar. Ni slipper hela stressen med att jämföra leverantörer.",
  },
];

export default function OmOss() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full px-4 md:px-6 py-12 md:py-16">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Om oss
          </span>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            Vi lägger den tiden ni inte vill lägga på att jämföra leverantörer
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Svenska företag lägger miljarder på reklamartiklar varje år. Men hur vet ni att ni
            fått det bästa priset? Djungeln av leverantörer gör det krångligt och tidskrävande att
            jämföra. Det är den biten vi tar åt er, så att ni slipper kasta pengar i sjön.
          </p>
        </section>

        <section className="w-full px-4 md:px-6 pb-12 md:pb-16">
          <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Så jobbar vi
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-lg border border-border bg-card p-6 shadow-sm transition-colors duration-200 hover:border-primary hover:bg-primary/5"
              >
                <step.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Ungdomsföretag
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
              Ett ungdomsföretag som drivs av Melvin Vestin och Jakob Bovidsson
            </h2>
            <p className="mt-4 text-muted-foreground">
              Som elever på Sundsvalls gymnasium, Västermalm valde vi kursen entreprenörskap där
              började vår resa, när vi såg alla valskyltar ute på gatorna. Vi ville satsa på
              reklamskyltar och ha prylar på sidan av, men när vi började leta efter reklamartiklar
              möttes vi av en djungel. Sidorna var svårnavigerade, priserna otydliga och så fort en
              av oss hittade en produkt hade någon annan hittat samma sak billigare någon
              annanstans.
            </p>
            <p className="mt-4 text-muted-foreground">
              Det var då vår idé föddes: vi gör grovjobbet åt kunden, så att ni slipper lägga tid
              på att leta och jämföra själva.
            </p>
          </div>
        </section>

        <section className="border-t border-border bg-card">
          <div className="w-full px-4 md:px-6 py-12 md:py-16">
            <div className="max-w-3xl">
              <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                Vet ni redan vad ni vill ha?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Kolla igenom våra bästa produkter, eller hör av er så hittar vi det ni söker.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" asChild>
                  <Link to="/butik">
                    Till butiken <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">Kontakta oss</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
