import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopGrid from "@/components/ShopGrid";

export default function Butik() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="w-full px-4 md:px-6 py-12 flex-1">
        <h1 className="font-heading font-extrabold text-4xl text-foreground mb-8">Butik</h1>
        <ShopGrid />
      </main>
      <Footer />
    </div>
  );
}
