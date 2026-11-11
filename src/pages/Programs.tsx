import Header from "@/components/Header";
import Footer from "@/components/Footer";

const programs = [
  {
    name: "Engelska", flag: "🇺🇸", levels: "A1–C2",
    formats: ["Gruppkurser", "Privatlektioner", "Online", "Intensivkurs"],
    prices: { grupp: "2 990 kr/mån", privat: "650 kr/tim", online: "2 490 kr/mån", intensiv: "8 990 kr (4 v)" },
    desc: "Omfattande engelskundervisning. Förberedelse för IELTS/TOEFL, affärsengelska och akademisk engelska.",
  },
  {
    name: "Spanska", flag: "🇪🇸", levels: "A1–C2",
    formats: ["Gruppkurser", "Privatlektioner", "Online", "Helgworkshops"],
    prices: { grupp: "2 990 kr/mån", privat: "650 kr/tim", online: "2 490 kr/mån" },
    desc: "Från vardagskonversation till affärsspanska. Utforska den spanskspråkiga kulturen samtidigt som du bemästrar grammatiken.",
  },
  {
    name: "Franska", flag: "🇫🇷", levels: "A1–B2",
    formats: ["Gruppkurser", "Privatlektioner", "Online"],
    prices: { grupp: "2 990 kr/mån", privat: "650 kr/tim", online: "2 490 kr/mån" },
    desc: "Språklig precision möter kulturfördjupning. Förberedelse för DELF/DALF och fransk litteratur.",
  },
  {
    name: "Tyska", flag: "🇩🇪", levels: "A1–C1",
    formats: ["Gruppkurser", "Privatlektioner", "Intensivkurs"],
    prices: { grupp: "2 990 kr/mån", privat: "650 kr/tim", intensiv: "8 990 kr (4 v)" },
    desc: "Systematisk undervisning som gör tysk grammatik begriplig. Specialisering på akademiskt och tekniskt språk.",
  },
  {
    name: "Mandarin", flag: "🇨🇳", levels: "A1–B2",
    formats: ["Gruppkurser", "Privatlektioner", "Online"],
    prices: { grupp: "3 190 kr/mån", privat: "700 kr/tim", online: "2 690 kr/mån" },
    desc: "Teckenskrift, tonläge och affärsmandarin. HSK-förberedelse erbjuds.",
  },
  {
    name: "Japanska", flag: "🇯🇵", levels: "A1–B2",
    formats: ["Gruppkurser", "Privatlektioner", "Helgworkshops"],
    prices: { grupp: "3 190 kr/mån", privat: "700 kr/tim" },
    desc: "JLPT-förberedelse, keigo (hövlighetsspråk) och kulturfördjupning genom modernt och traditionellt material.",
  },
  {
    name: "Italienska", flag: "🇮🇹", levels: "A1–B1",
    formats: ["Gruppkurser", "Privatlektioner"],
    prices: { grupp: "2 990 kr/mån", privat: "650 kr/tim" },
    desc: "Upptäck det italienska språkets och kulturens skönhet. Konversationsfokus med grammatisk grund.",
  },
  {
    name: "Portugisiska", flag: "🇧🇷", levels: "A1–B1",
    formats: ["Gruppkurser", "Privatlektioner", "Online"],
    prices: { grupp: "2 990 kr/mån", privat: "650 kr/tim", online: "2 490 kr/mån" },
    desc: "Brasiliansk och europeisk portugisiska. Program inriktade på affärer och resor.",
  },
];

export default function Programs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="w-full px-4 md:px-6 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Språkprogram</h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">8 språk, alla nivåer, flera format som passar ditt liv.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="w-full px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((prog) => (
                <div key={prog.name} className="card-interactive flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{prog.flag}</span>
                    <h2 className="text-2xl font-bold font-heading text-foreground">{prog.name}</h2>
                  </div>
                  <span className="inline-flex self-start items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                    Nivåer {prog.levels}
                  </span>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{prog.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prog.formats.map((f) => (
                      <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{f}</span>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 mt-auto">
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-sm text-muted-foreground">från</span>
                      <span className="text-2xl font-extrabold text-primary font-heading">{Object.values(prog.prices)[0].split("/")[0]}</span>
                      <span className="text-sm text-muted-foreground">/{Object.values(prog.prices)[0].split("/")[1] || "tillfälle"}</span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {Object.entries(prog.prices).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}</span>
                          <span className="font-medium text-foreground">{val}</span>
                        </div>
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
