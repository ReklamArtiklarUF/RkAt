import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="w-full px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-heading font-extrabold text-xl text-background mb-4">
              <img src={logo} alt="ReklamArtiklar UF" className="h-14 w-14 object-contain" />
              <span className="text-[hsl(var(--logo-blue))]">ReklamArtiklarUF</span>
            </Link>
            <p className="text-sm leading-relaxed text-background/60">
              Vi lägger den tiden ni inte vill lägga<br />på att jämföra leverantörer
            </p>
            <p className="text-sm leading-relaxed text-background/60 mt-3">
              Bakom varje produkt ligger minst 3–6 timmars research. Vi analyserar priser, fraktkostnader, kvalitet och miljöcertifieringar från olika leverantörer så att du får den bästa lösningen presenterad för dig.
            </p>
          </div>

          {/* Contact */}
          <div className="md:text-right">
            <h3 className="font-heading font-semibold text-background mb-4">Kontakta oss</h3>
            <ul className="space-y-3 text-sm md:flex md:flex-col md:items-end">
              <li className="flex items-start gap-2 md:flex-row-reverse">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Sundsvalls gymnasium, Västermalm</span>
              </li>
              <li className="flex items-center gap-2 md:flex-row-reverse">
                <Phone className="h-4 w-4 shrink-0" />
                <span>08-123 456 78</span>
              </li>
              <li className="flex items-center gap-2 md:flex-row-reverse">
                <Mail className="h-4 w-4 shrink-0" />
                <span>reklamartiklaruf@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center text-sm text-background/40">
          <p>© {new Date().getFullYear()} ReklamArtiklarUF. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
}
