import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const stories = [
  {
    name: "Sarah Mitchell", program: "Spanska", before: "A1", after: "B2", time: "18 månader",
    quote: "Jag började utan några som helst spanskkunskaper. Nu håller jag affärsmöten på spanska och förhandlade nyligen ett avtal med en kund i Mexico City.",
    achievement: "Klarade DELE B2-provet · Befordrad till regionchef Latinamerika",
  },
  {
    name: "James Chen", program: "Franska", before: "A2", after: "C1", time: "2 år",
    quote: "Lärarna här lär inte bara ut grammatik – de lär dig att tänka på språket. Jag flyttade till Paris för jobbet och kände mig helt förberedd.",
    achievement: "Antagen till Sorbonne · DALF C1-certifierad",
  },
  {
    name: "Priya Patel", program: "Tyska", before: "A1", after: "B1", time: "14 månader",
    quote: "Att lära sig tyska verkade omöjligt med mitt schema, men de flexibla onlinekurserna fick det att funka. Mina tyska kollegor är imponerade!",
    achievement: "Flyttade till Berlin-kontoret · Goethe-Zertifikat B1",
  },
  {
    name: "Marcus Johnson", program: "Mandarin", before: "A0", after: "A2", time: "10 månader",
    quote: "Jag har alltid velat lära mig mandarin men trodde att jag var för gammal. Det här programmet bevisade att ålder bara är en siffra.",
    achievement: "HSK 3-certifierad · Planerar en längre resa till Kina",
  },
  {
    name: "Elena Rodriguez", program: "Engelska", before: "B1", after: "C2", time: "2,5 år",
    quote: "Engelskkunskaperna öppnade dörrar jag aldrig hade kunnat föreställa mig. Jag gick från att kämpa med presentationer till att undervisa på universitet på engelska.",
    achievement: "Antagen till doktorandprogram · IELTS 8.5 · Universitetslärare",
  },
];

const globalStats = [
  { value: "2 547", label: "Elever totalt" },
  { value: "78", label: "Representerade länder" },
  { value: "94 %", label: "Godkända på prov" },
  { value: "4,8/5", label: "Nöjdhetsbetyg" },
];

export default function Stories() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="w-full px-4 md:px-6 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Framgångshistorier</h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">Verkliga elever, verkliga resultat. Se hur vi förvandlar framtider.</p>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-card border-b border-border py-10">
          <div className="w-full px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {globalStats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl md:text-4xl font-extrabold font-heading text-primary">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="w-full px-4 md:px-6 max-w-4xl space-y-8">
            {stories.map((s) => (
              <div key={s.name} className="card-elevated">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0 mx-auto md:mx-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <h2 className="font-heading text-xl font-bold text-foreground">{s.name}</h2>
                        <span className="text-sm text-muted-foreground">{s.program}programmet · {s.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{s.before}</span>
                        <ArrowRight className="h-4 w-4 text-success" />
                        <span className="px-2.5 py-1 rounded-full bg-success/10 text-success">{s.after}</span>
                      </div>
                    </div>
                    <blockquote className="text-foreground/80 italic leading-relaxed mb-4">"{s.quote}"</blockquote>
                    <div className="flex flex-wrap gap-2">
                      {s.achievement.split(" · ").map((a) => (
                        <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
