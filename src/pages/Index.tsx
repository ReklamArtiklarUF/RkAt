import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-classroom.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopGrid from "@/components/ShopGrid";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-[460px] lg:min-h-[540px] flex items-center">
          <img
            src={heroImage}
            alt="Elever som lär sig tillsammans i ett ljust klassrum"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative w-full px-4 md:px-6 pt-2 lg:pt-4 pb-16 lg:pb-24">
            <div className="max-w-2xl">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
                Företag i Sverige spenderar omkring      
                6-8 miljarder på reklam artiklar per år.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 max-w-xl">
                Svenska företag lägger miljarder på reklamartiklar varje år men hur vet ni att ni har fått det bästa priset? Djungeln av leverantörer gör det krångligt och tidskrävande att jämföra.

                Vi på ReklamArtiklarUF gör jobbet åt er. Så istället för att kasta pengar i sjön. kolla igenom våra bästa produkter eller kontakta oss så hittar vi det ni vill ha.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" asChild>
                  <Link to="/butik">Butik</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-semibold" asChild>
                  <Link to="/contact">Kontakta oss <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-1 bg-[hsl(var(--logo-blue))]" />

        <section className="py-4 md:py-6" aria-label="Motto">
          <div className="w-full px-4 md:px-6 text-center">
            <p className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-[hsl(var(--logo-blue))] tracking-tight">
              Billigt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unikt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Användbart
            </p>
          </div>
        </section>

        <div className="w-full h-1 bg-[hsl(var(--logo-blue))]" />

        <section className="pt-2 md:pt-3 pb-16 md:pb-24" aria-labelledby="shop-heading">
          <div className="w-full px-4 md:px-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="shop-heading" className="font-heading text-3xl font-bold text-foreground md:text-4xl">Vår butik</h2>
              </div>
              <Button variant="outline" asChild>
                <Link to="/butik">Öppna butiken <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <ShopGrid />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
