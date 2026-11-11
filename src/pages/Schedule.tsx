import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const classes = [
  { name: "Spanska A1 grupp", day: "Mån/Ons", time: "18:00–19:30", instructor: "Maria Rodriguez", spots: 8, max: 12, color: "bg-red-400" },
  { name: "Spanska A1 grupp", day: "Tis/Tors", time: "10:00–11:30", instructor: "Maria Rodriguez", spots: 5, max: 12, color: "bg-red-400" },
  { name: "Spanska B1 grupp", day: "Mån/Ons", time: "19:45–21:15", instructor: "Maria Rodriguez", spots: 10, max: 12, color: "bg-red-400" },
  { name: "Franska A2 grupp", day: "Tis/Tors", time: "18:00–19:30", instructor: "Jean-Pierre Dubois", spots: 7, max: 10, color: "bg-blue-400" },
  { name: "Franska A2 online", day: "Ons", time: "20:00–21:15", instructor: "Jean-Pierre Dubois", spots: 12, max: 15, color: "bg-blue-400" },
  { name: "Tyska A1 grupp", day: "Lördag", time: "09:00–12:00", instructor: "Hans Mueller", spots: 6, max: 10, color: "bg-yellow-500" },
  { name: "Tyska B2 grupp", day: "Torsdag", time: "19:00–20:30", instructor: "Hans Mueller", spots: 9, max: 10, color: "bg-yellow-500" },
  { name: "Mandarin A1 grupp", day: "Mån/Ons", time: "19:00–20:30", instructor: "Wei Zhang", spots: 8, max: 10, color: "bg-orange-400" },
  { name: "Japanska A1 grupp", day: "Tis/Tors", time: "18:30–20:00", instructor: "Yuki Tanaka", spots: 11, max: 12, color: "bg-pink-400" },
  { name: "Engelska B1 grupp", day: "Mån/Ons/Fre", time: "09:00–10:30", instructor: "Emma Williams", spots: 14, max: 15, color: "bg-emerald-400" },
  { name: "Engelska B2 intensiv", day: "Dagligen", time: "13:00–16:00 (4 v)", instructor: "Emma Williams", spots: 6, max: 8, color: "bg-emerald-400" },
  { name: "Engelska C1 grupp", day: "Tis/Tors", time: "19:00–20:30", instructor: "Emma Williams", spots: 8, max: 10, color: "bg-emerald-400" },
];

const sessions = [
  { date: "8 januari 2026", name: "Vintertermin" },
  { date: "5 februari 2026", name: "Mittvintersintensiv" },
  { date: "11 mars 2026", name: "Vårtermin" },
  { date: "15 april 2026", name: "Vårintensiv" },
  { date: "6 maj 2026", name: "Sommartermin" },
];

function capacityColor(spots: number, max: number) {
  const pct = spots / max;
  if (pct < 0.5) return "bg-success";
  if (pct < 0.8) return "bg-accent";
  return "bg-destructive";
}

export default function Schedule() {
  const [filter, setFilter] = useState("");
  const filtered = filter ? classes.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase())) : classes;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="w-full px-4 md:px-6 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Schema</h1>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">Hitta och boka din plats i våra kommande kurser.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-64 shrink-0 space-y-6">
                <div>
                  <label htmlFor="filter" className="block text-sm font-medium text-foreground mb-1.5">Filtrera på språk</label>
                  <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full border-2 border-input rounded-lg px-4 py-3 text-foreground bg-background focus:border-primary">
                    <option value="">Alla språk</option>
                    {["Spanska", "Franska", "Tyska", "Mandarin", "Japanska", "Engelska"].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-3">Kommande terminer</h3>
                  <ul className="space-y-2 text-sm">
                    {sessions.map((s) => (
                      <li key={s.date} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-foreground">{s.name}</div>
                        <div className="text-muted-foreground text-xs">{s.date}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Classes List */}
              <div className="flex-1 space-y-4">
                {filtered.map((c, i) => (
                  <div key={i} className="card-interactive flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${c.color} shrink-0 hidden sm:block`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-foreground">{c.name}</h3>
                      <p className="text-sm text-muted-foreground">{c.day} · {c.time} · {c.instructor}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{c.spots}/{c.max}</div>
                        <div className="w-20 bg-muted rounded-full h-1.5 mt-1">
                          <div className={`h-1.5 rounded-full ${capacityColor(c.spots, c.max)}`} style={{ width: `${(c.spots / c.max) * 100}%` }} />
                        </div>
                      </div>
                      <Button size="sm" variant={c.spots >= c.max ? "secondary" : "default"} disabled={c.spots >= c.max}>
                        {c.spots >= c.max ? "Fullt" : "Boka"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
