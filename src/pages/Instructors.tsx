import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";

const instructors = [
  {
    name: "Maria Rodriguez", lang: "Spanska", flag: "🇪🇸", exp: "12 år",
    education: "Magisterexamen i tillämpad lingvistik, Barcelonas universitet",
    certs: ["DELE-examinator", "SIELE-certifierad"],
    specialties: ["Affärsspanska", "Konversationsflyt", "Grammatikgrunder"],
    philosophy: "Språkinlärning ska vara rolig och praktisk. Jag skapar uppslukande upplevelser som kopplar grammatik till verklig kommunikation.",
    rating: 4.9, reviews: 127, levels: "A1–C2",
  },
  {
    name: "Jean-Pierre Dubois", lang: "Franska", flag: "🇫🇷", exp: "8 år",
    education: "Kandidatexamen i fransk litteratur, Université de Lyon",
    certs: ["DELF/DALF-examinator", "Alliance Française-certifierad"],
    specialties: ["Fransk kultur", "Uttal", "Litteratur"],
    philosophy: "Att förstå fransk kultur är oskiljbart från att bemästra språket. Mina lektioner blandar språklig precision med kulturfördjupning.",
    rating: 4.8, reviews: 89, levels: "A1–B2",
  },
  {
    name: "Hans Mueller", lang: "Tyska", flag: "🇩🇪", exp: "15 år",
    education: "Doktorsexamen i germanistik, Humboldt-universitetet i Berlin",
    certs: ["Goethe-Institut-examinator", "TestDaF-certifierad"],
    specialties: ["Akademisk tyska", "Tekniskt språk", "Grammatik"],
    philosophy: "Tysk grammatik har rykte om sig att vara komplicerad, men systematisk undervisning avslöjar eleganta mönster.",
    rating: 4.9, reviews: 156, levels: "A1–C2",
  },
  {
    name: "Wei Zhang", lang: "Mandarin", flag: "🇨🇳", exp: "10 år",
    education: "Magisterexamen i kinesiska som främmande språk, Beijing Normal University",
    certs: ["HSK-examinator", "Konfuciusinstitutet-certifierad"],
    specialties: ["Teckenskrift", "Tonläge", "Affärskinesiska"],
    philosophy: "Mandarin utmanar elever på unika sätt, men belöningen är extraordinär.",
    rating: 5.0, reviews: 94, levels: "A1–B2",
  },
  {
    name: "Yuki Tanaka", lang: "Japanska", flag: "🇯🇵", exp: "6 år",
    education: "Kandidatexamen i japansk språkundervisning, Waseda-universitetet",
    certs: ["JLPT N1", "Certifierad japansklärare"],
    specialties: ["JLPT-förberedelse", "Keigo", "Populärkultur"],
    philosophy: "Japanska öppnar dörrar till en av världens rikaste kulturer.",
    rating: 4.9, reviews: 71, levels: "A1–B2",
  },
  {
    name: "Emma Williams", lang: "Engelska", flag: "🇬🇧", exp: "14 år",
    education: "Magisterexamen i TESOL, King's College London",
    certs: ["CELTA", "DELTA", "IELTS-examinator"],
    specialties: ["Akademisk engelska", "IELTS/TOEFL", "Affärskommunikation"],
    philosophy: "Goda engelskkunskaper förändrar professionella och akademiska möjligheter.",
    rating: 4.9, reviews: 203, levels: "A1–C2",
  },
];

export default function Instructors() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="w-full px-4 md:px-6 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Våra lärare</h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">24 expertlärare med modersmål, dedikerade till din framgång.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="w-full px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((inst) => (
                <div key={inst.name} className="card-elevated flex flex-col">
                  {/* Avatar placeholder */}
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-4 mx-auto">
                    {inst.flag}
                  </div>
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold font-heading text-foreground">{inst.name}</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                      {inst.lang} · {inst.levels}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold text-foreground text-sm">{inst.rating}</span>
                    <span className="text-muted-foreground text-xs">({inst.reviews} omdömen)</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic text-center mb-4 flex-1">"{inst.philosophy}"</p>
                  <div className="border-t border-border pt-4 space-y-2 text-xs text-muted-foreground">
                    <div><span className="font-medium text-foreground">Erfarenhet:</span> {inst.exp}</div>
                    <div><span className="font-medium text-foreground">Utbildning:</span> {inst.education}</div>
                    <div className="flex flex-wrap gap-1">
                      {inst.certs.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
