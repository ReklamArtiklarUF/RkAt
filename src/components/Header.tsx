import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Butik", href: "/butik" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kontakta oss", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 md:px-6 h-16" aria-label="Huvudmeny">
        <Link to="/" className="flex items-center gap-2 font-heading font-extrabold text-xl text-foreground">
          <img src={logo} alt="ReklamArtiklar UF" className="h-20 w-20 -my-2 object-contain" />
          <span className="ml-3 text-[hsl(var(--logo-blue))]">ReklamArtiklarUF</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/kundvagn" aria-label={`Kundvagn${itemCount ? `, ${itemCount} artiklar` : ""}`} className={`relative rounded-lg p-2 transition-colors ${location.pathname === "/kundvagn" ? "text-primary" : "text-foreground/70 hover:text-primary"}`}>
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{itemCount}</span>}
          </Link>
          <ul className="flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          </ul>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Visa eller dölj meny"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 pb-4">
          <ul className="space-y-1 py-2">
            <li>
              <Link to="/kundvagn" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-primary/5 hover:text-primary">
                <ShoppingCart className="h-4 w-4" aria-hidden="true" /> Kundvagn {itemCount > 0 && `(${itemCount})`}
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-primary bg-primary/5 font-semibold"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

        </div>
      )}
    </header>
  );
}
